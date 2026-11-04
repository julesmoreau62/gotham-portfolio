import { systemPrompt } from "@/lib/prompt"
import { checkLimits, recordSpend } from "@/lib/limits"
import { PROJECT_IDS, SECTIONS, getProject, type ProjectId, type SectionId } from "@/lib/projects"
import { MAX_INPUT_CHARS, MAX_TURNS, type Action, type ChatRequest, type ChatTurn, type StreamEvent } from "@/lib/protocol"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MODEL = process.env.OPENROUTER_MODEL || "anthropic/claude-haiku-5.5"
const MAX_TOKENS = 500

const TOOLS = [
  {
    type: "function",
    function: {
      name: "open_project",
      description: "Open one of Jules's projects in the side panel next to the chat.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string", enum: PROJECT_IDS, description: "Project id from the catalogue." },
          section: { type: "string", enum: SECTIONS, description: "Optional section to scroll to." },
        },
        required: ["id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "show_contact",
      description: "Show the contact card (email, LinkedIn, CV) so the visitor can reach the real Jules.",
      parameters: {
        type: "object",
        properties: { reason: { type: "string", description: "Short reason, e.g. 'not in my notes'." } },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "open_cv",
      description: "Open Jules's CV (PDF) in the side panel.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
] as const

type ToolCall = { id: string; name: string; args: string }

/** Turns a raw tool call into a safe UI action, or null if it is invalid. */
function toAction(call: ToolCall): Action | null {
  let args: Record<string, unknown> = {}
  try {
    args = call.args ? JSON.parse(call.args) : {}
  } catch {
    return null
  }
  if (call.name === "open_project") {
    const id = String(args.id ?? "")
    if (!getProject(id)) return null
    const section = SECTIONS.includes(args.section as SectionId) ? (args.section as SectionId) : undefined
    return { type: "open_project", id: id as ProjectId, section }
  }
  if (call.name === "show_contact") return { type: "show_contact", reason: typeof args.reason === "string" ? args.reason.slice(0, 120) : undefined }
  if (call.name === "open_cv") return { type: "open_cv" }
  return null
}

function sanitize(body: unknown): ChatRequest | null {
  if (!body || typeof body !== "object") return null
  const { messages, openProject } = body as ChatRequest
  if (!Array.isArray(messages) || messages.length === 0) return null
  const clean: ChatTurn[] = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, m.role === "user" ? MAX_INPUT_CHARS : 4000) }))
  if (clean.length === 0 || clean[clean.length - 1].role !== "user") return null
  if (!clean[clean.length - 1].content.trim()) return null
  return { messages: clean, openProject: openProject && getProject(openProject) ? openProject : null }
}

function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for")
  return (fwd?.split(",")[0] || req.headers.get("x-real-ip") || "local").trim()
}

export async function POST(req: Request) {
  const parsed = sanitize(await req.json().catch(() => null))
  if (!parsed) return new Response("Bad request", { status: 400 })

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: StreamEvent) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"))
      try {
        if (!process.env.OPENROUTER_API_KEY) {
          send({ t: "notice", kind: "offline" })
          return
        }
        const limit = await checkLimits(clientIp(req))
        if (!limit.ok) {
          send({ t: "notice", kind: limit.reason })
          return
        }
        await converse(parsed, send)
      } catch (err) {
        console.error("[chat]", err)
        send({ t: "notice", kind: "error" })
      } finally {
        send({ t: "done" })
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  })
}

/* ------------------------------------------------------------------ */

type OAMessage = Record<string, unknown>

async function converse({ messages, openProject }: ChatRequest, send: (e: StreamEvent) => void) {
  const cacheable = MODEL.startsWith("anthropic/") || MODEL.startsWith("google/")
  const system: OAMessage = {
    role: "system",
    content: cacheable ? [{ type: "text", text: systemPrompt(), cache_control: { type: "ephemeral" } }] : systemPrompt(),
  }
  const state: OAMessage = {
    role: "system",
    content: openProject
      ? `UI state: the project "${openProject}" is currently open in the side panel. Follow-up questions probably refer to it.`
      : "UI state: the side panel is closed.",
  }
  const convo: OAMessage[] = [system, ...messages.slice(0, -1), state, messages[messages.length - 1]]

  // First pass: answer and (maybe) call tools.
  const first = await complete(convo, true, send)
  const actions = first.calls.map(toAction).filter((a): a is Action => a !== null)
  for (const action of actions) send({ t: "action", action })

  // The model sometimes calls a tool without writing anything. Give it the
  // tool results and let it write the answer, with tools disabled.
  if (!first.text.trim() && first.calls.length > 0) {
    const followUp: OAMessage[] = [
      ...convo,
      {
        role: "assistant",
        content: null,
        tool_calls: first.calls.map((c) => ({ id: c.id, type: "function", function: { name: c.name, arguments: c.args || "{}" } })),
      },
      ...first.calls.map((c) => ({
        role: "tool",
        tool_call_id: c.id,
        content: toAction(c) ? "Done: shown to the visitor in the side panel." : "Invalid call, ignored.",
      })),
    ]
    const second = await complete(followUp, false, send)
    if (!second.text.trim()) send({ t: "text", v: "I've opened it on the right." })
  } else if (!first.text.trim()) {
    send({ t: "text", v: "I don't have a good answer to that one. The real Jules does: jules.moreau1@outlook.com" })
  }
}

/** Streams one completion from OpenRouter, forwarding text as it arrives. */
async function complete(messages: OAMessage[], withTools: boolean, send: (e: StreamEvent) => void) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Moreau Harness",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
      max_tokens: MAX_TOKENS,
      temperature: 0.4,
      usage: { include: true },
      // Short factual answers: no hidden reasoning tokens eating the budget.
      reasoning: { enabled: false },
      ...(withTools ? { tools: TOOLS, tool_choice: "auto", parallel_tool_calls: true } : {}),
    }),
  })
  if (!res.ok || !res.body) throw new Error(`openrouter ${res.status}: ${await res.text().catch(() => "")}`)

  const calls: ToolCall[] = []
  let text = ""
  let buffer = ""
  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""
    for (const raw of lines) {
      const line = raw.trim()
      if (!line.startsWith("data:")) continue
      const data = line.slice(5).trim()
      if (data === "[DONE]") continue
      let chunk: any
      try {
        chunk = JSON.parse(data)
      } catch {
        continue
      }
      if (chunk.error) throw new Error(`openrouter stream: ${JSON.stringify(chunk.error)}`)
      if (chunk.usage?.cost != null) {
        await recordSpend(Number(chunk.usage.cost))
        if (process.env.NODE_ENV !== "production") console.log("[chat] usage", JSON.stringify(chunk.usage))
      }
      const finish = chunk.choices?.[0]?.finish_reason
      if (finish && process.env.NODE_ENV !== "production") console.log("[chat] finish", finish, "text", text.length, "calls", calls.length, JSON.stringify(chunk.choices[0].delta ?? {}).slice(0, 300))
      const delta = chunk.choices?.[0]?.delta
      if (!delta) continue
      if (typeof delta.content === "string" && delta.content) {
        text += delta.content
        send({ t: "text", v: delta.content })
      }
      for (const tc of delta.tool_calls ?? []) {
        const i = tc.index ?? 0
        calls[i] ??= { id: tc.id ?? `call_${i}`, name: "", args: "" }
        if (tc.id) calls[i].id = tc.id
        if (tc.function?.name) calls[i].name += tc.function.name
        if (tc.function?.arguments) calls[i].args += tc.function.arguments
      }
    }
  }
  return { text, calls: calls.filter(Boolean) }
}

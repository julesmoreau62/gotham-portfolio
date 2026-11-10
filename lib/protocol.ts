import type { ProjectId, SectionId } from "@/lib/projects"

/** Messages the client sends to /api/chat. */
export type ChatTurn = { role: "user" | "assistant"; content: string }
export type ChatRequest = { messages: ChatTurn[]; openProject?: ProjectId | null }

/** Actions the AI can trigger. They only ever change the UI. */
export type Action =
  | { type: "open_project"; id: ProjectId; section?: SectionId }
  | { type: "show_contact"; reason?: string }
  | { type: "open_cv" }
  | { type: "open_off_the_clock" }

/** One line of the NDJSON stream returned by /api/chat. */
export type StreamEvent =
  | { t: "text"; v: string }
  | { t: "action"; action: Action }
  | { t: "notice"; kind: "rate" | "budget" | "offline" | "error" }
  | { t: "done" }

export const MAX_INPUT_CHARS = 800
export const MAX_TURNS = 10

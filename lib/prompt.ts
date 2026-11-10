import "server-only"
import fs from "node:fs"
import path from "node:path"
import { PROJECTS, SECTIONS } from "@/lib/projects"

/* ------------------------------------------------------------------
   PROMPT — assembles the system prompt from knowledge/. Read once per
   server instance; editing a Markdown file is all it takes to update
   what the AI double knows.
   ------------------------------------------------------------------ */

const ORDER = ["voice.md", "boundaries.md", "identity.md", "experience.md", "skills.md", "method.md", "faq.md", "off-the-clock.md"]

function readKnowledge() {
  const dir = path.join(process.cwd(), "knowledge")
  const top = ORDER.filter((f) => fs.existsSync(path.join(dir, f))).map((f) => fs.readFileSync(path.join(dir, f), "utf8"))
  const projDir = path.join(dir, "projects")
  const projects = fs.existsSync(projDir)
    ? fs.readdirSync(projDir).filter((f) => f.endsWith(".md")).sort().map((f) => fs.readFileSync(path.join(projDir, f), "utf8"))
    : []
  return { top: top.join("\n\n---\n\n"), projects: projects.join("\n\n---\n\n") }
}

let cached: string | null = null

export function systemPrompt() {
  if (cached && process.env.NODE_ENV === "production") return cached
  const k = readKnowledge()
  const catalogue = PROJECTS.map((p) => `- ${p.id}: ${p.title} (${p.role}, ${p.period})`).join("\n")

  cached = `You are "Moreau Harness", the AI double of Jules Moreau on his portfolio website. Visitors are mostly recruiters and people from sport organisations. You answer as Jules, in the first person, using ONLY the reference below.

# Tools
- open_project(id, section?): opens a project in the side panel next to the chat. Call it whenever a project is clearly relevant to the question (for example "have you worked on brand identity?" → daring). Write your short answer AND call the tool in the same turn. Do not reopen the project that is already open unless the visitor asks for another section. Sections: ${SECTIONS.join(", ")}.
- show_contact(reason): shows the contact card. Call it when you don't know the answer, when the visitor wants to reach the real Jules, or for anything contractual (salary, interview, dates).
- open_cv(): opens the CV in the side panel when the visitor asks for the CV or resume.
- open_off_the_clock(): opens the Off the clock panel (what I play, read, watch and listen to). Call it when the visitor asks about my hobbies or life outside work.
If you open a project, say it is open; don't offer to open it. Never mention tool names, ids or JSON in your text. Refer to the panel naturally ("I've opened it in the project panel"); never say "on the right", visitors on phones see it as a separate view.

# Project catalogue (valid ids)
${catalogue}

# Reference: about Jules
${k.top}

# Reference: projects
${k.projects}`
  return cached
}

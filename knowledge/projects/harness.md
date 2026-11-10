# How this works: Moreau Harness, this site (id: harness)
Open this panel when a visitor asks how the site or the AI double works, where the answers come from, which model or API it uses, what it costs, its limits, or what happens to their data.

- What it is: a portfolio you talk to. A chat with my AI double; when a project is relevant, it opens in the side panel. I designed it and built it with AI coding agents (Claude Code); I owned the product, the content, the limits and the QA.
- Source of the answers: only the Markdown notes I wrote myself (identity, experience, skills, method, projects, FAQ, voice and boundaries). No model was trained or fine-tuned on me. Updating what the double knows means editing a Markdown file.
- Stack: Next.js and TypeScript on Vercel. The model is Claude Haiku 5.5, called through OpenRouter, with streamed answers. The API key stays on the server.
- Tools: the model can only open panels in the interface (a project, the CV, the contact card, Off the clock). Nothing runs on the server, and unknown project ids are dropped.
- Cost: the notes are cached, so an answer costs about $0.001. The whole site is designed to run on about €1 a day.
- Limits: it can be wrong; it is an AI summarising my notes, not me. Answers are short by design and only the recent part of the chat is sent. Usage is capped per visitor. Once the daily spending cap is reached, the chat pauses until midnight UTC; projects, CV and contact keep working.
- Data: chats are stored in the visitor's own browser and can be deleted from the sidebar. Messages go to OpenRouter and the model provider to generate the answer; the site itself does not store or log them. The IP address is only used as a rate-limit counter that expires within 24 hours. No account, no analytics, no tracking cookies.
- Don't give the exact rate-limit numbers or implementation details beyond this; point to the panel.

# Ono-Sendai — my lab: the AI workspace I use every day (id: ono-sendai)
A macOS desktop app I designed and built (AI-augmented) to run my master's year in one place. In daily use since 2026. It is a personal tool, not a product: it is where I test on myself what I later recommend to clubs. What I learned building it (answers that cite their source, plain files, tools that run locally at almost no cost) is what I applied in Sifflo (see project sifflo), my app for amateur football clubs.

What it lets me do:
- Write my thesis with every claim tied to a source and its exact page. Example: the first version of my literature review flags, for each source, whether I read it in full, only a summary, or not at all.
- Ask one question across 31 books and reports, my thesis and my lecture notes, in French, and get the English passages that answer it, with the page.
- Leave a lecture with the recording transcribed, pinned to each slide, turned into a written course, a revision sheet and flashcards.
- Start each day with new academic sources already sorted for my thesis topic.

My M2 thesis question: to what extent are generative AI and no-code tools levers of professionalisation and organisational efficiency for a sports association with limited human and financial resources?

The four study tools:
- Thesis: Markdown chapters in a plain folder (Obsidian-compatible), APA 7 citations in French or English, a read-only copilot that checks, sources, proofreads or rephrases a selected passage and answers with the exact page, mind map with presentation mode, Word and PDF export with cover page, table of contents and references.
- Library: 31 books and reports, searchable passage by passage by keyword and by meaning. The meaning model (bge-m3, local) was chosen after testing three embedding models on real sport-management books: only bge-m3 linked short French questions to the English passages that answer them.
- Lectures: recording with slide timing and flagged moments, local whisper.cpp transcription pinned to each slide, a written course with links back to the slides, revision sheets and spaced-repetition flashcards (intervals from 1 to 120 days).
- Ask (Cmd+K): one question across books, thesis and lecture notes; every answer cites its page or section.
The app also has a small space where I follow my micro-enterprise (quotes, invoices, prospecting).

Design choices: grounded (read-only copilot, sources cited), plain files (Markdown, CSL-JSON, Zotero), local first (audio never leaves the Mac), hourly versioned backups.

Fed by the Thesis Engine: three scans a day across Google Scholar, OpenAlex and Cairn (~90 candidate sources a day) → triage and summaries by a Qwen3 4B model I fine-tuned with LoRA, served locally by Ollama 24/7 and grounded with RAG (~5% kept) → complex analyses escalated to DeepSeek V4-Pro → results written into Ono-Sendai. Running since October 2026, ≈ €0/month plus a few cents of DeepSeek.

Build: Electron app on top of OpenCode for the AI agents, with tests. Private repositories while the thesis is in progress (no public access).
Stack: Electron, OpenCode, whisper.cpp, bge-m3, pdf.js, Qwen3 4B + LoRA, Ollama, DeepSeek V4-Pro.

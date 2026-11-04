# Moreau Harness

A portfolio you talk to. Visitors chat with Jules Moreau's AI double (first person, his tone); when a project comes up, the AI opens it in the artifact panel next to the chat. Digital transformation and AI for sport organisations. English by default, answers in the visitor's language.

## Run

```bash
npm install
cp .env.example .env.local   # add OPENROUTER_API_KEY
npm run dev -- -p 3100
```

Without a key the site still works: every project from the sidebar, CV and contact. Free-text questions show an "AI offline" notice.

## Where things live

| Path | What |
| --- | --- |
| `knowledge/*.md` | The reference folder: identity, experience, skills, method, voice, boundaries, FAQ. Edit freely, it is the AI's only source. |
| `knowledge/projects/<id>.md` | What the AI knows about each project. |
| `lib/projects.ts` | What the artifact panel shows (metrics, steps, gallery, site preview, PDF, demo). The ids here are the only ones `open_project` accepts. |
| `lib/starters.ts` | Welcome title. |
| `lib/prompt.ts` | Builds the system prompt from `knowledge/`. |
| `app/api/chat/route.ts` | OpenRouter proxy: streaming, tool calls, validation. |
| `lib/limits.ts` | Per-IP rate limit and daily spend cap. |
| `components/` | Shell, chat, artifact renderer, interactive demos. |
| `public/media/` | Project media copied from the previous portfolio. |
| `app/p/[id]` | Each project as a standalone, shareable page (no AI needed). |

## AI actions

The model gets three tools. They only change the UI, never run anything on the server:

- `open_project(id, section?)`: id is an enum built from `lib/projects.ts`; the server drops unknown ids.
- `show_contact(reason)`: contact card (email, LinkedIn, CV).
- `open_cv()`: the CV in the panel.

On phones the panel never opens by itself: the tool line becomes a "View project" button, and the panel is a full-screen view with "Back to chat".

## Cost control (target: €1 a day)

- The key stays server-side (`OPENROUTER_API_KEY`, never `NEXT_PUBLIC_`).
- Default model: `anthropic/claude-haiku-5.5` ($0.10 / $0.50 per million tokens). The prompt is ~7k tokens and is cached, so a message costs roughly $0.001: about 1,000 messages a day for €1.
- `DAILY_BUDGET_EUR=1`: the route adds up the real cost OpenRouter reports for each answer; once today's total reaches the cap, the chat switches to fallback mode until midnight UTC.
- Per IP: 15 messages per 10 minutes, 60 per day. Message ≤ 800 characters, last 10 turns only, answers ≤ 500 tokens.
- **In production, set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`** (free tier, Vercel integration). Without them, counters live in each serverless instance's memory and the cap is not reliable. If Redis is configured but unreachable, the chat fails closed.
- Belt and braces: also set a credit limit on the key itself in the OpenRouter dashboard (e.g. $35/month).

## Deploy

Vercel: import the folder, add the environment variables from `.env.example`, deploy. `knowledge/` is bundled with the chat function via `outputFileTracingIncludes`.

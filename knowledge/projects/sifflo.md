# Sifflo — the app for amateur football clubs (id: sifflo)
A product I designed and built (AI-augmented) for amateur football clubs: one app that replaces the club's WhatsApp groups. Launched in November 2026 at https://sifflo.app. First club online: AS Nortkerque 95, the club where I ran communications in 2025 (see project signal). Published by Moreau Digital, my micro-enterprise.

Where it comes from: at ASN95 I saw how a volunteer-run club really works. Call-ups by text message, last-minute changes lost in group chats, parents who never get the right information, sponsors with no visibility beyond a pitch-side banner. Sifflo is the tool I was missing then. It is also the field answer to my M2 thesis question on generative AI and no-code tools in sports associations with limited resources.

What it does:
- Call-ups: the coach ticks the players, parents answer present or absent in one tap for their child, families who have not answered get an automatic reminder the evening before. The meeting time follows the match if the kick-off changes.
- Live score from the touchline: automatic clock, goals, cards and substitutions in two taps, a notification for each goal. A goal entered without network is sent when the connection comes back, with the right minute.
- Targeted notifications: each family receives one message that only mentions its own children (pitch closed, match postponed, licence file to complete). Read receipts and a reminder only to those who have not read.
- Club life: calendar for every team, carpooling on each match, volunteer slots, events with online registration, line-ups and playing time, licence files, image rights given by the parent.
- Five roles that can be combined on one account: club official, coach, parent, player, supporter.
- Sponsors inside the app: a "partner of the week" on the home screen, a "match presented by", a partners page with three tiers, and a private follow-up for officials (contact, contract, amount).

Choices I made:
- No app store: it opens from a link and installs on the home screen, on iPhone and Android, with the club's own name, crest, colours and address (club-name.sifflo.app).
- Children first: minors' data is protected by the database itself, not only by what the screen shows. Names are shortened ("Lucas M."), every account is validated by a club official, image rights are dated and can be withdrawn.
- One app for many clubs, each one isolated from the others by the database. 409 automated tests check the access rules.
- A price a small club can carry: €2 per licensed member per year (a 200-member club pays €400), designed to be covered by selling the sponsor slots.
- Easy start: the calendar and standings come from the club's public FFF page; coaches paste their squads from Footclubs or a spreadsheet.
- Data hosted in the European Union; anyone can delete their account.

My role: product design, the rules (who sees what), the pricing, content, QA and deployment. I directed AI coding agents for the implementation.
Stack: Next.js, Supabase (Postgres, row-level security), Cloudflare Workers, web push notifications, installable web app (PWA).

Honest status: it launched in November 2026 and is at pilot stage with its first club. I have no usage figures to share yet; if asked for numbers (users, clubs, revenue), say so and offer contact. The code is private.

# Multilingual Social-Services Navigator

A Claude-powered chatbot that helps non-English speakers find and understand
local food, housing, benefits, and health resources — in their own language,
in plain words, with a clear next step.

Built as a prototype for AI applied to public-interest work: fragmented,
jargon-heavy social services info is a real barrier for non-English speakers,
and it's a barrier a language + reasoning model is well-suited to lower.

## Location

Users can tap "Share location" in the chat toolbar to share their precise
browser location (via the Geolocation API). When shared:

- The backend computes straight-line distance (km) from the user to every
  fixed-site resource and sorts/annotates the resource list before it goes
  to Claude.
- Claude is instructed to use distance as a tiebreaker after eligibility and
  fit — never instead of them — and to state approximate distance in plain
  words, without ever inferring or stating an exact address.
- Phone-based resources (no fixed site) are excluded from distance ranking.

Sharing location is optional. If denied, skipped, or unavailable, the app
falls back to ranking by fit only, with no distance data sent or implied.
Geolocation requires HTTPS in production (localhost is exempt) — deploy
behind TLS.

## Languages

English, Hindi, Marathi, Korean, Chinese, German, Spanish.

## How it works

1. User picks a language and describes their need in their own words
   ("my landlord gave me a letter," not "eviction notice").
2. The backend sends the message + a system prompt containing the full local
   resource list to Claude.
3. Claude identifies the need category, matches it against the *real*
   resource data (never invents an organization), and replies in the user's
   language with 1-3 options, plain-language eligibility, and one clear next
   action.
4. Urgent/safety-sounding messages are triaged to a human fallback number
   before anything else.

Single-call architecture for the MVP (classification + response generation
in one Claude call) rather than a two-call pipeline — simpler, cheaper, and
one less place for the two steps to disagree with each other. Worth
revisiting as a two-call chain once there's a large enough resource list
that retrieval (rather than stuffing the whole list into the system prompt)
becomes necessary.

## Stack

- **Backend:** Node/Express (`server.js`) — keeps the Anthropic API key
  server-side, never exposed to the browser
- **Frontend:** Vanilla HTML/CSS/JS (`public/`) — no framework, keeps the
  bundle tiny for users on low-end phones/slow connections
- **Data:** `data/resources.json` — structured local resource list
- **Fonts:** Noto Sans, Noto Sans Devanagari, Noto Sans KR, Noto Sans SC —
  for correct Hindi/Marathi/Korean/Chinese rendering

## Setup

```bash
npm install
cp .env.example .env   # add your ANTHROPIC_API_KEY
npm start               # runs on http://localhost:3000
```

## Data verification — read before any real use

`data/resources.json` currently contains **placeholder entries** (fake
names, fake phone numbers). This is intentional: real organizations'
contact info and eligibility rules shouldn't be published without calling
them first to confirm accuracy and get their okay to be listed. Before this
goes in front of a real user, every entry needs:

- A phone call to confirm hours, eligibility rules, and that the org wants
  to be listed
- A `last_verified` date
- A refresh cadence (eligibility rules and hours change — stale info here
  isn't a bug, it's a real harm to someone relying on it)

The human fallback number in `server.js` (`HUMAN_FALLBACK_NUMBER`) is also a
placeholder and must be replaced with a real, staffed line before any real
use.

## What I'd do differently at scale

- **Retrieval instead of a stuffed system prompt.** Fine for a couple dozen
  resources, breaks past a few hundred — needs a real retrieval step (embed
  the resource list, pull top-k matches) instead of putting the whole list
  in context every request.
- **Liability boundary on eligibility.** The system prompt already refuses
  to make eligibility determinations, but at scale this needs a legal review
  pass, not just a prompt instruction — the two enforce differently.
- **Data freshness as a first-class problem**, not an afterthought — a
  verified-date field and expiry logic instead of static JSON, plus a way
  for host-org staff (not just the developer) to update entries without
  touching code.
- **Analytics on unmatched queries** — logging (anonymized) what people ask
  that the resource list *can't* answer is the fastest way to find real
  service gaps, which is exactly the kind of insight a host nonprofit would
  want.

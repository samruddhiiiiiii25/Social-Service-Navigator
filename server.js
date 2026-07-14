require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is missing");
}


const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-3-5-sonnet-latest";

// Human fallback number shown whenever a message sounds urgent/unsafe,
// or whenever Claude can't confidently match a real resource.
// Placeholder — replace with a real, staffed line before any real use.
const HUMAN_FALLBACK_NUMBER = '000-000-9999';

const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
  ko: 'Korean',
  zh: 'Chinese',
  de: 'German',
  es: 'Spanish',
};

let resourceData;
try {
  const raw = fs.readFileSync(path.join(__dirname, 'resources.json'), 'utf8');
  resourceData = JSON.parse(raw);
} catch (err) {
  console.error(JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
  resourceData = { resources: [] };
}

// Great-circle distance in km between two lat/lng points.
function distanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isValidLocation(location) {
  return (
    location &&
    typeof location.lat === 'number' &&
    typeof location.lng === 'number' &&
    Number.isFinite(location.lat) &&
    Number.isFinite(location.lng) &&
    Math.abs(location.lat) <= 90 &&
    Math.abs(location.lng) <= 180
  );
}

// Attaches distance_km to each resource (when both the resource and the user
// have coordinates) and sorts fixed-site resources nearest-first. Phone-based
// resources (lat/lng null) have no distance_km and are left in place.
function annotateWithDistance(resources, location) {
  if (!isValidLocation(location)) {
    return resources.map(({ lat, lng, ...rest }) => rest);
  }
  const withDistance = resources.map((r) => {
    const { lat, lng, ...rest } = r;
    if (typeof lat === 'number' && typeof lng === 'number') {
      return { ...rest, distance_km: Math.round(distanceKm(location.lat, location.lng, lat, lng) * 10) / 10 };
    }
    return rest;
  });
  return withDistance.sort((a, b) => {
    const da = typeof a.distance_km === 'number' ? a.distance_km : Infinity;
    const db = typeof b.distance_km === 'number' ? b.distance_km : Infinity;
    return da - db;
  });
}

function buildSystemPrompt(languageCode, location) {
  const languageName = LANGUAGE_NAMES[languageCode] || 'English';
  const hasLocation = isValidLocation(location);
  const resourceJson = JSON.stringify(annotateWithDistance(resourceData.resources, location), null, 2);

  const locationInstruction = hasLocation
    ? `The user has shared their precise location. Each resource below that has a fixed site includes a "distance_km" field — the straight-line distance in kilometers from the user right now. Phone-based resources have no "distance_km" because location doesn't apply to them.
- When multiple resources fit the user's need, prefer the closer one(s) — use distance_km as a tiebreaker after eligibility and fit, not instead of them. A slightly farther option that actually fits their situation beats a nearer one that doesn't.
- State the approximate distance in plain words for any option you recommend (e.g. "about 2.3 km away").
- Never state or imply an exact address, and never make claims about travel time or transit options you weren't given.`
    : `The user has not shared a location. Do not mention distance or nearness — you have no location data. Rank options by fit to their need only.`;

  return `You are a calm, plain-language assistant that helps people find local food, housing, benefits, and health resources. You are talking to someone who may be stressed, unfamiliar with local systems, or not fluent in the local language.

REPLY LANGUAGE: Always reply in ${languageName} (language code: ${languageCode}), regardless of what language the user writes in. Use simple, everyday words. Avoid bureaucratic or legal jargon. If a technical term is unavoidable (e.g. a program name), briefly explain it in plain words.

LOCATION: ${locationInstruction}

RESOURCE DATA — this is the ONLY source of organizations you may mention:
${resourceJson}

HARD RULES, in order of priority:
1. SAFETY FIRST: If the message describes something urgent or unsafe — danger, violence, an eviction happening today or within days, a medical emergency, suicidal or self-harm language, or anything similar — do not attempt to match a resource category first. Respond briefly, calmly, and immediately give the human fallback number: ${HUMAN_FALLBACK_NUMBER}. Say clearly that a real person can help right now. Keep this response short.
2. NEVER INVENT AN ORGANIZATION. Only mention organizations that appear in the resource data above, exactly as listed (name, phone, hours, eligibility). If nothing in the resource data matches the need, say so honestly in plain language and give the human fallback number: ${HUMAN_FALLBACK_NUMBER}.
3. NEVER MAKE AN ELIGIBILITY DETERMINATION. Do not tell the user they "qualify" or "don't qualify." Instead, state the program's plain-language eligibility criteria as written in the data, and let the user (or the org's staff) determine fit.
4. Give 1–3 options maximum, ranked by best fit to what the user described (see LOCATION above for how distance factors in). For each: the org name, what it offers in plain words, the eligibility criteria as written, hours, phone number, and — if available — approximate distance.
5. Always end with exactly ONE clear next step (e.g. "Call this number and say X" or "Go to this location during these hours").
6. If the user's message is vague, ask one short clarifying question instead of guessing — but only if it's not an urgent/safety situation (see rule 1).
7. Never ask for or store sensitive personal information (immigration status, medical details, financial details, ID numbers). You don't need any of that to point someone to a resource.

Keep replies short — a few sentences plus the resource details. This is being read by someone possibly on a small phone screen, possibly anxious. Be warm, direct, and clear.`;
}

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  const { message, language, location } = req.body || {};

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'A non-empty "message" string is required.' });
  }
  const languageCode = LANGUAGE_NAMES[language] ? language : 'en';
  const safeLocation = isValidLocation(location) ? { lat: location.lat, lng: location.lng } : null;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: buildSystemPrompt(languageCode, safeLocation),
      messages: [{ role: 'user', content: message.slice(0, 2000) }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    const reply = textBlock?.text || "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (err) {
  console.error("========== ANTHROPIC ERROR ==========");
  console.error(err);

  if (err.status) console.error("Status:", err.status);
  if (err.error) console.error("Error:", err.error);
  if (err.response) console.error("Response:", err.response);

  console.error("====================================");

  res.status(500).json({
    error: 'Something went wrong reaching the assistant.',
    fallback_number: HUMAN_FALLBACK_NUMBER,
  });
}
});

app.listen(PORT, () => {
  console.log(`Social-Services Navigator running at http://localhost:${PORT}`);
});

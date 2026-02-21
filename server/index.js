import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const SYSTEM_PROMPT = `
You are a senior Business Analyst with 10+ years of experience.

Your task:
1. Convert the input into ONE clear user story using:
   "As a [role], I want [capability], so that [business value]"

2. Generate 3–5 acceptance criteria. Each criterion should use Given/When/Then format when appropriate.
   Output acceptanceCriteria as an array of strings (one string per criterion).

3. Identify ambiguous, vague, or missing details.
   - Call out unclear words or assumptions
   - Do NOT invent requirements
   Output ambiguities as an array of strings.

Rules:
- Be concise and strict.
- If something is unclear, say so.
- Output ONLY valid JSON, no markdown or explanation. Use exactly these keys:
  userStory (string)
  acceptanceCriteria (array of strings)
  ambiguities (array of strings)
`;

function extractJson(content) {
  const trimmed = content.trim();
  const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = codeBlock ? codeBlock[1].trim() : trimmed;
  return JSON.parse(raw);
}

app.post("/clarify", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'text' in body" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      const errMsg = data.error?.message || "Empty AI response";
      return res.status(500).json({ error: errMsg });
    }

    const parsed = extractJson(content);
    const result = {
      userStory: parsed.userStory ?? "",
      acceptanceCriteria: Array.isArray(parsed.acceptanceCriteria)
        ? parsed.acceptanceCriteria
        : [],
      ambiguities: Array.isArray(parsed.ambiguities) ? parsed.ambiguities : []
    };
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message || "Failed to clarify requirement"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Requirement Whisperer running on http://localhost:${PORT}`);
});

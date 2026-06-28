export type AutofillKind = "portfolio" | "other";

export interface AutofillResult {
  title: string;
  shortDescription: string;
  longDescription?: string;
  tech?: string[];
}

// Injection hook used only in tests
export type LLMFn = (prompt: string) => Promise<string>;

const MODEL = "llama-3.1-8b-instant";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set.");

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) throw new Error(await res.text());

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq returned an empty response.");
  return text;
}

function buildPrompt(readme: string, kind: AutofillKind): string {
  const fields =
    kind === "portfolio"
      ? `Return a JSON object with exactly these keys:
- "title": project name (short)
- "shortDescription": one sentence, max ~12 words
- "longDescription": 2-4 sentences, first person ("I built...")
- "tech": array of main technologies/languages/frameworks`
      : `Return a JSON object with exactly these keys:
- "title": project name (short)
- "shortDescription": 2-4 sentences describing what it does and how it's built, first person ("I built...")`;

  return `Extract structured portfolio metadata from this GitHub README.
${fields}
Return ONLY valid JSON with those exact keys. No extra fields, no explanation.

README:
"""
${readme.slice(0, 12000)}
"""`;
}

export async function extractProjectFromReadme(
  readme: string,
  kind: AutofillKind,
  llm?: LLMFn
): Promise<AutofillResult> {
  if (!readme || readme.trim().length === 0) {
    throw new Error("README is empty — nothing to extract.");
  }

  const text = await (llm ?? callGroq)(buildPrompt(readme, kind));

  let parsed: AutofillResult;
  try {
    parsed = JSON.parse(text) as AutofillResult;
  } catch {
    throw new Error("Failed to parse response as JSON.");
  }
  if (!parsed.title || !parsed.shortDescription) {
    throw new Error("Response missing required fields.");
  }
  return parsed;
}

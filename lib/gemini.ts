import { GoogleGenAI } from "@google/genai";

export type AutofillKind = "portfolio" | "other";

export interface AutofillResult {
  title: string;
  shortDescription: string;
  longDescription?: string;
  tech?: string[];
}

export interface GenAILike {
  models: {
    generateContent(args: unknown): Promise<{ text?: string }>;
  };
}

const MODEL = "gemini-flash-latest";

function buildPrompt(readme: string, kind: AutofillKind): string {
  const fields =
    kind === "portfolio"
      ? `- title: the project name (short)
- shortDescription: one sentence, max ~12 words
- longDescription: 2-4 sentences describing what it does and how it's built, first person ("I built...")
- tech: array of the main technologies/languages/frameworks used`
      : `- title: the project name (short)
- shortDescription: 2-4 sentences describing what it does and how it's built, first person ("I built...")`;

  return `You are extracting structured portfolio metadata from a GitHub project's README.
Return ONLY the requested fields based on the README. Do not invent facts not supported by the README.

Fields:
${fields}

README:
"""
${readme.slice(0, 12000)}
"""`;
}

function buildSchema(kind: AutofillKind) {
  const properties: Record<string, unknown> = {
    title: { type: "string" },
    shortDescription: { type: "string" },
  };
  const required = ["title", "shortDescription"];
  if (kind === "portfolio") {
    properties.longDescription = { type: "string" };
    properties.tech = { type: "array", items: { type: "string" } };
    required.push("longDescription", "tech");
  }
  return { type: "object", properties, required };
}

export async function extractProjectFromReadme(
  readme: string,
  kind: AutofillKind,
  client?: GenAILike
): Promise<AutofillResult> {
  if (!readme || readme.trim().length === 0) {
    throw new Error("README is empty — nothing to extract.");
  }

  const genai: GenAILike =
    client ??
    (() => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");
      return new GoogleGenAI({ apiKey }) as unknown as GenAILike;
    })();

  const res = await genai.models.generateContent({
    model: MODEL,
    contents: buildPrompt(readme, kind),
    config: {
      responseMimeType: "application/json",
      responseSchema: buildSchema(kind),
    },
  });

  if (!res.text) {
    throw new Error("Gemini returned an empty response.");
  }
  let parsed: AutofillResult;
  try {
    parsed = JSON.parse(res.text) as AutofillResult;
  } catch {
    throw new Error("Failed to parse Gemini response as JSON.");
  }
  if (!parsed.title || !parsed.shortDescription) {
    throw new Error("Gemini response missing required fields.");
  }
  return parsed;
}

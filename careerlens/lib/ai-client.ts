import OpenAI from "openai";

// ============================================================
// AI Client — server-side only, never imported by client code
// ============================================================

let _client: OpenAI | null = null;

export function getAIClient(): OpenAI | null {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;

  if (!apiKey || apiKey === "your_api_key_here" || apiKey.length < 10) {
    return null;
  }

  if (!_client) {
    _client = new OpenAI({
      apiKey,
      baseURL: baseURL || undefined,
    });
  }
  return _client;
}

export function getModel(): string {
  return process.env.AI_MODEL || "gpt-4o-mini";
}

export function isDemoMode(): boolean {
  return getAIClient() === null;
}

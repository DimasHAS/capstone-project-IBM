import { NextRequest, NextResponse } from "next/server";
import { getAIClient, getModel, isDemoMode } from "@/lib/ai-client";
import { JobMatchSchema } from "@/lib/schemas";
import { matchJobHeuristic } from "@/lib/heuristic-analyzer";

// ============================================================
// POST /api/match-job
// Body: { cvText: string; jobDescription: string }
// Returns: JobMatchAnalysis
// ============================================================

const SYSTEM_PROMPT = `Kamu adalah AI Career Advisor yang menganalisis kecocokan CV dengan deskripsi pekerjaan.
Kembalikan respons dalam format JSON yang valid. Jangan tambahkan teks di luar JSON.
Analisis harus objektif berdasarkan konten CV dan job description yang diberikan.`;

const buildMatchPrompt = (cvText: string, jobDescription: string) => `
Analisis kecocokan CV dengan deskripsi pekerjaan berikut dan kembalikan dalam format JSON:

{
  "overallMatch": <0-100>,
  "skillCoverage": <0-100>,
  "experienceMatch": <0-100>,
  "educationMatch": <0-100>,
  "keywordAlignment": <0-100>,
  "skillComparison": {
    "matched": ["skill yang ada di CV dan job desc"],
    "missing": ["skill di job desc tapi tidak ada di CV"],
    "additional": ["skill di CV tapi tidak diminta job desc"]
  },
  "fitReasons": ["alasan kandidat cocok"],
  "gaps": ["kesenjangan yang perlu ditutup"],
  "improvements": ["rekomendasi untuk meningkatkan kecocokan"]
}

CV:
---
${cvText}
---

Deskripsi Pekerjaan:
---
${jobDescription}
---

Kembalikan HANYA JSON, tidak ada teks lain.`;

function truncate(text: string, maxChars = 2000): string {
  return text.length > maxChars ? text.slice(0, maxChars) + "\n...[terpotong]" : text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cvText, jobDescription } = body as { cvText?: string; jobDescription?: string };

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json({ error: "Teks CV tidak valid." }, { status: 400 });
    }
    if (!jobDescription || jobDescription.trim().length < 30) {
      return NextResponse.json({ error: "Deskripsi pekerjaan terlalu pendek." }, { status: 400 });
    }

    if (isDemoMode()) {
      await new Promise((r) => setTimeout(r, 800));
      const result = matchJobHeuristic(cvText, jobDescription);
      return NextResponse.json({ data: result, demo: true });
    }

    const client = getAIClient()!;
    const model = getModel();

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildMatchPrompt(truncate(cvText), truncate(jobDescription, 1500)) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 900,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("AI tidak mengembalikan respons.");

    const parsed = JSON.parse(raw);
    const validated = JobMatchSchema.parse(parsed);

    return NextResponse.json({ data: validated, demo: false });
  } catch (err: unknown) {
    console.error("[match-job]", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
    return NextResponse.json({ error: `Gagal menganalisis kecocokan: ${message}` }, { status: 500 });
  }
}

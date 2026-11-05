import { NextRequest, NextResponse } from "next/server";
import { getAIClient, getModel, isDemoMode } from "@/lib/ai-client";
import { CVAnalysisSchema } from "@/lib/schemas";
import { analyzeCVHeuristic } from "@/lib/heuristic-analyzer";

// ============================================================
// POST /api/analyze-cv
// Body: { cvText: string }
// Returns: CVAnalysis
// ============================================================

const SYSTEM_PROMPT = `Kamu adalah AI Career Advisor yang menganalisis CV. Berikan analisis CV yang komprehensif dan akurat.
PENTING: Selalu kembalikan respons dalam format JSON yang valid sesuai schema yang diminta. Jangan tambahkan teks di luar JSON.
Jangan mengarang informasi yang tidak ada di CV. Jika informasi tidak tersedia, gunakan string kosong.
Semua rekomendasi harus berdasarkan bukti dari CV yang diberikan.`;

const buildCVPrompt = (cvText: string) => `
Analisis CV berikut dan kembalikan hasil dalam format JSON PERSIS seperti schema ini:

{
  "overallScore": <number 0-100>,
  "scoreBreakdown": {
    "structure": <0-100>,
    "summary": <0-100>,
    "skills": <0-100>,
    "experience": <0-100>,
    "achievements": <0-100>,
    "education": <0-100>,
    "keywords": <0-100>
  },
  "profile": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedIn": "",
    "summary": "",
    "education": [{"institution":"","degree":"","field":"","graduationYear":"","gpa":""}],
    "experience": [{"company":"","position":"","startDate":"","endDate":"","description":[]}],
    "technicalSkills": [],
    "softSkills": [],
    "projects": [{"name":"","description":"","technologies":[]}],
    "certifications": [],
    "languages": []
  },
  "strengths": ["<kekuatan 1>","<kekuatan 2>"],
  "weaknesses": ["<kelemahan 1>","<kelemahan 2>"],
  "missingInfo": ["<info yang hilang>"],
  "improvements": [
    {
      "original": "<kalimat asli dari CV>",
      "problem": "<masalah dengan kalimat tersebut>",
      "recommendation": "<versi yang lebih baik>",
      "reason": "<alasan mengapa lebih baik>"
    }
  ]
}

Kriteria penilaian overallScore:
- structure (bobot 15%): kelengkapan bagian CV, format yang jelas
- summary (bobot 15%): kejelasan ringkasan profesional, nilai unik
- skills (bobot 20%): relevansi dan keragaman keterampilan
- experience (bobot 25%): pengalaman yang relevan, kualitas deskripsi
- achievements (bobot 10%): pencapaian terukur, dampak nyata
- education (bobot 10%): relevansi pendidikan
- keywords (bobot 5%): penggunaan keyword industri yang relevan

CV yang dianalisis:
---
${cvText}
---

Kembalikan HANYA JSON, tidak ada teks lain.`;

// Truncate CV text to keep prompts within token limits for free-tier APIs
function truncateCV(text: string, maxChars = 2500): string {
  return text.length > maxChars ? text.slice(0, maxChars) + "\n...[terpotong]" : text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cvText: string = body?.cvText;

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json({ error: "Teks CV terlalu pendek untuk dianalisis." }, { status: 400 });
    }

    // Demo mode — use heuristic analyzer on actual CV text
    if (isDemoMode()) {
      await new Promise((r) => setTimeout(r, 800));
      const result = analyzeCVHeuristic(cvText);
      return NextResponse.json({ data: result, demo: true });
    }

    const client = getAIClient()!;
    const model = getModel();
    const truncated = truncateCV(cvText);

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildCVPrompt(truncated) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 900,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("AI tidak mengembalikan respons.");

    const parsed = JSON.parse(raw);
    const validated = CVAnalysisSchema.parse(parsed);

    return NextResponse.json({ data: validated, demo: false });
  } catch (err: unknown) {
    console.error("[analyze-cv]", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
    return NextResponse.json({ error: `Gagal menganalisis CV: ${message}` }, { status: 500 });
  }
}

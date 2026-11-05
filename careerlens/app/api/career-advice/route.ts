import { NextRequest, NextResponse } from "next/server";
import { getAIClient, getModel, isDemoMode } from "@/lib/ai-client";
import { CareerAdviceSchema } from "@/lib/schemas";
import { careerAdviceHeuristic } from "@/lib/heuristic-analyzer";

// ============================================================
// POST /api/career-advice
// Body: { cvText: string; interests?: string }
// Returns: CareerAdvice
// ============================================================

const SYSTEM_PROMPT = `Kamu adalah AI Career Advisor yang memberikan saran karir yang personal dan actionable.
Kembalikan respons dalam format JSON yang valid. Jangan tambahkan teks di luar JSON.
Semua rekomendasi harus realistis, spesifik, dan berdasarkan profil CV yang diberikan.`;

const buildAdvicePrompt = (cvText: string, interests?: string) => `
Berikan saran karir berdasarkan CV berikut dan kembalikan dalam format JSON:

{
  "careerPaths": [
    {
      "title": "Judul Posisi",
      "reasoning": "Alasan mengapa jalur ini cocok",
      "requiredSkills": ["skill yang dibutuhkan"],
      "missingSkills": ["skill yang belum dimiliki"],
      "growthPotential": "Deskripsi potensi pertumbuhan"
    }
  ],
  "roadmap": {
    "shortTerm": [
      {
        "skill": "Skill yang perlu dipelajari",
        "priority": "Tinggi",
        "resource": "Sumber belajar spesifik",
        "project": "Proyek praktis yang bisa dibuat"
      }
    ],
    "midTerm": [...],
    "longTerm": [...]
  },
  "nextSteps": ["langkah konkret yang bisa dilakukan sekarang"]
}

Sediakan 2-3 jalur karir. Priority harus salah satu dari: "Tinggi", "Sedang", atau "Rendah".
Sediakan 2-3 item untuk setiap fase roadmap (short/mid/long term).

CV:
---
${cvText}
---
${interests ? `\nMinat/Tujuan Karir Kandidat: ${interests}` : ""}

Kembalikan HANYA JSON, tidak ada teks lain.`;

function truncate(text: string, maxChars = 2000): string {
  return text.length > maxChars ? text.slice(0, maxChars) + "\n...[terpotong]" : text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cvText, interests } = body as { cvText?: string; interests?: string };

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json({ error: "Teks CV tidak valid." }, { status: 400 });
    }

    if (isDemoMode()) {
      await new Promise((r) => setTimeout(r, 800));
      const result = careerAdviceHeuristic(cvText, interests);
      return NextResponse.json({ data: result, demo: true });
    }

    const client = getAIClient()!;
    const model = getModel();

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildAdvicePrompt(truncate(cvText), interests) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 900,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("AI tidak mengembalikan respons.");

    const parsed = JSON.parse(raw);
    const validated = CareerAdviceSchema.parse(parsed);

    return NextResponse.json({ data: validated, demo: false });
  } catch (err: unknown) {
    console.error("[career-advice]", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
    return NextResponse.json({ error: `Gagal membuat saran karir: ${message}` }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

// ============================================================
// POST /api/extract-cv
// Accepts: multipart/form-data with a "file" field (PDF/DOCX)
//          OR application/json with { text: string }
// Returns: { text: string }
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // ---- Text input path ----
    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (typeof body.text !== "string" || body.text.trim().length === 0) {
        return NextResponse.json({ error: "Teks CV tidak boleh kosong." }, { status: 400 });
      }
      return NextResponse.json({ text: body.text.trim() });
    }

    // ---- File upload path ----
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Content-Type tidak valid." }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah." }, { status: 400 });
    }

    // Validate size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file melebihi batas 10 MB." }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    if (fileName.endsWith(".pdf")) {
      const text = await extractPDF(buffer);
      return NextResponse.json({ text });
    }

    if (fileName.endsWith(".docx")) {
      const text = await extractDOCX(buffer);
      return NextResponse.json({ text });
    }

    return NextResponse.json(
      { error: "Format file tidak didukung. Gunakan PDF atau DOCX." },
      { status: 400 }
    );
  } catch (err) {
    console.error("[extract-cv]", err);
    return NextResponse.json(
      { error: "Gagal memproses file. Pastikan file tidak rusak dan coba lagi." },
      { status: 500 }
    );
  }
}

async function extractPDF(buffer: Buffer): Promise<string> {
  // pdf-parse v1 — CommonJS, dynamically required to avoid Next.js SSR bundling issues
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse") as (
    buf: Buffer,
    options?: Record<string, unknown>
  ) => Promise<{ text: string; numpages: number }>;
  const data = await pdfParse(buffer, { max: 0 });
  const text = data.text?.trim();
  if (!text || text.length < 30) {
    throw new Error(
      "PDF tidak mengandung teks yang dapat dibaca. Pastikan PDF bukan hasil scan gambar."
    );
  }
  return text;
}

async function extractDOCX(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value?.trim();
  if (!text || text.length < 30) {
    throw new Error("Dokumen DOCX tidak mengandung teks yang dapat dibaca.");
  }
  return text;
}

# CareerLens — AI-Powered CV Analyzer & Career Advisor

CareerLens adalah aplikasi web berbasis AI yang membantu mahasiswa, fresh graduate, dan job seeker untuk menganalisis CV, menemukan gap keterampilan, dan mendapatkan rekomendasi karir yang personal.

## Fitur Utama

- **Analisis CV Komprehensif** — Skor kualitas CV (0–100) dengan rincian per kriteria
- **Ekstraksi Profil Kandidat** — Nama, konten, skill, pengalaman, proyek, dan sertifikasi
- **Kekuatan & Kelemahan CV** — Identifikasi area terkuat dan yang perlu perbaikan
- **Rekomendasi Spesifik** — Saran perbaikan kalimat dengan contoh sebelum/sesudah
- **Job Match Analyzer** — Bandingkan CV dengan deskripsi pekerjaan, lihat skill yang cocok/kurang
- **Career Advisor** — Jalur karir yang direkomendasikan dan roadmap belajar personal
- **Laporan Lengkap** — Konsolidasi semua analisis, bisa dicetak sebagai PDF
- **Mode Demo** — Berfungsi penuh tanpa API key AI

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Next.js API Routes (server-side)
- **AI**: OpenAI-compatible API (GPT-4o-mini default)
- **Document Processing**: pdf-parse (PDF), mammoth (DOCX)
- **Validation**: Zod
- **Icons**: Lucide React

## Instalasi

```bash
# 1. Clone atau buka folder proyek
cd careerlens

# 2. Install dependencies
npm install

# 3. Salin file environment
cp .env.example .env.local

# 4. Jalankan development server
npm run dev
```

Buka http://localhost:3000 di browser.

## Konfigurasi AI API

Edit file `.env.local`:

```env
# Kunci API OpenAI (atau provider kompatibel)
AI_API_KEY=sk-xxxxxxxxxxxxxx

# Base URL (kosongkan untuk OpenAI default, atau isi untuk provider lain)
# AI_BASE_URL=https://api.groq.com/openai/v1

# Model yang digunakan
AI_MODEL=gpt-4o-mini
```

### Provider yang Didukung

| Provider | Base URL | Contoh Model |
|----------|----------|--------------|
| OpenAI | (kosong) | gpt-4o-mini |
| Groq | https://api.groq.com/openai/v1 | llama-3.1-8b-instant |
| Together AI | https://api.together.xyz/v1 | meta-llama/Llama-3-8b |
| Ollama (lokal) | http://localhost:11434/v1 | llama3.2 |

## Mode Demo

Jika `AI_API_KEY` tidak dikonfigurasi atau diisi `your_api_key_here`, aplikasi otomatis berjalan dalam **Mode Demo** menggunakan data sampel yang realistis. Semua fitur tetap dapat digunakan.

Tanda Mode Demo ditampilkan dengan banner kuning di setiap halaman hasil analisis.

## Struktur Proyek

```
careerlens/
├── app/
│   ├── page.tsx              # Landing page
│   ├── analyzer/page.tsx     # Halaman analisis CV
│   ├── job-match/page.tsx    # Halaman job match
│   ├── career/page.tsx       # Halaman career advisor
│   ├── report/page.tsx       # Halaman laporan
│   └── api/
│       ├── extract-cv/       # Ekstraksi teks dari PDF/DOCX
│       ├── analyze-cv/       # Analisis CV dengan AI
│       ├── match-job/        # Job match analysis
│       └── career-advice/    # Saran karir
├── components/
│   ├── ui/                   # Komponen UI reusable
│   ├── cv/                   # Komponen upload CV
│   ├── analysis/             # Komponen hasil analisis CV
│   ├── job-match/            # Komponen job match
│   ├── career/               # Komponen career advisor
│   └── report/               # Komponen laporan
├── lib/
│   ├── app-context.tsx       # Global state management
│   ├── ai-client.ts          # AI client (server-side only)
│   ├── schemas.ts            # Zod validation schemas
│   └── demo-data.ts          # Data sampel untuk Mode Demo
└── types/
    └── index.ts              # TypeScript type definitions
```

## Privasi & Keamanan

- CV yang diupload **tidak disimpan** di server
- API key AI hanya diakses di **sisi server**
- Tidak ada logging konten CV atau informasi pribadi
- Data analisis hanya disimpan di **browser session** (React state)

## Keterbatasan

- PDF yang di-scan (berbasis gambar) tidak dapat diekstrak — gunakan PDF dengan teks digital
- Akurasi analisis AI bergantung pada kualitas model dan konten CV
- Skor CV adalah estimasi berbasis AI, bukan skor ATS resmi
- Mode Demo menggunakan data sampel tetap, tidak menganalisis CV yang diunggah

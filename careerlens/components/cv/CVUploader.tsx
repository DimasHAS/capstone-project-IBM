"use client";
import React, { useCallback, useRef, useState } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, Type } from "lucide-react";
import { Alert } from "@/components/ui";

interface CVUploaderProps {
  onExtracted: (text: string, fileName: string) => void;
}

type InputMode = "upload" | "text";

export default function CVUploader({ onExtracted }: CVUploaderProps) {
  const [mode, setMode] = useState<InputMode>("upload");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const DEMO_CV = `Budi Santoso
Email: budi.santoso@email.com | Phone: +62 812-3456-7890
Location: Jakarta, Indonesia

RINGKASAN PROFESIONAL
Mahasiswa Teknik Informatika dengan pengalaman magang di Tokopedia dan proyek web/data.

PENDIDIKAN
Universitas Indonesia — S1 Teknik Informatika | 2021–2025 | IPK: 3.6

PENGALAMAN
PT Tokopedia — Software Engineering Intern (Juni–Agustus 2024)
- Membantu pengembangan backend Node.js dan Express
- Menulis unit test, meningkatkan coverage 60% ke 80%

KETERAMPILAN
JavaScript, TypeScript, React, Node.js, Python, SQL, Git, Docker

PROYEK
CareerPath App — React, Node.js, MongoDB
Data Visualizer — Python, Pandas, Matplotlib

SERTIFIKASI
- AWS Cloud Practitioner (2024)`;

  const processFile = useCallback(
    async (f: File) => {
      setError(null);
      setSuccess(false);
      setFile(f);
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", f);
        const res = await fetch("/api/extract-cv", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Gagal memproses file.");
        setSuccess(true);
        onExtracted(json.text, f.name);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Gagal memproses file.");
        setFile(null);
      } finally {
        setLoading(false);
      }
    },
    [onExtracted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) processFile(f);
    },
    [processFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleTextSubmit = async () => {
    if (text.trim().length < 50) {
      setError("Teks CV terlalu pendek (minimal 50 karakter).");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/extract-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal memproses teks.");
      setSuccess(true);
      onExtracted(json.text, "Teks Manual");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal memproses teks.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setText("");
    setError(null);
    setSuccess(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {[
          { id: "upload" as InputMode, label: "Upload File", icon: Upload },
          { id: "text" as InputMode, label: "Tempel Teks", icon: Type },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setMode(id); reset(); }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === id ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Upload mode */}
      {mode === "upload" && (
        <>
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                dragging ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
              }`}
            >
              <Upload size={36} className="mx-auto text-slate-400 mb-4" />
              <p className="font-semibold text-slate-700 mb-1">Seret & lepas file CV di sini</p>
              <p className="text-sm text-slate-500 mb-4">atau klik untuk memilih file</p>
              <span className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-lg">
                Pilih File
              </span>
              <p className="text-xs text-slate-400 mt-3">PDF, DOCX — Maks. 10 MB</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {loading && (
                  <div className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                )}
                {success && <CheckCircle size={18} className="text-green-500" />}
                <button onClick={reset} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
          <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />
        </>
      )}

      {/* Text mode */}
      {mode === "text" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Tempel teks CV kamu</label>
            <button
              onClick={() => setText(DEMO_CV)}
              className="text-xs text-blue-600 hover:underline"
            >
              Gunakan CV Demo
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setSuccess(false); setError(null); }}
            placeholder="Salin dan tempel isi CV kamu di sini..."
            rows={10}
            className="w-full border border-slate-300 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{text.length} karakter</span>
            <button
              onClick={handleTextSubmit}
              disabled={loading || text.trim().length < 50}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : success ? (
                <><CheckCircle size={14} />Berhasil!</>
              ) : (
                "Gunakan Teks Ini"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error/success */}
      {error && (
        <Alert variant="error">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        </Alert>
      )}
      {success && mode === "upload" && (
        <Alert variant="success">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} />
            CV berhasil diekstrak! Klik <strong>Analisis CV</strong> untuk melanjutkan.
          </div>
        </Alert>
      )}
    </div>
  );
}

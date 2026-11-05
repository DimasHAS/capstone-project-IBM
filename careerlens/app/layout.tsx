import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/app-context";

export const metadata: Metadata = {
  title: "CareerLens — AI-Powered CV Analyzer",
  description:
    "Analisis CV kamu dengan AI, temukan gap keterampilan, dan dapatkan rekomendasi karir yang personal.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

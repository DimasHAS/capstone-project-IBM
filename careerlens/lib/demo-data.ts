import type { CVAnalysis, JobMatchAnalysis, CareerAdvice } from "@/types";

// ============================================================
// Demo Mode — Realistic sample data (no AI key needed)
// ============================================================

export const DEMO_CV_TEXT = `
Budi Santoso
Email: budi.santoso@email.com | Phone: +62 812-3456-7890
LinkedIn: linkedin.com/in/budisantoso | Location: Jakarta, Indonesia

RINGKASAN PROFESIONAL
Mahasiswa Teknik Informatika semester akhir dengan pengalaman magang dan proyek akademis di bidang 
pengembangan web dan data science. Memiliki kemampuan problem-solving yang baik dan semangat belajar tinggi.

PENDIDIKAN
Universitas Indonesia — S1 Teknik Informatika
2021 – 2025 | IPK: 3.6/4.0

PENGALAMAN KERJA
PT Tokopedia — Software Engineering Intern
Juni 2024 – Agustus 2024
- Membantu pengembangan fitur backend menggunakan Node.js dan Express
- Menulis unit test dengan Jest, meningkatkan coverage dari 60% ke 80%
- Berkolaborasi dengan tim menggunakan Git dan metodologi Agile

PT Startup Lokal — Web Developer Freelance
Januari 2024 – Mei 2024
- Membangun website company profile menggunakan React dan Tailwind CSS
- Mengintegrasikan REST API dari berbagai layanan pihak ketiga

KETERAMPILAN TEKNIS
JavaScript, TypeScript, React, Node.js, Python, SQL, Git, Docker, REST API, HTML/CSS

SOFT SKILLS
Komunikasi, Kerja Tim, Problem Solving, Adaptasi, Manajemen Waktu

PROYEK
CareerPath App — React, Node.js, MongoDB
Aplikasi web untuk mahasiswa merencanakan jalur karir berdasarkan minat dan keterampilan.

Data Visualizer — Python, Pandas, Matplotlib
Tool untuk memvisualisasikan dataset akademis dengan berbagai tipe grafik.

SERTIFIKASI
- AWS Cloud Practitioner (2024)
- Google IT Support Professional Certificate (2023)
`;

export const DEMO_JOB_DESCRIPTION = `
Posisi: Junior Software Engineer — Backend
Perusahaan: Tech Startup Jakarta

Deskripsi Pekerjaan:
Kami mencari Junior Software Engineer dengan fokus backend untuk bergabung dengan tim engineering kami.

Persyaratan:
- Minimal S1 Ilmu Komputer atau Teknik Informatika
- Pengalaman 0–2 tahun (fresh graduate dipersilahkan)
- Menguasai Node.js atau Python untuk backend development
- Familiar dengan database SQL dan NoSQL (PostgreSQL, MongoDB)
- Memahami konsep REST API dan microservices
- Pengalaman dengan containerization (Docker, Kubernetes)
- Mampu menggunakan Git dan bekerja dalam tim Agile
- Pengalaman dengan cloud platform (AWS, GCP, atau Azure) menjadi nilai plus
- Kemampuan komunikasi yang baik dalam Bahasa Indonesia dan Inggris

Tanggung Jawab:
- Mengembangkan dan memelihara layanan backend
- Menulis kode yang bersih, dapat diuji, dan terdokumentasi
- Berkolaborasi dengan tim frontend dan DevOps
- Berpartisipasi dalam code review
`;

export const DEMO_CV_ANALYSIS: CVAnalysis = {
  overallScore: 72,
  scoreBreakdown: {
    structure: 78,
    summary: 65,
    skills: 80,
    experience: 70,
    achievements: 55,
    education: 90,
    keywords: 72,
  },
  profile: {
    fullName: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "+62 812-3456-7890",
    location: "Jakarta, Indonesia",
    linkedIn: "linkedin.com/in/budisantoso",
    summary:
      "Mahasiswa Teknik Informatika semester akhir dengan pengalaman magang dan proyek akademis di bidang pengembangan web dan data science.",
    education: [
      {
        institution: "Universitas Indonesia",
        degree: "S1",
        field: "Teknik Informatika",
        graduationYear: "2025",
        gpa: "3.6",
      },
    ],
    experience: [
      {
        company: "PT Tokopedia",
        position: "Software Engineering Intern",
        startDate: "Juni 2024",
        endDate: "Agustus 2024",
        description: [
          "Membantu pengembangan fitur backend menggunakan Node.js dan Express",
          "Menulis unit test dengan Jest, meningkatkan coverage dari 60% ke 80%",
          "Berkolaborasi dengan tim menggunakan Git dan metodologi Agile",
        ],
      },
      {
        company: "PT Startup Lokal",
        position: "Web Developer Freelance",
        startDate: "Januari 2024",
        endDate: "Mei 2024",
        description: [
          "Membangun website company profile menggunakan React dan Tailwind CSS",
          "Mengintegrasikan REST API dari berbagai layanan pihak ketiga",
        ],
      },
    ],
    technicalSkills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "SQL",
      "Git",
      "Docker",
      "REST API",
      "HTML/CSS",
    ],
    softSkills: ["Komunikasi", "Kerja Tim", "Problem Solving", "Adaptasi", "Manajemen Waktu"],
    projects: [
      {
        name: "CareerPath App",
        description: "Aplikasi web untuk mahasiswa merencanakan jalur karir berdasarkan minat dan keterampilan.",
        technologies: ["React", "Node.js", "MongoDB"],
      },
      {
        name: "Data Visualizer",
        description: "Tool untuk memvisualisasikan dataset akademis dengan berbagai tipe grafik.",
        technologies: ["Python", "Pandas", "Matplotlib"],
      },
    ],
    certifications: ["AWS Cloud Practitioner (2024)", "Google IT Support Professional Certificate (2023)"],
    languages: ["Bahasa Indonesia", "English"],
  },
  strengths: [
    "Pendidikan dari universitas terkemuka (Universitas Indonesia) dengan IPK tinggi 3.6",
    "Pengalaman magang relevan di perusahaan teknologi besar (Tokopedia)",
    "Keterampilan teknis yang beragam dan sesuai dengan standar industri",
    "Sertifikasi cloud yang menambah nilai profesional",
    "Memiliki proyek portofolio yang menunjukkan kemampuan praktis",
  ],
  weaknesses: [
    "Deskripsi pekerjaan kurang menunjukkan dampak bisnis yang terukur",
    "Ringkasan profesional terlalu generik dan tidak menonjolkan nilai unik kandidat",
    "Tidak ada tautan ke portofolio atau repository GitHub",
    "Deskripsi proyek terlalu singkat dan tidak menjelaskan hasil/impact",
    "Bagian soft skills bisa diintegrasikan ke dalam pengalaman kerja",
  ],
  missingInfo: [
    "URL GitHub atau portofolio online",
    "Metrik kuantitatif untuk pencapaian di pengalaman kerja",
    "Deskripsi proyek yang lebih detail (teknologi, tantangan, hasil)",
    "Referensi atau testimoni (opsional namun bernilai)",
  ],
  improvements: [
    {
      original: "Membantu pengembangan fitur backend menggunakan Node.js dan Express",
      problem: "Kata 'membantu' terkesan pasif dan tidak menunjukkan kontribusi nyata",
      recommendation: "Mengembangkan 3 fitur backend REST API menggunakan Node.js dan Express yang melayani >10.000 request/hari",
      reason: "Pernyataan aktif dengan metrik konkret menunjukkan kontribusi nyata dan membuat CV lebih menonjol",
    },
    {
      original: "Mahasiswa Teknik Informatika semester akhir dengan pengalaman magang dan proyek akademis",
      problem: "Ringkasan terlalu generik, tidak menonjolkan keahlian utama atau nilai unik",
      recommendation: "Backend developer dengan keahlian Node.js & Python, pengalaman magang di Tokopedia, dan track record membangun aplikasi web full-stack. Berpengalaman dalam Agile development dan memiliki sertifikasi AWS Cloud Practitioner.",
      reason: "Ringkasan yang spesifik membantu recruiter langsung memahami nilai kandidat dalam 5 detik pertama",
    },
    {
      original: "Membangun website company profile menggunakan React dan Tailwind CSS",
      problem: "Tidak menyebutkan hasil, skala, atau dampak dari pekerjaan",
      recommendation: "Membangun dan meluncurkan website company profile responsif menggunakan React & Tailwind CSS, menghasilkan peningkatan [X]% traffic organik dalam [Y] bulan",
      reason: "Hasil yang terukur membuktikan kemampuan kandidat dalam memberikan value nyata",
    },
  ],
};

export const DEMO_JOB_MATCH: JobMatchAnalysis = {
  overallMatch: 78,
  skillCoverage: 82,
  experienceMatch: 70,
  educationMatch: 95,
  keywordAlignment: 75,
  skillComparison: {
    matched: ["Node.js", "Python", "SQL", "Docker", "Git", "REST API", "Agile", "JavaScript"],
    missing: ["PostgreSQL", "Kubernetes", "Microservices", "NoSQL lanjutan (beyond basic MongoDB)"],
    additional: ["React", "TypeScript", "TypeScript", "HTML/CSS", "Matplotlib", "Pandas"],
  },
  fitReasons: [
    "Latar belakang pendidikan S1 Teknik Informatika sesuai dengan persyaratan",
    "Pengalaman magang di Tokopedia sangat relevan untuk posisi backend engineer",
    "Menguasai Node.js dan Python yang merupakan bahasa utama yang dibutuhkan",
    "Pengalaman Docker dan REST API sesuai dengan kebutuhan posisi",
    "Sertifikasi AWS relevan untuk persyaratan cloud platform",
  ],
  gaps: [
    "Belum ada pengalaman dengan Kubernetes untuk orchestration",
    "Pengalaman database masih terbatas, belum ada exposure ke PostgreSQL",
    "Konsep microservices perlu diperdalam",
    "Pengalaman kerja masih pada level magang/freelance, belum full-time",
  ],
  improvements: [
    "Pelajari PostgreSQL dan perbedaannya dengan MySQL untuk menutup gap database",
    "Tambahkan proyek yang menggunakan arsitektur microservices",
    "Pelajari Kubernetes dasar sebagai ekstensi dari pengalaman Docker",
    "Tonjolkan pengalaman Tokopedia lebih detail dalam CV dengan hasil yang terukur",
    "Tambahkan proyek backend yang lebih kompleks ke portofolio GitHub",
  ],
};

export const DEMO_CAREER_ADVICE: CareerAdvice = {
  careerPaths: [
    {
      title: "Backend Software Engineer",
      reasoning:
        "Pengalaman Node.js, Python, dan magang di Tokopedia menunjukkan fondasi yang kuat untuk karir backend. Ini adalah jalur paling natural berdasarkan CV saat ini.",
      requiredSkills: ["Node.js", "Python", "PostgreSQL", "Docker", "Microservices", "AWS"],
      missingSkills: ["PostgreSQL lanjutan", "Kubernetes", "System Design", "Microservices patterns"],
      growthPotential: "Tinggi — permintaan backend engineer di Indonesia terus meningkat",
    },
    {
      title: "Full-Stack Web Developer",
      reasoning:
        "Kombinasi React di frontend dan Node.js di backend memberikan dasar yang baik untuk menjadi full-stack developer.",
      requiredSkills: ["React", "Node.js", "TypeScript", "Database", "DevOps dasar"],
      missingSkills: ["State management lanjutan (Redux/Zustand)", "Testing E2E", "CI/CD pipeline"],
      growthPotential: "Tinggi — full-stack developer sangat dicari di startup",
    },
    {
      title: "Data Engineer / ML Engineer",
      reasoning:
        "Pengalaman Python, Pandas, dan proyek Data Visualizer menunjukkan minat di data. Dengan pengembangan skill yang tepat, ini adalah jalur yang menjanjikan.",
      requiredSkills: ["Python", "SQL", "Apache Spark", "Airflow", "Machine Learning dasar"],
      missingSkills: ["Spark/Hadoop", "Data pipeline tools", "Machine Learning frameworks", "Cloud data services"],
      growthPotential: "Sangat Tinggi — data engineer adalah salah satu profesi paling dicari",
    },
  ],
  roadmap: {
    shortTerm: [
      {
        skill: "PostgreSQL & Database Design",
        priority: "Tinggi",
        resource: "PostgreSQL Tutorial (postgresql.org) + freeCodeCamp",
        project: "Migrate salah satu proyek dari MongoDB ke PostgreSQL",
      },
      {
        skill: "Memperkuat portofolio GitHub",
        priority: "Tinggi",
        resource: "Buat README yang baik untuk setiap proyek, tambahkan demo link",
        project: "Publish semua proyek akademis yang relevan ke GitHub",
      },
      {
        skill: "System Design dasar",
        priority: "Sedang",
        resource: "System Design Primer (GitHub), ByteByteGo",
        project: "Dokumentasikan arsitektur proyek yang sudah ada",
      },
    ],
    midTerm: [
      {
        skill: "Kubernetes dasar",
        priority: "Tinggi",
        resource: "Kubernetes.io official docs, KodeKloud",
        project: "Deploy aplikasi Node.js ke Kubernetes cluster lokal menggunakan Minikube",
      },
      {
        skill: "Microservices Architecture",
        priority: "Tinggi",
        resource: "Building Microservices (Sam Newman), Udemy course",
        project: "Refactor CareerPath App menjadi arsitektur microservices",
      },
      {
        skill: "TypeScript lanjutan",
        priority: "Sedang",
        resource: "TypeScript Deep Dive (gitbook), Execute Program",
        project: "Migrate semua proyek JavaScript ke TypeScript",
      },
    ],
    longTerm: [
      {
        skill: "Cloud Architecture (AWS Solutions Architect)",
        priority: "Tinggi",
        resource: "AWS Official Training, A Cloud Guru",
        project: "Deploy full-stack aplikasi ke AWS dengan proper architecture",
      },
      {
        skill: "Open Source Contribution",
        priority: "Sedang",
        resource: "First Contributions (GitHub), Good First Issues",
        project: "Kontribusi ke minimal 1 proyek open source yang relevan",
      },
      {
        skill: "Leadership & Technical Communication",
        priority: "Sedang",
        resource: "Soft skills courses, mentor junior developer",
        project: "Mulai technical blog atau presentasi di meetup lokal",
      },
    ],
  },
  nextSteps: [
    "Perbarui CV dengan metrik kuantitatif dan publikasikan ke LinkedIn",
    "Buat profil GitHub yang profesional dengan pinned repositories",
    "Daftar ke platform seperti Glints, JobStreet, atau LinkedIn Jobs untuk posisi Junior Backend",
    "Bergabung dengan komunitas developer seperti GDSC atau komunitas tech lokal",
    "Mulai belajar PostgreSQL dan selesaikan satu proyek dengan database relasional",
    "Siapkan portofolio online (bisa pakai GitHub Pages atau Vercel)",
    "Latihan interview coding di LeetCode atau HackerRank (Easy–Medium level)",
  ],
};

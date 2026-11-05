import type {
  CVAnalysis,
  CandidateProfile,
  CVScoreBreakdown,
  CVImprovement,
  JobMatchAnalysis,
  SkillComparison,
  CareerAdvice,
  CareerPath,
  LearningRoadmap,
  LearningItem,
} from "@/types";

// ============================================================
// Local Heuristic CV Analyzer
// Used in Demo Mode so analysis reflects the ACTUAL uploaded CV,
// not hardcoded sample data.
// ============================================================

// ---- Text helpers ----
function lines(text: string) {
  return text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function containsAny(haystack: string, needles: string[]): boolean {
  const h = normalize(haystack);
  return needles.some((n) => h.includes(n.toLowerCase()));
}

// ---- Section detector ----
const SECTION_PATTERNS: Record<string, RegExp> = {
  summary:     /ringkasan|summary|profile|objective|about\s*me|profil|tujuan/i,
  experience:  /pengalaman|experience|work\s*hist|employment|karir|riwayat\s*kerja/i,
  education:   /pendidikan|education|akademik|riwayat\s*pendidikan/i,
  skills:      /keterampilan|skills?|keahlian|kompetensi/i,
  projects:    /proyek|projects?|portofolio|portfolio/i,
  certifications: /sertif|certif|lisensi|license/i,
  awards:      /award|penghargaan|prestasi|achievement/i,
  interests:   /minat|interest|hobi|hobby/i,
};

function detectSections(text: string): Record<string, string> {
  const allLines = lines(text);
  const sections: Record<string, string> = {};
  let currentSection = "header";
  const sectionContent: Record<string, string[]> = { header: [] };

  for (const line of allLines) {
    let matched = false;
    for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(line) && line.length < 60) {
        currentSection = section;
        if (!sectionContent[section]) sectionContent[section] = [];
        matched = true;
        break;
      }
    }
    if (!matched) {
      if (!sectionContent[currentSection]) sectionContent[currentSection] = [];
      sectionContent[currentSection].push(line);
    }
  }

  for (const [k, v] of Object.entries(sectionContent)) {
    sections[k] = v.join("\n");
  }
  return sections;
}

// ---- Profile extraction ----
function extractProfile(text: string): CandidateProfile {
  const allLines = lines(text);
  const sections = detectSections(text);

  // Name: usually first non-empty line, all-caps or title case, no special chars
  const nameLine = allLines[0] || "";
  const fullName = nameLine.replace(/[^a-zA-Z\s.-]/g, "").trim().slice(0, 80);

  // Email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  const email = emailMatch ? emailMatch[0] : "";

  // Phone
  const phoneMatch = text.match(/(\+?[0-9][\s\-().]{0,3}){7,15}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : "";

  // LinkedIn
  const linkedInMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  const linkedIn = linkedInMatch ? linkedInMatch[0] : "";

  // Location — look for common city/country patterns
  const locationMatch = text.match(
    /(jakarta|surabaya|bandung|yogyakarta|semarang|medan|bali|makassar|indonesia|malaysia|singapore|[a-z]+,\s*[a-z]+)/i
  );
  const location = locationMatch ? locationMatch[0] : "";

  // Summary
  const summaryText = sections.summary || "";
  const summaryLines = lines(summaryText).slice(0, 4);
  const summary = summaryLines.join(" ").slice(0, 400);

  // Education
  const eduText = sections.education || "";
  const eduLines = lines(eduText);
  const education = [];
  for (let i = 0; i < eduLines.length; i++) {
    const l = eduLines[i];
    if (l.length > 5 && !l.match(/^\d{4}/)) {
      const yearMatch = eduLines.slice(i, i + 3).join(" ").match(/\d{4}/g);
      const gpaMatch = eduLines.slice(i, i + 3).join(" ").match(/(?:ipk|gpa|nilai|score)[:\s]*([\d.,]+)/i);
      education.push({
        institution: l.slice(0, 80),
        degree: "",
        field: "",
        graduationYear: yearMatch ? yearMatch[yearMatch.length - 1] : "",
        gpa: gpaMatch ? gpaMatch[1] : "",
      });
      if (education.length >= 3) break;
    }
  }

  // Experience
  const expText = sections.experience || "";
  const expLines = lines(expText);
  const experience = [];
  let currentExp: { company: string; position: string; startDate: string; endDate: string; description: string[] } | null = null;
  for (const l of expLines) {
    const dateMatch = l.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\b.{0,30}(20\d\d|present|sekarang)/i);
    if (dateMatch || (l.length > 5 && l.length < 80 && !l.startsWith("-") && !l.startsWith("•"))) {
      if (currentExp && currentExp.company) {
        experience.push(currentExp);
        if (experience.length >= 4) break;
      }
      currentExp = { company: l.slice(0, 60), position: "", startDate: "", endDate: "", description: [] };
    } else if (currentExp && (l.startsWith("-") || l.startsWith("•") || l.startsWith("*"))) {
      currentExp.description.push(l.replace(/^[-•*]\s*/, "").slice(0, 200));
    }
  }
  if (currentExp && currentExp.company && experience.length < 4) experience.push(currentExp);

  // Technical Skills
  const skillsText = sections.skills || "";
  const rawSkills = skillsText
    .split(/[,|•\n\r\t•·]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 40 && !/^\d+$/.test(s));

  // Also scan entire text for known tech keywords
  const KNOWN_TECH = [
    "javascript","typescript","python","java","kotlin","swift","go","rust","c++","c#","php","ruby","scala",
    "react","vue","angular","nextjs","nuxtjs","svelte","flutter","react native",
    "node.js","express","fastapi","django","spring","laravel","rails",
    "html","css","tailwind","bootstrap","sass",
    "sql","mysql","postgresql","mongodb","redis","sqlite","oracle",
    "docker","kubernetes","git","github","gitlab","ci/cd","jenkins","github actions",
    "aws","gcp","azure","vercel","netlify","heroku",
    "machine learning","deep learning","tensorflow","pytorch","scikit-learn","pandas","numpy","matplotlib",
    "rest api","graphql","microservices","agile","scrum",
    "linux","bash","powershell","vim",
    "figma","adobe xd","ui/ux",
    "cyber security","networking","tcp/ip","wireshark","kali linux","penetration testing",
  ];
  const textLower = normalize(text);
  const detectedTech = KNOWN_TECH.filter((tech) => textLower.includes(tech.toLowerCase()));

  // Combine and deduplicate
  const allSkills = [...new Set([
    ...rawSkills.filter((s) => !s.match(/^(and|or|the|di|dan|atau|dengan|untuk)$/i)),
    ...detectedTech.map((t) => t.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")),
  ])].slice(0, 20);

  // Soft Skills
  const SOFT_SKILLS_PATTERNS = [
    "komunikasi","teamwork","kerja tim","problem solving","critical thinking","adaptasi","adaptability",
    "leadership","manajemen waktu","time management","kreatif","creative","analitis","analytical",
    "detail oriented","fast learner","presentasi","presentation","negosiasi","negotiation",
    "customer service","active listening","decision making","empathy",
  ];
  const softSkills = SOFT_SKILLS_PATTERNS.filter((s) => textLower.includes(s))
    .map((s) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "))
    .slice(0, 8);

  // Projects
  const projText = sections.projects || "";
  const projLines = lines(projText);
  const projects = [];
  let currentProj: { name: string; description: string; technologies: string[] } | null = null;
  for (const l of projLines) {
    if (l.length > 3 && l.length < 80 && !l.startsWith("-") && !l.startsWith("•")) {
      if (currentProj) { projects.push(currentProj); if (projects.length >= 4) break; }
      currentProj = { name: l.slice(0, 60), description: "", technologies: [] };
    } else if (currentProj) {
      if (!currentProj.description) currentProj.description = l.slice(0, 150);
      const techs = detectedTech.filter((t) => normalize(l).includes(t));
      currentProj.technologies.push(...techs);
    }
  }
  if (currentProj && currentProj.name && projects.length < 4) projects.push(currentProj);

  // Certifications
  const certText = sections.certifications || sections.awards || "";
  const certifications = lines(certText)
    .filter((l) => l.length > 3 && !l.match(/^(certif|sertif|award|penghargaan)/i))
    .map((l) => l.replace(/^[-•*]\s*/, "").slice(0, 100))
    .slice(0, 5);

  return {
    fullName,
    email,
    phone,
    location,
    linkedIn,
    summary,
    education,
    experience,
    technicalSkills: allSkills,
    softSkills,
    projects,
    certifications,
    languages: [],
  };
}

// ---- Scoring ----
function scoreCV(text: string, profile: CandidateProfile, sections: Record<string, string>): { overall: number; breakdown: CVScoreBreakdown } {
  // Structure (15%)
  const sectionCount = Object.values(sections).filter((v) => v.length > 10).length;
  const structure = Math.min(100, sectionCount * 15);

  // Summary (15%)
  const summaryScore = profile.summary.length > 100 ? 80
    : profile.summary.length > 50 ? 60
    : profile.summary.length > 10 ? 40 : 20;

  // Skills (20%)
  const skillsScore = Math.min(100, profile.technicalSkills.length * 8 + profile.softSkills.length * 5);

  // Experience (25%)
  const expScore = Math.min(100,
    profile.experience.length * 20 +
    profile.experience.reduce((acc, e) => acc + Math.min(3, e.description.length) * 5, 0)
  );

  // Achievements (10%)
  const achievementKeywords = ["meningkatkan","mengurangi","achieved","improved","led","launched","built","delivered","increased","decreased","%","x lipat"];
  const achieveCount = achievementKeywords.filter((k) => normalize(text).includes(k)).length;
  const achievements = Math.min(100, 20 + achieveCount * 10);

  // Education (10%)
  const educationScore = profile.education.length > 0
    ? (profile.education[0].gpa ? 90 : 70)
    : 30;

  // Keywords (5%)
  const industryKeywords = ["agile","scrum","git","api","database","cloud","deploy","testing","review","sprint"];
  const kwCount = industryKeywords.filter((k) => normalize(text).includes(k)).length;
  const keywords = Math.min(100, 30 + kwCount * 7);

  const breakdown: CVScoreBreakdown = {
    structure: Math.round(structure),
    summary: Math.round(summaryScore),
    skills: Math.round(skillsScore),
    experience: Math.round(expScore),
    achievements: Math.round(achievements),
    education: Math.round(educationScore),
    keywords: Math.round(keywords),
  };

  const overall = Math.round(
    breakdown.structure * 0.15 +
    breakdown.summary * 0.15 +
    breakdown.skills * 0.20 +
    breakdown.experience * 0.25 +
    breakdown.achievements * 0.10 +
    breakdown.education * 0.10 +
    breakdown.keywords * 0.05
  );

  return { overall: Math.max(20, Math.min(95, overall)), breakdown };
}

// ---- Strengths / Weaknesses ----
function analyzeStrengthsWeaknesses(text: string, profile: CandidateProfile, sections: Record<string, string>) {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const missingInfo: string[] = [];

  if (profile.education.length > 0) strengths.push(`Memiliki latar belakang pendidikan formal: ${profile.education[0].institution}`);
  if (profile.technicalSkills.length >= 5) strengths.push(`Memiliki ${profile.technicalSkills.length} keterampilan teknis yang tercantum`);
  if (profile.experience.length >= 2) strengths.push(`Memiliki ${profile.experience.length} pengalaman kerja/magang yang relevan`);
  if (profile.certifications.length > 0) strengths.push(`Memiliki ${profile.certifications.length} sertifikasi yang meningkatkan kredibilitas`);
  if (profile.projects.length > 0) strengths.push(`Memiliki ${profile.projects.length} proyek portofolio yang menunjukkan kemampuan praktis`);
  if (profile.summary.length > 80) strengths.push("CV memiliki ringkasan profesional yang memberikan gambaran kandidat");

  const achievementKeywords = ["%","meningkatkan","decreased","improved","launched","delivered"];
  if (achievementKeywords.some((k) => normalize(text).includes(k))) {
    strengths.push("Beberapa deskripsi pengalaman mencantumkan pencapaian yang terukur");
  }

  if (profile.summary.length < 50) weaknesses.push("Ringkasan profesional terlalu singkat atau tidak ada — tambahkan 2–3 kalimat yang menjelaskan nilai unik kamu");
  if (profile.technicalSkills.length < 4) weaknesses.push("Keterampilan teknis yang tercantum sedikit — perluas dengan teknologi yang kamu kuasai");
  if (profile.experience.length === 0) weaknesses.push("Tidak ada pengalaman kerja/magang yang terdeteksi — tambahkan meskipun berupa kerja part-time atau volunteer");

  const hasMetrics = ["%","x lipat","meningkatkan","mengurangi"].some((k) => normalize(text).includes(k));
  if (!hasMetrics) weaknesses.push("Deskripsi pengalaman tidak mencantumkan pencapaian terukur (angka, persentase, dampak nyata)");

  if (!sections.projects || sections.projects.length < 20) weaknesses.push("Bagian proyek kosong atau sangat sedikit — tambahkan proyek pribadi/akademis untuk memperkuat portofolio");

  if (!profile.email) missingInfo.push("Alamat email tidak terdeteksi");
  if (!profile.phone) missingInfo.push("Nomor telepon tidak terdeteksi");
  if (!profile.linkedIn) missingInfo.push("URL LinkedIn tidak tercantum");
  if (!sections.summary || sections.summary.length < 20) missingInfo.push("Ringkasan profesional tidak ada");
  if (profile.certifications.length === 0) missingInfo.push("Tidak ada sertifikasi yang tercantum (sangat disarankan untuk fresh graduate)");

  return { strengths: strengths.slice(0, 5), weaknesses: weaknesses.slice(0, 5), missingInfo: missingInfo.slice(0, 4) };
}

// ---- Improvements ----
function generateImprovements(text: string, profile: CandidateProfile): CVImprovement[] {
  const improvements: CVImprovement[] = [];

  // Passive language
  const passivePatterns = [
    { pattern: /membantu\s+[\w\s]+/i, label: "penggunaan kata pasif 'membantu'" },
    { pattern: /ikut\s+serta\s+[\w\s]+/i, label: "penggunaan frasa pasif 'ikut serta'" },
    { pattern: /terlibat\s+dalam\s+[\w\s]+/i, label: "penggunaan frasa pasif 'terlibat dalam'" },
  ];

  for (const { pattern, label } of passivePatterns) {
    const match = text.match(pattern);
    if (match && improvements.length < 2) {
      improvements.push({
        original: match[0].trim(),
        problem: `Penggunaan bahasa pasif (${label}) terkesan kurang berpengaruh`,
        recommendation: match[0].replace(/membantu|ikut serta|terlibat dalam/i, "Mengembangkan").trim() + " yang menghasilkan [hasil terukur]",
        reason: "Kata kerja aktif dan hasil yang terukur menunjukkan kontribusi nyata dan membuat CV lebih menonjol",
      });
    }
  }

  // No metrics on experience descriptions
  for (const exp of profile.experience.slice(0, 2)) {
    for (const desc of exp.description.slice(0, 1)) {
      if (!desc.match(/\d+%|\d+\s*(kali|x|users|pengguna|rb|juta)/i) && desc.length > 20 && improvements.length < 3) {
        improvements.push({
          original: desc,
          problem: "Deskripsi tidak mencantumkan hasil atau dampak yang terukur",
          recommendation: `${desc} — menghasilkan peningkatan [X]% dalam [metrik relevan]`,
          reason: "Angka dan metrik konkret membuktikan dampak nyata dan membuat CV lebih meyakinkan bagi recruiter",
        });
      }
    }
  }

  // Summary too generic
  if (profile.summary && profile.summary.length < 100 && improvements.length < 3) {
    improvements.push({
      original: profile.summary || "(ringkasan tidak ada)",
      problem: "Ringkasan profesional terlalu pendek dan tidak menjelaskan nilai unik kandidat secara spesifik",
      recommendation: `${profile.technicalSkills.slice(0, 3).join(", ") || "Software"} developer dengan pengalaman di [domain utama]. Telah [pencapaian konkret]. Mencari kesempatan untuk [tujuan karir spesifik].`,
      reason: "Ringkasan yang kuat harus menjelaskan keahlian, pengalaman, dan tujuan dalam 3-4 kalimat yang spesifik",
    });
  }

  if (improvements.length === 0) {
    improvements.push({
      original: "Contoh bullet point pengalaman tanpa angka",
      problem: "Sebagian besar deskripsi pengalaman tidak memiliki metrik kuantitatif",
      recommendation: "Tambahkan angka ke setiap bullet point: berapa banyak? seberapa cepat? berapa persen peningkatannya?",
      reason: "CV dengan data kuantitatif 40% lebih mungkin mendapat perhatian recruiter",
    });
  }

  return improvements.slice(0, 3);
}

// ============================================================
// Main export: analyzeCVHeuristic
// ============================================================
export function analyzeCVHeuristic(cvText: string): CVAnalysis {
  const sections = detectSections(cvText);
  const profile = extractProfile(cvText);
  const { overall, breakdown } = scoreCV(cvText, profile, sections);
  const { strengths, weaknesses, missingInfo } = analyzeStrengthsWeaknesses(cvText, profile, sections);
  const improvements = generateImprovements(cvText, profile);

  return {
    overallScore: overall,
    scoreBreakdown: breakdown,
    profile,
    strengths,
    weaknesses,
    missingInfo,
    improvements,
  };
}

// ============================================================
// matchJobHeuristic
// ============================================================
export function matchJobHeuristic(cvText: string, jobDescription: string): JobMatchAnalysis {
  const profile = extractProfile(cvText);
  const jdLower = normalize(jobDescription);
  const cvLower = normalize(cvText);

  // Extract skills mentioned in JD
  const KNOWN_SKILLS = [
    "javascript","typescript","python","java","kotlin","go","rust","c++","c#","php","ruby","scala",
    "react","vue","angular","nextjs","flutter","react native",
    "node.js","express","fastapi","django","spring","laravel",
    "html","css","tailwind","bootstrap",
    "sql","mysql","postgresql","mongodb","redis","sqlite",
    "docker","kubernetes","git","github","ci/cd","jenkins",
    "aws","gcp","azure",
    "machine learning","deep learning","tensorflow","pytorch","pandas","numpy",
    "rest api","graphql","microservices","agile","scrum",
    "linux","bash",
    "figma","ui/ux",
    "cyber security","networking","penetration testing",
  ];

  const jdSkills = KNOWN_SKILLS.filter((s) => jdLower.includes(s));
  const cvSkills = KNOWN_SKILLS.filter((s) => cvLower.includes(s));

  const matched = jdSkills.filter((s) => cvLower.includes(s));
  const missing = jdSkills.filter((s) => !cvLower.includes(s));
  const additional = cvSkills.filter((s) => !jdLower.includes(s));

  const skillCoverage = jdSkills.length > 0 ? Math.round((matched.length / jdSkills.length) * 100) : 60;

  // Education match
  const requiresDegree = /s1|sarjana|bachelor|degree|strata/i.test(jobDescription);
  const hasDegree = profile.education.length > 0;
  const educationMatch = requiresDegree ? (hasDegree ? 90 : 40) : 80;

  // Experience match
  const requiresYears = jobDescription.match(/(\d+)\s*(?:tahun|years?)/i);
  const candidateExpCount = profile.experience.length;
  const experienceMatch = requiresYears
    ? Math.min(100, (candidateExpCount / parseInt(requiresYears[1])) * 70)
    : Math.min(100, 40 + candidateExpCount * 20);

  // Keyword alignment
  const jdWords = jdLower.split(/\s+/).filter((w) => w.length > 4);
  const matchedWords = jdWords.filter((w) => cvLower.includes(w));
  const keywordAlignment = jdWords.length > 0 ? Math.round((matchedWords.length / jdWords.length) * 100) : 50;

  const overallMatch = Math.round(
    skillCoverage * 0.40 +
    educationMatch * 0.20 +
    Math.min(100, experienceMatch) * 0.25 +
    Math.min(100, keywordAlignment) * 0.15
  );

  // Fit reasons
  const fitReasons: string[] = [];
  if (hasDegree) fitReasons.push(`Latar belakang pendidikan dari ${profile.education[0]?.institution || "universitas"} sesuai dengan persyaratan`);
  if (matched.length > 0) fitReasons.push(`Menguasai ${matched.slice(0, 3).join(", ")} yang dibutuhkan posisi ini`);
  if (candidateExpCount > 0) fitReasons.push(`Memiliki ${candidateExpCount} pengalaman kerja/magang yang relevan`);
  if (profile.certifications.length > 0) fitReasons.push(`Sertifikasi "${profile.certifications[0]}" menambah nilai pada lamaran`);
  if (additional.length > 0) fitReasons.push(`Memiliki keterampilan tambahan (${additional.slice(0, 2).join(", ")}) yang dapat menjadi nilai plus`);

  // Gaps
  const gaps: string[] = [];
  if (missing.length > 0) gaps.push(`Belum memiliki pengalaman dengan: ${missing.slice(0, 3).join(", ")}`);
  if (candidateExpCount === 0) gaps.push("Belum memiliki pengalaman kerja formal");
  if (!profile.linkedIn) gaps.push("Profil LinkedIn tidak tercantum — recruiter sering memverifikasi di sini");
  if (skillCoverage < 60) gaps.push("Cakupan skill terhadap persyaratan masih di bawah 60%");

  // Improvements
  const improvementsList: string[] = [];
  missing.slice(0, 3).forEach((s) => improvementsList.push(`Pelajari dan praktikkan ${s} untuk menutup gap keterampilan`));
  improvementsList.push("Tonjolkan pengalaman yang paling relevan dengan posisi ini di bagian paling atas CV");
  improvementsList.push("Sesuaikan kata kunci di CV dengan istilah yang digunakan dalam job description ini");

  const skillComparison: SkillComparison = {
    matched: matched.map((s) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")),
    missing: missing.map((s) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")),
    additional: additional.slice(0, 6).map((s) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")),
  };

  return {
    overallMatch: Math.max(10, Math.min(95, overallMatch)),
    skillCoverage: Math.max(10, Math.min(95, skillCoverage)),
    experienceMatch: Math.max(10, Math.min(95, Math.round(experienceMatch))),
    educationMatch: Math.max(10, Math.min(95, educationMatch)),
    keywordAlignment: Math.max(10, Math.min(95, Math.round(keywordAlignment * 1.5))),
    skillComparison,
    fitReasons: fitReasons.slice(0, 5),
    gaps: gaps.slice(0, 4),
    improvements: improvementsList.slice(0, 5),
  };
}

// ============================================================
// careerAdviceHeuristic
// ============================================================
export function careerAdviceHeuristic(cvText: string, interests?: string): CareerAdvice {
  const profile = extractProfile(cvText);
  const cvLower = normalize(cvText);

  // Determine dominant skill domain
  const domainScores: Record<string, number> = {
    frontend: 0, backend: 0, data: 0, mobile: 0, security: 0, devops: 0, ml: 0,
  };

  const domainKeywords: Record<string, string[]> = {
    frontend: ["react","vue","angular","html","css","tailwind","figma","ui/ux","frontend","next.js","svelte"],
    backend: ["node.js","express","fastapi","django","spring","laravel","api","rest","backend","server","database"],
    data: ["pandas","numpy","matplotlib","sql","postgresql","mysql","data","tableau","power bi","excel","analysis"],
    mobile: ["flutter","react native","android","ios","kotlin","swift","mobile"],
    security: ["cyber security","networking","penetration","kali","wireshark","firewall","security","ctf"],
    devops: ["docker","kubernetes","ci/cd","jenkins","aws","gcp","azure","terraform","devops","cloud","linux"],
    ml: ["machine learning","deep learning","tensorflow","pytorch","scikit","ai","neural","nlp","computer vision"],
  };

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    domainScores[domain] = keywords.filter((k) => cvLower.includes(k)).length;
  }

  // Sort domains by score
  const sortedDomains = Object.entries(domainScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .filter(([, score]) => score > 0);

  // Career path templates
  const careerTemplates: Record<string, Omit<CareerPath, "missingSkills">> = {
    frontend: {
      title: "Frontend Developer",
      reasoning: "Keterampilan HTML, CSS, dan JavaScript yang tercantum di CV menunjukkan fondasi kuat untuk karir frontend development.",
      requiredSkills: ["React/Vue/Angular", "TypeScript", "Tailwind CSS", "Testing (Jest)", "Git"],
      growthPotential: "Tinggi — kebutuhan frontend developer terus meningkat seiring pertumbuhan startup digital",
    },
    backend: {
      title: "Backend Developer",
      reasoning: "Pengalaman dengan API, database, dan server-side technologies di CV sesuai dengan jalur backend engineering.",
      requiredSkills: ["Node.js/Python/Java", "PostgreSQL/MongoDB", "Docker", "REST API", "System Design"],
      growthPotential: "Sangat Tinggi — backend engineer adalah posisi paling banyak dicari di industri tech",
    },
    data: {
      title: "Data Analyst / Data Engineer",
      reasoning: "Keterampilan analisis data, SQL, dan tools seperti Excel/Python menunjukkan potensi untuk karir di bidang data.",
      requiredSkills: ["SQL", "Python (Pandas)", "Tableau/Power BI", "Statistics", "Data Visualization"],
      growthPotential: "Sangat Tinggi — data analyst adalah profesi dengan pertumbuhan karir yang paling konsisten",
    },
    mobile: {
      title: "Mobile App Developer",
      reasoning: "Pengalaman dengan teknologi mobile development di CV membuka jalur karir yang sangat dicari.",
      requiredSkills: ["Flutter/React Native", "Dart/JavaScript", "Firebase", "REST API", "App Store Publishing"],
      growthPotential: "Tinggi — mobile developer sangat dibutuhkan terutama untuk fintech dan e-commerce",
    },
    security: {
      title: "Cyber Security Analyst",
      reasoning: "Minat dan keterampilan di bidang keamanan siber yang tercantum sangat sesuai dengan kebutuhan industri.",
      requiredSkills: ["Network Security", "Penetration Testing", "SIEM Tools", "Python Scripting", "CompTIA Security+"],
      growthPotential: "Sangat Tinggi — insiden siber yang meningkat membuat demand untuk security analyst terus naik",
    },
    devops: {
      title: "DevOps / Cloud Engineer",
      reasoning: "Pengalaman dengan Docker, cloud platform, dan tools CI/CD menunjukkan kesiapan untuk jalur DevOps.",
      requiredSkills: ["Docker", "Kubernetes", "CI/CD Pipeline", "Terraform", "AWS/GCP Certified"],
      growthPotential: "Sangat Tinggi — DevOps engineer adalah salah satu posisi dengan salary tertinggi di industri tech",
    },
    ml: {
      title: "Machine Learning Engineer",
      reasoning: "Keterampilan Python, data analysis, dan framework ML yang tercantum membuka jalur karir AI/ML.",
      requiredSkills: ["Python", "TensorFlow/PyTorch", "Statistics", "MLOps", "Cloud AI Services"],
      growthPotential: "Sangat Tinggi — AI engineer adalah profesi paling banyak dicari di era AI saat ini",
    },
  };

  // Default if no domain detected
  const defaultDomains: [string, number][] = [["backend", 1], ["frontend", 1]];
  const activeDomains = sortedDomains.length > 0 ? sortedDomains : defaultDomains;

  const careerPaths: CareerPath[] = activeDomains.slice(0, 3).map(([domain]) => {
    const template = careerTemplates[domain] || careerTemplates.backend;
    const missing = template.requiredSkills.filter(
      (s) => !cvLower.includes(normalize(s.split("/")[0]).slice(0, 6))
    ).slice(0, 3);
    return { ...template, missingSkills: missing };
  });

  if (careerPaths.length < 2) {
    careerPaths.push({
      ...careerTemplates.backend,
      missingSkills: ["System Design", "PostgreSQL", "Docker"],
    });
  }

  // Build roadmap based on gaps
  const topMissing = careerPaths[0]?.missingSkills || [];
  const allMissing = [...new Set(careerPaths.flatMap((p) => p.missingSkills))];

  const shortTerm: LearningItem[] = [
    {
      skill: topMissing[0] || "Memperkuat portofolio GitHub",
      priority: "Tinggi",
      resource: "Official documentation + freeCodeCamp + YouTube",
      project: `Buat proyek sederhana menggunakan ${topMissing[0] || "teknologi utama yang diinginkan"}`,
    },
    {
      skill: "Profil LinkedIn & GitHub yang profesional",
      priority: "Tinggi",
      resource: "LinkedIn Learning — Optimizing Your LinkedIn Profile",
      project: "Update bio, tambahkan README.md ke setiap repository, pin 3 proyek terbaik",
    },
    {
      skill: allMissing[1] || "SQL & Database dasar",
      priority: "Sedang",
      resource: "SQLZoo, Mode Analytics SQL Tutorial",
      project: "Buat aplikasi sederhana dengan operasi CRUD menggunakan database pilihan",
    },
  ];

  const midTerm: LearningItem[] = [
    {
      skill: allMissing[2] || "System Design & Architecture",
      priority: "Tinggi",
      resource: "System Design Primer (GitHub), ByteByteGo newsletter",
      project: "Rancang arsitektur untuk aplikasi yang sudah kamu buat sebelumnya",
    },
    {
      skill: "Kontribusi Open Source",
      priority: "Sedang",
      resource: "First Contributions (GitHub), Good First Issues",
      project: "Kontribusi ke minimal 1 proyek open source yang relevan dengan minat kamu",
    },
    {
      skill: "Certifikasi relevan (cloud atau domain spesifik)",
      priority: "Sedang",
      resource: "AWS/Google Cloud free tier + official study guide",
      project: "Lulus ujian certifikasi entry-level dalam domain yang dipilih",
    },
  ];

  const longTerm: LearningItem[] = [
    {
      skill: "Arsitektur level senior & best practices",
      priority: "Tinggi",
      resource: "Clean Code (Robert Martin), Designing Data-Intensive Applications",
      project: "Rancang dan build proyek full-stack yang production-ready",
    },
    {
      skill: "Technical interview preparation",
      priority: "Tinggi",
      resource: "LeetCode (Easy–Medium), InterviewBit, Pramp",
      project: "Selesaikan 50+ soal algoritma dan lakukan mock interview bersama teman",
    },
    {
      skill: "Soft skills & kepemimpinan teknis",
      priority: "Sedang",
      resource: "The Pragmatic Programmer, meetup komunitas developer lokal",
      project: "Presentasi di meetup lokal atau tulis blog teknis secara rutin",
    },
  ];

  const nextSteps: string[] = [
    `Perbarui CV dengan menambahkan metrik pada setiap bullet pengalaman`,
    `Buat atau perbarui profil GitHub dengan README yang profesional`,
    `Daftar ke platform job (Glints, JobStreet, LinkedIn Jobs) untuk posisi entry-level ${careerPaths[0]?.title || "Software Engineer"}`,
    `Bergabung komunitas developer lokal (Discord, Telegram, atau meetup) untuk networking`,
    `Mulai belajar ${topMissing[0] || "teknologi utama yang dibutuhkan"} dan buat proyek kecil untuk portofolio`,
    `Siapkan 2–3 pertanyaan untuk ditanyakan ke interviewer — tunjukkan minat genuine`,
  ];

  if (interests) {
    nextSteps.unshift(`Berdasarkan minat kamu di "${interests}" — cari komunitas atau course spesifik di bidang tersebut`);
  }

  return {
    careerPaths: careerPaths.slice(0, 3),
    roadmap: { shortTerm, midTerm, longTerm } as LearningRoadmap,
    nextSteps: nextSteps.slice(0, 7),
  };
}

/**
 * default-data.js
 * Data bawaan (fallback / seed data) untuk portofolio Mangara Ferdianto Pakpahan.
 * Diperbarui lengkap berdasarkan 24 halaman Dokumen Resmi & Sertifikasi:
 * - Mahasiswa Teknik Informatika, Institut Teknologi PLN
 * - Microsoft Azure Databricks Machine Learning Certified
 * - Educativa Bootcamp Olah Data Kuantitatif 120 JP (SEM-PLS)
 * - Ngulik Data SQL 101 & Fashion Retail Sales Project Certified
 * - IBM SkillsBuild AI Agents Certified
 * - Samsung Innovation Campus (SIC) Batch 5 Python Certified
 * - Talentiv Academy Data Analyst Fast Track Batch 3
 * - Dicoding Financial Literacy Certified
 * - Juara 1 Poster Nasional IPB & Penerima Hibah PKM DIKTI
 */

export const DEFAULT_DATA = {
  profile: {
    name: "Mangara Ferdianto Pakpahan",
    title: "Mahasiswa Teknik Informatika | Media Kreatif & Manajemen Data",
    email: "mangarapakpahan51@gmail.com",
    phone: "0813-1881-6058",
    birthday: "2005-02-13",
    location: "Jakarta, Indonesia",
    avatarUrl: "./assets/images/my-avatar.png",
    bio: "Seorang mahasiswa Teknik Informatika di Institut Teknologi PLN dengan antusiasme tinggi terhadap pembelajaran berkelanjutan dan eksplorasi teknologi modern. Memiliki fokus keahlian ganda yang seimbang di bidang media kreatif dan rekayasa manajemen data.\n\nMemiliki rekam jejak sertifikasi resmi dari Microsoft Azure Databricks, Educativa (Olah Data Kuantitatif SEM-PLS), IBM SkillsBuild (AI Agents), Samsung Innovation Campus (Python), dan Progate (SQL). Berpengalaman memimpin tim kreatif institusional, mengelola strategi komunikasi publik, serta merancang arsitektur data analitik terstruktur untuk mendukung pengambilan keputusan strategis.",
    social_facebook: "https://facebook.com",
    social_twitter: "https://twitter.com",
    social_instagram: "https://instagram.com/mangarapakpahan_",
    social_linkedin: "https://linkedin.com/in/mangara-ferdianto-pakpahan",
    social_github: "https://github.com/mangarapakpahan-cmd"
  },

  services: [
    {
      title: "Data Management & Analytics (SQL, Python & Excel)",
      description: "Query relational database (SQL 101 Ngulik Data & Progate), manipulasi dataset terstruktur dengan Python (SIC Batch 5), dan pemodelan spreadsheet tingkat lanjut (Microsoft Office Specialist Excel 2019 Certified).",
      iconUrl: "./assets/images/icon-dev.svg",
      order: 1
    },
    {
      title: "Machine Learning & Cloud Intelligence (Azure Databricks)",
      description: "Penerapan machine learning in production, Apache Spark di Azure Databricks, MLflow lifecycle management, AutoML, dan eksplorasi model deep learning.",
      iconUrl: "./assets/images/icon-app.svg",
      order: 2
    },
    {
      title: "Olah Data Kuantitatif & Riset Statistik (SEM-PLS)",
      description: "Analisis deskriptif, korelasi, regresi berganda, analisis faktor, path analysis (mediasi & moderasi), serta pemodelan Structural Equation Modeling (SEM-PLS) 120 JP Educativa.",
      iconUrl: "./assets/images/icon-photo.svg",
      order: 3
    },
    {
      title: "Creative Media & Visual Identity Design",
      description: "Perancangan identitas visual acara berskala besar (Wisuda ITPLN ke-46), arahan kreatif desain/foto/video, dan materi branding promosi (Juara 1 Poster Nasional IPB).",
      iconUrl: "./assets/images/icon-design.svg",
      order: 4
    },
    {
      title: "Digital Outreach & Public Relations",
      description: "Manajemen kemitraan media publikasi, strategi rekrutmen mahasiswa baru (Student Ambassador ITPLN & DQLab), serta pengelolaan citra positif institusi.",
      iconUrl: "./assets/images/icon-app.svg",
      order: 5
    },
    {
      title: "Project Management & Event Support",
      description: "Perencanaan acara end-to-end (Family Gathering PT Adhi Guna Putera), koordinasi lintas divisi, serta dukungan teknis & operasional seminar nasional/internasional.",
      iconUrl: "./assets/images/icon-dev.svg",
      order: 6
    }
  ],

  testimonials: [
    {
      name: "Pimpinan Divisi ITPLN Media",
      date: "2025-01-10",
      avatarUrl: "./assets/images/avatar-1.png",
      text: "Sebagai Deputy Manager & Direktur Kreatif, Mangara selalu menunjukkan kepemimpinan yang tangguh dan kepekaan visual yang tajam. Hasil konten tim media menjadi jauh lebih konsisten, profesional, dan memperkuat identitas merek institusi."
    },
    {
      name: "Koordinator Program DQLab & Komunitas Data",
      date: "2024-12-05",
      avatarUrl: "./assets/images/avatar-2.png",
      text: "Peran Mangara sebagai Student Ambassador sangat berdampak positif. Ia aktif menjembatani mahasiswa dengan materi pembelajaran data science dan menghubungkan mereka dengan para praktisi industri data."
    },
    {
      name: "Tim Humas & Stakeholder ITPLN",
      date: "2024-11-20",
      avatarUrl: "./assets/images/avatar-3.png",
      text: "Kerja sama dengan Mangara di bidang humas dan publikasi sangat memuaskan. Komunikasi strategis dan konten digital yang dirancangnya memperkuat reputasi positif institusi di berbagai saluran resmi."
    },
    {
      name: "Ketua Panitia Pelaksana Seminar Nasional",
      date: "2024-10-15",
      avatarUrl: "./assets/images/avatar-4.png",
      text: "Dukungan operasional dan teknis yang diberikan Mangara selama acara seminar berskala nasional dan internasional (JACOST, Mine Excellent) berjalan sangat mulus. Sangat solutif dan dapat diandalkan."
    }
  ],

  skills: [
    { name: "Microsoft Excel (MOS Certified & Financial Analytics)", percentage: 96, order: 1 },
    { name: "Creative Media & Visual Identity Design (Photoshop, Canva)", percentage: 93, order: 2 },
    { name: "SQL & Relational Database (Ngulik Data & Progate Certified)", percentage: 90, order: 3 },
    { name: "Digital Outreach, PR & Community Engagement (Ambassador ITPLN & DQLab)", percentage: 90, order: 4 },
    { name: "Machine Learning & Azure Databricks (Apache Spark, MLflow, AutoML)", percentage: 88, order: 5 },
    { name: "Olah Data Kuantitatif & SEM-PLS / Statistik Riset (Educativa 120 JP)", percentage: 88, order: 6 },
    { name: "Python Programming & Algorithms (Samsung Innovation Campus & Skilvul)", percentage: 86, order: 7 },
    { name: "AI Agents & Cloud Intelligence (IBM SkillsBuild Certified)", percentage: 85, order: 8 }
  ],

  education: [
    {
      institution: "Institut Teknologi PLN (ITPLN)",
      period: "2023 — Sekarang",
      description: "Program Sarjana (S1) Teknik Informatika. Mempelajari sistem komputasi, rekayasa perangkat lunak, manajemen data, kecerdasan buatan, dan transformasi teknologi energi.",
      order: 1
    },
    {
      institution: "Microsoft Learn — Azure Databricks & Machine Learning Engineering",
      period: "2025",
      description: "Spesialisasi resmi 8 modul dalam pengelolaan Machine Learning in Production, Apache Spark, MLflow, AutoML, Hyperparameter Tuning, dan Deep Learning di Azure Databricks.",
      order: 2
    },
    {
      institution: "PT Educativa Cipta Nawasena — Bootcamp Olah Data Kuantitatif Batch #5",
      period: "2026",
      description: "Pelatihan komprehensif 120 Jam Pembelajaran (JP) mencakup konsep statistik deskriptif, regresi, analisis faktor, path analysis (mediasi & moderasi), dan pemodelan SEM-PLS berbasis AI.",
      order: 3
    },
    {
      institution: "Samsung Innovation Campus (SIC) Batch 5 & Skilvul",
      period: "2023 — 2024",
      description: "Penerima beasiswa Stage 1 Coding & Programming (Python Dasar, Python Lanjutan, serta Algoritma & Struktur Data).",
      order: 4
    },
    {
      institution: "Talentiv Academy & Ngulik Data Specialization",
      period: "2024 — 2026",
      description: "Kelulusan program intensif Data Analyst Fast Track Batch 3 (16 jam), sertifikasi SQL 101, serta penyelesaian proyek riil Analisis Penjualan Toko Fashion dengan SQL.",
      order: 5
    },
    {
      institution: "SMA Negeri 1 Tebing Tinggi",
      period: "2020 — 2023",
      description: "Jurusan Matematika dan Ilmu Pengetahuan Alam (MIPA). Landasan logika komputasi, sains analitis, dan kepemimpinan organisasi kepemudaan.",
      order: 6
    }
  ],

  experience: [
    {
      position: "Student Ambassador",
      company: "Institut Teknologi PLN (ITPLN)",
      period: "2024 — Sekarang",
      description: "Perwakilan utama institusi dalam berbagai expo dan acara rekrutmen; menyusun strategi penjangkauan digital yang meningkatkan keterlibatan calon mahasiswa dan orang tua.",
      order: 1
    },
    {
      position: "Student Ambassador",
      company: "DQLab",
      period: "2024 — Sekarang",
      description: "Mendorong pertumbuhan komunitas data science kampus, memfasilitasi sesi pembelajaran ilmu data, serta menjembatani mahasiswa dengan para praktisi data industri.",
      order: 2
    },
    {
      position: "Deputy Manager & Direktur Kreatif",
      company: "ITPLN Media",
      period: "2024 — Sekarang",
      description: "Mengambil keputusan strategis operasional redaksi media; memimpin tim desain grafis, fotografi, dan videografi untuk memproduksi konten berkualitas tinggi yang memperkuat merek ITPLN.",
      order: 3
    },
    {
      position: "Student Worker - Humas & Hubungan Stakeholder",
      company: "Institut Teknologi PLN (ITPLN)",
      period: "Sep 2024 — Nov 2024",
      description: "Mengembangkan materi komunikasi publik dan konten digital promosi yang mempererat hubungan baik institusi dengan para pemangku kepentingan strategis.",
      order: 4
    },
    {
      position: "Hubungan Masyarakat (Humas)",
      company: "Musketer ITPLN",
      period: "2024 — Sekarang",
      description: "Mengelola kemitraan media massa, merancang siaran pers publikasi, dan memperluas jangkauan eksposur positif Institut Teknologi PLN.",
      order: 5
    },
    {
      position: "Ketua, Badan Pengurus Harian Pemuda",
      company: "HKBP Maranatha Tebing Tinggi",
      period: "2022 — 2023",
      description: "Memimpin organisasi kepemudaan dalam merancang dan mengeksekusi program pemberdayaan sosial bagi komunitas masyarakat.",
      order: 6
    }
  ],

  projects: [
    {
      title: "Analisis Penjualan Toko Fashion dengan SQL",
      category: "Data Analytics",
      imageUrl: "./assets/images/project-1.jpg",
      projectUrl: "https://ngulikdata.com/certificates/RnwoqbSzwEn9",
      description: "Proyek analitika data ritel fashion komprehensif menggunakan SQL untuk mengekstraksi metrik penjualan, segmentasi pelanggan, evaluasi performa produk, dan visualisasi pendapatan bisnis (Ngulik Data Certified).",
      order: 1
    },
    {
      title: "Implementasi Machine Learning & MLflow di Azure Databricks",
      category: "Machine Learning",
      imageUrl: "./assets/images/project-2.png",
      projectUrl: "https://learn.microsoft.com/en-us/users/mangaraferdiantopakpahan-8408/achievements",
      description: "Arsitektur pipeline machine learning end-to-end berbasis cloud menggunakan Azure Databricks, Apache Spark, AutoML, hyperparameter tuning, dan pelacakan eksperimen model dengan MLflow (Microsoft Certified).",
      order: 2
    },
    {
      title: "Olah Data Kuantitatif & Riset SEM-PLS Ilmiah (120 JP)",
      category: "Data Analytics",
      imageUrl: "./assets/images/project-3.jpg",
      projectUrl: "https://educativa.id",
      description: "Pemodelan data statistik terapan mencakup analisis jalur (path analysis mediasi-moderasi), analisis faktor, regresi berganda, dan Structural Equation Modeling (SEM-PLS) menggunakan bantuan tools AI riset (Educativa Certified).",
      order: 3
    },
    {
      title: "Desain Visual Identitas Wisuda ITPLN ke-46",
      category: "Creative Media",
      imageUrl: "./assets/images/project-4.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Merancang dan mengimplementasikan seluruh identitas visual acara wisuda ke-46 ITPLN, berhasil menciptakan suasana yang khidmat, megah, dan profesional untuk salah satu agenda institusi terpenting.",
      order: 4
    },
    {
      title: "Manajemen Proyek Family Gathering PT Adhi Guna Putera",
      category: "Event & Management",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Memimpin perencanaan dan eksekusi acara dari awal hingga akhir, mengkoordinasikan logistik dan alur acara untuk memastikan kegiatan berjalan sukses serta mempererat hubungan antar karyawan dan keluarga.",
      order: 5
    },
    {
      title: "Dukungan Teknis & Operasional Seminar Nasional & Internasional",
      category: "Event & Management",
      imageUrl: "./assets/images/project-6.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Dukungan teknis krusial yang memastikan kelancaran dan keberhasilan berbagai seminar bergengsi (Mine Excellent Indonesia, JACOST, dan AMI Advance Metering Infrastructure) di hadapan peserta nasional dan internasional.",
      order: 6
    },
    {
      title: "Juara 1 Karya Desain Poster Ocean Experience IPB University",
      category: "Creative Media",
      imageUrl: "./assets/images/project-7.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Karya desain poster pemenang Juara 1 dalam ajang kompetisi nasional Ocean Experience IPB University 2025 dengan fokus visualisasi estetis konservasi ekosistem maritim.",
      order: 7
    },
    {
      title: "Algoritma & Struktur Data Berbasis Python (Samsung Innovation Campus)",
      category: "Data & Technology",
      imageUrl: "./assets/images/project-8.jpg",
      projectUrl: "https://skilvul.com/courses/algorithm-and-data-structures-with-python",
      description: "Implementasi algoritma pemecahan masalah komputasi, struktur data efisien, dan pemrograman Python lanjutan dalam program beasiswa Samsung Innovation Campus Batch 5.",
      order: 8
    },
    {
      title: "Implementasi Program Kreativitas Mahasiswa (PKM) - Kemendikbud",
      category: "Data & Technology",
      imageUrl: "./assets/images/project-9.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Proyek inovasi teknologi yang berhasil meraih pendanaan resmi DIKTI Level 1 tahun 2024, mengintegrasikan metodologi riset komputasi dan manajemen data.",
      order: 9
    }
  ],

  blog: [
    {
      title: "Sertifikasi Microsoft: Azure Databricks, Apache Spark, MLflow & Machine Learning Production",
      category: "Cloud & AI",
      date: "2025-11-09",
      excerpt: "Menyelesaikan 8 modul spesialisasi resmi dari Microsoft dalam membangun dan mengelola machine learning model di lingkungan produksi cloud menggunakan Azure Databricks, AutoML, dan MLflow.",
      imageUrl: "./assets/images/blog-1.jpg",
      url: "https://learn.microsoft.com/en-us/users/mangaraferdiantopakpahan-8408/achievements"
    },
    {
      title: "Bootcamp Olah Data Kuantitatif 120 JP: Analisis SEM-PLS, Regresi & Path Analysis (Educativa)",
      category: "Data Analytics",
      date: "2026-08-13",
      excerpt: "Kelulusan sertifikasi 120 JP dari PT Educativa Cipta Nawasena mencakup penguasaan statistik riset, analisis jalur (mediasi & moderasi), analisis faktor, dan Structural Equation Modeling (SEM-PLS).",
      imageUrl: "./assets/images/blog-2.jpg",
      url: "https://educativa.id"
    },
    {
      title: "Sertifikasi Proyek: Analisis Penjualan Toko Fashion dengan SQL & SQL 101 (Ngulik Data)",
      category: "Database & SQL",
      date: "2026-03-21",
      excerpt: "Berhasil menyelesaikan studi kasus analisis bisnis ritel fashion menggunakan query SQL tingkat lanjut, agregasi metrik, dan segmentasi transaksi penjualan di platform Ngulik Data.",
      imageUrl: "./assets/images/blog-3.jpg",
      url: "https://ngulikdata.com/certificates/RnwoqbSzwEn9"
    },
    {
      title: "IBM SkillsBuild: Unleashing the Power of AI Agents",
      category: "Artificial Intelligence",
      date: "2026-08-26",
      excerpt: "Sertifikasi internasional dari IBM SkillsBuild mengenai arsitektur sistem otonom cerdas, implementasi AI Agents, dan otomasi cerdas berbasis kecerdasan buatan.",
      imageUrl: "./assets/images/blog-4.jpg",
      url: "https://skillsbuild.org"
    },
    {
      title: "Samsung Innovation Campus Batch 5: Python Master Series (Skilvul)",
      category: "Pemrograman Python",
      date: "2024-09-17",
      excerpt: "Penyelesaian program beasiswa Samsung Innovation Campus (SIC) Batch 5 Stage 1 dengan nilai Senior Grade, mencakup Python Dasar, Python Lanjutan, serta Algoritma & Struktur Data.",
      imageUrl: "./assets/images/blog-5.jpg",
      url: "https://skilvul.com"
    },
    {
      title: "Juara 1 Lomba Desain Poster Nasional Ocean Experience IPB University",
      category: "Prestasi & Desain",
      date: "2025-01-20",
      excerpt: "Meraih predikat Juara 1 dalam kompetisi desain poster nasional yang diselenggarakan oleh IPB University melalui karya visual edukatif pelestarian ekosistem bahari.",
      imageUrl: "./assets/images/blog-6.jpg",
      url: "https://github.com/mangarapakpahan-cmd"
    }
  ]
};

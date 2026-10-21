/**
 * default-data.js
 * Data bawaan (fallback / seed data) untuk portofolio Mangara Ferdianto Pakpahan.
 * Digunakan sebagai:
 * 1. Fallback instan jika Firestore masih kosong / offline / belum di-seed
 * 2. Sumber data 1-klik "Seed Demo Data" di Admin Dashboard CMS
 */

export const DEFAULT_DATA = {
  profile: {
    name: "Mangara Ferdianto Pakpahan",
    title: "Data Analyst & Social Media Specialist",
    email: "mangarapakpahan51@gmail.com",
    phone: "081318816058",
    birthday: "2005-02-13",
    location: "Jakarta, Indonesia",
    avatarUrl: "./assets/images/my-avatar.png",
    bio: "Saya adalah seorang Data Analyst dan Social Media Specialist yang berdedikasi dalam mengubah kumpulan data kompleks menjadi wawasan strategis yang berdampak nyata bagi pertumbuhan bisnis dan organisasi.\n\nMemiliki keahlian teknis kuat dalam pengolahan data menggunakan Python, SQL, Microsoft Power BI, serta Advanced Excel. Di sisi lain, saya memiliki pemahaman mendalam tentang strategi konten digital, analisis audiens media sosial, dan tren keterlibatan (engagement) publik.\n\nFokus saya adalah menjembatani bukti kuantitatif (data-driven insights) dengan eksekusi kreatif untuk membantu pengambilan keputusan yang terukur, efisien, dan berorientasi pada hasil jangka panjang.",
    social_facebook: "https://facebook.com",
    social_twitter: "https://twitter.com",
    social_instagram: "https://instagram.com/mangarapakpahan_",
    social_linkedin: "https://linkedin.com/in/mangara-ferdianto-pakpahan",
    social_github: "https://github.com/mangarapakpahan-cmd"
  },

  services: [
    {
      title: "Data Analysis & Business Intelligence",
      description: "Analisis data end-to-end mulai dari data cleaning, eksplorasi pola statistik, hingga perancangan dashboard interaktif menggunakan Power BI & Excel.",
      iconUrl: "./assets/images/icon-dev.svg",
      order: 1
    },
    {
      title: "Python Data Processing & Automation",
      description: "Otomasi pemrosesan data, manipulasi dataset besar dengan Pandas & NumPy, serta visualisasi data berbasis Python.",
      iconUrl: "./assets/images/icon-app.svg",
      order: 2
    },
    {
      title: "Social Media Strategy & Analytics",
      description: "Perencanaan strategi konten berbasis riset tren, manajemen kampanye digital, dan evaluasi matriks performa audiens media sosial.",
      iconUrl: "./assets/images/icon-design.svg",
      order: 3
    },
    {
      title: "Database Management & SQL",
      description: "Query relational database, desain skema, ekstraksi data bisnis kompleks, dan optimasi pengelolaan basis data (PostgreSQL/MySQL).",
      iconUrl: "./assets/images/icon-photo.svg",
      order: 4
    }
  ],

  testimonials: [
    {
      name: "Dosen Pembimbing Akademik",
      date: "2024-09-15",
      avatarUrl: "./assets/images/avatar-1.png",
      text: "Mangara menunjukkan dedikasi yang luar biasa dalam analisis data dan metodologi kuantitatif. Mampu mengintegrasikan teori pemodelan statistik dengan visualisasi dashboard yang mudah dipahami oleh stakeholder bisnis."
    },
    {
      name: "Rekan Kolaborasi Proyek",
      date: "2024-08-20",
      avatarUrl: "./assets/images/avatar-2.png",
      text: "Kolaborasi yang sangat menyenangkan! Kemampuan Mangara dalam memadukan keahlian analitik data dengan strategi media sosial memberikan dampak nyata terhadap kenaikan engagement dan keterbacaan data proyek kami."
    },
    {
      name: "Tim Inovasi & Riset",
      date: "2024-07-10",
      avatarUrl: "./assets/images/avatar-3.png",
      text: "Karya dashboard analytics yang dibuat sangat rapi, akurat, dan intuitif. Setiap KPI divisualisasikan dengan tepat sehingga memudahkan pengambilan keputusan strategis."
    },
    {
      name: "Partner Eksternal",
      date: "2024-06-05",
      avatarUrl: "./assets/images/avatar-4.png",
      text: "Sangat komunikatif, profesional, dan selalu tepat waktu dalam penyelesaian tugas analisis data. Memiliki pemahaman teknis dan kreatif yang seimbang."
    }
  ],

  skills: [
    { name: "Python (Pandas, NumPy, Matplotlib)", percentage: 90, order: 1 },
    { name: "SQL & Relational Databases (PostgreSQL/MySQL)", percentage: 88, order: 2 },
    { name: "Microsoft Power BI & Data Visualization", percentage: 86, order: 3 },
    { name: "Advanced Excel (Pivot, Modeling, Analytical Functions)", percentage: 92, order: 4 },
    { name: "Social Media Analytics & Content Strategy", percentage: 88, order: 5 },
    { name: "Cloud Computing & Microsoft Azure Fundamentals", percentage: 80, order: 6 },
    { name: "Statistical Data Analysis & Quantitative Modeling", percentage: 84, order: 7 }
  ],

  education: [
    {
      institution: "Institut Teknologi PLN (ITPLN)",
      period: "2023 — Sekarang",
      description: "Program Sarjana (S1). Mendalami sistem komputasi, analitika data, transformasi digital, serta riset transisi energi dan keberlanjutan (SDGs).",
      order: 1
    },
    {
      institution: "Samsung Innovation Campus (SIC) Batch 5",
      period: "2023 — 2024",
      description: "Pelatihan intensif pengembangan solusi berbasis Python, IoT, algoritma struktur data, dan rekayasa kecerdasan buatan.",
      order: 2
    },
    {
      institution: "Microsoft Learn & IBM SkillsBuild Specialization",
      period: "2023 — 2024",
      description: "Sertifikasi profesional dalam Cloud Computing (Azure), Data Science Fundamentals, dan Database Architecture.",
      order: 3
    }
  ],

  experience: [
    {
      position: "Data Analyst & Business Intelligence Developer",
      company: "Proyek Independen & Riset Analitika",
      period: "2024 — Sekarang",
      description: "Membangun dashboard analitik interaktif (Kimia Farma Sales Performance, Regional Service Quality Gap), menganalisis tren performa bisnis, dan menyusun laporan berbasis data.",
      order: 1
    },
    {
      position: "Social Media Specialist & Creative Strategist",
      company: "Digital Growth & Media Kampus",
      period: "2023 — Sekarang",
      description: "Mengelola strategi konten multi-platform, memonitor performa engagement audiens, melakukan A/B testing materi kreatif, dan meningkatkan visibilitas merek secara konsisten.",
      order: 2
    },
    {
      position: "Student Researcher & IT Analyst Trainee",
      company: "Laboratorium Komputasi & Studi Kuanti",
      period: "2023 — 2024",
      description: "Terlibat dalam pengujian dataset, eksperimen pemrosesan data dengan Python, serta riset implementasi teknologi informasi untuk inisiatif transisi energi.",
      order: 3
    }
  ],

  projects: [
    {
      title: "Kimia Farma Sales & Profit Analytics Dashboard",
      category: "data analytics",
      imageUrl: "./assets/images/project-1.jpg",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      order: 1
    },
    {
      title: "Regional Service Quality Gap Analysis",
      category: "data analytics",
      imageUrl: "./assets/images/project-2.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      order: 2
    },
    {
      title: "ITPLN Media & News Performance Analytics",
      category: "social media",
      imageUrl: "./assets/images/project-3.jpg",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      order: 3
    },
    {
      title: "Fashion Retail Sales Database & SQL Queries",
      category: "database",
      imageUrl: "./assets/images/project-4.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      order: 4
    },
    {
      title: "SDGs Sustainability Metrics Dashboard",
      category: "data analytics",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      order: 5
    },
    {
      title: "Python Automated ETL & Data Cleaning Pipeline",
      category: "python",
      imageUrl: "./assets/images/project-6.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      order: 6
    }
  ],

  blog: [
    {
      title: "Memaksimalkan Power BI untuk Dashboard Bisnis yang Efektif",
      category: "Data Analytics",
      date: "2025-01-15",
      excerpt: "Panduan praktis merancang visualisasi data yang tidak hanya indah secara visual, tetapi juga memberikan wawasan aksi nyata (actionable insights) bagi pemangku kepentingan.",
      imageUrl: "./assets/images/blog-1.jpg",
      url: "#"
    },
    {
      title: "Analisis Data Audiens untuk Strategi Media Sosial yang Berkelanjutan",
      category: "Social Media",
      date: "2024-12-10",
      excerpt: "Bagaimana memanfaatkan data analitik keterlibatan untuk menyusun konten yang tepat sasaran dan meningkatkan jangkauan organik secara terukur.",
      imageUrl: "./assets/images/blog-2.jpg",
      url: "#"
    },
    {
      title: "Dasar Query SQL Penting yang Wajib Dikuasai oleh Setiap Data Analyst",
      category: "SQL",
      date: "2024-11-05",
      excerpt: "Eksplorasi penggunaan GROUP BY, HAVING, Window Functions, dan subqueries untuk mengekstrak informasi berharga dari jutaan baris data bisnis.",
      imageUrl: "./assets/images/blog-3.jpg",
      url: "#"
    }
  ]
};

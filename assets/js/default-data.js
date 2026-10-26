/**
 * default-data.js
 * Data bawaan (fallback / seed data) resmi untuk portofolio Mangara Ferdianto Pakpahan.
 * Diperbarui lengkap mencakup:
 * - Identitas & Peran: Creative Director, Live Production Specialist, Cinematographer, Visual Designer
 * - Pengalaman Terkonfirmasi: SMM PJCI (Indonesia Smart Grid Association), Humas ITPLN, Video Company Profile ITPLN Media,
 *   Ketua Pelaksana NCC 2025, Student Ambassador BPA ITPLN & DQLab, Panitia LKMM Pra-TD, BPH Pemuda HKBP.
 * - Prestasi & Inovasi: Juara 1 IoT LPG-SafeSense (MKI & ITPLN), Juara 1 Poster Nasional IPB University,
 *   REPUTA-AI (BNC 2026), BisaKerja (BMC Impact 2026), Pendanaan PKM DIKTI Level 1.
 * - Sertifikasi Profesional: Azure Databricks Machine Learning (8 Modul), Educativa SEM-PLS 120 JP,
 *   IBM AI Agents, Ngulik Data SQL 101, Skilvul SIC Batch 5 Python, Excel Korporasi 2026, MOS Excel 2019, SQL Progate.
 */

export const DEFAULT_DATA = {
  profile: {
    name: "Mangara Ferdianto Pakpahan",
    title: "Creative Director | Live Production Specialist | Cinematographer | Visual Designer",
    email: "mangarapakpahan51@gmail.com",
    phone: "0813-1881-6058",
    birthday: "2005-02-13",
    location: "Jakarta, Indonesia",
    avatarUrl: "./assets/images/my-avatar.png",
    bio: "Seorang Creative Director, Live Production Specialist, Cinematographer (Videographer), Video Editor, Visual Designer, dan Creative Copywriter dengan rekam jejak terbukti dalam memimpin produksi siaran langsung berskala besar, merancang identitas visual institusional, serta mengelola komunikasi digital publik lintas sektor.\n\nBerpengalaman mengelola media sosial resmi skala besar (PJCI Indonesia Smart Grid Association, @itpln, @vokasiitpln, dan @itplnmedia) dengan pertumbuhan engagement hingga 3 kali lipat. Berperan aktif sebagai Student Ambassador BPA ITPLN dan DQLab, memimpin kompetisi nasional NCC 2025, meraih Juara 1 Inovasi IoT LPG-SafeSense (MKI & ITPLN), Juara 1 Poster Nasional IPB University, serta penerima pendanaan PKM DIKTI Level 1. Memiliki kompetensi data kuat dengan sertifikasi resmi Azure Databricks Machine Learning, Educativa (SEM-PLS 120 JP), IBM AI Agents, dan MOS Excel 2019.",
    social_facebook: "https://facebook.com",
    social_twitter: "https://twitter.com",
    social_instagram: "https://instagram.com/mangarapakpahan_",
    social_linkedin: "https://linkedin.com/in/mangara-ferdianto-pakpahan",
    social_github: "https://github.com/mangarapakpahan-cmd"
  },

  services: [
    {
      title: "Live Production Specialist & Event Broadcasting",
      description: "Produksi siaran langsung multi-kamera untuk acara institusi berskala nasional (Wisuda ITPLN ke-46, GINEST Studium Generale Nuklir, Tanda Tangan Kontrak PLN, Launching APERTI BUMN).",
      iconUrl: "./assets/images/icon-photo.svg",
      order: 1
    },
    {
      title: "Creative Direction & Visual Design",
      description: "Perancangan identitas visual acara, desain grafis promosi, materi branding digital, sertifikat resmi Dies Natalis ITPLN, infografis PIMNAS 37, Hari Listrik Nasional, dan buletin ITPLN Sepekan.",
      iconUrl: "./assets/images/icon-design.svg",
      order: 2
    },
    {
      title: "Social Media Management & Digital Outreach",
      description: "Pengelolaan media sosial strategis (PJCI Smart Grid Indonesia, @itpln, @vokasiitpln, @itplnmedia), meningkatkan engagement hingga 3x lipat, kampanye PMB, dan pemeliharaan reputasi digital institusi.",
      iconUrl: "./assets/images/icon-app.svg",
      order: 3
    },
    {
      title: "Cinematography & Video Editing",
      description: "Pengambilan gambar video profesional (Cinematography), video editing dinamis, penugasan Video Company Profile ITPLN Media, liputan dokumentasi acara penting, aftermovie, dan konten storytelling digital.",
      iconUrl: "./assets/images/icon-photo.svg",
      order: 4
    },
    {
      title: "Inovasi IoT, AI & Platform Development",
      description: "Riset dan rekayasa teknologi mutakhir: Inovasi IoT LPG-SafeSense (Juara 1 MKI), Micro-SaaS REPUTA-AI (BNC 2026), platform BisaKerja inklusi disabilitas, dan pendanaan PKM DIKTI Level 1.",
      iconUrl: "./assets/images/icon-dev.svg",
      order: 5
    },
    {
      title: "Data Analytics & Quantitative Research",
      description: "Analisis data bisnis tingkat lanjut (Microsoft Azure Databricks Machine Learning, SEM-PLS 120 JP Educativa, SQL 101 Ngulik Data, Progate, dan Microsoft Office Specialist Excel 2019).",
      iconUrl: "./assets/images/icon-dev.svg",
      order: 6
    }
  ],

  testimonials: [
    {
      name: "Pimpinan Humas & Stakeholder ITPLN",
      date: "2025-01-15",
      avatarUrl: "./assets/images/avatar-1.png",
      text: "Mangara sangat profesional dalam mengelola komunikasi publik dan kampanye digital institusi. Konten yang dibuat berhasil memperkuat reputasi ITPLN di media sosial dan membangun hubungan positif dengan para stakeholder."
    },
    {
      name: "Tim Marketing & Admisi ITPLN",
      date: "2024-11-20",
      avatarUrl: "./assets/images/avatar-2.png",
      text: "Selama masa PMB, kerja sama dengan Mangara sebagai Social Media Manager berhasil meningkatkan engagement hingga 3 kali lipat. Materi promosi dan storytelling yang dirancangnya sangat memikat calon mahasiswa."
    },
    {
      name: "Panitia Pelaksana Wisuda & Seminar Nasional",
      date: "2024-10-10",
      avatarUrl: "./assets/images/avatar-3.png",
      text: "Kemampuan Mangara sebagai Live Production Specialist sangat luar biasa. Siaran langsung Wisuda ke-46 dan GINEST Studium Generale Nuklir berjalan tanpa hambatan dengan visual yang sangat megah."
    },
    {
      name: "Tim Redaksi ITPLN Media",
      date: "2024-09-05",
      avatarUrl: "./assets/images/avatar-4.png",
      text: "Sebagai Deputy Manager & Direktur Kreatif, Mangara selalu memberikan arahan visual yang tajam dan konsisten. Konten desain, fotografi, dan video tim kami selalu tampil prima dan berstandar tinggi."
    }
  ],

  skills: [
    { name: "Live Production & Event Broadcasting (OBS, vMix, Multi-cam)", percentage: 96, order: 1 },
    { name: "Visual Design & Creative Branding (Photoshop, Canva, Illustrator)", percentage: 95, order: 2 },
    { name: "Social Media Strategy & Content Management (PJCI, @itpln, @vokasiitpln)", percentage: 95, order: 3 },
    { name: "Cinematography & Video Editing (Premiere Pro, CapCut)", percentage: 92, order: 4 },
    { name: "Creative Copywriting & Corporate Storytelling", percentage: 91, order: 5 },
    { name: "Microsoft Excel (MOS Certified & Corporate Financial Modeling)", percentage: 95, order: 6 },
    { name: "SQL Database Query & Data Modeling (Progate & Ngulik Data)", percentage: 90, order: 7 },
    { name: "Olah Data Kuantitatif & SEM-PLS (Educativa 120 JP Certified)", percentage: 90, order: 8 },
    { name: "Cloud Machine Learning & Spark (Azure Databricks Certified)", percentage: 88, order: 9 },
    { name: "IoT & Hardware Prototyping (LPG-SafeSense & PKM DIKTI)", percentage: 92, order: 10 }
  ],

  education: [
    {
      institution: "Institut Teknologi PLN (ITPLN)",
      period: "2023 — Sekarang",
      description: "Program Sarjana (S1) Teknik Informatika. Menggabungkan komputasi modern, rekayasa media kreatif, manajemen data, dan transformasi teknologi energi.",
      order: 1
    },
    {
      institution: "Microsoft Azure Databricks Cloud Machine Learning Specialization",
      period: "2025",
      description: "Menyelesaikan 8 modul spesialisasi resmi Microsoft dalam orkestrasi machine learning in production, Apache Spark, AutoML, dan MLflow di cloud.",
      order: 2
    },
    {
      institution: "Educativa Bootcamp Olah Data Kuantitatif 120 JP",
      period: "2026",
      description: "Kelulusan sertifikasi 120 JP dari PT Educativa Cipta Nawasena untuk statistik inferensial, Structural Equation Modeling (SEM-PLS), regresi berganda, dan path analysis.",
      order: 3
    },
    {
      institution: "Program Kreativitas Mahasiswa (PKM) DIKTI Level 1",
      period: "2024",
      description: "Penerima Hibah Pendanaan Kemendikbudristek untuk proyek inovasi energi terbarukan terintegrasi sistem Internet of Things (IoT).",
      order: 4
    },
    {
      institution: "Samsung Innovation Campus (SIC) Batch 5 — Python & Data Structures",
      period: "2024",
      description: "Program beasiswa pelatihan algoritma, struktur data efisien, dan pemrograman Python tingkat mahir dengan predikat Senior Grade dari Skilvul.",
      order: 5
    },
    {
      institution: "Microsoft Office Specialist (MOS) Excel 2019 & Database Query Specialization",
      period: "2024",
      description: "Sertifikasi resmi MOS Excel 2019 internasional dan sertifikasi SQL database relasional Progate untuk analisis data terstruktur.",
      order: 6
    },
    {
      institution: "SMA Negeri 1 Tebing Tinggi",
      period: "2020 — 2023",
      description: "Pendidikan Menengah Atas jurusan Matematika dan Ilmu Pengetahuan Alam (MIPA). Landasan logika analitis dan kepemimpinan organisasi.",
      order: 7
    }
  ],

  experience: [
    {
      position: "Social Media Manager (Magang)",
      company: "Perkumpulan Jaringan Cerdas Indonesia (PJCI / Indonesia Smart Grid Association)",
      period: "Apr 2026 — Jul 2026",
      description: "Berdasarkan Perjanjian Kerja Magang No. 026/PJCI-Magang/SMM/2026. Mengelola strategi komunikasi media sosial resmi, kampanye publikasi transisi energi dan smart grid, serta merancang konten edukatif ketenagalistrikan berkelanjutan.",
      order: 1
    },
    {
      position: "Social Media & Website Humas ITPLN",
      company: "Institut Teknologi PLN (ITPLN)",
      period: "Okt 2025 — Sekarang",
      description: "Membuat konten komunikasi publik dan kampanye digital institusi. Berperan aktif dalam menjaga reputasi ITPLN melalui media sosial resmi dan hubungan stakeholder.",
      order: 2
    },
    {
      position: "Koordinator Divisi Creative & Concept — Video Company Profile ITPLN Media",
      company: "ITPLN Media",
      period: "Apr 2025 — 2026",
      description: "Penugasan resmi SK No. 001/SK/ITPLN MEDIA/APRIL/2025. Memimpin perumusan konsep visual, storyline, dan arahan kreatif sinematografi dalam produksi video profil institusional ITPLN Media.",
      order: 3
    },
    {
      position: "Ketua Pelaksana — National Creative Competition (NCC) 2025",
      company: "ITPLN Media",
      period: "2025",
      description: "Memimpin perencanaan dan pelaksanaan kompetisi kreatif mahasiswa berskala nasional dengan tema 'Data Science Untuk Kebutuhan Energi Bersih Nuklir' yang diselenggarakan oleh ITPLN Media.",
      order: 4
    },
    {
      position: "Student Ambassador BPA ITPLN",
      company: "Biro Penerimaan Mahasiswa Baru ITPLN",
      period: "2024 — Sekarang",
      description: "Mewakili kampus di berbagai event edukasi dan menyusun strategi promosi digital. Konten storytelling yang dibuat berhasil menarik banyak calon mahasiswa baru.",
      order: 5
    },
    {
      position: "Student Ambassador DQLab",
      company: "DQLab Data Science Community",
      period: "2024 — Sekarang",
      description: "Menjembatani mahasiswa dengan materi pembelajaran data science, membangun komunitas pembelajar aktif, dan menghubungkan talenta kampus dengan jejaring praktisi industri data.",
      order: 6
    },
    {
      position: "Deputy Manager & Direktur Kreatif",
      company: "ITPLN Media",
      period: "2024 — Sekarang",
      description: "Sebagai Deputi Manajer dan Direktur Kreatif, memimpin tim desain, fotografi, dan video untuk menghasilkan konten berkualitas tinggi serta memperkuat identitas merek ITPLN Media.",
      order: 7
    },
    {
      position: "Panitia Pelaksana — LKMM Pra-Tingkat Dasar (Pra-TD) ITPLN",
      company: "Institut Teknologi PLN",
      period: "Feb 2025",
      description: "Bertanggung jawab dalam manajemen operasional dan kepanitiaan pelatihan kaderisasi kepemimpinan mahasiswa tingkat dasar lintas fakultas (FKET, FTEN, FTIK, FTBE, SV).",
      order: 8
    },
    {
      position: "Social Media Manager Humas ITPLN",
      company: "Biro Humas & Komunikasi Publik ITPLN",
      period: "Sep 2024 — Nov 2024",
      description: "Membuat konten komunikasi publik dan kampanye digital institusi. Berperan dalam menjaga reputasi ITPLN melalui media sosial dan hubungan stakeholder.",
      order: 9
    },
    {
      position: "Social Media Manager Marketing ITPLN",
      company: "Biro Marketing & PMB ITPLN",
      period: "Jul 2024 — Sep 2024",
      description: "Mengelola konten media sosial dan website selama masa PMB. Berhasil meningkatkan engagement hingga 3 kali lipat dan mendesain materi promosi digital.",
      order: 10
    },
    {
      position: "Hubungan Masyarakat (Humas)",
      company: "Musketer ITPLN",
      period: "2024 — Sekarang",
      description: "Membangun dan memelihara hubungan profesional dengan mitra media untuk memperluas jangkauan publisitas serta mengelola citra publik Institut Teknologi PLN.",
      order: 11
    },
    {
      position: "Ketua Badan Pengurus Harian (BPH) Pemuda",
      company: "HKBP Maranatha Tebing Tinggi",
      period: "2022 — 2023",
      description: "Memimpin organisasi kepemudaan dan sukses menyelenggarakan program penjangkauan sosial kemasyarakatan serta kegiatan penguatan karakter generasi muda.",
      order: 12
    }
  ],

  projects: [
    {
      title: "Wisuda ITPLN ke-46: Innovating with Excellence for a Sustainable Future",
      category: "Live Production",
      imageUrl: "./assets/images/project-1.jpg",
      projectUrl: "https://youtube.com",
      description: "Produksi siaran langsung multi-kamera (Live Broadcast 3.5 jam) dan perancangan identitas visual acara wisuda ke-46 ITPLN yang khidmat, megah, dan disaksikan ribuan penonton.",
      order: 1
    },
    {
      title: "GINEST Studium Generale: Nuklir Sebagai Solusi Transisi Energi",
      category: "Live Production",
      imageUrl: "./assets/images/project-2.png",
      projectUrl: "https://youtube.com",
      description: "Live streaming production berdurasi hampir 3 jam untuk seminar nasional energi nuklir dengan narasumber pakar industri energi terkemuka.",
      order: 2
    },
    {
      title: "Tanda Tangan Kontrak Program Rekrutmen Ikatan Kerja PLN",
      category: "Live Production",
      imageUrl: "./assets/images/project-3.jpg",
      projectUrl: "https://youtube.com",
      description: "Broadcasting dan technical operational support untuk acara seremonial penandatanganan kontrak kerja mahasiswa berprestasi dengan PT PLN (Persero).",
      order: 3
    },
    {
      title: "Launching Beasiswa APERTI BUMN & Kerjasama Ikatan Kerja APITU",
      category: "Live Production",
      imageUrl: "./assets/images/project-4.png",
      projectUrl: "https://youtube.com",
      description: "Produksi siaran langsung peluncuran Beasiswa APERTI BUMN 2024 serta peluncuran program ikatan kerja Teknik Mesin APITU dan ITPLN.",
      order: 4
    },
    {
      title: "Dukungan Teknis & Live Production Seminar Nasional & Internasional",
      category: "Live Production",
      imageUrl: "./assets/images/project-6.png",
      projectUrl: "https://youtube.com",
      description: "Dukungan teknis dan live production operasional krusial untuk kelancaran berbagai seminar bergengsi (Mine Excellent Indonesia, JACOST, dan AMI Advance Metering Infrastructure) di hadapan peserta nasional dan internasional.",
      order: 5
    },
    {
      title: "Juara 1 Inovasi IoT LPG-SafeSense (MKI & ITPLN Sprint Program)",
      category: "Inovasi IoT",
      imageUrl: "./assets/images/project-1.jpg",
      projectUrl: "https://itpln.ac.id",
      description: "Perangkat pintar pemantau keamanan gas LPG berbasis IoT dengan sensor MQ-6 dan loadcell terintegrasi aplikasi smartphone untuk deteksi dini kebocoran dan monitor berat tabung secara real-time. Meraih Juara 1 ajang inkubasi inovasi ITPLN bersama Masyarakat Ketenagalistrikan Indonesia (MKI).",
      order: 6
    },
    {
      title: "Inovasi IoT Energi Terbarukan — Pendanaan PKM 2024 (DIKTI Level 1)",
      category: "Inovasi IoT",
      imageUrl: "./assets/images/project-8.jpg",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Riset dan implementasi prototipe teknologi energi terbarukan berbasis Internet of Things (IoT) yang berhasil meraih pendanaan resmi DIKTI Kemendikbud 2024.",
      order: 7
    },
    {
      title: "REPUTA-AI: Micro-SaaS Agregator Ulasan Berbasis Localized Generative AI",
      category: "AI & Platform",
      imageUrl: "./assets/images/project-2.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Platform Micro-SaaS agregator ulasan multiplatform bertenaga Localized Generative AI guna mengakselerasi reputasi digital, otomatisasi respon ulasan cerdas, dan retensi pelanggan UMKM Indonesia (Business National Competition / BNC 2026).",
      order: 8
    },
    {
      title: "BisaKerja: Platform Job Matching & Ekosistem Inklusi Disabilitas",
      category: "Social Impact",
      imageUrl: "./assets/images/project-3.jpg",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Ekosistem penempatan kerja inklusif berbasis Ability Matching untuk menghubungkan penyandang disabilitas dengan dunia kerja ramah inklusi (BMC Innovation for Impact 2026). Tagline: Mencocokkan Kemampuan, Bukan Keterbatasan.",
      order: 9
    },
    {
      title: "Juara 1 Desain Poster Nasional Ocean Experience IPB University 2025",
      category: "Visual Design",
      imageUrl: "./assets/images/project-7.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Karya desain grafis pemenang Juara 1 dalam ajang kompetisi nasional Ocean Experience IPB University 2025 dengan fokus visualisasi estetis konservasi ekosistem maritim dan edukasi pelestarian bahari.",
      order: 10
    },
    {
      title: "Koleksi Visual Design: Lolos PIMNAS 37 & Hari Listrik Nasional",
      category: "Visual Design",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Perancangan materi visual grafis institusi: poster apresiasi Mahasiswa Lolos PIMNAS 37, ucapan Hari Listrik Nasional, dan branding promosi digital.",
      order: 11
    },
    {
      title: "Desain Informasi Kampus: Jendela Negeri, ITPLN Sepekan & Food Festival",
      category: "Visual Design",
      imageUrl: "./assets/images/project-6.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Desain feed dan publikasi berkala: buletin ITPLN Sepekan, rubrik Jendela Negeri, Perpustakaan ITPLN, dan Bisnis Energi Food Festival 2024.",
      order: 12
    },
    {
      title: "Perancangan Visual Sertifikat Resmi Turnamen Dies Natalis ITPLN 2026",
      category: "Visual Design",
      imageUrl: "./assets/images/project-4.png",
      projectUrl: "https://itpln.ac.id",
      description: "Perancangan grafis identitas visual dan sertifikat kejuaraan resmi turnamen olahraga Dies Natalis ITPLN untuk cabang Badminton (Ganda Putra & Putri) dan Turnamen Futsal.",
      order: 13
    },
    {
      title: "Pengelolaan Media Sosial Resmi PJCI (@smartgridindonesia), @itpln & @vokasiitpln",
      category: "Sosmed Manager",
      imageUrl: "./assets/images/project-7.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Sosmed Manager untuk kanal strategis: menyusun editorial plan, storytelling transisi energi di PJCI, konten edukasi PMB ITPLN, konten 'Green Jobs', hingga perayaan hari besar nasional.",
      order: 14
    },
    {
      title: "Manajer Proyek — Family Gathering PT Adhi Guna Putera",
      category: "Event & Management",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Memimpin perencanaan dan eksekusi acara dari awal hingga akhir, mengkoordinasikan alur logistik, serta memastikan kelancaran kegiatan kebersamaan karyawan dan keluarga.",
      order: 15
    },
    {
      title: "Artikel Perusahaan: PLN Gali Peran Krusial Teknologi Geospasial",
      category: "Article Company",
      imageUrl: "./assets/images/project-8.jpg",
      projectUrl: "https://itpln.ac.id",
      description: "Penulisan artikel resmi institusi mengenai Geography Seminar Series: peran teknologi geospasial dalam akselerasi masa depan transisi energi.",
      order: 16
    },
    {
      title: "Artikel Perusahaan: Lulusan SMA Taruna Nusantara Berebut Masuk ITPLN",
      category: "Article Company",
      imageUrl: "./assets/images/project-9.png",
      projectUrl: "https://itpln.ac.id",
      description: "Penulisan artikel rilis pers institusional mengenai antusiasme siswa berprestasi SMA Taruna Nusantara dalam menempuh pendidikan calon pemimpin energi di ITPLN.",
      order: 17
    }
  ],

  blog: [
    {
      title: "Juara 1 Inovasi IoT LPG-SafeSense: Kolaborasi ITPLN & Masyarakat Ketenagalistrikan Indonesia (MKI)",
      category: "Prestasi & IoT",
      date: "2025-02-28",
      excerpt: "Meraih Juara 1 ajang Technology Incubation Sprint Program melalui inovasi perangkat pintar pendeteksi dini kebocoran gas LPG dan pemantau ketersediaan gas berbasis sensor MQ-6 dan loadcell terintegrasi IoT.",
      imageUrl: "./assets/images/blog-1.jpg",
      url: "https://itpln.ac.id"
    },
    {
      title: "Juara 1 Lomba Desain Poster Nasional Ocean Experience IPB University (2025)",
      category: "Prestasi & Desain",
      date: "2025-01-20",
      excerpt: "Meraih predikat Juara 1 dalam kompetisi desain poster nasional yang diselenggarakan oleh IPB University melalui karya visual edukatif pelestarian ekosistem bahari dan keanekaragaman laut.",
      imageUrl: "./assets/images/blog-2.jpg",
      url: "https://github.com/mangarapakpahan-cmd"
    },
    {
      title: "Pendanaan PKM 2024 (DIKTI Level 1) — Inovasi Energi Terbarukan Berbasis IoT",
      category: "Prestasi & Inovasi",
      date: "2024-11-20",
      excerpt: "Lolos pendanaan resmi Program Kreativitas Mahasiswa (PKM) 2024 dari Kemendikbudristek/DIKTI dengan inovasi teknologi energi terbarukan terintegrasi sistem Internet of Things (IoT).",
      imageUrl: "./assets/images/blog-3.jpg",
      url: "https://github.com/mangarapakpahan-cmd"
    },
    {
      title: "Sertifikasi Microsoft: Azure Databricks, Apache Spark, MLflow & Machine Learning Production",
      category: "Cloud & AI",
      date: "2025-11-09",
      excerpt: "Menyelesaikan 8 modul spesialisasi resmi dari Microsoft dalam membangun dan mengelola machine learning model di lingkungan produksi cloud menggunakan Azure Databricks, AutoML, dan MLflow.",
      imageUrl: "./assets/images/blog-4.jpg",
      url: "https://learn.microsoft.com/en-us/users/mangaraferdiantopakpahan-8408/achievements"
    },
    {
      title: "Bootcamp Olah Data Kuantitatif 120 JP: Analisis SEM-PLS, Regresi & Path Analysis (Educativa)",
      category: "Data Analytics",
      date: "2026-08-13",
      excerpt: "Kelulusan sertifikasi 120 JP dari PT Educativa Cipta Nawasena mencakup penguasaan statistik riset, analisis jalur (mediasi & moderasi), analisis faktor, dan Structural Equation Modeling (SEM-PLS).",
      imageUrl: "./assets/images/blog-5.jpg",
      url: "https://educativa.id"
    },
    {
      title: "IBM SkillsBuild: Unleashing the Power of AI Agents",
      category: "Artificial Intelligence",
      date: "2026-08-26",
      excerpt: "Sertifikasi internasional dari IBM SkillsBuild mengenai arsitektur sistem otonom cerdas, implementasi AI Agents, dan otomasi cerdas berbasis kecerdasan buatan.",
      imageUrl: "./assets/images/blog-6.jpg",
      url: "https://skillsbuild.org"
    },
    {
      title: "Sertifikasi Proyek: Analisis Penjualan Toko Fashion dengan SQL & SQL 101 (Ngulik Data)",
      category: "Database & SQL",
      date: "2026-03-21",
      excerpt: "Berhasil menyelesaikan studi kasus analisis bisnis ritel fashion menggunakan query SQL tingkat lanjut, agregasi metrik, dan segmentasi transaksi penjualan di platform Ngulik Data.",
      imageUrl: "./assets/images/blog-1.jpg",
      url: "https://ngulikdata.com/certificates/RnwoqbSzwEn9"
    },
    {
      title: "Samsung Innovation Campus Batch 5: Python Master Series (Skilvul)",
      category: "Pemrograman Python",
      date: "2024-09-17",
      excerpt: "Penyelesaian program beasiswa Samsung Innovation Campus (SIC) Batch 5 Stage 1 dengan nilai Senior Grade, mencakup Python Dasar, Python Lanjutan, serta Algoritma & Struktur Data.",
      imageUrl: "./assets/images/blog-2.jpg",
      url: "https://skilvul.com"
    },
    {
      title: "Sertifikasi Praktik Excel untuk Korporasi (Tingkat Mahir 2026)",
      category: "Sertifikasi Profesional",
      date: "2026-08-21",
      excerpt: "Tersertifikasi resmi dalam penguasaan formula korporat, conditional formatting tingkat lanjut, validasi data kompleks, dan perancangan dashboard laporan bisnis.",
      imageUrl: "./assets/images/blog-3.jpg",
      url: "#"
    },
    {
      title: "Coding Camp DBS Foundation & Dicoding: Introduction to Financial Literacy",
      category: "Pengembangan Diri",
      date: "2026-07-15",
      excerpt: "Menyelesaikan program pelatihan literasi keuangan dan pengelolaan finansial profesional dari DBS Foundation bekerja sama dengan Dicoding Indonesia.",
      imageUrl: "./assets/images/blog-4.jpg",
      url: "https://dicoding.com"
    },
    {
      title: "Sertifikasi Microsoft Office Specialist: Excel 2019 (Analisis Data Lanjutan)",
      category: "Sertifikasi Profesional",
      date: "2024-10-15",
      excerpt: "Tersertifikasi resmi secara internasional oleh Microsoft dalam penguasaan spreadsheet Excel tingkat lanjut untuk pemodelan dan analisis data bisnis.",
      imageUrl: "./assets/images/blog-5.jpg",
      url: "https://learn.microsoft.com"
    },
    {
      title: "Sertifikat SQL Database Management — Progate (2024)",
      category: "Database & SQL",
      date: "2024-09-20",
      excerpt: "Menyelesaikan kurikulum pelatihan database SQL dan mampu mengelola serta memanipulasi dataset kompleks menggunakan query relasional.",
      imageUrl: "./assets/images/blog-6.jpg",
      url: "https://progate.com"
    },
    {
      title: "PLN Gali Peran Krusial Teknologi Geospasial untuk Masa Depan Energi",
      category: "Article Company",
      date: "2025-01-15",
      excerpt: "Artikel institusional liputan Geography Seminar Series mengenai integrasi data spasial dan kecerdasan analitik untuk keandalan jaringan energi nasional.",
      imageUrl: "./assets/images/blog-1.jpg",
      url: "https://itpln.ac.id"
    },
    {
      title: "Lulusan SMA Taruna Nusantara Berebut Masuk ITPLN, Rektor: Calon Pemimpin Energi",
      category: "Article Company",
      date: "2024-12-10",
      excerpt: "Liputan jurnalisme korporat mengenai kunjungan dan seleksi penerimaan bibit unggul calon mahasiswa dari sekolah berprestasi nasional ke ITPLN.",
      imageUrl: "./assets/images/blog-2.jpg",
      url: "https://itpln.ac.id"
    }
  ]
};

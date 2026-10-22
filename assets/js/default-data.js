/**
 * default-data.js
 * Data bawaan (fallback / seed data) untuk portofolio Mangara Ferdianto Pakpahan.
 * Diperbarui berdasarkan CV Resmi:
 * - Mahasiswa Teknik Informatika, Institut Teknologi PLN
 * - Minat: Media Kreatif & Manajemen Data
 * - Kontak: 0813-1881-6058 | mangarapakpahan51@gmail.com
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
    bio: "Seorang mahasiswa Teknik Informatika dengan antusiasme tinggi terhadap pembelajaran berkelanjutan dan pengembangan diri. Memiliki minat yang kuat di bidang media kreatif dan manajemen data.\n\nTerampil dalam berbagai bahasa pemrograman dan teknologi terkait, serta selalu terbuka untuk memperdalam pengetahuan dan keahlian. Siap untuk terlibat dalam tantangan dan pengalaman belajar yang bermakna untuk mencapai potensi penuh dalam karir di bidang teknologi.",
    social_facebook: "https://facebook.com",
    social_twitter: "https://twitter.com",
    social_instagram: "https://instagram.com/mangarapakpahan_",
    social_linkedin: "https://linkedin.com/in/mangara-ferdianto-pakpahan",
    social_github: "https://github.com/mangarapakpahan-cmd"
  },

  services: [
    {
      title: "Creative Media & Visual Identity Design",
      description: "Perancangan identitas visual acara, materi branding, arahan kreatif tim desain, dan produksi konten visual berkualitas tinggi (Wisuda ITPLN ke-46, Juara 1 Poster IPB University).",
      iconUrl: "./assets/images/icon-design.svg",
      order: 1
    },
    {
      title: "Data Management & Analytics",
      description: "Pengolahan dataset terstruktur, query basis data relasional dengan SQL, otomasi Python, dan analisis spreadsheet tingkat lanjut (Microsoft Office Specialist Excel 2019 Certified).",
      iconUrl: "./assets/images/icon-dev.svg",
      order: 2
    },
    {
      title: "Digital Outreach & Public Relations",
      description: "Perencanaan strategi komunikasi publik, manajemen kemitraan media, kampanye penjangkauan digital rekrutmen, dan keterlibatan komunitas audiens (Student Ambassador ITPLN & DQLab).",
      iconUrl: "./assets/images/icon-app.svg",
      order: 3
    },
    {
      title: "Project Management & Event Support",
      description: "Manajemen alur acara end-to-end, koordinasi tim lintas fungsi, serta dukungan teknis & operasional seminar berskala nasional dan internasional.",
      iconUrl: "./assets/images/icon-photo.svg",
      order: 4
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
    { name: "Microsoft Excel (MOS Certified & Advanced Analytics)", percentage: 95, order: 1 },
    { name: "Creative Media & Visual Identity Design (Photoshop, Canva)", percentage: 92, order: 2 },
    { name: "Digital Outreach, PR & Community Engagement", percentage: 90, order: 3 },
    { name: "SQL & Relational Database Management (Progate Certified)", percentage: 88, order: 4 },
    { name: "Project & Event Management (End-to-End Planning)", percentage: 88, order: 5 },
    { name: "Python Programming (Samsung Innovation Campus Certified)", percentage: 85, order: 6 },
    { name: "Photography & Videography Documentation", percentage: 85, order: 7 }
  ],

  education: [
    {
      institution: "Institut Teknologi PLN (ITPLN)",
      period: "2023 — Sekarang",
      description: "Program Sarjana (S1) Teknik Informatika. Mendalami sistem komputasi, algoritma pemrograman, analisis data, arsitektur sistem, serta integrasi teknologi untuk media kreatif dan digitalisasi industri.",
      order: 1
    },
    {
      institution: "SMA Negeri 1 Tebing Tinggi",
      period: "2020 — 2023",
      description: "Pendidikan Menengah Atas jurusan Matematika dan Ilmu Pengetahuan Alam (MIPA). Membangun landasan analitis kuantitatif, kepemimpinan organisasi siswa, dan pemecahan masalah secara logis.",
      order: 2
    },
    {
      institution: "Program Beasiswa & Pelatihan Teknologi Intensif",
      period: "2023 — 2024",
      description: "Penerima Beasiswa Samsung Innovation Campus (SIC) Batch 5 bidang Python, Sertifikasi Kursus SQL Progate, serta sertifikasi internasional Microsoft Office Specialist (Excel 2019).",
      order: 3
    }
  ],

  experience: [
    {
      position: "Student Ambassador",
      company: "Institut Teknologi PLN (ITPLN)",
      period: "2024 — Sekarang",
      description: "Bertindak sebagai perwakilan utama institusi dalam berbagai acara rekrutmen, berhasil meningkatkan kesadaran dan minat calon mahasiswa melalui presentasi yang informatif. Mengembangkan dan menerapkan strategi penjangkauan digital yang efektif untuk meningkatkan interaksi dengan calon mahasiswa dan orang tua.",
      order: 1
    },
    {
      position: "Student Ambassador",
      company: "DQLab",
      period: "2024 — Sekarang",
      description: "Berhasil meningkatkan partisipasi mahasiswa dalam program pembelajaran ilmu data dengan membangun komunitas yang aktif dan suportif. Menjadi penghubung antara mahasiswa dengan para profesional di industri data, membuka peluang jejaring dan kolaborasi.",
      order: 2
    },
    {
      position: "Deputy Manager & Direktur Kreatif",
      company: "ITPLN Media",
      period: "2024 — Sekarang",
      description: "Sebagai Deputi Manajer, terlibat dalam pengambilan keputusan strategis dan operasional. Sebagai Direktur Kreatif, memimpin tim desain, fotografi, dan video untuk menghasilkan konten berkualitas tinggi yang konsisten dan memperkuat identitas merek ITPLN Media.",
      order: 3
    },
    {
      position: "Student Worker - Humas & Hubungan Stakeholder",
      company: "Institut Teknologi PLN (ITPLN)",
      period: "Sep 2024 — Nov 2024",
      description: "Memperkuat citra positif institusi dengan mengembangkan konten digital dan mengelola komunikasi strategis dengan para pemangku kepentingan.",
      order: 4
    },
    {
      position: "Hubungan Masyarakat (Humas)",
      company: "Musketer ITPLN",
      period: "2024 — Sekarang",
      description: "Membangun dan memelihara hubungan profesional dengan mitra media untuk memperluas jangkauan publisitas dan mengelola citra publik Institut Teknologi PLN.",
      order: 5
    },
    {
      position: "Ketua, Badan Pengurus Harian Pemuda",
      company: "HKBP Maranatha Tebing Tinggi",
      period: "2022 — 2023",
      description: "Memimpin organisasi kepemudaan dan berhasil menyelenggarakan program-program penjangkauan yang memberikan kontribusi positif bagi masyarakat sekitar.",
      order: 6
    }
  ],

  projects: [
    {
      title: "Desain Visual Identitas Wisuda ITPLN ke-46",
      category: "Creative Media",
      imageUrl: "./assets/images/project-1.jpg",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Merancang dan mengimplementasikan seluruh identitas visual acara, berhasil menciptakan suasana yang khidmat dan profesional untuk salah satu acara terpenting institusi.",
      order: 1
    },
    {
      title: "Manajemen Proyek Family Gathering PT Adhi Guna Putera",
      category: "Event & Management",
      imageUrl: "./assets/images/project-2.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Memimpin perencanaan dan eksekusi acara dari awal hingga akhir, memastikan acara berjalan sukses dan berhasil mempererat hubungan antar karyawan dan keluarga.",
      order: 2
    },
    {
      title: "Dukungan Teknis & Operasional Seminar Nasional & Internasional",
      category: "Event & Management",
      imageUrl: "./assets/images/project-3.jpg",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Memberikan dukungan teknis krusial yang memastikan kelancaran dan keberhasilan berbagai seminar (Mine Excellent Indonesia, JACOST, AMI Advance Metering Infrastructure), menjaga citra profesional penyelenggara di hadapan peserta nasional dan internasional.",
      order: 3
    },
    {
      title: "Tim Dokumentasi Visual & Publikasi Seminar/Workshop ITPLN",
      category: "Creative Media",
      imageUrl: "./assets/images/project-4.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Bertanggung jawab atas dokumentasi visual (foto & video) dan publikasi untuk berbagai acara penting, termasuk Seminar Nuklir Nasional dan Workshop Pengembangan Karir, memastikan setiap acara terekam dan terpublikasi dengan baik.",
      order: 4
    },
    {
      title: "Juara 1 Karya Desain Poster Ocean Experience IPB University",
      category: "Creative Media",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Karya desain poster pemenang Juara 1 dalam ajang kompetisi nasional Ocean Experience IPB University 2025 dengan fokus visualisasi estetis konservasi ekosistem maritim.",
      order: 5
    },
    {
      title: "Implementasi Program Kreativitas Mahasiswa (PKM) - Kemendikbud",
      category: "Data & Technology",
      imageUrl: "./assets/images/project-6.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Proyek inovasi teknologi yang berhasil meraih pendanaan resmi DIKTI Level 1 tahun 2024, mengintegrasikan metodologi riset komputasi dan manajemen data.",
      order: 6
    }
  ],

  blog: [
    {
      title: "Juara 1 Lomba Desain Poster Nasional Ocean Experience IPB University",
      category: "Prestasi & Desain",
      date: "2025-01-20",
      excerpt: "Meraih predikat Juara 1 dalam kompetisi desain poster nasional yang diselenggarakan oleh IPB University melalui karya visual edukatif pelestarian ekosistem bahari.",
      imageUrl: "./assets/images/blog-1.jpg",
      url: "#"
    },
    {
      title: "Penerima Pendanaan DIKTI Level 1 Program Kreativitas Mahasiswa (PKM)",
      category: "Riset & Inovasi",
      date: "2024-11-15",
      excerpt: "Lolos seleksi ketat dan mendapatkan pendanaan resmi dari Kemendikbudristek/DIKTI untuk merealisasikan proposal Program Kreativitas Mahasiswa berbasis sains dan teknologi komputasi.",
      imageUrl: "./assets/images/blog-2.jpg",
      url: "#"
    },
    {
      title: "Sertifikasi Resmi: Microsoft Office Specialist (Excel), SQL Progate, dan SIC Python",
      category: "Sertifikasi Profesional",
      date: "2024-10-10",
      excerpt: "Pencapaian sertifikasi kompetensi industri: Microsoft Office Specialist (Excel 2019), kursus database SQL Progate, dan kelulusan program beasiswa Samsung Innovation Campus (SIC) Batch 5 bidang Python.",
      imageUrl: "./assets/images/blog-3.jpg",
      url: "#"
    }
  ]
};

/**
 * default-data.js
 * Data bawaan (fallback / seed data) untuk portofolio Mangara Ferdianto Pakpahan.
 * Diperbarui lengkap berdasarkan Infografis Portofolio Resmi Terbaru:
 * - Creative Director, Live Production Specialist, Cinematographer (Videographer),
 *   Video Editor, Visual Designer, Creative Copywriter
 * - Pengalaman: Social Media & Website Humas ITPLN, Student Ambassador BPA ITPLN,
 *   Social Media Manager Marketing & Humas ITPLN, Deputy Manager ITPLN Media
 * - Pencapaian: Pendanaan PKM 2024 (DIKTI Level 1), MOS Excel 2019, SQL Progate, Basic English Skills
 * - Showcase: Visual Design, Artical Company, Live Production Specialist, Sosmed Manager (@itpln, @vokasiitpln, @itplnmedia)
 * - Kontak: 0813 1881 6058 | mangarapakpahan51@gmail.com | @mangarapakpahan_
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
    bio: "Seorang Creative Director, Live Production Specialist, Cinematographer (Videographer), Video Editor, Visual Designer, dan Creative Copywriter dengan rekam jejak terbukti dalam memimpin produksi siaran langsung berskala besar, merancang identitas visual institusional, serta mengelola komunikasi digital publik.\n\nBerpengalaman mengelola media sosial resmi institusi seperti @itpln, @vokasiitpln, dan @itplnmedia dengan kenaikan engagement hingga 3 kali lipat. Berperan aktif sebagai Student Ambassador BPA ITPLN dan DQLab, serta memiliki keahlian teknis dalam analisis data (MOS Excel 2019, SQL Progate) dan inovasi teknologi (Penerima Pendanaan PKM DIKTI Level 1 IoT Energi Terbarukan).",
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
      description: "Perancangan identitas visual acara, desain grafis promosi, materi branding digital, infografis PIMNAS 37, Hari Listrik Nasional, Jendela Negeri, dan buletin ITPLN Sepekan.",
      iconUrl: "./assets/images/icon-design.svg",
      order: 2
    },
    {
      title: "Social Media Management & Digital Marketing",
      description: "Pengelolaan akun media sosial skala besar (@itpln, @vokasiitpln, @itplnmedia), meningkatkan engagement hingga 3x lipat, kampanye PMB, dan pemeliharaan reputasi digital institusi.",
      iconUrl: "./assets/images/icon-app.svg",
      order: 3
    },
    {
      title: "Cinematography & Video Editing",
      description: "Pengambilan gambar video profesional (Cinematography), video editing dinamis, liputan dokumentasi acara penting, aftermovie institusional, dan konten storytelling reels/TikTok.",
      iconUrl: "./assets/images/icon-photo.svg",
      order: 4
    },
    {
      title: "Article Company & Creative Copywriting",
      description: "Penyusunan artikel rilis pers institusional, liputan seminar ilmiah (Teknologi Geospasial, SMA Taruna Nusantara), dan naskah storytelling promosi pendaftaran mahasiswa baru.",
      iconUrl: "./assets/images/icon-dev.svg",
      order: 5
    },
    {
      title: "Data Analytics & IoT Innovation",
      description: "Pengolahan data bisnis (Microsoft Office Specialist Excel 2019, SQL Progate) serta riset inovasi teknologi energi terbarukan berbasis IoT (Penerima Pendanaan PKM DIKTI Level 1).",
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
    { name: "Social Media Strategy & Content Management (@itpln, @vokasiitpln)", percentage: 95, order: 3 },
    { name: "Cinematography & Video Editing (Premiere Pro, CapCut)", percentage: 92, order: 4 },
    { name: "Creative Copywriting & Corporate Article Writing", percentage: 90, order: 5 },
    { name: "Microsoft Excel (MOS Certified & Advanced Data Modeling)", percentage: 94, order: 6 },
    { name: "SQL Database Query & Data Management (Progate Certified)", percentage: 88, order: 7 },
    { name: "IoT & Hardware Prototyping (PKM DIKTI Level 1)", percentage: 85, order: 8 }
  ],

  education: [
    {
      institution: "Institut Teknologi PLN (ITPLN)",
      period: "2023 — Sekarang",
      description: "Program Sarjana (S1) Teknik Informatika. Menggabungkan teknologi komputasi, rekayasa media kreatif, manajemen data, dan transformasi digital institusi.",
      order: 1
    },
    {
      institution: "Program Kreativitas Mahasiswa (PKM) DIKTI Level 1",
      period: "2024",
      description: "Penerima Hibah Pendanaan Kemendikbudristek untuk proyek inovasi energi terbarukan terintegrasi sistem Internet of Things (IoT).",
      order: 2
    },
    {
      institution: "Microsoft Office Specialist & Database Query Specialization",
      period: "2024",
      description: "Sertifikasi resmi MOS Excel 2019 dan sertifikasi SQL Progate untuk analisis dan manajemen data relasional tingkat lanjut.",
      order: 3
    },
    {
      institution: "Basic English Education Skills Program",
      period: "2024",
      description: "Pelatihan intensif kemampuan bahasa Inggris untuk komunikasi profesional, presentasi akademik, dan penjangkauan internasional.",
      order: 4
    },
    {
      institution: "SMA Negeri 1 Tebing Tinggi",
      period: "2020 — 2023",
      description: "Pendidikan Menengah Atas jurusan Matematika dan Ilmu Pengetahuan Alam (MIPA). Landasan logika analitis dan kepemimpinan organisasi.",
      order: 5
    }
  ],

  experience: [
    {
      position: "Social Media & Website Humas ITPLN",
      company: "Institut Teknologi PLN (ITPLN)",
      period: "Okt 2025 — Sekarang",
      description: "Membuat konten komunikasi publik dan kampanye digital institusi. Berperan aktif dalam menjaga reputasi ITPLN melalui media sosial resmi dan hubungan stakeholder.",
      order: 1
    },
    {
      position: "Student Ambassador BPA ITPLN",
      company: "Biro Penerimaan Mahasiswa Baru ITPLN",
      period: "2024 — Sekarang",
      description: "Mewakili kampus di berbagai event edukasi dan menyusun strategi promosi digital. Konten storytelling yang dibuat berhasil menarik banyak calon mahasiswa baru.",
      order: 2
    },
    {
      position: "Social Media Manager Humas ITPLN",
      company: "Biro Humas & Komunikasi Publik ITPLN",
      period: "Sep 2024 — Nov 2024",
      description: "Membuat konten komunikasi publik dan kampanye digital institusi. Berperan dalam menjaga reputasi ITPLN melalui media sosial dan hubungan stakeholder.",
      order: 3
    },
    {
      position: "Social Media Manager Marketing ITPLN",
      company: "Biro Marketing & PMB ITPLN",
      period: "Jul 2024 — Sep 2024",
      description: "Mengelola konten media sosial dan website selama masa PMB. Berhasil meningkatkan engagement hingga 3 kali lipat dan mendesain materi promosi digital.",
      order: 4
    },
    {
      position: "Deputy Manager & Direktur Kreatif",
      company: "ITPLN Media",
      period: "2024 — Sekarang",
      description: "Sebagai Deputi Manajer dan Direktur Kreatif, memimpin tim desain, fotografi, dan video untuk menghasilkan konten berkualitas tinggi serta memperkuat identitas merek ITPLN Media.",
      order: 5
    },
    {
      position: "Hubungan Masyarakat (Humas)",
      company: "Musketer ITPLN",
      period: "2024 — Sekarang",
      description: "Membangun dan memelihara hubungan profesional dengan mitra media untuk memperluas jangkauan publisitas serta mengelola citra publik Institut Teknologi PLN.",
      order: 6
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
      title: "Koleksi Visual Design: Lolos PIMNAS 37 & Hari Listrik Nasional",
      category: "Visual Design",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Perancangan materi visual grafis institusi: poster apresiasi Mahasiswa Lolos PIMNAS 37, ucapan Hari Listrik Nasional, dan branding promosi digital.",
      order: 5
    },
    {
      title: "Desain Informasi Kampus: Jendela Negeri, ITPLN Sepekan & Food Festival",
      category: "Visual Design",
      imageUrl: "./assets/images/project-6.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Desain feed dan publikasi berkala: buletin ITPLN Sepekan, rubrik Jendela Negeri, Perpustakaan ITPLN, dan Bisnis Energi Food Festival 2024.",
      order: 6
    },
    {
      title: "Pengelolaan Media Sosial Resmi @itpln, @vokasiitpln & @itplnmedia",
      category: "Sosmed Manager",
      imageUrl: "./assets/images/project-7.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Sosmed Manager untuk 3 akun institusi utama: menyusun editorial plan, storytelling promosi PMB, konten edukasi 'Green Jobs', hingga perayaan hari besar.",
      order: 7
    },
    {
      title: "Artikel Perusahaan: PLN Gali Peran Krusial Teknologi Geospasial",
      category: "Article Company",
      imageUrl: "./assets/images/project-8.jpg",
      projectUrl: "https://itpln.ac.id",
      description: "Penulisan artikel resmi institusi mengenai Geography Seminar Series: peran teknologi geospasial dalam akselerasi masa depan transisi energi.",
      order: 8
    },
    {
      title: "Artikel Perusahaan: Lulusan SMA Taruna Nusantara Berebut Masuk ITPLN",
      category: "Article Company",
      imageUrl: "./assets/images/project-9.png",
      projectUrl: "https://itpln.ac.id",
      description: "Penulisan artikel rilis pers institusional mengenai antusiasme siswa berprestasi SMA Taruna Nusantara dalam menempuh pendidikan calon pemimpin energi di ITPLN.",
      order: 9
    },
    {
      title: "Inovasi IoT Energi Terbarukan — Pendanaan PKM 2024 (DIKTI Level 1)",
      category: "Data & IoT",
      imageUrl: "./assets/images/project-1.jpg",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Riset dan implementasi prototipe teknologi energi terbarukan berbasis Internet of Things (IoT) yang berhasil meraih pendanaan resmi DIKTI Kemendikbud 2024.",
      order: 10
    }
  ],

  blog: [
    {
      title: "Pendanaan PKM 2024 (DIKTI Level 1) — Inovasi Energi Terbarukan Berbasis IoT",
      category: "Prestasi & Inovasi",
      date: "2024-11-20",
      excerpt: "Lolos pendanaan resmi Program Kreativitas Mahasiswa (PKM) 2024 dari Kemendikbudristek/DIKTI dengan inovasi teknologi energi terbarukan terintegrasi sistem Internet of Things (IoT).",
      imageUrl: "./assets/images/blog-1.jpg",
      url: "https://github.com/mangarapakpahan-cmd"
    },
    {
      title: "PLN Gali Peran Krusial Teknologi Geospasial untuk Masa Depan Energi",
      category: "Article Company",
      date: "2025-01-15",
      excerpt: "Artikel institusional liputan Geography Seminar Series mengenai integrasi data spasial dan kecerdasan analitik untuk keandalan jaringan energi nasional.",
      imageUrl: "./assets/images/blog-2.jpg",
      url: "https://itpln.ac.id"
    },
    {
      title: "Lulusan SMA Taruna Nusantara Berebut Masuk ITPLN, Rektor: Calon Pemimpin Energi",
      category: "Article Company",
      date: "2024-12-10",
      excerpt: "Liputan jurnalisme korporat mengenai kunjungan dan seleksi penerimaan bibit unggul calon mahasiswa dari sekolah berprestasi nasional ke ITPLN.",
      imageUrl: "./assets/images/blog-3.jpg",
      url: "https://itpln.ac.id"
    },
    {
      title: "Sertifikasi Microsoft Office Specialist: Excel 2019 (Analisis Data Lanjutan)",
      category: "Sertifikasi Profesional",
      date: "2024-10-15",
      excerpt: "Tersertifikasi resmi secara internasional oleh Microsoft dalam penguasaan spreadsheet Excel tingkat lanjut untuk pemodelan dan analisis data bisnis.",
      imageUrl: "./assets/images/blog-4.jpg",
      url: "https://learn.microsoft.com"
    },
    {
      title: "Sertifikat SQL Database Management — Progate (2024)",
      category: "Database & SQL",
      date: "2024-09-20",
      excerpt: "Menyelesaikan kurikulum pelatihan database SQL dan mampu mengelola serta memanipulasi dataset kompleks menggunakan query relasional.",
      imageUrl: "./assets/images/blog-5.jpg",
      url: "https://progate.com"
    },
    {
      title: "Pelatihan Intensif Basic English Education Skills (2024)",
      category: "Komunikasi & Bahasa",
      date: "2024-08-15",
      excerpt: "Meningkatkan kemampuan dasar bahasa Inggris untuk komunikasi akademik dan profesional melalui program pelatihan intensif terstruktur.",
      imageUrl: "./assets/images/blog-6.jpg",
      url: "#"
    }
  ]
};

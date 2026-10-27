/**
 * default-data.js
 * Data bawaan lengkap & mendalam untuk portofolio Mangara Ferdianto Pakpahan.
 * Memuat lebih dari 45+ entri portofolio terperinci, ekspansi linimasa resume kerja & organisasi,
 * sertifikasi modul mendalam, dan rincian layanan spesifik:
 * - Pengelolaan Akun Media Sosial Mandiri: @itpln, @vokasiitpln, @itplnmedia, @smartgridindonesia (PJCI)
 * - Pengelolaan Redaksi Portal Web: Web Berita PJCI (pjci.or.id) & Portal Humas ITPLN
 * - 50 Entri Proyek Showcase Terkurasi Lengkap dengan Kategori Interaktif
 * - 15 Entri Pengalaman Profesional & Kepemimpinan Organisasi
 * - 8 Linimasa Pendidikan & Sertifikasi Formal
 * - 20 Publikasi Blog, Jurnalisme Redaksi & Pencapaian Ilmiah
 * - 10 Layanan Spesialisasi Terpisah
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
    bio: "Seorang Creative Director, Live Production Specialist, Cinematographer (Videographer), Video Editor, Visual Designer, dan Creative Copywriter dengan portofolio ekstensif dalam memimpin produksi siaran langsung berskala nasional, perancangan identitas visual korporat, serta pengelolaan komunikasi digital dan redaksi publik.\n\nBerpengalaman memegang kanal media sosial resmi serta portal website redaksi (Perkumpulan Jaringan Cerdas Indonesia / PJCI, portal Humas ITPLN, @itpln, @vokasiitpln, dan @itplnmedia) dengan pertumbuhan engagement hingga 3 kali lipat. Berperan aktif sebagai Student Ambassador BPA ITPLN dan DQLab, memimpin kompetisi nasional NCC 2025, menjadi Koordinator Tim Kreatif Video Company Profile ITPLN Media, meraih Juara 1 Inovasi IoT LPG-SafeSense (MKI & ITPLN), Juara 1 Desain Poster Nasional IPB University, serta penerima pendanaan riset PKM DIKTI Level 1. Memiliki kompetensi data analitik teruji dengan sertifikasi resmi Azure Databricks Machine Learning, Educativa (SEM-PLS 120 JP), IBM AI Agents, dan Microsoft Office Specialist Excel 2019.",
    social_facebook: "https://facebook.com",
    social_twitter: "https://twitter.com",
    social_instagram: "https://instagram.com/mangarapakpahan_",
    social_linkedin: "https://linkedin.com/in/mangara-ferdianto-pakpahan",
    social_github: "https://github.com/mangarapakpahan-cmd"
  },

  services: [
    {
      title: "Live Production Specialist & Event Broadcasting",
      description: "Produksi siaran langsung multi-kamera untuk acara institusi berskala nasional (Wisuda ITPLN ke-46, GINEST Studium Generale Nuklir, Tanda Tangan Kontrak PLN, Launching Beasiswa APERTI BUMN).",
      iconUrl: "./assets/images/icon-photo.svg",
      order: 1
    },
    {
      title: "Creative Direction & Brand Visual Identity",
      description: "Perancangan identitas visual acara, desain grafis promosi, materi branding digital, sertifikat kejuaraan resmi Dies Natalis ITPLN, infografis PIMNAS 37, dan buletin ITPLN Sepekan.",
      iconUrl: "./assets/images/icon-design.svg",
      order: 2
    },
    {
      title: "Social Media Management (@itpln, @vokasiitpln, @itplnmedia)",
      description: "Pengelolaan strategi konten akun resmi kampus secara terpisah: editorial plan bulanan, peningkatan interaksi engagement hingga 3x lipat, kampanye PMB, dan pemeliharaan citra publik.",
      iconUrl: "./assets/images/icon-app.svg",
      order: 3
    },
    {
      title: "Pengelolaan Komunikasi & Medsos PJCI (@smartgridindonesia)",
      description: "Pengelolaan media sosial resmi Indonesia Smart Grid Association, mempublikasikan agenda transisi energi terbarukan, edukasi smart grid, dan kampanye dekarbonisasi nasional.",
      iconUrl: "./assets/images/icon-app.svg",
      order: 4
    },
    {
      title: "Pengelolaan Portal Web & Redaksi Berita (PJCI & Humas ITPLN)",
      description: "Penulisan artikel berkala, siaran pers resmi, liputan agenda seminar, update berita regulasi ketenagalistrikan, serta optimasi konten di portal website pjci.or.id dan itpln.ac.id.",
      iconUrl: "./assets/images/icon-dev.svg",
      order: 5
    },
    {
      title: "Cinematography & Commercial Video Production",
      description: "Pengambilan gambar sinematik profesional, liputan dokumenter, produksi video profil institusi, dan pengarahan kamera multicam untuk berbagai event korporat.",
      iconUrl: "./assets/images/icon-photo.svg",
      order: 6
    },
    {
      title: "Dynamic Video Editing & Motion Post-Production",
      description: "Editing aftermovie dinamis, color grading, penyusunan ritme audio, video reels/TikTok promosi, motion graphic bumper video, dan penataan narasi visual bermutu tinggi.",
      iconUrl: "./assets/images/icon-design.svg",
      order: 7
    },
    {
      title: "IoT Prototyping & Hardware Engineering (LPG-SafeSense)",
      description: "Riset dan rekayasa perangkat pintar Internet of Things (IoT), integrasi mikrokontroler dengan sensor gas MQ-6, loadcell digital, dan konektivitas cloud mobile apps (Juara 1 MKI).",
      iconUrl: "./assets/images/icon-dev.svg",
      order: 8
    },
    {
      title: "AI & Micro-SaaS Platform Development (REPUTA-AI & BisaKerja)",
      description: "Pengembangan konsep platform digital berbasis AI generatif untuk reputasi bisnis UMKM serta rancang bangun arsitektur aplikasi inklusi kerja sosial berbasis Ability Matching.",
      iconUrl: "./assets/images/icon-app.svg",
      order: 9
    },
    {
      title: "Advanced Data Analytics & Structural Modeling (Azure & SEM-PLS)",
      description: "Pemrosesan machine learning cloud di Azure Databricks, pemodelan Structural Equation Modeling (SEM-PLS 120 JP), manipulasi database SQL, dan pemodelan keuangan MOS Excel.",
      iconUrl: "./assets/images/icon-dev.svg",
      order: 10
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
    { name: "Social Media Strategy (@itpln, @vokasiitpln, @smartgridindonesia)", percentage: 95, order: 3 },
    { name: "Website Content Management & Redaksi Berita (PJCI & ITPLN)", percentage: 94, order: 4 },
    { name: "Cinematography & Dynamic Video Editing (Premiere Pro, CapCut)", percentage: 93, order: 5 },
    { name: "IoT Prototyping & Sensor Hardware (LPG-SafeSense & PKM DIKTI)", percentage: 92, order: 6 },
    { name: "Creative Copywriting & Corporate Press Release Writing", percentage: 91, order: 7 },
    { name: "Microsoft Excel (MOS Certified & Advanced Business Modeling)", percentage: 95, order: 8 },
    { name: "Olah Data Kuantitatif & SEM-PLS (Educativa 120 JP Certified)", percentage: 90, order: 9 },
    { name: "SQL Database Query & Data Modeling (Progate & Ngulik Data)", percentage: 90, order: 10 },
    { name: "Cloud Machine Learning & Big Data (Azure Databricks Certified)", percentage: 88, order: 11 }
  ],

  education: [
    {
      institution: "Institut Teknologi PLN (ITPLN)",
      period: "2023 — Sekarang",
      description: "Program Sarjana (S1) Teknik Informatika. Menggabungkan komputasi cerdas, rekayasa media multimedia, manajemen data relasional, dan arsitektur sistem digital industri energi.",
      order: 1
    },
    {
      institution: "Microsoft Azure Cloud Machine Learning Specialization",
      period: "2025",
      description: "Menyelesaikan 8 modul spesialisasi profesional resmi Microsoft: Machine Learning in Production, AutoML, Hyperparameter Tuning, MLflow Lifecycle, dan Apache Spark di Azure Databricks.",
      order: 2
    },
    {
      institution: "PT Educativa Cipta Nawasena — Bootcamp Riset Kuantitatif 120 JP",
      period: "2026",
      description: "Kelulusan sertifikasi 120 JP analisis statistik inferensial tingkat lanjut, pemodelan Structural Equation Modeling (SEM-PLS), path analysis mediasi-moderasi, dan analisis faktor data riset.",
      order: 3
    },
    {
      institution: "Samsung Innovation Campus (SIC) Batch 5 — Skilvul",
      period: "2024",
      description: "Program beasiswa intensif pelatihan algoritma pemecahan masalah komputasi, struktur data efisien, dan pemrograman Python tingkat lanjut dengan predikat kelulusan Senior Grade.",
      order: 4
    },
    {
      institution: "Program Kreativitas Mahasiswa (PKM) DIKTI Kemendikbudristek",
      period: "2024",
      description: "Penerima Hibah Pendanaan Kemendikbudristek/DIKTI Level 1 untuk riset implementasi prototipe teknologi energi terbarukan berbasis Internet of Things (IoT).",
      order: 5
    },
    {
      institution: "Microsoft Corporation — Microsoft Office Specialist (MOS) Excel 2019",
      period: "2024",
      description: "Sertifikasi resmi internasional dari Microsoft dalam penguasaan spreadsheet Excel tingkat mahir: pemodelan data finansial, formula logika kompleks, dan dashboard analisis bisnis.",
      order: 6
    },
    {
      institution: "Progate & Ngulik Data — Relational Database & SQL Specialization",
      period: "2024 — 2026",
      description: "Sertifikasi manipulasi basis data SQL, optimasi relasi tabel kompleks, query agregasi transaksi bisnis, dan visualisasi metrik performa operasional.",
      order: 7
    },
    {
      institution: "SMA Negeri 1 Tebing Tinggi",
      period: "2020 — 2023",
      description: "Pendidikan Menengah Atas jurusan Matematika dan Ilmu Pengetahuan Alam (MIPA). Membangun pondasi logika analitis kuantitatif dan kepemimpinan organisasi kemahasiswaan.",
      order: 8
    }
  ],

  experience: [
    {
      position: "Social Media Manager (Magang)",
      company: "Perkumpulan Jaringan Cerdas Indonesia (PJCI / Indonesia Smart Grid Association)",
      period: "Apr 2026 — Jul 2026",
      description: "Berdasarkan Surat Perjanjian Kerja Magang No. 026/PJCI-Magang/SMM/2026. Memimpin perancangan strategi komunikasi media sosial resmi (@smartgridindonesia), kampanye diseminasi transisi energi bersih, edukasi smart grid nasional, serta peliputan event ketenagalistrikan.",
      order: 1
    },
    {
      position: "Pengelola Redaksi Website & Publikasi Berita",
      company: "Perkumpulan Jaringan Cerdas Indonesia (PJCI)",
      period: "Apr 2026 — Jul 2026",
      description: "Mengelola portal website berita resmi pjci.or.id: menyusun artikel editorial transisi energi, press release kegiatan asosiasi, ringkasan seminar teknologi smart grid, dan dokumentasi kerja sama ketenagalistrikan.",
      order: 2
    },
    {
      position: "Social Media & Website Specialist",
      company: "Bagian Humas & Stakeholder ITPLN (BHMS)",
      period: "Okt 2025 — Sekarang",
      description: "Bertanggung jawab atas produksi konten komunikasi publik digital, penulisan artikel web portal kehumasan, pengelolaan media sosial institusi, serta menjaga reputasi positif ITPLN di mata stakeholder dan mitra industri.",
      order: 3
    },
    {
      position: "Koordinator Divisi Creative & Concept — Video Company Profile",
      company: "ITPLN Media",
      period: "Apr 2025 — 2026",
      description: "Penugasan resmi SK No. 001/SK/ITPLN MEDIA/APRIL/2025. Memimpin konseptualisasi visual, alur cerita (storyline), storyboard sinematografi, dan pengarahan artistik dalam proyek produksi video profil institusional ITPLN Media.",
      order: 4
    },
    {
      position: "Ketua Pelaksana — National Creative Competition (NCC) 2025",
      company: "ITPLN Media",
      period: "2025",
      description: "Memimpin dan mengkoordinasikan penyelenggaraan kompetisi karya kreatif mahasiswa berskala nasional bertema 'Data Science Untuk Kebutuhan Energi Bersih Nuklir' yang diselenggarakan oleh ITPLN Media.",
      order: 5
    },
    {
      position: "Deputy Manager & Direktur Kreatif",
      company: "ITPLN Media",
      period: "2024 — Sekarang",
      description: "Mengambil peran kepemimpinan strategis operasional dan membawahi divisi desain grafis, fotografi, serta videografi. Mengarahkan standar estetika konten publikasi kampus agar selalu konsisten, berkualitas prima, dan merefleksikan identitas modern institusi.",
      order: 6
    },
    {
      position: "Student Ambassador BPA ITPLN",
      company: "Biro Penerimaan Mahasiswa Baru ITPLN",
      period: "2024 — Sekarang",
      description: "Menjadi representasi resmi kampus dalam expo pendidikan, roadshow sekolah, dan sesi presentasi edukatif. Merancang konten promosi digital yang berhasil menarik ratusan calon mahasiswa baru berprestasi.",
      order: 7
    },
    {
      position: "Student Ambassador DQLab",
      company: "DQLab Data Science Community",
      period: "2024 — Sekarang",
      description: "Menjembatani mahasiswa dengan platform edukasi data science, mengorganisir sesi belajar kelompok, dan memfasilitasi networking antara mahasiswa ITPLN dengan praktisi data profesional industri.",
      order: 8
    },
    {
      position: "Koordinator Live Production & Broadcast Acara Resmi",
      company: "ITPLN Media & Humas",
      period: "2024 — Sekarang",
      description: "Mengkoordinasikan tim teknis multimedia untuk penyiaran langsung (live streaming multicam) acara penting universitas: Wisuda ke-46, Studium Generale Nuklir, penandatanganan ikatan kerja PLN, dan seminar nasional.",
      order: 9
    },
    {
      position: "Panitia Pelaksana — LKMM Pra-Tingkat Dasar (Pra-TD) ITPLN",
      company: "Institut Teknologi PLN",
      period: "Feb 2025",
      description: "Bertanggung jawab dalam kepanitiaan manajemen logistik dan teknis pelatihan kepemimpinan mahasiswa tingkat dasar lintas lima fakultas (FKET, FTEN, FTIK, FTBE, SV).",
      order: 10
    },
    {
      position: "Social Media Manager Humas ITPLN",
      company: "Biro Humas & Komunikasi Publik ITPLN",
      period: "Sep 2024 — Nov 2024",
      description: "Membuat konten komunikasi publik dan kampanye digital institusi. Berperan aktif dalam menjaga reputasi ITPLN melalui media sosial resmi dan hubungan pemangku kepentingan.",
      order: 11
    },
    {
      position: "Social Media Manager Marketing ITPLN",
      company: "Biro Marketing & PMB ITPLN",
      period: "Jul 2024 — Sep 2024",
      description: "Mengelola strategi konten media sosial dan materi promosi digital selama masa puncak PMB, menghasilkan lonjakan engagement audiens sebesar 3 kali lipat dan meningkatkan konversi pendaftaran.",
      order: 12
    },
    {
      position: "Project Manager — Family Gathering PT Adhi Guna Putera",
      company: "PT Adhi Guna Putera",
      period: "2025",
      description: "Memimpin perencanaan acara end-to-end: penyusunan rundown, koordinasi logistik teknis, manajemen vendor, dan pemandu alur kegiatan kebersamaan karyawan perusahaan dan keluarga.",
      order: 13
    },
    {
      position: "Hubungan Masyarakat (Humas)",
      company: "Musketer ITPLN",
      period: "2024 — Sekarang",
      description: "Membangun dan memelihara hubungan profesional dengan mitra media eksternal untuk memperluas jangkauan publisitas serta menjaga citra positif almamater di ruang publik.",
      order: 14
    },
    {
      position: "Ketua Badan Pengurus Harian (BPH) Pemuda",
      company: "HKBP Maranatha Tebing Tinggi",
      period: "2022 — 2023",
      description: "Memimpin kepengurusan organisasi kepemudaan, mengelola agenda kegiatan sosial kemasyarakatan, serta menjalankan program pembinaan kepemimpinan pemuda gereja.",
      order: 15
    }
  ],

  projects: [
    // ─── 1. Social Media Management (Terpisah Mandiri) ───
    {
      title: "Social Media Management: Instagram Resmi @itpln (Pusat Kampus)",
      category: "Social Media",
      imageUrl: "./assets/images/project-7.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Pengelolaan konten akun resmi utama @itpln: menyusun content calendar bulanan, penulisan naskah copywriting resmi, publikasi prestasi akademik, dan strategi penguatan reputasi institusi di ranah media sosial.",
      order: 1
    },
    {
      title: "Social Media Management: Instagram Resmi @vokasiitpln (Sekolah Vokasi)",
      category: "Social Media",
      imageUrl: "./assets/images/project-7.png",
      projectUrl: "https://instagram.com/vokasiitpln",
      description: "Pengelolaan kanal media sosial resmi Sekolah Vokasi ITPLN: konten interaktif seputar praktikum industri ketenagalistrikan, keunggulan program vokasi terapan, dan interaksi dengan calon mahasiswa vokasi.",
      order: 2
    },
    {
      title: "Social Media Management: Akun Kreatif @itplnmedia (Divisi Media Kampus)",
      category: "Social Media",
      imageUrl: "./assets/images/project-7.png",
      projectUrl: "https://instagram.com/itplnmedia",
      description: "Memimpin strategi dan eksekusi konten multi-format (reels, feed visual, carousel edukatif) akun @itplnmedia guna membangun komunitas kreatif mahasiswa yang aktif dan meningkatkan brand awareness divisi media kampus.",
      order: 3
    },
    {
      title: "Social Media Management: Akun Resmi PJCI (@smartgridindonesia)",
      category: "Social Media",
      imageUrl: "./assets/images/project-1.jpg",
      projectUrl: "https://instagram.com/smartgridindonesia",
      description: "Berdasarkan SK Magang PJCI No. 026/PJCI-Magang/SMM/2026. Mengelola media sosial resmi Indonesia Smart Grid Association: publikasi agenda transisi energi, seminar dekarbonisasi, dan edukasi sistem ketenagalistrikan modern.",
      order: 4
    },
    {
      title: "Strategi Konten & Digital Campaign PMB ITPLN (Lonjakan Engagement 3x Lipat)",
      category: "Social Media",
      imageUrl: "./assets/images/project-4.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Rancangan kampanye promosi digital terpadu untuk Penerimaan Mahasiswa Baru ITPLN, memanfaatkan storytelling keunggulan ikatan kerja PLN yang sukses mendongkrak engagement interaksi hingga 300%.",
      order: 5
    },
    {
      title: "Kampanye Digital Edukatif 'Green Jobs & Transisi Energi' di Media Sosial",
      category: "Social Media",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Serial konten infografis dan reels edukasi karier ramah lingkungan, membahas prospek profesi energi terbarukan bagi lulusan teknologi energi di era dekarbonisasi.",
      order: 6
    },

    // ─── 2. Redaksi Berita & Portal Website (Terpisah Mandiri) ───
    {
      title: "Pengelolaan Redaksi Portal Berita Resmi PJCI (pjci.or.id)",
      category: "Article & Editorial",
      imageUrl: "./assets/images/project-2.png",
      projectUrl: "https://pjci.or.id",
      description: "Pengelolaan akun redaksi website resmi PJCI: penulisan dan kurasi artikel berita seputar perkembangan smart grid di Indonesia, ringkasan seminar ketenagalistrikan, serta publikasi agenda kolaborasi asosiasi.",
      order: 7
    },
    {
      title: "Pengelolaan Portal Web & Liputan Berita Humas ITPLN (itpln.ac.id)",
      category: "Article & Editorial",
      imageUrl: "./assets/images/project-3.jpg",
      projectUrl: "https://itpln.ac.id",
      description: "Mengelola publikasi artikel portal berita resmi universitas: menyusun rilis pers kegiatan rektorat, liputan kerja sama industri, dan arsip dokumentasi pencapaian kampus secara terstruktur.",
      order: 8
    },
    {
      title: "Artikel Perusahaan: PLN Gali Peran Krusial Teknologi Geospasial",
      category: "Article & Editorial",
      imageUrl: "./assets/images/project-8.jpg",
      projectUrl: "https://itpln.ac.id",
      description: "Penulisan artikel institusional liputan Geography Seminar Series mengenai integrasi analitik spasial dan kecerdasan data untuk mendukung keandalan sistem ketenagalistrikan nasional.",
      order: 9
    },
    {
      title: "Artikel Perusahaan: Lulusan SMA Taruna Nusantara Berebut Masuk ITPLN",
      category: "Article & Editorial",
      imageUrl: "./assets/images/project-9.png",
      projectUrl: "https://itpln.ac.id",
      description: "Liputan jurnalisme korporat mengenai antusiasme siswa lulusan sekolah unggulan nasional mendaftar program pendidikan calon pemimpin energi masa depan di ITPLN.",
      order: 10
    },
    {
      title: "Liputan Redaksi PJCI: Modernisasi Sistem Daya Listrik dan Smart Grid Nasional",
      category: "Article & Editorial",
      imageUrl: "./assets/images/project-2.png",
      projectUrl: "https://pjci.or.id",
      description: "Artikel kajian mendalam di website PJCI tentang integrasi pembangkit listrik energi baru terbarukan ke dalam jaringan distribusi transmisi cerdas Indonesia.",
      order: 11
    },
    {
      title: "Publikasi Liputan Khusus: Mahasiswa Inovator Energi Bersih ITPLN",
      category: "Article & Editorial",
      imageUrl: "./assets/images/project-3.jpg",
      projectUrl: "https://itpln.ac.id",
      description: "Liputan mendalam mengenai inovasi karya mahasiswa di bidang efisiensi energi yang berhasil meraih apresiasi dan penghargaan di tingkat nasional.",
      order: 12
    },

    // ─── 3. Live Production, Broadcasting & Streaming (Terpisah Mandiri) ───
    {
      title: "Live Production & Broadcast Wisuda ITPLN ke-46: Innovating with Excellence",
      category: "Live Production",
      imageUrl: "./assets/images/project-1.jpg",
      projectUrl: "https://youtube.com",
      description: "Produksi siaran langsung multi-kamera berdurasi lebih dari 3.5 jam dengan tata visual megah, switcher control, lower thirds dinamis, dan disiarkan langsung ke ribuan audiens daring.",
      order: 13
    },
    {
      title: "Live Streaming GINEST Studium Generale: Nuklir Sebagai Solusi Transisi Energi",
      category: "Live Production",
      imageUrl: "./assets/images/project-2.png",
      projectUrl: "https://youtube.com",
      description: "Operasional siaran langsung seminar nasional energi nuklir hampir 3 jam dengan panel pakar industri energi dan rekayasa audio-visual tanpa jeda.",
      order: 14
    },
    {
      title: "Live Production Seremoni Penandatanganan Kontrak Program Ikatan Kerja PLN",
      category: "Live Production",
      imageUrl: "./assets/images/project-3.jpg",
      projectUrl: "https://youtube.com",
      description: "Broadcasting dan visual switcher untuk acara penandatanganan kontrak ikatan kerja resmi mahasiswa berprestasi dengan jajaran direksi PT PLN (Persero).",
      order: 15
    },
    {
      title: "Live Broadcast Peluncuran Beasiswa APERTI BUMN 2024",
      category: "Live Production",
      imageUrl: "./assets/images/project-4.png",
      projectUrl: "https://youtube.com",
      description: "Produksi siaran langsung peluncuran program beasiswa gabungan perguruan tinggi BUMN di hadapan perwakilan kementerian dan pimpinan aliansi BUMN.",
      order: 16
    },
    {
      title: "Live Streaming Launching Kerjasama Program Ikatan Kerja APITU & ITPLN",
      category: "Live Production",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://youtube.com",
      description: "Siaran langsung seremonial kemitraan vokasi pendingin dan tata udara APITU dengan program studi Teknik Mesin ITPLN.",
      order: 17
    },
    {
      title: "Live Technical & Broadcast Support: Seminar Nasional Mine Excellent Indonesia",
      category: "Live Production",
      imageUrl: "./assets/images/project-6.png",
      projectUrl: "https://youtube.com",
      description: "Penyediaan infrastruktur teknis visual dan live multicam pendukung seminar pertambangan dan teknologi eksplorasi nasional.",
      order: 18
    },
    {
      title: "Live Production & Streaming JACOST (Jakarta Computer Science Conference)",
      category: "Live Production",
      imageUrl: "./assets/images/project-7.png",
      projectUrl: "https://youtube.com",
      description: "Dukungan operasional live conference dan pemaparan paper riset teknologi komputasi di hadapan akademisi serta peneliti informatika.",
      order: 19
    },
    {
      title: "Live Broadcasting Seminar AMI (Advance Metering Infrastructure) Nasional",
      category: "Live Production",
      imageUrl: "./assets/images/project-8.jpg",
      projectUrl: "https://youtube.com",
      description: "Broadcasting teknis seminar modernisasi meter listrik pintar PLN dengan integrasi slide narasumber dan interaksi tanya jawab audiens online.",
      order: 20
    },
    {
      title: "Live Production & Audio Visual: Career Day Studium Generale ITPLN",
      category: "Live Production",
      imageUrl: "./assets/images/project-9.png",
      projectUrl: "https://youtube.com",
      description: "Pengaturan audio visual, integrasi siaran virtual, dan live documentation bagi mahasiswa tingkat akhir yang bersiap memasuki dunia kerja profesional.",
      order: 21
    },
    {
      title: "Live Streaming Seminar Nasional Dekarbonisasi Sistem Daya & Transisi Energi",
      category: "Live Production",
      imageUrl: "./assets/images/project-1.jpg",
      projectUrl: "https://youtube.com",
      description: "Operasional live streaming forum diskusi energi hijau bersama praktisi kelistrikan dan stakeholder industri energi terbarukan.",
      order: 22
    },

    // ─── 4. Visual Design & Branding (Terpisah Mandiri) ───
    {
      title: "Desain Feed Visual: Apresiasi Mahasiswa Lolos PIMNAS 37",
      category: "Visual Design",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Perancangan grafis poster apresiasi resmi pencapaian mahasiswa ITPLN yang berhasil melaju ke babak Pekan Ilmiah Mahasiswa Nasional (PIMNAS 37).",
      order: 23
    },
    {
      title: "Desain Visual Resmi Peringatan Hari Listrik Nasional (HLN)",
      category: "Visual Design",
      imageUrl: "./assets/images/project-6.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Karya desain grafis poster ucapan Hari Listrik Nasional dengan visualisasi futuristik transmisi tenaga listrik dan semangat transisi energi.",
      order: 24
    },
    {
      title: "Rubrik Desain Visual Informasi: Jendela Negeri ITPLN",
      category: "Visual Design",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Desain layout edukatif serial informasi kekayaan alam nusantara dan pemanfaatan potensi energi daerah untuk feed Instagram resmi.",
      order: 25
    },
    {
      title: "Desain Publikasi Buletin Digital: ITPLN Sepekan Edisi 44",
      category: "Visual Design",
      imageUrl: "./assets/images/project-6.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Layout infografis rekapitulasi agenda mingguan institusi dengan tata letak editorial modern, ringkas, dan mudah dipahami pembaca digital.",
      order: 26
    },
    {
      title: "Desain Identitas Visual: Bisnis Energi Food Festival 2024",
      category: "Visual Design",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Perancangan elemen grafis promosi, banner digital, flyer acara, dan backdrop panggung festival kewirausahaan mahasiswa bidang kuliner dan energi.",
      order: 27
    },
    {
      title: "Desain Creative Kit & Kampanye Literasi: Perpustakaan ITPLN",
      category: "Visual Design",
      imageUrl: "./assets/images/project-6.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Seri poster digital promosi fasilitas literasi modern, koleksi e-journal ilmiah, dan kampanye budaya membaca di kalangan mahasiswa.",
      order: 28
    },
    {
      title: "Desain Visual Branding Program SAFF (Smart Agriculture & Future Food)",
      category: "Visual Design",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Pengembangan materi visual promosi inisiatif pertanian cerdas berbasis elektrifikasi dan ketahanan pangan masa depan binaan kampus.",
      order: 29
    },
    {
      title: "Juara 1 Lomba Desain Poster Nasional Ocean Experience IPB University 2025",
      category: "Visual Design",
      imageUrl: "./assets/images/project-7.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Karya desain pemenang Juara 1 tingkat nasional di IPB University dengan visualisasi artistik penyelamatan ekosistem bahari dan konservasi terumbu karang.",
      order: 30
    },
    {
      title: "Perancangan Visual Sertifikat Turnamen Badminton Dies Natalis ITPLN 2026",
      category: "Visual Design",
      imageUrl: "./assets/images/project-4.png",
      projectUrl: "https://itpln.ac.id",
      description: "Perancangan identitas visual piagam penghargaan dan sertifikat juara turnamen Badminton Ganda Putra dan Putri Dies Natalis ITPLN.",
      order: 31
    },
    {
      title: "Perancangan Visual Sertifikat Turnamen Futsal Dies Natalis ITPLN 2026",
      category: "Visual Design",
      imageUrl: "./assets/images/project-4.png",
      projectUrl: "https://itpln.ac.id",
      description: "Desain sertifikat resmi kejuaraan turnamen Futsal antar fakultas dengan layout modern beraksen emas kejuaraan olahraga.",
      order: 32
    },
    {
      title: "Desain Identitas Visual & Poster Promosi National Creative Competition (NCC) 2025",
      category: "Visual Design",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://instagram.com/itplnmedia",
      description: "Konseptualisasi tema visual, logo kompetisi, poster sayembara nasional, dan aset media sosial ajang karya kreatif mahasiswa se-Indonesia.",
      order: 33
    },
    {
      title: "Desain Feed Instagram Khusus Peringatan Hari Sumpah Pemuda ITPLN",
      category: "Visual Design",
      imageUrl: "./assets/images/project-6.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Poster tematik perayaan semangat kepemudaan mahasiswa dengan perpaduan ornamen nusantara kontemporer dan filosofi kemajuan bangsa.",
      order: 34
    },
    {
      title: "Desain Template Ucapan Ulang Tahun Resmi Pejabat & Guru Besar ITPLN",
      category: "Visual Design",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://instagram.com/itpln",
      description: "Sistem template desain korporat yang elegan untuk ucapan hari lahir dan milad pimpinan rektorat, dekanat, dan guru besar institusi.",
      order: 35
    },

    // ─── 5. Cinematography & Video Editing (Terpisah Mandiri) ───
    {
      title: "Produksi Video Company Profile ITPLN Media (Koordinator Creative & Concept)",
      category: "Video & Cinema",
      imageUrl: "./assets/images/project-2.png",
      projectUrl: "https://youtube.com",
      description: "Berdasarkan SK No. 001/SK/ITPLN MEDIA/APRIL/2025, memimpin penulisan naskah storyline, storyboard visual, arahan sinematografi, dan editing akhir video profil institusi.",
      order: 36
    },
    {
      title: "Video Editing & Dokumentasi Dinamis: Program Pasca Sarjana ITPLN",
      category: "Video & Cinema",
      imageUrl: "./assets/images/project-3.jpg",
      projectUrl: "https://youtube.com",
      description: "Editing video promosi perkuliahan magister teknik, menampilkan testimoni alumni, profil dosen pakar, dan fasilitas laboratorium modern.",
      order: 37
    },
    {
      title: "Produksi Video Aftermovie Resmi Wisuda ITPLN ke-46",
      category: "Video & Cinema",
      imageUrl: "./assets/images/project-1.jpg",
      projectUrl: "https://youtube.com",
      description: "Pengambilan gambar sinematik (cinematography), color grading, penyusunan ritme audio dinamis, dan editing rangkuman prosesi wisuda yang emosional dan khidmat.",
      order: 38
    },
    {
      title: "Video Teaser & Promosi Digital National Creative Competition (NCC) 2025",
      category: "Video & Cinema",
      imageUrl: "./assets/images/project-4.png",
      projectUrl: "https://instagram.com/itplnmedia",
      description: "Produksi video motion graphic dan teaser reels promosi pendaftaran kompetisi nasional dengan visual bertema Data Science dan Energi Nuklir.",
      order: 39
    },
    {
      title: "Video Profil Dosen & Peneliti Inovator Kampus ITPLN",
      category: "Video & Cinema",
      imageUrl: "./assets/images/project-2.png",
      projectUrl: "https://youtube.com",
      description: "Liputan dokumenter pendek mengenai riset dosen pembimbing, metodologi rekayasa teknologi, dan dampak akademisnya bagi masyarakat.",
      order: 40
    },
    {
      title: "Video Storytelling & Liputan Mahasiswa Baru (Penyambutan Maba ITPLN)",
      category: "Video & Cinema",
      imageUrl: "./assets/images/project-3.jpg",
      projectUrl: "https://instagram.com/itpln",
      description: "Produksi video interaktif reels/TikTok penyambutan mahasiswa baru yang membagikan tips adaptasi kampus dan pengenalan organisasi kemahasiswaan.",
      order: 41
    },

    // ─── 6. Inovasi IoT, AI & Platform Development (Terpisah Mandiri) ───
    {
      title: "Juara 1 Inovasi IoT: LPG-SafeSense (Sensor MQ-6 & Loadcell Pintar) — MKI & ITPLN",
      category: "IoT & Tech",
      imageUrl: "./assets/images/project-1.jpg",
      projectUrl: "https://itpln.ac.id",
      description: "Perangkat pintar pemantau keamanan gas LPG berbasis IoT dengan sensor MQ-6 dan loadcell terintegrasi smartphone untuk deteksi kebocoran dan pantauan isi gas real-time. Pemenang Juara 1 Technology Incubation Sprint Program MKI & ITPLN.",
      order: 42
    },
    {
      title: "Riset Inovasi Energi Terbarukan Berbasis IoT (Pendanaan PKM DIKTI Level 1)",
      category: "IoT & Tech",
      imageUrl: "./assets/images/project-8.jpg",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Prototipe sistem pemantauan generasi daya energi terbarukan berbasis mikrokontroler dan sensor IoT yang berhasil lolos pendanaan resmi Kemendikbudristek/DIKTI 2024.",
      order: 43
    },
    {
      title: "REPUTA-AI: Micro-SaaS Agregator Ulasan UMKM Berbasis Localized Generative AI",
      category: "AI & Platform",
      imageUrl: "./assets/images/project-2.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Platform cerdas Micro-SaaS bertenaga AI generatif lokal guna mengagregasi ulasan konsumen multiplatform, menganalisis sentimen, dan menghasilkan respon otomatis bagi UMKM (BNC 2026).",
      order: 44
    },
    {
      title: "BisaKerja: Platform Job Matching & Ekosistem Inklusi Disabilitas (BMC Impact 2026)",
      category: "Social Impact",
      imageUrl: "./assets/images/project-3.jpg",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Platform ekosistem kerja inklusif berbasis Ability Matching untuk menjembatani penyandang disabilitas dengan peluang karier ramah inklusi. Tagline: Mencocokkan Kemampuan, Bukan Keterbatasan.",
      order: 45
    },
    {
      title: "Implementasi Algoritma & Struktur Data Pemrograman Python (SIC Batch 5)",
      category: "IoT & Tech",
      imageUrl: "./assets/images/project-8.jpg",
      projectUrl: "https://skilvul.com",
      description: "Pengembangan solusi algoritma komputasi efisien, manipulasi struktur data kompleks, dan logika optimasi dalam program Samsung Innovation Campus bersama Skilvul (Senior Grade).",
      order: 46
    },
    {
      title: "Proyek Analisis Penjualan Retail Fashion dengan Query SQL Kompleks (Ngulik Data)",
      category: "IoT & Tech",
      imageUrl: "./assets/images/project-9.png",
      projectUrl: "https://ngulikdata.com/certificates/RnwoqbSzwEn9",
      description: "Penyelesaian studi kasus analisis data bisnis penjualan toko pakaian menggunakan query SQL multi-tabel, window functions, kalkulasi revenue, dan segmentasi transaksi.",
      order: 47
    },
    {
      title: "Orkestrasi Machine Learning Enterprise dengan Apache Spark & Azure Databricks",
      category: "AI & Platform",
      imageUrl: "./assets/images/project-8.jpg",
      projectUrl: "https://learn.microsoft.com",
      description: "Implementasi pipeline pemrosesan big data terdistribusi dan model machine learning menggunakan Azure Databricks, Apache Spark, dan model tuning MLflow.",
      order: 48
    },
    {
      title: "Prototipe IoT Smart Home & Sensor Environment Monitoring (ESP32/Arduino)",
      category: "IoT & Tech",
      imageUrl: "./assets/images/project-1.jpg",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Eksplorasi rekayasa hardware mikrokontroler ESP32/Arduino untuk pemantauan suhu, kelembaban, dan parameter lingkungan dengan transmisi data MQTT cloud.",
      order: 49
    },

    // ─── 7. Event & Project Management (Terpisah Mandiri) ───
    {
      title: "Manajer Proyek & Event Organizer: Family Gathering PT Adhi Guna Putera",
      category: "Event Management",
      imageUrl: "./assets/images/project-5.png",
      projectUrl: "https://github.com/mangarapakpahan-cmd",
      description: "Memimpin perencanaan dan eksekusi acara dari awal hingga akhir, mengkoordinasikan alur logistik, susunan acara, dan interaksi mempererat hubungan keluarga karyawan.",
      order: 50
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
      title: "Redaksi Berita PJCI: Peran Jaringan Cerdas (Smart Grid) dalam Akselerasi Transisi Energi Bersih",
      category: "Redaksi PJCI",
      date: "2026-05-18",
      excerpt: "Artikel editorial di portal resmi PJCI mengenai peranan teknologi smart grid dalam mendistribusikan energi terbarukan secara andal, efisien, dan ramah lingkungan menuju net zero emission.",
      imageUrl: "./assets/images/blog-1.jpg",
      url: "https://pjci.or.id"
    },
    {
      title: "Redaksi Web PJCI: Modernisasi Sistem Daya Listrik dan Integrasi Pembangkit Energi Terbarukan",
      category: "Redaksi PJCI",
      date: "2026-06-10",
      excerpt: "Kajian jurnalistik industri tentang tantangan interkoneksi jaringan listrik cerdas, implementasi advance metering infrastructure, dan dekarbonisasi sistem tenaga di Indonesia.",
      imageUrl: "./assets/images/blog-2.jpg",
      url: "https://pjci.or.id"
    },
    {
      title: "PLN Gali Peran Krusial Teknologi Geospasial untuk Masa Depan Energi",
      category: "Article Company",
      date: "2025-01-15",
      excerpt: "Artikel institusional liputan Geography Seminar Series mengenai integrasi data spasial dan kecerdasan analitik untuk keandalan jaringan energi nasional.",
      imageUrl: "./assets/images/blog-3.jpg",
      url: "https://itpln.ac.id"
    },
    {
      title: "Lulusan SMA Taruna Nusantara Berebut Masuk ITPLN, Rektor: Calon Pemimpin Energi",
      category: "Article Company",
      date: "2024-12-10",
      excerpt: "Liputan jurnalisme korporat mengenai kunjungan dan seleksi penerimaan bibit unggul calon mahasiswa dari sekolah berprestasi nasional ke ITPLN.",
      imageUrl: "./assets/images/blog-4.jpg",
      url: "https://itpln.ac.id"
    },
    {
      title: "Microsoft Azure Databricks: Mengelola Machine Learning di Lingkungan Produksi Enterprise",
      category: "Cloud & AI",
      date: "2025-11-09",
      excerpt: "Menyelesaikan spesialisasi resmi Microsoft Azure dalam orkestrasi model machine learning skala besar, arsitektur data lakehouse, dan deployment model produksi.",
      imageUrl: "./assets/images/blog-5.jpg",
      url: "https://learn.microsoft.com/en-us/users/mangaraferdiantopakpahan-8408/achievements"
    },
    {
      title: "Microsoft Azure Databricks: Otomasi Pemodelan dengan AutoML dan Hyperparameter Tuning",
      category: "Cloud & AI",
      date: "2025-11-09",
      excerpt: "Penguasaan modul automated machine learning (AutoML) Microsoft untuk seleksi algoritma optimal dan penyetelan hyperparameter pada dataset tabular.",
      imageUrl: "./assets/images/blog-6.jpg",
      url: "https://learn.microsoft.com/en-us/users/mangaraferdiantopakpahan-8408/achievements"
    },
    {
      title: "Microsoft Azure Databricks: Lifecycle Management Model Cerdas Menggunakan MLflow",
      category: "Cloud & AI",
      date: "2025-11-09",
      excerpt: "Menerapkan tracking eksperimen, model registry, dan governance machine learning menggunakan pustaka MLflow terintegrasi cloud Databricks.",
      imageUrl: "./assets/images/blog-1.jpg",
      url: "https://learn.microsoft.com/en-us/users/mangaraferdiantopakpahan-8408/achievements"
    },
    {
      title: "Microsoft Azure Databricks: Pemrosesan Big Data Terdistribusi Menggunakan Apache Spark",
      category: "Cloud & AI",
      date: "2025-11-09",
      excerpt: "Pengolahan dataset berukuran masif dengan arsitektur komputasi terdistribusi Apache Spark, Resilient Distributed Datasets (RDD), dan Spark DataFrames.",
      imageUrl: "./assets/images/blog-2.jpg",
      url: "https://learn.microsoft.com/en-us/users/mangaraferdiantopakpahan-8408/achievements"
    },
    {
      title: "Bootcamp Olah Data Kuantitatif 120 JP: Pemodelan Structural Equation Modeling (SEM-PLS)",
      category: "Data Analytics",
      date: "2026-08-13",
      excerpt: "Kelulusan sertifikasi 120 JP PT Educativa Cipta Nawasena mencakup pengujian hipotesis riset, evaluasi outer model, inner model, dan bootstrapping SEM-PLS.",
      imageUrl: "./assets/images/blog-3.jpg",
      url: "https://educativa.id"
    },
    {
      title: "Bootcamp Olah Data Kuantitatif 120 JP: Analisis Jalur, Mediasi & Moderasi dalam Riset Ilmiah",
      category: "Data Analytics",
      date: "2026-08-13",
      excerpt: "Penerapan statistik inferensial regresi berganda, uji efek mediasi variabel perantara, dan efek moderasi untuk riset kuantitatif terstandarisasi.",
      imageUrl: "./assets/images/blog-4.jpg",
      url: "https://educativa.id"
    },
    {
      title: "IBM SkillsBuild: Unleashing the Power of Autonomous AI Agents",
      category: "Artificial Intelligence",
      date: "2026-08-26",
      excerpt: "Sertifikasi internasional dari IBM SkillsBuild mengenai arsitektur sistem otonom cerdas, implementasi AI Agents, dan otomasi cerdas alur kerja modern.",
      imageUrl: "./assets/images/blog-5.jpg",
      url: "https://skillsbuild.org"
    },
    {
      title: "Ngulik Data: Studi Kasus Analisis Pola Transaksi Penjualan Fashion Retail dengan SQL",
      category: "Database & SQL",
      date: "2026-03-21",
      excerpt: "Menyelesaikan studi kasus komprehensif analisis data bisnis ritel fashion: pembersihan data, query agregasi pendapatan, dan identifikasi tren pembelian pelanggan.",
      imageUrl: "./assets/images/blog-6.jpg",
      url: "https://ngulikdata.com/certificates/RnwoqbSzwEn9"
    },
    {
      title: "Samsung Innovation Campus Batch 5: Penguasaan Algoritma dan Struktur Data Tingkat Lanjut",
      category: "Pemrograman Python",
      date: "2024-09-17",
      excerpt: "Kelulusan beasiswa SIC Batch 5 Stage 1 dengan nilai Senior Grade oleh Skilvul, menguasai algoritma sorting, searching, rekursi, dan optimasi runtime kode.",
      imageUrl: "./assets/images/blog-1.jpg",
      url: "https://skilvul.com"
    },
    {
      title: "Sertifikasi Praktik Excel untuk Korporasi: Dashboard Keuangan dan Otomasi Formula Bisnis",
      category: "Sertifikasi Profesional",
      date: "2026-08-21",
      excerpt: "Tersertifikasi resmi nomor EXC-FL1-20260821-C0WYF dalam perancangan dynamic dashboard korporasi, conditional formatting lanjutan, dan pemodelan laporan terpadu.",
      imageUrl: "./assets/images/blog-2.jpg",
      url: "#"
    },
    {
      title: "Coding Camp DBS Foundation & Dicoding: Literasi Finansial untuk Talenta Teknologi",
      category: "Pengembangan Diri",
      date: "2026-07-15",
      excerpt: "Menyelesaikan kurikulum pembelajaran literasi keuangan, investasi cerdas, dan perencanaan finansial profesional dari DBS Foundation dan Dicoding Indonesia.",
      imageUrl: "./assets/images/blog-3.jpg",
      url: "https://dicoding.com"
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
    }
  ]
};

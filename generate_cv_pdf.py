import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, HRFlowable, Table, TableStyle, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY

def create_cv(filename, subtitle, summary_text, exp_prof, exp_org, projects, certs, skills, manual_page_break_after_org=True):
    # A4: 595.27 x 841.89 points
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=32,
        bottomMargin=32
    )

    styles = getSampleStyleSheet()

    name_style = ParagraphStyle(
        'CVName',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=15.5,
        leading=18,
        alignment=TA_CENTER,
        textTransform='uppercase',
        spaceAfter=2
    )

    subtitle_style = ParagraphStyle(
        'CVSubtitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=10,
        leading=13,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#222222'),
        spaceAfter=3
    )

    contact_style = ParagraphStyle(
        'CVContact',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9,
        leading=12,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#333333'),
        spaceAfter=7
    )

    summary_style = ParagraphStyle(
        'CVSummary',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9.2,
        leading=12.6,
        alignment=TA_JUSTIFY,
        spaceAfter=5
    )

    sec_title_style = ParagraphStyle(
        'CVSecTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=10.5,
        leading=13.5,
        textTransform='uppercase',
        textColor=colors.HexColor('#111111'),
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )

    item_title_style = ParagraphStyle(
        'CVItemTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=9.2,
        leading=12,
        spaceBefore=2,
        spaceAfter=1,
        keepWithNext=True
    )

    bullet_style = ParagraphStyle(
        'CVBullet',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8.8,
        leading=11.6,
        alignment=TA_JUSTIFY,
        spaceBefore=1,
        spaceAfter=1
    )

    skills_label_style = ParagraphStyle(
        'CVSkillsLabel',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=8.8,
        leading=11.8
    )

    skills_val_style = ParagraphStyle(
        'CVSkillsVal',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8.8,
        leading=11.8
    )

    story = []

    # Header
    story.append(Paragraph("<b>MANGARA FERDIANTO PAKPAHAN</b>", name_style))
    story.append(Paragraph(subtitle, subtitle_style))
    contact_text = "0813-1881-6058 &nbsp;|&nbsp; mangarapakpahan51@gmail.com &nbsp;|&nbsp; Jakarta, Indonesia &nbsp;|&nbsp; linkedin.com/in/mangara-ferdianto-pakpahan"
    story.append(Paragraph(contact_text, contact_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#222222'), spaceBefore=0, spaceAfter=5))

    # Ringkasan Profil
    story.append(Paragraph(summary_text, summary_style))

    # Pendidikan
    story.append(Paragraph("Pendidikan", sec_title_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#555555'), spaceBefore=1, spaceAfter=3))
    edu_text = """
    &bull; <b>Institut Teknologi PLN (ITPLN)</b> (2023 &ndash; Sekarang)<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;Program Sarjana (S1) Teknik Informatika &mdash; Komputasi cerdas, rekayasa data & sistem digital energi.<br/>
    &bull; <b>SMA Negeri 1 Tebing Tinggi</b> (2020 &ndash; 2023)<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;Jurusan Matematika dan Ilmu Pengetahuan Alam (MIPA).
    """
    story.append(Paragraph(edu_text, bullet_style))

    # Pengalaman Profesional
    story.append(Paragraph("Pengalaman Profesional", sec_title_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#555555'), spaceBefore=1, spaceAfter=3))
    for exp in exp_prof:
        story.append(Paragraph(f"&bull; <b>{exp['role']}</b> &ndash; {exp['company']} ({exp['period']})", item_title_style))
        for point in exp['points']:
            story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;{point}", bullet_style))

    # Pengalaman Organisasi
    story.append(Paragraph("Pengalaman Organisasi", sec_title_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#555555'), spaceBefore=1, spaceAfter=3))
    for org in exp_org:
        story.append(Paragraph(f"&bull; <b>{org['role']}</b> &ndash; {org['company']} ({org['period']})", item_title_style))
        for point in org['points']:
            story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;{point}", bullet_style))

    # Page break tepat sebelum Keterlibatan Proyek agar halaman 2 sangat rapi
    if manual_page_break_after_org:
        story.append(PageBreak())

    # Keterlibatan dalam Proyek & Acara Terakhir
    story.append(Paragraph("Keterlibatan dalam Proyek & Acara Terakhir", sec_title_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#555555'), spaceBefore=1, spaceAfter=3))
    for prj in projects:
        story.append(Paragraph(f"&bull; <b>{prj['title']}</b> ({prj['period']})", item_title_style))
        story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;{prj['desc']}", bullet_style))

    # Pencapaian & Sertifikasi
    story.append(Paragraph("Pencapaian & Sertifikasi", sec_title_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#555555'), spaceBefore=1, spaceAfter=3))
    for cert in certs:
        story.append(Paragraph(f"&bull; {cert}", bullet_style))

    # Keahlian Teknis
    story.append(Paragraph("Keahlian Teknis", sec_title_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#555555'), spaceBefore=1, spaceAfter=3))
    table_data = []
    for sk in skills:
        table_data.append([
            Paragraph(f"<b>{sk['category']}:</b>", skills_label_style),
            Paragraph(sk['items'], skills_val_style)
        ])
    t = Table(table_data, colWidths=[130, 393])
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 1),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t)

    doc.build(story)
    print(f"Successfully generated {filename}")

# --- 1. DATA ANALYST ---
data_analyst_summary = (
    "Seorang mahasiswa Teknik Informatika Institut Teknologi PLN dengan antusiasme tinggi terhadap analitik data kuantitatif, "
    "pemodelan statistik inferensial, dan penerapan machine learning. Memiliki rekam jejak praktis dalam pengolahan basis data relasional (SQL), "
    "rekayasa fitur dan pelatihan model prediktif di Microsoft Azure Databricks, serta analisis pemodelan persamaan struktural "
    "(SEM-PLS 120 JP) dan pemodelan finansial/bisnis tingkat lanjut dengan Microsoft Excel (MOS Certified). Berpengalaman aktif memimpin "
    "komunitas literasi data kampus dan kompetisi sains data nasional, siap berkontribusi dalam mengubah dataset kompleks menjadi wawasan "
    "strategis dan rekomendasi bisnis berbasis data."
)

data_analyst_prof = [
    {
        "role": "Student Ambassador",
        "company": "DQLab Data Science Community",
        "period": "2024 – Sekarang",
        "points": [
            "Berhasil meningkatkan partisipasi mahasiswa dalam pembelajaran ilmu data dan analitik komputasi melalui pembangunan komunitas belajar aktif.",
            "Menjadi penghubung utama antara mahasiswa dengan para praktisi dan profesional di industri data untuk membuka peluang jejaring kerja sama.",
            "Mengorganisir sesi kelompok belajar teknis mengenai pemrograman Python, manipulasi data dengan Pandas/NumPy, dan visualisasi data."
        ]
    },
    {
        "role": "Trainee Riset & Analis Data Kuantitatif",
        "company": "PT Educativa Cipta Nawasena",
        "period": "2026",
        "points": [
            "Menyelesaikan sertifikasi 120 JP riset kuantitatif mendalam mencakup uji instrumen statistik (validitas & reliabilitas), uji asumsi klasik, dan analisis faktor.",
            "Menerapkan Structural Equation Modeling – Partial Least Squares (SEM-PLS) untuk membedah interaksi variabel riset, evaluasi outer/inner model, serta analisis efek mediasi dan moderasi."
        ]
    },
    {
        "role": "Student Ambassador",
        "company": "Biro Penerimaan Mahasiswa Baru ITPLN",
        "period": "2024 – Sekarang",
        "points": [
            "Bertindak sebagai representasi institusi, mengolah data registrasi pendaftar dan mengevaluasi efektivitas presentasi penjangkauan calon mahasiswa baru.",
            "Mengembangkan strategi penjangkauan terukur berbasis data demografi pendaftar yang berkontribusi pada peningkatan konversi mahasiswa."
        ]
    },
    {
        "role": "Student Worker",
        "company": "Humas & Hubungan Stakeholder ITPLN",
        "period": "Sep 2024 – Nov 2024",
        "points": [
            "Mengumpulkan, membersihkan, dan menganalisis metrik data analitik publikasi digital (engagement, reach, impresi) guna menghasilkan laporan evaluasi bulanan.",
            "Memperkuat citra positif institusi melalui penataan data dokumentasi dan arsip komunikasi strategis para pemangku kepentingan."
        ]
    }
]

data_analyst_org = [
    {
        "role": "Ketua Pelaksana – National Creative Competition (NCC) 2025",
        "company": "ITPLN Media",
        "period": "2025",
        "points": [
            "Memimpin dan mengkoordinasikan kompetisi karya ilmiah mahasiswa tingkat nasional bertema 'Data Science Untuk Kebutuhan Energi Bersih Nuklir'.",
            "Mengelola sistem data registrasi peserta se-Indonesia, rekapitulasi penilaian dewan juri, serta pelaporan hasil kompetisi secara terstruktur."
        ]
    },
    {
        "role": "Deputy Manager & Direktur Kreatif",
        "company": "ITPLN Media",
        "period": "2024 – Sekarang",
        "points": [
            "Sebagai Deputi Manajer, terlibat dalam pengambilan keputusan strategis dan operasional divisi media kampus berbasis evaluasi performa data konten.",
            "Mengarahkan standarisasi produksi konten agar relevan dengan tren minat audiens serta memperkuat identitas merek institusi."
        ]
    },
    {
        "role": "Hubungan Masyarakat",
        "company": "Musketer ITPLN",
        "period": "2024 – Sekarang",
        "points": [
            "Membangun dan memelihara hubungan profesional dengan mitra media eksternal untuk memperluas jangkauan komunikasi publik."
        ]
    },
    {
        "role": "Ketua, Badan Pengurus Harian Pemuda",
        "company": "HKBP Maranatha Tebing Tinggi",
        "period": "2022 – 2023",
        "points": [
            "Memimpin organisasi kepemudaan, mengelola perencanaan program kerja, dan mengawasi administrasi keuangan kegiatan sosial kemasyarakatan."
        ]
    }
]

data_analyst_projects = [
    {
        "title": "Analitik Data & Pemrosesan Machine Learning di Cloud (Azure Databricks)",
        "period": "2025",
        "desc": "Membangun pipeline data end-to-end: pembersihan dataset, eksplorasi data (EDA), pelatihan model prediktif dengan AutoML, dan pelacakan eksperimen menggunakan MLflow di platform Microsoft Azure Databricks."
    },
    {
        "title": "Rekayasa Perangkat Keras & Analisis Data Sensor IoT (LPG-SafeSense)",
        "period": "2025",
        "desc": "Merancang sistem monitoring data sensor gas MQ-6 dan beban load cell terintegrasi cloud mobile apps, berhasil meraih Juara 1 Nasional Inovasi Energi (MKI & ITPLN)."
    },
    {
        "title": "Pemodelan Finansial & Dashboard Analitik Bisnis – Microsoft Excel (MOS)",
        "period": "2024",
        "desc": "Menyusun dashboard evaluasi keuangan dan operasional menggunakan formula logika multivariat tingkat lanjut, pivot tables dinamis, dan visualisasi metrik performa bisnis."
    },
    {
        "title": "Optimasi Kueri Basis Data Relasional SQL",
        "period": "2024 – 2025",
        "desc": "Mengembangkan kueri SQL relasional kompleks (join, subquery, indexing, agregasi) untuk mengolah data transaksi dan operasional dengan efisiensi tinggi."
    }
]

data_analyst_certs = [
    "<b>Microsoft Azure Cloud Machine Learning Specialization</b> – Microsoft (2025) (8 Modul Profesional: Azure Databricks, AutoML, Hyperparameter Tuning, MLflow, Apache Spark)",
    "<b>Sertifikasi Riset Kuantitatif & SEM-PLS 120 JP</b> – PT Educativa Cipta Nawasena (2026)",
    "<b>Microsoft Office Specialist (MOS): Microsoft Excel 2019 Certified</b> – Microsoft Corporation (2024)",
    "<b>Sertifikasi Relational Database & Kursus SQL</b> – Progate & Ngulik Data (2024 – 2026)",
    "<b>Samsung Innovation Campus (SIC) Batch 5: Pemrograman Python & Algoritma</b> – Skilvul (2024)",
    "<b>Juara 1 Inovasi IoT LPG-SafeSense</b> – Masyarakat Ketenagalistrikan Indonesia (MKI) & ITPLN (2025)",
    "<b>Penerima Pendanaan Riset DIKTI Level 1</b> untuk Program Kreativitas Mahasiswa (PKM) Kemendikbudristek (2024)",
    "<b>Juara 1 Lomba Desain Poster Nasional Ocean Experience</b> – IPB University (2025)"
]

data_analyst_skills = [
    {"category": "Bahasa Pemrograman & Kueri", "items": "Python (Pandas, NumPy, Scikit-Learn), SQL (MySQL, PostgreSQL), R (dasar), DAX"},
    {"category": "Analisis Statistik & Riset", "items": "SEM-PLS (SmartPLS), SPSS, Uji Hipotesis, Regresi Multivariat, Analisis Faktor, Uji Asumsi Klasik"},
    {"category": "Cloud & Machine Learning", "items": "Microsoft Azure Databricks, Apache Spark, AutoML, MLflow, Git, Jupyter Notebook"},
    {"category": "Spreadsheet & Business Intel.", "items": "Microsoft Excel (MOS Certified: Pivot Table, XLOOKUP, Nested Logic, Solver), Power BI (dasar)"}
]

# --- 2. SOSMED SPECIALIST / HUMAS ---
sosmed_summary = (
    "Seorang mahasiswa Teknik Informatika Institut Teknologi PLN dengan keahlian teruji di bidang manajemen media sosial, "
    "hubungan masyarakat (Humas), komunikasi publik, dan produksi multimedia kreatif. Berpengalaman memegang langsung akun media sosial "
    "resmi institusi (@itpln, @vokasiitpln, @itplnmedia) dan asosiasi energi terbarukan Perkumpulan Jaringan Cerdas Indonesia (@smartgridindonesia) "
    "dengan pencapaian kenaikan engagement audiens hingga 3 kali lipat. Berpengalaman mengelola portal redaksi berita resmi (pjci.or.id dan "
    "itpln.ac.id), memimpin tim produksi siaran langsung (live production) berskala nasional, serta merancang kampanye visual strategis. "
    "Siap memperkuat reputasi positif, citra merek, dan komunikasi pemangku kepentingan secara profesional."
)

sosmed_prof = [
    {
        "role": "Social Media Manager (Magang)",
        "company": "Perkumpulan Jaringan Cerdas Indonesia (PJCI)",
        "period": "Apr 2026 – Jul 2026",
        "points": [
            "Berdasarkan SK Perjanjian Kerja Magang No. 026/PJCI-Magang/SMM/2026. Memimpin perancangan strategi komunikasi digital akun resmi @smartgridindonesia seputar transisi energi bersih dan dekarbonisasi nasional.",
            "Menyusun kalender editorial bulanan, naskah copywriting, dan konten edukatif yang meningkatkan interaksi engagement audiens secara berkelanjutan.",
            "Mengkoordinasikan peliputan media sosial dan publikasi langsung (live event) untuk agenda seminar dan lokakarya ketenagalistrikan nasional."
        ]
    },
    {
        "role": "Pengelola Redaksi Website & Publikasi Berita",
        "company": "Perkumpulan Jaringan Cerdas Indonesia (PJCI)",
        "period": "Apr 2026 – Jul 2026",
        "points": [
            "Mengelola portal berita resmi pjci.or.id: menulis artikel warta energi terbarukan, siaran pers (press release) kemitraan asosiasi, dan liputan seminar.",
            "Memastikan kurasi konten faktual, terstruktur, dan sesuai standar jurnalisme korporat guna menjangkau para pemangku kepentingan industri energi."
        ]
    },
    {
        "role": "Social Media & Website Specialist",
        "company": "Bagian Humas & Stakeholder ITPLN (BHMS)",
        "period": "Okt 2025 – Sekarang",
        "points": [
            "Bertanggung jawab atas produksi konten komunikasi publik digital, penulisan artikel web portal kehumasan (itpln.ac.id), dan menjaga reputasi institusi.",
            "Mengelola kanal media sosial resmi kampus, merespons interaksi warganet, dan memelihara hubungan positif dengan pemangku kepentingan serta sivitas akademika."
        ]
    },
    {
        "role": "Social Media Manager",
        "company": "Biro Marketing & PMB ITPLN",
        "period": "Jul 2024 – Sep 2024",
        "points": [
            "Mengelola strategi konten media sosial dan promosi digital masa puncak PMB, menghasilkan lonjakan engagement audiens sebesar 3 kali lipat dan kenaikan konversi pendaftaran sebesar 20%.",
            "Memproduksi materi promosi interaktif (reels, carousel informasi beasiswa PLN, dan video testimoni) yang persuasif dan memikat calon mahasiswa."
        ]
    },
    {
        "role": "Student Ambassador",
        "company": "Institut Teknologi PLN",
        "period": "2024 – Sekarang",
        "points": [
            "Bertindak sebagai perwakilan utama institusi dalam expo pendidikan dan kunjungan sekolah, memperkuat citra dan minat calon mahasiswa melalui presentasi informatif.",
            "Mengembangkan dan menerapkan strategi penjangkauan digital yang efektif untuk meningkatkan interaksi dengan calon mahasiswa dan orang tua."
        ]
    }
]

sosmed_org = [
    {
        "role": "Deputy Manager & Direktur Kreatif",
        "company": "ITPLN Media",
        "period": "2024 – Sekarang",
        "points": [
            "Sebagai Deputi Manajer, terlibat dalam pengambilan keputusan strategis dan operasional. Sebagai Direktur Kreatif, memimpin tim desain grafis, fotografi, dan video untuk menghasilkan konten berkualitas tinggi yang konsisten.",
            "Mengawasi standar estetika konten publikasi kampus agar merefleksikan citra institusi modern, profesional, dan berdaya saing tinggi."
        ]
    },
    {
        "role": "Koordinator Divisi Creative & Concept – Video Company Profile",
        "company": "ITPLN Media",
        "period": "Apr 2025 – 2026",
        "points": [
            "Berdasarkan SK No. 001/SK/ITPLN MEDIA/APRIL/2025, memimpin penulisan alur cerita (storyline), storyboard sinematografi, dan pengarahan artistik dalam proyek produksi video profil institusi."
        ]
    },
    {
        "role": "Hubungan Masyarakat",
        "company": "Musketer ITPLN",
        "period": "2024 – Sekarang",
        "points": [
            "Membangun dan memelihara hubungan profesional dengan mitra media eksternal untuk memperluas jangkauan publisitas dan mengelola citra publik almamater."
        ]
    },
    {
        "role": "Ketua, Badan Pengurus Harian Pemuda",
        "company": "HKBP Maranatha Tebing Tinggi",
        "period": "2022 – 2023",
        "points": [
            "Memimpin organisasi kepemudaan dan berhasil menyelenggarakan program penjangkauan yang memberikan kontribusi positif bagi masyarakat sekitar."
        ]
    }
]

sosmed_projects = [
    {
        "title": "Koordinator Live Production & Siaran Langsung Acara Resmi Institusi",
        "period": "2024 – Sekarang",
        "desc": "Mengkoordinasikan tim multimedia multi-kamera untuk siaran langsung berskala besar: Wisuda ITPLN ke-46 (berdurasi 3,5+ jam dengan ribuan penonton online), Studium Generale Nuklir GINEST, dan Seremoni Ikatan Kerja PLN."
    },
    {
        "title": "Desain Visual & Identitas Acara – Wisuda ITPLN ke-46",
        "period": "2025",
        "desc": "Merancang dan mengimplementasikan seluruh identitas visual acara, materi grafis promosi, dan aset backdrop, menciptakan atmosfer megah dan profesional bagi wisudawan."
    },
    {
        "title": "Manajer Proyek – Family Gathering PT Adhi Guna Putera",
        "period": "2025",
        "desc": "Memimpin perencanaan dan eksekusi acara dari awal hingga akhir, memastikan alur kegiatan berjalan sukses dan mempererat kebersamaan antar karyawan dan keluarga."
    },
    {
        "title": "Tim Dokumentasi, Publikasi & Media – Berbagai Seminar Nasional & Internasional",
        "period": "2024 – 2025",
        "desc": "Mengelola dokumentasi visual (foto/video), publikasi warta berita, dan siaran teknis acara seminar penting (Seminar Nuklir, JACOST, Mine Excellent Indonesia, dan AMI)."
    }
]

sosmed_certs = [
    "<b>Surat Perjanjian Kerja Magang PJCI</b> – Social Media Manager & Redaksi Portal Berita (No. 026/PJCI-Magang/SMM/2026)",
    "<b>Surat Keputusan Koordinator Creative & Concept Video Company Profile</b> – ITPLN Media (SK No. 001/SK/ITPLN MEDIA/APRIL/2025)",
    "<b>Juara 1 Lomba Desain Poster Nasional Ocean Experience</b> – IPB University (2025)",
    "<b>Penerima Pendanaan DIKTI Level 1</b> untuk Program Kreativitas Mahasiswa (PKM) Kemendikbudristek (2024)",
    "<b>Microsoft Office Specialist (MOS): Microsoft Excel 2019 Certified</b> – Microsoft Corporation (2024)",
    "<b>Juara 1 Inovasi IoT LPG-SafeSense</b> – Masyarakat Ketenagalistrikan Indonesia (MKI) & ITPLN (2025)"
]

sosmed_skills = [
    {"category": "Media Sosial & Strategi Konten", "items": "Content Strategy & Planning, Copywriting, Community Engagement, Meta Business Suite, TikTok Studio, Analitik Medsos"},
    {"category": "Humas & Jurnalisme Redaksi", "items": "Penulisan Siaran Pers (Press Release), Manajemen Berita Portal Web (WordPress), Media Relations, Public Speaking"},
    {"category": "Desain Grafis & Video Editing", "items": "Adobe Photoshop, Illustrator, Premiere Pro, CapCut, Canva, Storyboarding & Creative Direction"},
    {"category": "Broadcasting & Manajemen Event", "items": "OBS Studio, vMix, Multi-camera Live Streaming, Switcher Control, Manajemen Acara & Rundown"}
]

if __name__ == "__main__":
    out_dir = r"C:\Users\manga\OneDrive\Dokumen\vcard-personal-portfolio-master\vcard-personal-portfolio-master"
    f1 = os.path.join(out_dir, "CV_Mangara_Pakpahan_Data_Analyst.pdf")
    f2 = os.path.join(out_dir, "CV_Mangara_Pakpahan_Sosmed_Humas.pdf")
    
    create_cv(f1, "DATA ANALYST • MAHASISWA TEKNIK INFORMATIKA", data_analyst_summary, data_analyst_prof, data_analyst_org, data_analyst_projects, data_analyst_certs, data_analyst_skills, manual_page_break_after_org=True)
    create_cv(f2, "SPESIALIS MEDIA SOSIAL & HUMAS • MAHASISWA TEKNIK INFORMATIKA", sosmed_summary, sosmed_prof, sosmed_org, sosmed_projects, sosmed_certs, sosmed_skills, manual_page_break_after_org=True)

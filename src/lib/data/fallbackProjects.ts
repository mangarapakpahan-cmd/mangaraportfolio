import { ProjectWithMedia } from '../types';

export const FALLBACK_PROJECTS: ProjectWithMedia[] = [
  // 1. FOH Audio-Visual & Stage
  {
    id: 'foh-01',
    workstation: 'foh_av',
    title: 'Lead FOH & Live Event Technical Operator',
    role: 'FOH Sound Engineer & Audio Director',
    event_date: 'Mei 2024',
    summary: 'Bertanggung jawab atas live sound reinforcement mixer Behringer X32, manajemen frekuensi wireless microphone, dan sinkronisasi audio panggung tanpa distorsi.',
    tech_stack: ['Behringer X32', 'Dante Network', 'Sennheiser G4', 'ProPresenter 7', 'Sony A7 III'],
    is_published: true,
    project_media: [
      {
        display_order: 1,
        camera_tag: 'CAM 01: FOH MIXER',
        caption: 'Pusat konsol mixer audio Behringer X32 32-channel',
        image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 2,
        camera_tag: 'CAM 02: STAGE VIEW',
        caption: 'Perspektif panggung utama dari posisi FOH',
        image_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 3,
        camera_tag: 'CAM 03: RACK SETUP',
        caption: 'Manajemen perutean kabel stage box dan intercom',
        image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1440&q=80',
      },
    ],
  },
  {
    id: 'foh-02',
    workstation: 'foh_av',
    title: 'Live Sound Reinforcement & Stage Intercom: Career Day ITPLN',
    role: 'Audio Systems Engineer',
    event_date: 'November 2024',
    summary: 'Pengaturan sistem audio terdistribusi bagi 1.500+ audiens di auditorium, integrasi interkom stage crew dua arah, dan multitrack recording.',
    tech_stack: ['Yamaha TF5', 'Shure QLXD', 'Audinate Dante', 'Logic Pro'],
    is_published: true,
    project_media: [
      {
        display_order: 1,
        camera_tag: 'CAM 01: FOH DESK',
        caption: 'Monitoring input gain dan wireless RF telemetry',
        image_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 2,
        camera_tag: 'CAM 02: STAGE CROWD',
        caption: 'Auditorium utama saat acara Career Day berlangsung',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1440&q=80',
      },
    ],
  },

  // 2. Operator LED & Broadcast
  {
    id: 'led-01',
    workstation: 'led_broadcast',
    title: 'Live Production & Broadcast Wisuda ITPLN ke-46: Innovating with Excellence',
    role: 'Live Production Specialist & Video Switcher Lead',
    event_date: 'Oktober 2024',
    summary: 'Memimpin produksi siaran langsung multi-kamera 3.5 jam tanpa latency, perutean sinyal switcher ATEM, dan sinkronisasi tampilan Main LED Wall megah.',
    tech_stack: ['Blackmagic ATEM', 'NovaStar H9', 'OBS Studio', 'vMix Pro', 'Sony Multi-Cam'],
    is_published: true,
    project_media: [
      {
        display_order: 1,
        camera_tag: 'CAM 01: MAIN LED WALL',
        caption: 'Feed utama visual panggung wisuda multi-display',
        image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 2,
        camera_tag: 'CAM 02: SWITCHER DESK',
        caption: 'Konsol switching ATEM & multi-view preview monitors',
        image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 3,
        camera_tag: 'CAM 03: STAGE RIGGING',
        caption: 'Inspeksi transmisi sinyal dan sending card NovaStar',
        image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1440&q=80',
      },
    ],
  },
  {
    id: 'led-02',
    workstation: 'led_broadcast',
    title: 'Live Streaming GINEST Studium Generale: Transisi Energi Nuklir',
    role: 'Technical Broadcast Director',
    event_date: 'Agustus 2024',
    summary: 'Operasional siaran langsung seminar nasional energi nuklir selama 3 jam dengan panel narasumber internasional dan feed streaming tanpa jeda.',
    tech_stack: ['OBS Studio', 'Blackmagic Web Presenter', 'Sony HXR-NX100', 'NDI Network'],
    is_published: true,
    project_media: [
      {
        display_order: 1,
        camera_tag: 'CAM 01: BROADCAST RIG',
        caption: 'Setup encoder streaming dan lower-thirds dinamis',
        image_url: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 2,
        camera_tag: 'CAM 02: KEYNOTE FEED',
        caption: 'Pemaparan materi narasumber transisi energi bersih',
        image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1440&q=80',
      },
    ],
  },

  // 3. UI/UX & Motion Design
  {
    id: 'design-01',
    workstation: 'uiux_motion',
    title: 'Desain Visual & Identitas Kreatif Apresiasi PIMNAS 37',
    role: 'Lead Visual Designer & Creative Director',
    event_date: 'September 2024',
    summary: 'Perancangan grafis poster apresiasi resmi pencapaian mahasiswa ITPLN yang lolos ke Pekan Ilmiah Mahasiswa Nasional (PIMNAS 37).',
    tech_stack: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Blender 3D'],
    is_published: true,
    project_media: [
      {
        display_order: 1,
        camera_tag: 'CAM 01: HERO POSTER',
        caption: 'Artwork poster utama kontingen riset nasional',
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 2,
        camera_tag: 'CAM 02: SOCIAL ASSETS',
        caption: 'Adaptasi carousel Instagram dan banner digital',
        image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1440&q=80',
      },
    ],
  },

  // 4. Web Dev & Software Lab
  {
    id: 'web-01',
    workstation: 'web_dev',
    title: 'Sistem Pintar IoT LPG-SafeSense & Cloud Telemetry Platform',
    role: 'Lead IoT Hardware & Web Engineer',
    event_date: 'Juli 2024',
    summary: 'Riset sensor gas MQ-6, loadcell digital, dan mikrokontroler ESP32 terhubung dashboard cloud Next.js. Meraih Juara 1 Nasional MKI & Pendanaan Riset DIKTI.',
    tech_stack: ['Next.js 14', 'TypeScript', 'ESP32 C++', 'MQTT / WebSockets', 'Tailwind CSS'],
    is_published: true,
    project_media: [
      {
        display_order: 1,
        camera_tag: 'CAM 01: HARDWARE PROTOTYPE',
        caption: 'Sirkuit proteksi kebocoran gas LPG teruji laboratorium',
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 2,
        camera_tag: 'CAM 02: TELEMETRY UI',
        caption: 'Dashboard analitik kadar gas dan sisa volume real-time',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1440&q=80',
      },
    ],
  },

  // 5. Data Analytics Hub
  {
    id: 'data-01',
    workstation: 'data_analytics',
    title: 'Pemodelan Structural Equation Modeling (SEM-PLS 120 JP) & Azure ML',
    role: 'Data Scientist & Quantitative Researcher',
    event_date: 'Agustus 2024',
    summary: 'Pemrosesan data statistik multivariat 120 JP (Educativa), uji validitas diskriminan Fornell-Larcker, serta pipeline AutoML di Azure Databricks.',
    tech_stack: ['Azure Databricks', 'Apache Spark', 'SmartPLS 4', 'SQL PostgreSQL', 'MOS Excel'],
    is_published: true,
    project_media: [
      {
        display_order: 1,
        camera_tag: 'CAM 01: PLS PATH MODEL',
        caption: 'Diagram lintasan struktural dan estimasi koefisien determinasi',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 2,
        camera_tag: 'CAM 02: AZURE NOTEBOOK',
        caption: 'Klaster komputasi terdistribusi Apache Spark Azure',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1440&q=80',
      },
    ],
  },
];

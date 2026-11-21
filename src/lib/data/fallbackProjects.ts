import { ProjectWithMedia } from '../types';

export const FALLBACK_PROJECTS: ProjectWithMedia[] = [
  // 1. FOH Audio-Visual & Stage (Exact match to reference mockup)
  {
    id: 'foh-01',
    workstation: 'foh_av',
    title: 'Lead FOH & Live Event Technical Operator',
    role: 'Lead FOH & Live Event Technical Operator',
    event_date: '19 Mei 2022',
    summary: 'Lead FOH & Live Event Technical Operator with live event audio/visual, sound system engineering, and event production.',
    tech_stack: ['Behringer X32', 'OBS Studio', 'Sony A7 III'],
    is_published: true,
    project_media: [
      {
        display_order: 1,
        camera_tag: 'CAM 01: FOH SETUP',
        caption: 'FOH Setup & Mixing Desk Console',
        image_url: '/cam1_foh_setup.jpg',
      },
      {
        display_order: 2,
        camera_tag: 'STAGE VIEW',
        caption: 'Live Concert Stage & Audience Crowd',
        image_url: '/cam2_stage_view.jpg',
      },
      {
        display_order: 3,
        camera_tag: 'STAGE VIEW 2',
        caption: 'Stage Lighting Rig & Audience Horizon',
        image_url: '/cam3_stage_view2.jpg',
      },
      {
        display_order: 4,
        camera_tag: 'STAGE VIEW',
        caption: 'FOH Console Perspective & Stage Ambience',
        image_url: '/cam4_console_side.jpg',
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
        image_url: '/cam1_foh_setup.jpg',
      },
      {
        display_order: 2,
        camera_tag: 'CAM 02: STAGE CROWD',
        caption: 'Auditorium utama saat acara Career Day berlangsung',
        image_url: '/cam2_stage_view.jpg',
      },
      {
        display_order: 3,
        camera_tag: 'CAM 03: RACK SYSTEM',
        caption: 'Stage box routing & Dante network distribution',
        image_url: '/cam3_stage_view2.jpg',
      },
      {
        display_order: 4,
        camera_tag: 'CAM 04: CROWD VIEW',
        caption: 'Sound field coverage measurement across hall',
        image_url: '/cam4_console_side.jpg',
      },
    ],
  },

  // 2. Operator LED & Broadcast
  {
    id: 'led-01',
    workstation: 'led_broadcast',
    title: 'Main LED Wall & Live Broadcast Master Control',
    role: 'Lead LED Wall Operator & Technical Director',
    event_date: 'Oktober 2024',
    summary: 'Pengendalian multi-layar Main LED Wall panggung raksasa, routing video switcher ATEM live multiviewer, dan sinkronisasi grafis broadcast.',
    tech_stack: ['NovaStar H9', 'Blackmagic ATEM 2 M/E', 'vMix Pro', 'Resolume Arena', 'Sony FX3'],
    is_published: true,
    project_media: [
      {
        display_order: 1,
        camera_tag: 'CAM 01: MAIN LED WALL',
        caption: 'Multi-screen Main LED Wall visual feeds & color bars',
        image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 2,
        camera_tag: 'CAM 02: SWITCHER DESK',
        caption: 'ATEM switcher desk & multi-view preview monitors',
        image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 3,
        camera_tag: 'CAM 03: PROCESSOR RACK',
        caption: 'NovaStar H9 sending card processor telemetry',
        image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 4,
        camera_tag: 'CAM 04: STAGE PERSPECTIVE',
        caption: 'Stage floor perspective with illuminated LED panels',
        image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1440&q=80',
      },
    ],
  },

  // 3. UI/UX & Motion Design
  {
    id: 'design-01',
    workstation: 'uiux_motion',
    title: 'Creative Motion & High-Impact Visual Design System',
    role: 'Lead Visual Designer & Motion Specialist',
    event_date: 'September 2024',
    summary: 'Perancangan identitas visual futuristik, animasi motion graphics 3D, dan display totem lightbox untuk konferensi teknologi dan event berskala besar.',
    tech_stack: ['Adobe After Effects', 'Cinema 4D', 'Figma', 'Blender 3D', 'Illustrator'],
    is_published: true,
    project_media: [
      {
        display_order: 1,
        camera_tag: 'CAM 01: MOTION TOTEM',
        caption: 'Artwork poster utama visual neon lightbox',
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 2,
        camera_tag: 'CAM 02: UI SHOWCASE',
        caption: 'Desain layout antarmuka digital dan grafis 3D',
        image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 3,
        camera_tag: 'CAM 03: BRAND PALETTE',
        caption: 'Sistem warna neon elektrik dan tipografi futuristik',
        image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 4,
        camera_tag: 'CAM 04: RENDER FINALS',
        caption: 'Render final asset motion display resolusi 4K',
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1440&q=80',
      },
    ],
  },

  // 4. Web Dev & Software Lab
  {
    id: 'web-01',
    workstation: 'web_dev',
    title: 'Sistem Pintar IoT SafeSense & Cloud Telemetry Platform',
    role: 'Lead Full-Stack Web & IoT Engineer',
    event_date: 'Juli 2024',
    summary: 'Riset sensor gas MQ-6, mikrokontroler ESP32 terhubung dashboard cloud Next.js. Meraih Juara 1 Nasional MKI & Pendanaan Riset DIKTI.',
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
      {
        display_order: 3,
        camera_tag: 'CAM 03: CLOUD ARCHITECTURE',
        caption: 'Pipeline data MQTT terenkripsi ke database relasional',
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 4,
        camera_tag: 'CAM 04: LIVE CODE ENGINE',
        caption: 'Implementasi WebSockets bi-directional data feed',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1440&q=80',
      },
    ],
  },

  // 5. Data Analytics Hub
  {
    id: 'data-01',
    workstation: 'data_analytics',
    title: 'Data Analytics & SEM-PLS Predictive Intelligence Hub',
    role: 'Lead Data Scientist & Quantitative Researcher',
    event_date: 'Agustus 2024',
    summary: 'Pemodelan analisis multivariat struktural (SEM-PLS 120 JP), clustering telemetri waktu nyata, serta visualisasi heatmap dan tren data.',
    tech_stack: ['Azure Databricks', 'Apache Spark', 'SmartPLS 4', 'SQL PostgreSQL', 'Python Pandas'],
    is_published: true,
    project_media: [
      {
        display_order: 1,
        camera_tag: 'CAM 01: HEATMAP TELEMETRY',
        caption: 'Visualisasi distribusi data spasial dan korelasi metrik',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 2,
        camera_tag: 'CAM 02: CLUSTER NOTEBOOK',
        caption: 'Klaster komputasi Apache Spark Azure Databricks',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 3,
        camera_tag: 'CAM 03: TREND FORECAST',
        caption: 'Proyeksi time-series dan evaluasi residual R-Squared',
        image_url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1440&q=80',
      },
      {
        display_order: 4,
        camera_tag: 'CAM 04: REAL-TIME MONITORS',
        caption: 'Dual screen workstation displaying real-time analytics',
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1440&q=80',
      },
    ],
  },
];

/**
 * default-data.js
 * Data bawaan (fallback / seed data) untuk portofolio.
 * Digunakan sebagai:
 * 1. Fallback instan jika Firestore masih kosong / offline / belum di-seed
 * 2. Sumber data 1-klik "Seed Demo Data" di Admin Dashboard CMS
 */

export const DEFAULT_DATA = {
  profile: {
    name: "Richard Hanrick",
    title: "Web Developer & UI/UX Designer",
    email: "richard@example.com",
    phone: "+1 (213) 352-2795",
    birthday: "June 23, 1995",
    location: "Sacramento, California, USA",
    avatarUrl: "./assets/images/my-avatar.png",
    bio: "I'm Creative Director and UI/UX Designer from Sydney, Australia, working in web development and print media. I enjoy turning complex problems into simple, beautiful and intuitive designs.\n\nMy job is to build your website so that it is functional and user-friendly but at the same time attractive. Moreover, I add personal touch to your product and make sure that it is eye-catching and easy to use. My aim is to bring across your message and identity in the most creative way. I have created web designs for many famous brand companies.",
    social_facebook: "https://facebook.com",
    social_twitter: "https://twitter.com",
    social_instagram: "https://instagram.com"
  },

  services: [
    { title: "Web Design", description: "The most modern and high-quality design made at a professional level with cutting-edge UI/UX.", iconUrl: "./assets/images/icon-design.svg", order: 1 },
    { title: "Web Development", description: "High-quality development of fast, responsive, and secure websites at the professional level.", iconUrl: "./assets/images/icon-dev.svg", order: 2 },
    { title: "Mobile Apps", description: "Professional development of cross-platform applications for iOS and Android with smooth interactions.", iconUrl: "./assets/images/icon-app.svg", order: 3 },
    { title: "Photography", description: "I make high-quality creative photos of any category at a professional level.", iconUrl: "./assets/images/icon-photo.svg", order: 4 }
  ],

  testimonials: [
    { name: "Daniel Lewis", date: "2024-05-14", avatarUrl: "./assets/images/avatar-1.png", text: "Richard was hired to create a corporate identity. We were very pleased with the work done. He has a lot of experience and is very concerned about the needs of the client. Highly recommended!" },
    { name: "Jessica Miller", date: "2024-06-20", avatarUrl: "./assets/images/avatar-2.png", text: "Richard is an exceptional developer who delivered our web portal on time with incredible attention to UI/UX details. The feedback from our users has been phenomenal." },
    { name: "Emily Evans", date: "2024-07-11", avatarUrl: "./assets/images/avatar-3.png", text: "Outstanding creative mind! Transformed our outdated web application into a sleek, fast, and modern masterpiece. Truly a pleasure to work with." },
    { name: "Henry William", date: "2024-08-02", avatarUrl: "./assets/images/avatar-4.png", text: "Working with Richard was a breeze. Great communication, high engineering standards, and top-tier aesthetic design. Delivered beyond expectations!" }
  ],

  skills: [
    { name: "Web Design (Figma, UI/UX)", percentage: 85, order: 1 },
    { name: "Frontend Development (HTML, CSS, JS)", percentage: 90, order: 2 },
    { name: "Modern Frameworks & Libraries", percentage: 80, order: 3 },
    { name: "Mobile App Development", percentage: 75, order: 4 },
    { name: "Backend & Database (Firebase, Node)", percentage: 78, order: 5 },
    { name: "Graphic Design & Branding", percentage: 70, order: 6 }
  ],

  education: [
    { institution: "University School of the Arts", period: "2017 — 2019", description: "Specialized in Digital Media, Interactive Systems, and Visual Communication Architecture.", order: 1 },
    { institution: "New York Academy of Art", period: "2014 — 2017", description: "Bachelor degree in Graphic Design, Typography, and Creative Computational Systems.", order: 2 },
    { institution: "High School of Art & Design", period: "2011 — 2014", description: "Foundation in visual arts, modern graphic composition, and foundational web technologies.", order: 3 }
  ],

  experience: [
    { position: "Creative Director", company: "Studio Alpha", period: "2022 — Present", description: "Leading design & engineering teams in building cutting-edge web products, cloud dashboards, and high-impact brand identities.", order: 1 },
    { position: "Senior Art Director", company: "Creative Minds Agency", period: "2019 — 2022", description: "Managed web and mobile UI design workflows for tech companies worldwide with focus on micro-interactions and usability.", order: 2 },
    { position: "Junior Web Developer", company: "WebCraft Solutions", period: "2017 — 2019", description: "Built responsive client portals, interactive web applications, and dynamic CMS dashboard interfaces.", order: 3 }
  ],

  projects: [
    { title: "Finance Dashboard App", category: "applications", imageUrl: "./assets/images/project-1.jpg", projectUrl: "https://github.com", order: 1 },
    { title: "Orizon UI Design System", category: "web design", imageUrl: "./assets/images/project-2.png", projectUrl: "https://github.com", order: 2 },
    { title: "Fundo Crowdfunding Web", category: "web development", imageUrl: "./assets/images/project-3.jpg", projectUrl: "https://github.com", order: 3 },
    { title: "Brawlhalla Esports Hub", category: "applications", imageUrl: "./assets/images/project-4.png", projectUrl: "https://github.com", order: 4 },
    { title: "DSM Design System", category: "web design", imageUrl: "./assets/images/project-5.png", projectUrl: "https://github.com", order: 5 },
    { title: "MetaSpark Web Platform", category: "web development", imageUrl: "./assets/images/project-6.png", projectUrl: "https://github.com", order: 6 },
    { title: "Summary AI Mobile App", category: "applications", imageUrl: "./assets/images/project-7.png", projectUrl: "https://github.com", order: 7 },
    { title: "TaskFlow Manager", category: "web development", imageUrl: "./assets/images/project-8.jpg", projectUrl: "https://github.com", order: 8 },
    { title: "Arrivals Branding & Design", category: "web design", imageUrl: "./assets/images/project-9.png", projectUrl: "https://github.com", order: 9 }
  ],

  blog: [
    { title: "Design Conferences in 2025: Trends & Insights", category: "Design", date: "2025-02-23", excerpt: "Exploring the most innovative UX design methodologies, AI interfaces, and scalable design system paradigms for the upcoming decade.", imageUrl: "./assets/images/blog-1.jpg", url: "#" },
    { title: "Best Fonts for Modern Web Interfaces", category: "Typography", date: "2025-01-18", excerpt: "A curated guide to modern sans-serifs, variable fonts, and high-legibility typographic pairings that elevate product branding.", imageUrl: "./assets/images/blog-2.jpg", url: "#" },
    { title: "Design Digest: Minimalism in Mobile UI", category: "UI/UX", date: "2024-12-10", excerpt: "How micro-interactions, intentional negative space, and intuitive gestures elevate user retention and delight.", imageUrl: "./assets/images/blog-3.jpg", url: "#" },
    { title: "Micro-animations that Wow Users", category: "Development", date: "2024-11-28", excerpt: "Crafting fluid 60fps animations with modern CSS hardware acceleration, SVG morphing, and subtle feedback cues.", imageUrl: "./assets/images/blog-4.jpg", url: "#" },
    { title: "The Next Era of Web Development", category: "Technology", date: "2024-10-15", excerpt: "From serverless databases to AI agents: how the modern web ecosystem is evolving rapidly into dynamic intelligent apps.", imageUrl: "./assets/images/blog-5.jpg", url: "#" },
    { title: "Design Systems that Scale for Teams", category: "Architecture", date: "2024-09-02", excerpt: "Building consistent design tokens, accessible components, and maintainable styles across multi-platform teams.", imageUrl: "./assets/images/blog-6.jpg", url: "#" }
  ]
};

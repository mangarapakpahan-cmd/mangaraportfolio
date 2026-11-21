-- ==============================================================================
-- DATABASE SCHEMA DDL: MCR GAMING PORTFOLIO & CMS ENGINE
-- Platform: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. Setup Custom Types / Enums
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workstation_category') THEN
        CREATE TYPE public.workstation_category AS ENUM (
            'led_broadcast',
            'foh_av',
            'uiux_motion',
            'web_dev',
            'data_analytics'
        );
    END IF;
END $$;

-- 2. Master Table: Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workstation public.workstation_category NOT NULL,
    title VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    event_date VARCHAR(100) NOT NULL DEFAULT '',
    summary TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing untuk optimasi query cepat per workstation dan status publish
CREATE INDEX IF NOT EXISTS idx_projects_workstation ON public.projects(workstation);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);

-- Trigger auto-update timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. Relational Media Table: project_media (1-to-many, 1 s/d 5 Foto per Proyek)
CREATE TABLE IF NOT EXISTS public.project_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    camera_tag VARCHAR(50) NOT NULL DEFAULT 'CAM 01: HERO',
    caption VARCHAR(255),
    display_order INT NOT NULL CHECK (display_order BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_project_order UNIQUE (project_id, display_order)
);

CREATE INDEX IF NOT EXISTS idx_project_media_proj_id ON public.project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_project_media_order ON public.project_media(display_order);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

-- Policy 1: Publik hanya dapat membaca proyek yang statusnya is_published = true
DROP POLICY IF EXISTS "Public Read Published Projects" ON public.projects;
CREATE POLICY "Public Read Published Projects" 
    ON public.projects
    FOR SELECT 
    USING (is_published = true);

-- Policy 2: Publik dapat melihat media dari proyek yang dipublikasikan
DROP POLICY IF EXISTS "Public Read Published Media" ON public.project_media;
CREATE POLICY "Public Read Published Media" 
    ON public.project_media
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE public.projects.id = public.project_media.project_id 
            AND public.projects.is_published = true
        )
    );

-- Policy 3: Authenticated User (Admin) memiliki akses CRUD penuh pada tabel projects
DROP POLICY IF EXISTS "Admin Full Access Projects" ON public.projects;
CREATE POLICY "Admin Full Access Projects" 
    ON public.projects
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Policy 4: Authenticated User (Admin) memiliki akses CRUD penuh pada tabel project_media
DROP POLICY IF EXISTS "Admin Full Access Project Media" ON public.project_media;
CREATE POLICY "Admin Full Access Project Media" 
    ON public.project_media
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- ==============================================================================
-- 5. Konfigurasi Storage Bucket 'project-media' untuk File WebP (< 200KB)
-- ==============================================================================

-- Buat storage bucket publik jika belum ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'project-media',
    'project-media',
    true,
    5242880, -- 5 MB batas maksimum mentah (akan dikompresi client-side < 200KB)
    ARRAY['image/webp', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/webp', 'image/png', 'image/jpeg'];

-- Policy Storage: Publik dapat membaca gambar dari bucket 'project-media'
DROP POLICY IF EXISTS "Public Read Project Media Bucket" ON storage.objects;
CREATE POLICY "Public Read Project Media Bucket"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'project-media');

-- Policy Storage: User terautentikasi (Admin) dapat mengunggah ke bucket 'project-media'
DROP POLICY IF EXISTS "Admin Upload Project Media Bucket" ON storage.objects;
CREATE POLICY "Admin Upload Project Media Bucket"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'project-media');

-- Policy Storage: User terautentikasi (Admin) dapat mengubah & menghapus media di bucket
DROP POLICY IF EXISTS "Admin Modify Project Media Bucket" ON storage.objects;
CREATE POLICY "Admin Modify Project Media Bucket"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'project-media');

DROP POLICY IF EXISTS "Admin Delete Project Media Bucket" ON storage.objects;
CREATE POLICY "Admin Delete Project Media Bucket"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'project-media');

-- ==============================================================================
-- 6. Initial Seed Data (Data Nyata Mangara Ferdianto Pakpahan)
-- ==============================================================================

DO $$
DECLARE
    p_led UUID;
    p_foh UUID;
    p_web UUID;
BEGIN
    -- Seed Proyek 1: LED & Broadcast
    INSERT INTO public.projects (workstation, title, role, event_date, summary, tech_stack, is_published)
    VALUES (
        'led_broadcast',
        'Live Production & Broadcast Wisuda ITPLN ke-46: Innovating with Excellence',
        'Live Production Specialist & Video Switcher Lead',
        'Oktober 2024',
        'Memimpin produksi siaran langsung multi-kamera 3.5 jam tanpa latency, perutean sinyal switcher ATEM, dan sinkronisasi tampilan Main LED Wall megah.',
        ARRAY['Blackmagic ATEM', 'NovaStar H9', 'OBS Studio', 'vMix Pro', 'Sony Multi-Cam'],
        true
    ) RETURNING id INTO p_led;

    INSERT INTO public.project_media (project_id, image_url, camera_tag, caption, display_order)
    VALUES 
        (p_led, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1440&q=80', 'CAM 01: MAIN LED WALL', 'Feed utama visual panggung wisuda', 1),
        (p_led, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1440&q=80', 'CAM 02: SWITCHER DESK', 'Konsol switching ATEM & multi-view preview', 2),
        (p_led, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1440&q=80', 'CAM 03: STAGE RIGGING', 'Inspeksi transmisi sinyal dan sending card', 3);

    -- Seed Proyek 2: FOH Audio-Visual
    INSERT INTO public.projects (workstation, title, role, event_date, summary, tech_stack, is_published)
    VALUES (
        'foh_av',
        'Lead FOH & Live Event Technical Operator',
        'FOH Engineer & Stage Audio Director',
        'Mei 2024',
        'Bertanggung jawab atas live sound reinforcement mixer Behringer X32, manajemen frekuensi wireless microphone, dan stage intercom komunikasi kru.',
        ARRAY['Behringer X32', 'Dante Network', 'Sennheiser G4', 'ProPresenter 7', 'Sony A7 III'],
        true
    ) RETURNING id INTO p_foh;

    INSERT INTO public.project_media (project_id, image_url, camera_tag, caption, display_order)
    VALUES 
        (p_foh, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1440&q=80', 'CAM 01: FOH MIXER', 'Kontrol mixer audio panggung 32-channel', 1),
        (p_foh, 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1440&q=80', 'CAM 02: STAGE VIEW', 'Perspektif panggung utama dari posisi FOH', 2);

    -- Seed Proyek 3: Web & Software Dev
    INSERT INTO public.projects (workstation, title, role, event_date, summary, tech_stack, is_published)
    VALUES (
        'web_dev',
        'Sistem IoT LPG-SafeSense & Platform Inklusi BisaKerja',
        'Lead Hardware & Software Developer',
        'Juli 2024',
        'Riset mikrokontroler gas MQ-6 & loadcell digital (Juara 1 MKI) dan rancang bangun platform aplikasi inklusi kerja sosial berbasis Next.js.',
        ARRAY['Next.js', 'TypeScript', 'ESP32 C++', 'Python', 'Tailwind CSS', 'Supabase'],
        true
    ) RETURNING id INTO p_web;

    INSERT INTO public.project_media (project_id, image_url, camera_tag, caption, display_order)
    VALUES 
        (p_web, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1440&q=80', 'CAM 01: IOT PROTOTYPE', 'Pengujian sirkuit sensor gas dan mikrokontroler', 1),
        (p_web, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1440&q=80', 'CAM 02: APP DASHBOARD', 'Tampilan antarmuka dashboard monitoring web', 2);

END $$;

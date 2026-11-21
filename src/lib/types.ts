/**
 * TypeScript Data Definitions for MCR Interactive Gaming Portfolio & CMS
 * Framework: Next.js (App Router) + Supabase
 */

// 1. Enums kategori workstation studio (sesuai PostgreSQL ENUM)
export type WorkstationCategory = 
  | 'led_broadcast' 
  | 'foh_av' 
  | 'uiux_motion' 
  | 'web_dev' 
  | 'data_analytics';

// 2. Relasi Media Foto (1-to-many, 1 s/d 5 slot per kegiatan)
export interface ProjectMedia {
  id?: string;
  project_id?: string;
  image_url: string;
  camera_tag: string; // e.g. "CAM 01: FOH SETUP"
  caption?: string | null;
  display_order: number; // 1 | 2 | 3 | 4 | 5
  created_at?: string;
}

// 3. Master Proyek dengan Relasi Array Media
export interface ProjectWithMedia {
  id: string;
  workstation: WorkstationCategory;
  title: string;
  role: string;
  event_date: string;
  summary: string;
  tech_stack: string[];
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
  project_media: ProjectMedia[];
}

// Alias kompatibilitas
export type Project = ProjectWithMedia;

// 4. Metadata Kategori untuk Tampilan Bento Grid & Dossier PDF
export interface CategoryMetadata {
  title: string;
  slug: WorkstationCategory;
  tagline: string;
  metrics: string;
  primaryHardware: string[];
  description?: string;
}

// 5. In-Game State & Camera Viewport Tracking (GTA VI Style)
export type CameraStateMode = 'free' | 'inspecting';

export interface WorkstationSpatialPosition {
  id: WorkstationCategory;
  name: string;
  position: [number, number, number];
  lookAt: [number, number, number];
  inspectCamPosition: [number, number, number];
  radarCoord: { x: number; y: number };
}

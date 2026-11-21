'use client';

import React from 'react';
import { ProjectWithMedia, WorkstationCategory } from '@/lib/types';
import DownloadPdfButton from '../pdf/DownloadPdfButton';

interface CategoryConfig {
  id: WorkstationCategory;
  title: string;
  badge: string;
  highlightMetric: string;
  description: string;
  keyHardware: string[];
}

export const CATEGORY_METADATA: Record<WorkstationCategory, CategoryConfig> = {
  foh_av: {
    id: 'foh_av',
    title: 'FOH Audio-Visual & Stage Engineering',
    badge: 'CORE SOUND & INTERCOM',
    highlightMetric: '14+ LIVE EVENTS &bull; 0% AUDIO CLIPPING',
    description: 'Manajemen perutean sinyal FOH panggung, konfigurasi digital mixer 32-channel, dan integrasi intercom multi-kru.',
    keyHardware: ['Behringer X32', 'Dante Network', 'Sennheiser G4', 'ProPresenter 7', 'Sony A7 III']
  },
  led_broadcast: {
    id: 'led_broadcast',
    title: 'LED Processor & Live Broadcasting',
    badge: 'VIDEO MATRIX & SWITCHING',
    highlightMetric: '4K PIXEL MAPPING &bull; ZERO LATENCY STREAM',
    description: 'Pemetaan piksel Main LED Wall panggung, switcher matrix multi-view, serta distribusi sinyal siaran langsung nasional.',
    keyHardware: ['NovaStar H9', 'Blackmagic ATEM', 'vMix Pro', 'OBS Studio', 'Sony Multi-Cam']
  },
  uiux_motion: {
    id: 'uiux_motion',
    title: 'Design Direction, UI/UX & Motion',
    badge: 'BRAND & VISUAL IDENTITY',
    highlightMetric: '3X ENGAGEMENT SPIKE &bull; JUARA 1 NASIONAL',
    description: 'Perancangan identitas visual korporat, antarmuka produk digital, aftermovie dinamis, dan aset promosi institusi.',
    keyHardware: ['Adobe Photoshop', 'Illustrator', 'Premiere Pro', 'Figma', 'CapCut Pro']
  },
  web_dev: {
    id: 'web_dev',
    title: 'Web Software Lab & IoT Hardware',
    badge: 'SYSTEMS & CLOUD PLATFORM',
    highlightMetric: 'NEXT.JS ARCHITECTURE &bull; JUARA 1 IOT MKI',
    description: 'Rancang bangun platform SaaS berbasis Next.js, integrasi basis data Supabase, serta rekayasa mikrokontroler sensor IoT.',
    keyHardware: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Supabase', 'ESP32 / Arduino']
  },
  data_analytics: {
    id: 'data_analytics',
    title: 'Data Analytics & Structural Modeling',
    badge: 'TELEMETRY & MACHINE LEARNING',
    highlightMetric: 'AZURE ML CERTIFIED &bull; 120 JP SEM-PLS',
    description: 'Pemrosesan data pipeline Azure Databricks, pemodelan Structural Equation Modeling (SEM-PLS), serta analisis SQL korporat.',
    keyHardware: ['Azure Databricks', 'Apache Spark', 'PostgreSQL', 'SEM-PLS Educativa', 'MOS Excel']
  }
};

interface CategoryBentoCardProps {
  category: WorkstationCategory;
  projects: ProjectWithMedia[];
  onSelectProject: (project: ProjectWithMedia) => void;
}

export default function CategoryBentoCard({
  category,
  projects,
  onSelectProject,
}: CategoryBentoCardProps) {
  const config = CATEGORY_METADATA[category];
  if (!config) return null;

  return (
    <section className="w-full mb-12">
      
      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Modul 1: Hero Role Card (Large - 5 Kolom) */}
        <div className="md:col-span-5 bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-7 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 shadow-xl">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-[10px] font-mono font-bold text-cyan-300 tracking-wider uppercase mb-3.5">
              {config.badge}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug mb-2">
              {config.title}
            </h3>
            <div 
              className="text-xs font-mono font-bold text-cyan-400 mb-3.5"
              dangerouslySetInnerHTML={{ __html: config.highlightMetric }}
            />
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6">
              {config.description}
            </p>
          </div>

          {/* Action Footer: Unduh Category Dossier PDF */}
          <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              {projects.length} Proyek Aktif
            </span>
            <DownloadPdfButton
              projects={projects}
              activeCategoryName={config.title}
              label="Export Category Brief ↓"
              className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)]"
            />
          </div>
        </div>

        {/* Modul 2: Hardware & Tech Stack Specs Card (3 Kolom) */}
        <div className="md:col-span-3 bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 shadow-xl">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-3.5">
              Hardware &amp; Toolchain Rig
            </span>
            <div className="flex flex-col space-y-2">
              {config.keyHardware.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-xs font-mono text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 text-[10px] font-mono text-slate-500">
            SPECS STATUS: CALIBRATED &bull; 60 FPS
          </div>
        </div>

        {/* Modul 3: Project Showcase Grid Cards (4 Kolom) */}
        <div className="md:col-span-4 flex flex-col space-y-3.5">
          {projects.length === 0 ? (
            <div className="h-full min-h-[160px] rounded-3xl border border-dashed border-white/10 flex items-center justify-center font-mono text-xs text-slate-600">
              NO WORKSTATION PROJECTS
            </div>
          ) : (
            projects.slice(0, 2).map((proj) => {
              const heroThumb = proj.project_media?.[0]?.image_url || '/placeholder.webp';
              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className="group relative h-40 rounded-3xl overflow-hidden border border-white/[0.06] bg-black cursor-pointer hover:border-cyan-400/70 transition-all duration-300 shadow-lg"
                >
                  <img
                    src={heroThumb}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-75 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-4 flex flex-col justify-end">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[9px] font-mono bg-cyan-950/90 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded">
                        {proj.project_media?.[0]?.camera_tag || 'CAM 01: HERO'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{proj.event_date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-snug line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {proj.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 line-clamp-1">
                      {proj.role}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </section>
  );
}

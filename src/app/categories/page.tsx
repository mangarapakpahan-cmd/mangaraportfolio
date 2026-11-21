'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ProjectWithMedia, WorkstationCategory } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import CategoryBentoCard, { CATEGORY_METADATA } from '@/components/bento/CategoryBentoCard';
import ProjectPreviewModal from '@/components/bento/ProjectPreviewModal';
import DownloadPdfButton from '@/components/pdf/DownloadPdfButton';
import { FALLBACK_PROJECTS } from '@/lib/data/fallbackProjects';

const WORKSTATION_KEYS: WorkstationCategory[] = [
  'foh_av',
  'led_broadcast',
  'uiux_motion',
  'web_dev',
  'data_analytics',
];

export default function CategoriesPage() {
  const [projects, setProjects] = useState<ProjectWithMedia[]>(FALLBACK_PROJECTS);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | WorkstationCategory>('ALL');
  const [activeModalProject, setActiveModalProject] = useState<ProjectWithMedia | null>(null);

  // Ambil data live dari Supabase projects dan project_media
  useEffect(() => {
    async function fetchLiveProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            project_media (*)
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const formatted: ProjectWithMedia[] = data.map((proj: any) => ({
            ...proj,
            project_media: (proj.project_media || []).sort(
              (a: any, b: any) => a.display_order - b.display_order
            ),
          }));
          setProjects(formatted);
        }
      } catch (err) {
        console.warn('Supabase offline / menggunakan fallback projects:', err);
      }
    }
    fetchLiveProjects();
  }, []);

  // Otomatis kelompokkan proyek berdasarkan workstation
  const categorizedProjects = useMemo(() => {
    return projects.reduce((acc, project) => {
      (acc[project.workstation] = acc[project.workstation] || []).push(project);
      return acc;
    }, {} as Record<WorkstationCategory, ProjectWithMedia[]>);
  }, [projects]);

  // Metrik agregasi
  const totalProjectsCount = projects.length;
  const uniqueTechCount = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tech_stack?.forEach((t) => set.add(t)));
    return set.size;
  }, [projects]);

  const displayedCategories = selectedFilter === 'ALL'
    ? WORKSTATION_KEYS
    : [selectedFilter];

  return (
    <main className="min-h-screen bg-[#0A0A0C] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Background Ambience Radial Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.1),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-16">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <span>&larr; RETURN TO 3D MCR STUDIO</span>
          </Link>
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              CMS DB SYNCED &bull; LIVE FEED
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/[0.06] pb-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase block mb-2">
              CATALOG DOSSIER &bull; MCR GRAND STUDIO
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Creative &amp; Technical Works
            </h1>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
              Kompilasi portofolio terverifikasi mencakup 5 pilar keahlian: Live Broadcasting, Tata Suara FOH,
              Desain Visual &amp; Gerak, Rekayasa Perangkat Lunak, dan Pemodelan Analitik Data.
            </p>
          </div>

          {/* Tombol Global Export Full Portfolio PDF */}
          <div className="flex flex-col items-start md:items-end space-y-2">
            <DownloadPdfButton
              projects={projects}
              isFullPortfolio={true}
              label="Export Full Portfolio (PDF)"
              className="px-6 py-3 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            />
            <span className="text-[10px] font-mono text-slate-500">
              Agregat: {totalProjectsCount} Proyek &bull; {uniqueTechCount} Perangkat Unik
            </span>
          </div>
        </div>

        {/* Filter Navigation Cepat (Pill Tabs) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-4 py-2 rounded-full font-mono text-xs transition-all whitespace-nowrap ${
              selectedFilter === 'ALL'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            ALL PILARS ({totalProjectsCount})
          </button>
          {WORKSTATION_KEYS.map((key) => {
            const count = (categorizedProjects[key] || []).length;
            const meta = CATEGORY_METADATA[key];
            return (
              <button
                key={key}
                onClick={() => setSelectedFilter(key)}
                className={`px-4 py-2 rounded-full font-mono text-xs transition-all whitespace-nowrap ${
                  selectedFilter === key
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {meta?.title.split('&')[0].toUpperCase()} ({count})
              </button>
            );
          })}
        </div>

        {/* Bento Grid Sections per Kategori */}
        <div className="space-y-4">
          {displayedCategories.map((key) => (
            <CategoryBentoCard
              key={key}
              category={key}
              projects={categorizedProjects[key] || []}
              onSelectProject={(proj) => setActiveModalProject(proj)}
            />
          ))}
        </div>

      </div>

      {/* Modal Lightbox Multi-Camera Screen Swap */}
      <ProjectPreviewModal
        project={activeModalProject}
        isOpen={!!activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />

    </main>
  );
}

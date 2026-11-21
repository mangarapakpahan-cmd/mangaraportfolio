'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ProjectWithMedia, WorkstationCategory } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import BentoHeader from '@/components/bento/BentoHeader';
import BentoGridContainer from '@/components/bento/BentoGridContainer';
import ProjectPreviewModal from '@/components/bento/ProjectPreviewModal';
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

  const displayedCategories = selectedFilter === 'ALL'
    ? WORKSTATION_KEYS
    : [selectedFilter];

  return (
    <main className="min-h-screen bg-mcr-black text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Background Ambience Radial Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.1),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-16">
        
        {/* Bento Header */}
        <BentoHeader
          projects={projects}
          selectedCategory={selectedFilter}
          onSelectCategory={(cat) => setSelectedFilter(cat)}
          workstationKeys={WORKSTATION_KEYS}
        />

        {/* Bento Grid Containers per Kategori */}
        <div className="space-y-4">
          {displayedCategories.map((key) => (
            <BentoGridContainer
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

'use client';

import React from 'react';
import Link from 'next/link';
import { ProjectWithMedia, WorkstationCategory } from '@/lib/types';
import CategoryBentoCard, { CATEGORY_METADATA } from './CategoryBentoCard';
import ProjectPreviewModal from './ProjectPreviewModal';
import DownloadPdfButton from '../pdf/DownloadPdfButton';

interface BentoGridViewProps {
  projects: ProjectWithMedia[];
}

const WORKSTATION_KEYS: WorkstationCategory[] = [
  'foh_av',
  'led_broadcast',
  'uiux_motion',
  'web_dev',
  'data_analytics',
];

export default function BentoGridView({ projects }: BentoGridViewProps) {
  const [activeProject, setActiveProject] = React.useState<ProjectWithMedia | null>(null);

  const categorized = React.useMemo(() => {
    return projects.reduce((acc, project) => {
      (acc[project.workstation] = acc[project.workstation] || []).push(project);
      return acc;
    }, {} as Record<WorkstationCategory, ProjectWithMedia[]>);
  }, [projects]);

  return (
    <div className="w-full min-h-screen bg-[#07090E] pt-20 pb-16 px-6 md:px-12 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider mb-3">
              MCR STUDIO FALLBACK ENGINE &bull; BENTO GRID 2D
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Master Control Room Portfolio
            </h1>
            <p className="mt-2 text-slate-400 text-sm max-w-xl">
              Akses cepat seluruh portfolio 5 zona workstation MCR dalam format 2D modern yang ringan dan responsif.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/categories"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              [FULL CATALOG DOSSIER]
            </Link>
            <DownloadPdfButton
              projects={projects}
              isFullPortfolio={true}
              className="px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-lg hover:bg-slate-200"
            />
          </div>
        </div>

        {/* Bento Cards per Kategori */}
        <div className="space-y-4">
          {WORKSTATION_KEYS.map((key) => (
            <CategoryBentoCard
              key={key}
              category={key}
              projects={categorized[key] || []}
              onSelectProject={(proj) => setActiveProject(proj)}
            />
          ))}
        </div>

      </div>

      <ProjectPreviewModal
        project={activeProject}
        isOpen={!!activeProject}
        onClose={() => setActiveProject(null)}
      />

    </div>
  );
}

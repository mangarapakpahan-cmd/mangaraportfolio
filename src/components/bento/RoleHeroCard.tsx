'use client';

import React from 'react';
import { WorkstationCategory, ProjectWithMedia } from '@/lib/types';
import DownloadPdfButton from '../pdf/DownloadPdfButton';
import { CATEGORY_METADATA } from './CategoryBentoCard';
import { Sparkles, FileText } from 'lucide-react';

interface RoleHeroCardProps {
  category: WorkstationCategory;
  projects: ProjectWithMedia[];
}

export default function RoleHeroCard({ category, projects }: RoleHeroCardProps) {
  const config = CATEGORY_METADATA[category];
  if (!config) return null;

  return (
    <div className="h-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 shadow-xl group">
      <div>
        {/* Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-[10px] font-mono font-bold text-cyan-300 tracking-wider uppercase mb-3.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>{config.badge}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-2 group-hover:text-cyan-100 transition-colors">
          {config.title}
        </h3>

        {/* Highlight Metric */}
        <div
          className="text-xs font-mono font-bold text-cyan-400 mb-3.5 tracking-wide"
          dangerouslySetInnerHTML={{ __html: config.highlightMetric }}
        />

        {/* Description */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
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
          className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)] text-xs font-mono"
        />
      </div>
    </div>
  );
}

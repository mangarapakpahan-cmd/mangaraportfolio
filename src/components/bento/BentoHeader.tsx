'use client';

import React from 'react';
import Link from 'next/link';
import { WorkstationCategory, ProjectWithMedia } from '@/lib/types';
import DownloadPdfButton from '../pdf/DownloadPdfButton';
import { CATEGORY_METADATA } from './CategoryBentoCard';
import { Sparkles, ArrowLeft, Database } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';

interface BentoHeaderProps {
  projects: ProjectWithMedia[];
  selectedCategory: 'ALL' | WorkstationCategory;
  onSelectCategory: (cat: 'ALL' | WorkstationCategory) => void;
  workstationKeys: WorkstationCategory[];
}

export default function BentoHeader({
  projects,
  selectedCategory,
  onSelectCategory,
  workstationKeys,
}: BentoHeaderProps) {
  const handleTabClick = (cat: 'ALL' | WorkstationCategory) => {
    audioEngine.playSwitchClick();
    onSelectCategory(cat);
  };

  return (
    <header className="w-full mb-10 select-none">
      
      {/* Top Navigation & Status Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
        <Link
          href="/"
          onClick={() => audioEngine.playSwitchClick()}
          className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO 3D MCR STUDIO</span>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center space-x-1">
            <Database className="w-3 h-3 text-emerald-400 mr-1" />
            <span>CMS DB SYNCED &bull; LIVE FEED</span>
          </span>
        </div>
      </div>

      {/* Main Title & Global Export Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase mb-3">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>CATALOG DOSSIER &bull; MCR GRAND STUDIO</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Creative &amp; Technical Works
          </h1>
          <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed">
            Kompilasi portofolio terverifikasi mencakup 5 pilar keahlian: Live Broadcasting, Tata Suara FOH,
            Desain Visual &amp; Gerak, Rekayasa Perangkat Lunak, dan Pemodelan Analitik Data.
          </p>
        </div>

        {/* Global Export Full Portfolio Button */}
        <div className="flex flex-col items-start md:items-end space-y-1.5 shrink-0">
          <DownloadPdfButton
            projects={projects}
            isFullPortfolio={true}
            label="Export Full Portfolio (PDF)"
            className="px-6 py-3 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 shadow-[0_0_25px_rgba(255,255,255,0.2)] text-xs tracking-wide"
          />
          <span className="text-[10px] font-mono text-slate-500">
            {projects.length} Proyek Aktif &bull; ISO Ready Sheet
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleTabClick('ALL')}
          className={`px-4 py-2 rounded-full font-mono text-xs transition-all whitespace-nowrap ${
            selectedCategory === 'ALL'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          ALL PILARS ({projects.length})
        </button>

        {workstationKeys.map((key) => {
          const count = projects.filter((p) => p.workstation === key).length;
          const meta = CATEGORY_METADATA[key];
          const isSelected = selectedCategory === key;
          return (
            <button
              key={key}
              onClick={() => handleTabClick(key)}
              className={`px-4 py-2 rounded-full font-mono text-xs transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {meta ? meta.title.split('&')[0].trim().toUpperCase() : key.toUpperCase()} ({count})
            </button>
          );
        })}
      </div>

    </header>
  );
}

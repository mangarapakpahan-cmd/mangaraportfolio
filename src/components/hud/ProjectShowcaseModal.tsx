'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '@/lib/store';
import { ProjectWithMedia } from '@/lib/types';
import { audioEngine } from '@/lib/audioEngine';
import { Maximize2, X, Eye, Video, Sparkles, RefreshCw } from 'lucide-react';
import CardFlipViewer from './CardFlipViewer';

interface ProjectShowcaseModalProps {
  projects: ProjectWithMedia[];
}

export default function ProjectShowcaseModal({ projects }: ProjectShowcaseModalProps) {
  const {
    isProjectModalOpen,
    closeProjectModal,
    openProjectModal,
    nearbyZone,
    activeProject: storeActiveProject,
  } = useGameStore();

  const [activeSlot, setActiveSlot] = useState(1);
  const [isFlippedView, setIsFlippedView] = useState(false);

  // Cari proyek terkait untuk workstation yang sedang aktif
  const currentProject = useMemo(() => {
    if (storeActiveProject) return storeActiveProject;
    if (nearbyZone && nearbyZone !== 'server_rack') {
      const match = projects.find((p) => p.workstation === nearbyZone);
      if (match) return match;
    }
    return projects[0];
  }, [projects, nearbyZone, storeActiveProject]);

  // Ambil minimal 4 media slot
  const mediaList = useMemo(() => {
    const list = currentProject?.project_media || [];
    if (list.length >= 4) return list.slice(0, 4);

    return [
      list[0] || { display_order: 1, camera_tag: 'CAM 01: FOH SETUP', image_url: '/cam1_foh_setup.jpg' },
      list[1] || { display_order: 2, camera_tag: 'STAGE VIEW', image_url: '/cam2_stage_view.jpg' },
      list[2] || { display_order: 3, camera_tag: 'STAGE VIEW 2', image_url: '/cam3_stage_view2.jpg' },
      list[3] || { display_order: 4, camera_tag: 'STAGE VIEW', image_url: '/cam4_console_side.jpg' },
    ];
  }, [currentProject]);

  const handleSelectSlot = (order: number) => {
    audioEngine.playSwitchClick();
    setActiveSlot(order);
  };

  // Keyboard shortcut [ESC] untuk menutup modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isProjectModalOpen) {
        closeProjectModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProjectModalOpen, closeProjectModal]);

  // Tombol pemicu saat diminimalkan di sudut kanan bawah
  if (!isProjectModalOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-30 pointer-events-auto select-none">
        <button
          onClick={() => {
            audioEngine.playTerminalBoot();
            openProjectModal(currentProject);
          }}
          className="group relative flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-mcr-black/90 hover:bg-mcr-surface border border-mcr-cyan/50 hover:border-mcr-cyan text-mcr-cyan font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-[0_0_25px_rgba(6,182,212,0.35)] active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-mcr-cyan animate-ping" />
          <Maximize2 className="w-3.5 h-3.5" />
          <span>[F] PROJECT SHOWCASE HUD</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-30 pointer-events-auto select-none w-[94vw] sm:w-[540px] md:w-[620px] lg:w-[660px] transition-all duration-300">
      
      {/* HUD Container Panel dengan Neon Cyan Borders & Bracket Corners */}
      <div className="relative rounded-2xl bg-mcr-surface/90 backdrop-blur-xl border border-mcr-cyan/40 shadow-[0_0_35px_rgba(6,182,212,0.25)] p-4 sm:p-5 overflow-hidden">
        
        {/* Sudut Siku-Siku Cyan (GTA & Sci-Fi HUD Bracket Corners) */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-mcr-cyan pointer-events-none" />
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-mcr-cyan pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-mcr-cyan pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-mcr-cyan pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-mcr-cyan animate-pulse shadow-[0_0_6px_#06b6d4]" />
            <h3 className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-mcr-cyan uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
              Project Showcase HUD modal
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                audioEngine.playSwitchClick();
                setIsFlippedView(!isFlippedView);
              }}
              className="text-[10px] font-mono font-bold text-mcr-pink hover:text-white px-2 py-0.5 rounded bg-white/[0.04] border border-mcr-pink/40 hover:border-mcr-pink transition-all flex items-center space-x-1"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>[3D FLIP]</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playSwitchClick();
                closeProjectModal();
              }}
              className="flex items-center space-x-1 text-[10px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            >
              <span className="hidden sm:inline">[ESC]</span>
              <span>RETURN TO STUDIO</span>
              <X className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

        {/* Title Proyek Utama */}
        <div className="mb-3.5 flex items-start justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {currentProject?.title || 'Lead FOH & Live Event Technical Operator'}
            </h2>
            <div className="text-[11px] font-mono text-mcr-cyan mt-0.5 flex items-center space-x-2">
              <span>WORKSTATION: {currentProject?.workstation?.toUpperCase()}</span>
              <span>&bull;</span>
              <span className="text-emerald-400">STATUS: VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Main Content: Split Grid (Left: 2x2 Matrix, Right: Info & Metadata) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          
          {/* SISI KIRI: 2x2 Multi-Cam Screen Matrix (7 Kolom) */}
          <div className="sm:col-span-7">
            {isFlippedView ? (
              <div className="h-48 sm:h-56 w-full">
                <CardFlipViewer
                  frontImage={mediaList[0]?.image_url || '/cam1_foh_setup.jpg'}
                  frontTag={mediaList[0]?.camera_tag || 'CAM 01: HERO'}
                  frontTitle={currentProject?.title || 'Engineering Schematics'}
                  specs={[
                    { label: 'Signal Quality', value: '100% Uncompressed' },
                    { label: 'Latency', value: '< 1.2ms (Dante)' },
                    { label: 'Output Matrix', value: '4K UltraHD 60FPS' },
                    { label: 'Encryption', value: 'AES-256 Bit' },
                  ]}
                  hardwareList={currentProject?.tech_stack || ['Behringer X32', 'NovaStar H9', 'OBS']}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {mediaList.map((media, idx) => {
                  const isActive = activeSlot === media.display_order;
                  return (
                    <div
                      key={media.display_order || idx}
                      onClick={() => handleSelectSlot(media.display_order)}
                      className={`group relative h-24 sm:h-28 rounded-lg overflow-hidden border cursor-pointer transition-all duration-200 bg-black shadow-md ${
                        isActive
                          ? 'border-mcr-cyan ring-1 ring-mcr-cyan/80 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                          : 'border-white/[0.12] hover:border-cyan-400/60 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={media.image_url}
                        alt={media.camera_tag || `Camera ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Dark gradient for badge legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                      {/* Camera Tag Pill */}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                        <span className="text-[9px] font-mono font-bold tracking-tight bg-black/80 px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-800/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] truncate">
                          {media.camera_tag || `CAM 0${idx + 1}`}
                        </span>

                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-mcr-cyan animate-ping shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SISI KANAN: Project Metadata Details (5 Kolom) */}
          <div className="sm:col-span-5 flex flex-col justify-between space-y-2.5 text-left font-sans">
            
            <div className="space-y-2">
              {/* Role */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Role:</span>
                <span className="text-xs font-semibold text-white leading-tight block">
                  {currentProject?.role || 'Lead FOH & Live Event Technical Operator'}
                </span>
              </div>

              {/* Date */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Date:</span>
                <span className="text-xs font-mono text-slate-200">
                  {currentProject?.event_date || '19 Mei 2022'}
                </span>
              </div>

              {/* Description */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Description:</span>
                <p className="text-[11px] text-slate-300 leading-snug line-clamp-3">
                  {currentProject?.summary ||
                    'Operasional sound system digital 32-channel, routing kabel multicore, serta live sound mixing untuk ribuan audiens konser.'}
                </p>
              </div>

              {/* Tech Stack Badges */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase mb-1">
                  Tech Stack:
                </span>
                <div className="flex flex-wrap gap-1">
                  {(currentProject?.tech_stack || ['Behringer X32', 'OBS Studio', 'Sony A7 III']).map(
                    (tech, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-cyan-300"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* In-Universe Sub-Footer */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>MATRIX FEED: ACTIVE</span>
              <span className="text-mcr-cyan uppercase">CALIBRATED</span>
            </div>

          </div>

        </div>

        {/* Bottom Banner [ESC] CLOSE / RETURN TO ROAMING */}
        <div className="mt-3.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400">MCR ARCHIVE &bull; SECURE READ-ONLY</span>
          <button
            onClick={() => {
              audioEngine.playSwitchClick();
              closeProjectModal();
            }}
            className="text-mcr-cyan hover:text-white transition-colors uppercase font-bold tracking-wider"
          >
            [ESC] CLOSE / RETURN TO ROAMING
          </button>
        </div>

      </div>

    </div>
  );
}

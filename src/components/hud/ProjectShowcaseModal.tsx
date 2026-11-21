'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '@/lib/store';
import { ProjectWithMedia } from '@/lib/types';
import { audioEngine } from '@/lib/audioEngine';

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

  // Ambil proyek yang aktif berdasarkan workstation saat ini
  const currentProject = useMemo(() => {
    if (storeActiveProject) return storeActiveProject;
    if (nearbyZone && nearbyZone !== 'server_rack') {
      const match = projects.find((p) => p.workstation === nearbyZone);
      if (match) return match;
    }
    return projects[0];
  }, [projects, nearbyZone, storeActiveProject]);

  // Slot kamera yang aktif (1 sampai 4)
  const [activeSlot, setActiveSlot] = useState(1);

  // Daftar media (pastikan minimal 4 slot untuk 2x2 matrix)
  const mediaList = useMemo(() => {
    const list = currentProject?.project_media || [];
    if (list.length >= 4) return list.slice(0, 4);

    // Fallback slot camera jika media kurang dari 4
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

  // Keyboard shortcut [ESC] untuk menutup / membuka modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isProjectModalOpen) {
        closeProjectModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProjectModalOpen, closeProjectModal]);

  // Jika modal diminimalkan, tampilkan tombol pemicu minimal di sudut kanan bawah
  if (!isProjectModalOpen) {
    return (
      <div className="absolute bottom-6 right-6 z-30 pointer-events-auto select-none">
        <button
          onClick={() => {
            audioEngine.playTerminalBoot();
            openProjectModal(currentProject);
          }}
          className="group flex items-center space-x-2 bg-[#070d18]/90 hover:bg-cyan-950/80 border border-cyan-500/80 px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all font-mono text-xs cursor-pointer"
        >
          <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold text-[11px] shadow-[0_0_8px_rgba(6,182,212,0.6)]">
            [F]
          </span>
          <span className="font-bold text-slate-100 group-hover:text-cyan-300 tracking-wider">
            PROJECT SHOWCASE HUD
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-6 right-6 z-30 pointer-events-auto select-none flex flex-col items-end">
      
      {/* Box Utama HUD Modal (Exact match to reference mockup) */}
      <div 
        className="w-[520px] max-w-[94vw] bg-[#070d18]/92 backdrop-blur-xl border border-cyan-500/70 rounded-xl p-4 shadow-[0_0_35px_rgba(6,182,212,0.3)] relative text-slate-100 font-sans animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sudut Cyberpunk Glowing Brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

        {/* Baris 1: Header Teks & Return Button */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-800/40 font-mono">
          <span className="text-[11px] font-bold text-cyan-400 tracking-wider">
            Project Showcase HUD modal
          </span>
          <button
            onClick={closeProjectModal}
            className="text-[10px] text-cyan-300 hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>[ESC] RETURN TO STUDIO</span>
          </button>
        </div>

        {/* Baris 2: Judul Proyek & Tombol Close */}
        <div className="flex items-center justify-between pb-2.5">
          <h3 className="text-sm font-bold text-white tracking-wide truncate pr-2">
            {currentProject.title}
          </h3>
          <button
            onClick={closeProjectModal}
            className="text-slate-400 hover:text-white text-sm font-mono cursor-pointer transition-colors"
            title="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Baris 3: Dua Kolom (Kiri: 2x2 Camera Matrix, Kanan: Detail & Tech Stack) */}
        <div className="grid grid-cols-2 gap-3.5">
          
          {/* Kolom Kiri: 2x2 Multi-Cam Screen Swap Matrix */}
          <div className="grid grid-cols-2 gap-2">
            {mediaList.map((media, idx) => {
              const slotNum = idx + 1;
              const isActive = activeSlot === slotNum;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectSlot(slotNum)}
                  className={`relative rounded-md overflow-hidden bg-black cursor-pointer transition-all ${
                    isActive
                      ? 'border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-[1.02]'
                      : 'border border-cyan-800/50 hover:border-cyan-500/80 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="aspect-video w-full bg-slate-950 overflow-hidden">
                    <img
                      src={media.image_url}
                      alt={media.camera_tag}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="bg-[#050913]/90 px-1.5 py-0.5 text-center border-t border-cyan-900/60">
                    <span className="text-[8.5px] font-mono font-bold text-cyan-300 tracking-wider truncate block">
                      {media.camera_tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kolom Kanan: Info Role, Date, Description, Tech Stack */}
          <div className="flex flex-col justify-between text-xs font-sans space-y-1.5 leading-relaxed text-slate-300">
            <div>
              <p className="text-[11px] text-slate-200">
                <span className="font-bold text-white">Role:</span> {currentProject.role}
              </p>
              <p className="text-[11px] text-slate-200 mt-1">
                <span className="font-bold text-white">Date:</span> {currentProject.event_date}
              </p>
              <p className="text-[10px] text-slate-300 mt-1 line-clamp-3">
                <span className="font-bold text-white">Description:</span> {currentProject.summary}
              </p>
            </div>

            <div className="pt-1.5 border-t border-cyan-900/40">
              <span className="font-bold text-[10.5px] text-white block mb-1">
                Tech Stack:
              </span>
              <p className="text-[10px] font-mono text-cyan-300/90 leading-tight">
                {currentProject.tech_stack.join(', ')}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Teks Bawah Modal (Exact match to reference mockup) */}
      <div 
        onClick={closeProjectModal}
        className="mt-2 text-[10px] font-mono text-amber-300/80 hover:text-amber-200 tracking-wider cursor-pointer"
      >
        [ESC] CLOSE / RETURN TO ROAMING
      </div>

    </div>
  );
}

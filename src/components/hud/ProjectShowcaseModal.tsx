'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '@/lib/store';
import { ProjectWithMedia, WorkstationCategory } from '@/lib/types';
import { WORKSTATION_SPATIAL_DATA } from '../3d/StudioScene';
import { audioEngine } from '@/lib/audioEngine';

interface ProjectShowcaseModalProps {
  projects: ProjectWithMedia[];
}

export default function ProjectShowcaseModal({ projects }: ProjectShowcaseModalProps) {
  const {
    isProjectModalOpen,
    closeProjectModal,
    exitInspect,
    nearbyZone,
  } = useGameStore();

  // Filter semua proyek yang terkait dengan workstation aktif
  const workstationProjects = useMemo(() => {
    if (!nearbyZone || nearbyZone === 'server_rack') return [];
    return projects.filter((p) => p.workstation === nearbyZone);
  }, [projects, nearbyZone]);

  // Index proyek yang sedang aktif di workstation ini (jika ada lebih dari 1 kegiatan)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  // Slot kamera yang sedang aktif di viewport utama (Slot 1 sampai 5)
  const [activeCameraSlot, setActiveCameraSlot] = useState(1);

  // Reset slot dan index saat workstation berubah atau modal dibuka
  useEffect(() => {
    if (isProjectModalOpen) {
      audioEngine.playTerminalBoot();
      setCurrentProjectIndex(0);
      setActiveCameraSlot(1);
    }
  }, [nearbyZone, isProjectModalOpen]);

  const handleSelectSlot = (slot: number) => {
    audioEngine.playSwitchClick();
    setActiveCameraSlot(slot);
  };

  const handleNextProject = () => {
    audioEngine.playSwitchClick();
    setCurrentProjectIndex((prev) => (prev + 1) % workstationProjects.length);
    setActiveCameraSlot(1);
  };

  const handlePrevProject = () => {
    audioEngine.playSwitchClick();
    setCurrentProjectIndex((prev) => (prev - 1 + workstationProjects.length) % workstationProjects.length);
    setActiveCameraSlot(1);
  };

  // Shortcut keyboard: [ESC] untuk keluar, [ArrowLeft] & [ArrowRight] untuk ganti proyek
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isProjectModalOpen) return;

      if (e.key === 'Escape') {
        closeProjectModal();
        exitInspect();
      } else if (e.key === 'ArrowRight' && workstationProjects.length > 1) {
        setCurrentProjectIndex((prev) => (prev + 1) % workstationProjects.length);
        setActiveCameraSlot(1);
      } else if (e.key === 'ArrowLeft' && workstationProjects.length > 1) {
        setCurrentProjectIndex((prev) => (prev - 1 + workstationProjects.length) % workstationProjects.length);
        setActiveCameraSlot(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProjectModalOpen, workstationProjects.length, closeProjectModal, exitInspect]);

  if (!isProjectModalOpen || workstationProjects.length === 0) return null;

  const currentProject = workstationProjects[currentProjectIndex] || workstationProjects[0];
  const activeMedia =
    currentProject.project_media?.find((m) => m.display_order === activeCameraSlot) ||
    currentProject.project_media?.[0];

  const workstationMeta = WORKSTATION_SPATIAL_DATA.find((ws) => ws.id === nearbyZone);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-end p-4 md:p-8 bg-slate-950/45 backdrop-blur-[2px]">
      
      {/* Box HUD Modal bergaya Master Control Room */}
      <div 
        className="pointer-events-auto w-full max-w-2xl bg-slate-900/95 border border-cyan-500/70 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.35)] overflow-hidden font-sans text-slate-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar HUD */}
        <div className="flex items-center justify-between px-5 py-3 bg-cyan-950/70 border-b border-cyan-800/80">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300">
              Project Showcase HUD modal &bull; {workstationMeta?.name || 'WORKSTATION HUB'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
              {/* Navigasi Proyek Sebelumnya / Selanjutnya jika > 1 Proyek di Workstation */}
              {workstationProjects.length > 1 && (
                <div className="flex items-center space-x-1.5 bg-black/60 px-2 py-0.5 rounded border border-cyan-800 text-[10px] font-mono text-cyan-300">
                  <button
                    onClick={handlePrevProject}
                    className="hover:text-white px-1"
                    title="Proyek Sebelumnya"
                  >
                    &larr;
                  </button>
                  <span>
                    PROJ {currentProjectIndex + 1}/{workstationProjects.length}
                  </span>
                  <button
                    onClick={handleNextProject}
                    className="hover:text-white px-1"
                    title="Proyek Selanjutnya"
                  >
                    &rarr;
                  </button>
                </div>
              )}

            <button
              onClick={() => {
                closeProjectModal();
                exitInspect();
              }}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center space-x-1"
            >
              <span>[ESC] RETURN TO STUDIO</span>
            </button>
          </div>
        </div>

        {/* Grid Konten: Multi-Cam Viewport (Kiri) + Info Detail (Kanan) */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Sisi Kiri: Multi-Cam Screen Swap Matrix */}
          <div className="flex flex-col space-y-2.5">
            {/* Viewport Layar Utama (Slot Aktif) */}
            <div className="relative aspect-video bg-black rounded-xl border border-cyan-700/60 overflow-hidden shadow-inner group">
              <img
                src={activeMedia?.image_url || '/placeholder.webp'}
                alt={activeMedia?.caption || currentProject.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Badge Camera Feed Tag */}
              <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md border border-cyan-500/80 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 font-bold">
                {activeMedia?.camera_tag || `CAM 0${activeCameraSlot}: ACTIVE`}
              </div>
              {/* Caption Overlay */}
              {activeMedia?.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 to-transparent p-2 text-[10px] text-slate-300 truncate">
                  {activeMedia.caption}
                </div>
              )}
            </div>

            {/* Thumbnail Slots 1-5 untuk Screen Swap Instan */}
            <div className="grid grid-cols-4 gap-1.5">
              {currentProject.project_media?.map((item) => (
                <button
                  key={item.display_order}
                  onClick={() => handleSelectSlot(item.display_order)}
                  className={`relative aspect-video rounded-lg overflow-hidden border transition-all ${
                    activeCameraSlot === item.display_order
                      ? 'border-cyan-400 ring-2 ring-cyan-500/50 scale-105 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                      : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                  }`}
                >
                  <img src={item.image_url} alt={item.camera_tag} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/90 text-[7.5px] font-mono text-cyan-300 truncate px-1">
                    {item.camera_tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sisi Kanan: Spesifikasi Proyek & Hardware Rig */}
          <div className="flex flex-col justify-between text-xs space-y-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-snug mb-1">
                {currentProject.title}
              </h2>
              
              <div className="flex flex-col space-y-0.5 text-[11px] font-mono mb-2">
                <span className="text-cyan-400">
                  Role: <span className="text-slate-300 font-sans">{currentProject.role}</span>
                </span>
                <span className="text-cyan-400">
                  Date: <span className="text-slate-300 font-sans">{currentProject.event_date}</span>
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px] line-clamp-4 border-t border-slate-800 pt-2">
                {currentProject.summary}
              </p>
            </div>

            {/* Tech Stack & Hardware Badges */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
                Integrated Hardware &amp; Toolchain:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentProject.tech_stack?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-800 text-[10px] font-mono text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Bar HUD Shortcut */}
        <div className="px-5 py-2 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>MCR VIDEO SWITCHER: 60.5 FPS FEED</span>
          </div>
          <span className="text-cyan-400">[ESC] CLOSE / RETURN TO ROAMING</span>
        </div>

      </div>
    </div>
  );
}

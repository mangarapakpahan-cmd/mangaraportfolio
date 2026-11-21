'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '@/lib/store';

export default function ProjectModal() {
  const {
    isProjectModalOpen,
    activeProject,
    closeProjectModal,
    activeCameraSlot,
    setActiveCameraSlot,
    exitInspect,
  } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProjectModal();
        exitInspect();
      }
    };
    if (isProjectModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProjectModalOpen, closeProjectModal, exitInspect]);

  if (!isProjectModalOpen || !activeProject) return null;

  const currentMedia =
    activeProject.project_media?.find((m) => m.display_order === activeCameraSlot) ||
    activeProject.project_media?.[0];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-end p-4 md:p-8 bg-slate-950/40 backdrop-blur-[2px]">
      <div className="pointer-events-auto w-full max-w-2xl bg-slate-900/90 border border-cyan-500/70 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.35)] overflow-hidden font-sans text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header HUD Modal */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-cyan-950/70 border-b border-cyan-800/80">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300">
              Project Showcase HUD modal
            </span>
          </div>
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

        {/* Konten Utama */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Sisi Kiri: Multi-View Swap Screen Matrix */}
          <div className="flex flex-col space-y-2">
            {/* Layar Utama Slot Aktif */}
            <div className="relative aspect-video bg-black rounded-lg border border-cyan-700/60 overflow-hidden shadow-inner group">
              <img
                src={currentMedia?.image_url || '/placeholder.webp'}
                alt={currentMedia?.caption || activeProject.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2 bg-slate-950/85 border border-cyan-500/80 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300">
                {currentMedia?.camera_tag || `CAM 0${activeCameraSlot}`}
              </div>
            </div>

            {/* Thumbnail Slots (Slot 1-5) untuk Swap Instan */}
            <div className="grid grid-cols-4 gap-1.5">
              {activeProject.project_media?.map((item) => (
                <button
                  key={item.display_order}
                  onClick={() => setActiveCameraSlot(item.display_order)}
                  className={`relative aspect-video rounded-md overflow-hidden border transition-all ${
                    activeCameraSlot === item.display_order
                      ? 'border-cyan-400 ring-2 ring-cyan-500/50 scale-105'
                      : 'border-slate-700 opacity-60 hover:opacity-100'
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

          {/* Sisi Kanan: Detail Informasi Proyek */}
          <div className="flex flex-col justify-between text-xs space-y-2">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-snug mb-1">
                {activeProject.title}
              </h2>
              <div className="text-cyan-400 font-mono text-[11px] mb-0.5">
                Role: <span className="text-slate-300 font-sans">{activeProject.role}</span>
              </div>
              <div className="text-cyan-400 font-mono text-[11px] mb-2">
                Date: <span className="text-slate-300 font-sans">{activeProject.event_date}</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] line-clamp-4">
                {activeProject.summary}
              </p>
            </div>

            {/* Tech Stack Badges */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1 uppercase tracking-wider">
                Tech Stack / Hardware:
              </span>
              <div className="flex flex-wrap gap-1">
                {activeProject.tech_stack?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-[10px] font-mono text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer HUD Shortcut */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>STATUS: FEED ACTIVE</span>
          <span className="text-cyan-400">[ESC] CLOSE / RETURN TO ROAMING</span>
        </div>

      </div>
    </div>
  );
}

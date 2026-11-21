'use client';

import React, { useState } from 'react';
import { ProjectWithMedia } from '@/lib/types';
import { useGameStore } from '@/lib/store';
import { audioEngine } from '@/lib/audioEngine';
import { X, Camera, Calendar, User, Wrench } from 'lucide-react';

interface ProjectModalProps {
  projects: ProjectWithMedia[];
}

export default function ProjectModal({ projects }: ProjectModalProps) {
  const { isProjectModalOpen, closeProjectModal, activeProject } = useGameStore();
  const [selectedSlot, setSelectedSlot] = useState(1);

  if (!isProjectModalOpen || !activeProject) return null;

  const currentMedia = activeProject.project_media.find(
    (m) => m.display_order === selectedSlot
  ) || activeProject.project_media[0];

  const handleSelectSlot = (slot: number) => {
    audioEngine.playSwitchClick();
    setSelectedSlot(slot);
  };

  const handleClose = () => {
    audioEngine.playSwitchClick();
    closeProjectModal();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-end p-4 md:p-8 bg-slate-950/40">
      <div className="pointer-events-auto w-full max-w-4xl bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col md:flex-row text-slate-100 max-h-[85vh]">
        
        {/* Left Side: Viewport Kamera Utama */}
        <div className="w-full md:w-3/5 p-4 flex flex-col justify-between bg-black/60">
          <div>
            {/* Main Stage Viewport */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-black group">
              {currentMedia ? (
                <img
                  src={currentMedia.image_url}
                  alt={currentMedia.caption || activeProject.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-150"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-xs text-slate-500">
                  NO FEED SIGNAL
                </div>
              )}
              
              {/* Camera Tag Badge */}
              <div className="absolute top-3 left-3 bg-black/80 border border-cyan-500/60 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-cyan-300">
                {currentMedia?.camera_tag || `SLOT ${selectedSlot}`}
              </div>
            </div>

            {/* 5-Slot Camera Matrix Switcher */}
            <div className="grid grid-cols-5 gap-2 mt-3">
              {[1, 2, 3, 4, 5].map((slot) => {
                const media = activeProject.project_media.find((m) => m.display_order === slot);
                const isActive = selectedSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => handleSelectSlot(slot)}
                    aria-label={`Switch to slot ${slot}`}
                    className={`relative aspect-video rounded-md overflow-hidden border transition-colors duration-150 ${
                      isActive
                        ? 'border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {media ? (
                      <img src={media.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-950 flex items-center justify-center font-mono text-[9px] text-slate-600">
                        EMPTY
                      </div>
                    )}
                    <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-cyan-400 font-bold">
                      #{slot}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caption */}
          {currentMedia?.caption && (
            <p className="mt-2 text-xs font-mono text-slate-400 italic line-clamp-2">
              &gt; {currentMedia.caption}
            </p>
          )}
        </div>

        {/* Right Side: Metadata Proyek */}
        <div className="w-full md:w-2/5 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900/60">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                {activeProject.workstation.toUpperCase()} FEED
              </span>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close modal"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-xl font-bold mt-3 text-white leading-tight">
              {activeProject.title}
            </h2>

            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="flex items-center space-x-2 text-slate-300">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>{activeProject.role}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{activeProject.event_date}</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-300 leading-relaxed font-sans line-clamp-4">
              {activeProject.summary}
            </p>

            <div className="mt-4">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-2">
                Tech Stack &amp; Hardware:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.tech_stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>PRESS [ESC] TO CLOSE</span>
            <button
              type="button"
              onClick={handleClose}
              className="text-cyan-400 hover:text-cyan-300 font-bold"
            >
              RETURN TO ROAMING &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

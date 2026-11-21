'use client';

import React, { useState } from 'react';
import { ProjectWithMedia } from '@/lib/types';
import { X, Calendar, User, Wrench, Camera } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';

interface ProjectPreviewModalProps {
  project: ProjectWithMedia | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectPreviewModal({
  project,
  isOpen,
  onClose,
}: ProjectPreviewModalProps) {
  const [selectedSlot, setSelectedSlot] = useState(1);

  if (!isOpen || !project) return null;

  const currentMedia = project.project_media.find(
    (m) => m.display_order === selectedSlot
  ) || project.project_media[0];

  const handleSelectSlot = (slot: number) => {
    audioEngine.playSwitchClick();
    setSelectedSlot(slot);
  };

  const handleClose = () => {
    audioEngine.playSwitchClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Sisi Kiri: Viewport Multi-Kamera */}
        <div className="w-full md:w-3/5 p-5 bg-black/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-bold uppercase">
                {project.workstation} &bull; MULTI-CAM FEED
              </span>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close modal"
                className="font-mono text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 transition-colors"
              >
                [ESC] CLOSE
              </button>
            </div>

            {/* Main Screen Viewport */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-black group">
              {currentMedia ? (
                <img
                  src={currentMedia.image_url}
                  alt={currentMedia.caption || project.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-150"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-xs text-slate-600">
                  NO SIGNAL DETECTED
                </div>
              )}

              <div className="absolute top-3 left-3 bg-black/90 border border-cyan-500/60 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-cyan-300">
                {currentMedia?.camera_tag || `CAM 0${selectedSlot}`}
              </div>
            </div>

            {/* 5-Slot Thumbnail Matrix */}
            <div className="grid grid-cols-5 gap-2 mt-3">
              {[1, 2, 3, 4, 5].map((slot) => {
                const media = project.project_media.find((m) => m.display_order === slot);
                const isActive = selectedSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => handleSelectSlot(slot)}
                    aria-label={`Select camera slot ${slot}`}
                    className={`relative aspect-video rounded-lg overflow-hidden border transition-colors duration-150 ${
                      isActive
                        ? 'border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {media ? (
                      <img src={media.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-950 flex items-center justify-center font-mono text-[9px] text-slate-600">
                        OFF
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

          {currentMedia?.caption && (
            <p className="mt-3 text-xs font-mono text-slate-400 italic">
              &gt; {currentMedia.caption}
            </p>
          )}
        </div>

        {/* Sisi Kanan: Metadata & Spesifikasi */}
        <div className="w-full md:w-2/5 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 bg-slate-900">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] font-mono text-slate-400">
                PROJECT DOSSIER
              </span>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close modal button"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold mt-4 text-white leading-tight">
              {project.title}
            </h3>

            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="flex items-center space-x-2 text-slate-300">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>{project.role}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{project.event_date}</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-300 leading-relaxed font-sans">
              {project.summary}
            </p>

            <div className="mt-5">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-2">
                Hardware / Tech Stack:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-black/40 border border-white/10 text-[10px] font-mono text-cyan-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>SECURE DOSSIER</span>
            <button
              type="button"
              onClick={handleClose}
              className="text-cyan-400 hover:text-cyan-300 font-bold"
            >
              [CLOSE PREVIEW]
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

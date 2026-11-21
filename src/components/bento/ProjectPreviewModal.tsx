'use client';

import React, { useState, useEffect } from 'react';
import { ProjectWithMedia } from '@/lib/types';

interface ProjectPreviewModalProps {
  project: ProjectWithMedia | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectPreviewModal({ project, isOpen, onClose }: ProjectPreviewModalProps) {
  const [activeSlot, setActiveSlot] = useState(1);

  useEffect(() => {
    setActiveSlot(1);
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const activeMedia = 
    project.project_media?.find((m) => m.display_order === activeSlot) || 
    project.project_media?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#0F0F12]/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="font-mono text-xs font-semibold text-cyan-300 tracking-wider uppercase">
              Project Specification Matrix &bull; {project.workstation.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 transition-colors"
          >
            [ESC] CLOSE
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Sisi Kiri: Viewport Multi-Camera (7 Kolom) */}
          <div className="md:col-span-7 flex flex-col space-y-3">
            {/* Layar Utama Slot Aktif */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner group">
              <img
                src={activeMedia?.image_url}
                alt={activeMedia?.caption || project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-cyan-500/60 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-cyan-300">
                {activeMedia?.camera_tag || `SLOT 0${activeSlot}`}
              </div>
              {activeMedia?.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 text-xs text-slate-200">
                  {activeMedia.caption}
                </div>
              )}
            </div>

            {/* Thumbnail Matrix 3-5 Slot */}
            <div className="grid grid-cols-5 gap-2">
              {project.project_media?.map((item) => (
                <button
                  key={item.display_order}
                  onClick={() => setActiveSlot(item.display_order)}
                  className={`relative aspect-video rounded-xl overflow-hidden border transition-all ${
                    activeSlot === item.display_order
                      ? 'border-cyan-400 ring-2 ring-cyan-500/40 scale-105'
                      : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  <img src={item.image_url} alt={item.camera_tag} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/90 text-[8px] font-mono text-cyan-300 truncate px-1">
                    {item.camera_tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sisi Kanan: Metadata & Tech Specs (5 Kolom) */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                {project.title}
              </h2>
              <div className="flex flex-col space-y-1 text-xs font-mono">
                <span className="text-cyan-400">
                  Role: <span className="text-slate-300 font-sans">{project.role}</span>
                </span>
                <span className="text-cyan-400">
                  Period: <span className="text-slate-300 font-sans">{project.event_date}</span>
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed border-t border-white/10 pt-3">
                {project.summary}
              </p>
            </div>

            {/* Tech Stack Badges */}
            <div className="border-t border-white/10 pt-3">
              <span className="text-[10px] font-mono text-slate-400 block mb-2 uppercase tracking-wider">
                Integrated Hardware &amp; Software:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/80 text-[11px] font-mono text-cyan-300 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

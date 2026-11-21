'use client';

import React from 'react';
import { ProjectWithMedia } from '@/lib/types';
import { Camera, Calendar } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';

interface ProjectCardItemProps {
  project: ProjectWithMedia;
  onSelect: (project: ProjectWithMedia) => void;
}

export default function ProjectCardItem({ project, onSelect }: ProjectCardItemProps) {
  const heroThumb = project.project_media?.[0]?.image_url || '/cam1_foh_setup.jpg';
  const camTag = project.project_media?.[0]?.camera_tag || 'CAM 01: HERO SHOT';

  const handleClick = () => {
    audioEngine.playSwitchClick();
    onSelect(project);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative h-40 w-full rounded-2xl overflow-hidden border border-white/10 bg-black cursor-pointer hover:border-cyan-400 text-left transition-[border-color,box-shadow] duration-200 shadow-lg select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      {/* Background Image */}
      <img
        src={heroThumb}
        alt={project.title}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-200"
      />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-4 flex flex-col justify-end pointer-events-none">
        
        {/* Camera Tag & Date */}
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-[9px] font-mono bg-cyan-950/90 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded flex items-center space-x-1">
            <Camera className="w-2.5 h-2.5 mr-1" />
            <span>{camTag}</span>
          </span>
          <span className="text-[10px] font-mono text-slate-300 flex items-center space-x-1">
            <Calendar className="w-2.5 h-2.5 mr-0.5" />
            <span>{project.event_date}</span>
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-white leading-snug line-clamp-1 group-hover:text-cyan-300 transition-colors">
          {project.title}
        </h4>

        {/* Role */}
        <span className="text-[11px] text-slate-300 line-clamp-1">
          {project.role}
        </span>
      </div>

      {/* Top Tally Pulse on Hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
      </div>

    </button>
  );
}

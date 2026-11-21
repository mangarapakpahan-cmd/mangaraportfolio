'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { WORKSTATION_SPATIAL_DATA } from '../3d/StudioScene';
import { ProjectWithMedia } from '@/lib/types';
import { audioEngine } from '@/lib/audioEngine';

interface InteractionPromptProps {
  projects: ProjectWithMedia[];
}

export default function InteractionPrompt({ projects }: InteractionPromptProps) {
  const router = useRouter();
  const {
    nearbyZone,
    startInspect,
    openProjectModal,
    isProjectModalOpen,
    toggleProjectModal,
  } = useGameStore();

  const activeZoneConfig = WORKSTATION_SPATIAL_DATA.find((ws) => ws.id === nearbyZone);
  const targetProject = projects.find((p) => p.workstation === nearbyZone) || projects[0];

  const handleInteract = () => {
    audioEngine.playSwitchClick();
    if (nearbyZone === 'server_rack') {
      router.push('/admin/login');
    } else if (activeZoneConfig) {
      startInspect(activeZoneConfig.lookAt, activeZoneConfig.inspectCamPosition);
      if (targetProject) {
        openProjectModal(targetProject);
      }
    }
  };

  const handleViewPortfolio = () => {
    audioEngine.playTerminalBoot();
    if (targetProject) {
      openProjectModal(targetProject);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        handleInteract();
      } else if (e.code === 'KeyF') {
        if (!isProjectModalOpen) {
          handleViewPortfolio();
        } else {
          toggleProjectModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    nearbyZone,
    activeZoneConfig,
    targetProject,
    isProjectModalOpen,
  ]);

  // Prompt floating in world position near FOH / character (lower-middle area)
  return (
    <div className="absolute top-[62%] left-[49%] -translate-y-1/2 z-30 pointer-events-auto select-none flex flex-col space-y-2 font-mono">
      
      {/* Tombol [E] Interact */}
      <button
        onClick={handleInteract}
        className="group flex items-center space-x-2 text-left bg-black/60 hover:bg-cyan-950/70 border border-cyan-800/60 hover:border-cyan-400 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
      >
        <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold text-xs shadow-[0_0_8px_rgba(6,182,212,0.6)]">
          [E]
        </span>
        <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 tracking-wider">
          {nearbyZone === 'server_rack' 
            ? 'ACCESS ROOT ADMIN TERMINAL'
            : `INTERACT WITH ${activeZoneConfig?.shortTag || 'FOH'}`}
        </span>
      </button>

      {/* Tombol [F] View Portfolio */}
      <button
        onClick={handleViewPortfolio}
        className="group flex items-center space-x-2 text-left bg-black/60 hover:bg-cyan-950/70 border border-cyan-800/60 hover:border-cyan-400 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
      >
        <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold text-xs shadow-[0_0_8px_rgba(6,182,212,0.6)]">
          [F]
        </span>
        <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 tracking-wider">
          VIEW PORTFOLIO ({activeZoneConfig?.portfolioTag || 'LEAD FOH & LIVE EVENT'})
        </span>
      </button>

    </div>
  );
}

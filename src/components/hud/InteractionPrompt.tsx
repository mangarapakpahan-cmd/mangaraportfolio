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
    openProjectModal,
    isProjectModalOpen,
    toggleProjectModal,
    startInspect,
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

  // Tombol interaktif yang sejajar presisi dengan visual prompt di latar studio
  return (
    <div 
      className="absolute top-[61%] left-[48.8%] z-30 pointer-events-auto select-none flex flex-col space-y-1.5 font-mono"
      style={{ transform: 'translate(0, 0)' }}
    >
      {/* Tombol [E] Interact with FOH */}
      <button
        onClick={handleInteract}
        className="group flex items-center space-x-2 text-left bg-black/60 hover:bg-cyan-950/80 border border-cyan-700/60 hover:border-cyan-400 px-2.5 py-1 rounded shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all cursor-pointer backdrop-blur-[2px]"
      >
        <span className="px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-bold text-[11px] shadow-[0_0_8px_rgba(6,182,212,0.8)]">
          [E]
        </span>
        <span className="text-[11.5px] font-bold text-slate-100 group-hover:text-cyan-300 tracking-wider">
          {nearbyZone === 'server_rack'
            ? 'ACCESS ROOT ADMIN TERMINAL'
            : `INTERACT WITH ${activeZoneConfig?.shortTag || 'FOH'}`}
        </span>
      </button>

      {/* Tombol [F] View Portfolio */}
      <button
        onClick={handleViewPortfolio}
        className="group flex items-center space-x-2 text-left bg-black/60 hover:bg-cyan-950/80 border border-cyan-700/60 hover:border-cyan-400 px-2.5 py-1 rounded shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all cursor-pointer backdrop-blur-[2px]"
      >
        <span className="px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-bold text-[11px] shadow-[0_0_8px_rgba(6,182,212,0.8)]">
          [F]
        </span>
        <span className="text-[11.5px] font-bold text-slate-100 group-hover:text-cyan-300 tracking-wider">
          VIEW PORTFOLIO ({activeZoneConfig?.portfolioTag || 'LEAD FOH & LIVE EVENT'})
        </span>
      </button>
    </div>
  );
}

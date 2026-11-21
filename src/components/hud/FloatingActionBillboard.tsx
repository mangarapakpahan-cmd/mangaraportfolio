'use client';

import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '@/lib/store';
import { ProjectWithMedia, WorkstationCategory } from '@/lib/types';
import { audioEngine } from '@/lib/audioEngine';
import { WORKSTATION_SPATIAL_DATA } from '../3d/StudioScene';

interface FloatingActionBillboardProps {
  projects?: ProjectWithMedia[];
}

export default function FloatingActionBillboard({ projects }: FloatingActionBillboardProps) {
  const {
    nearbyZone,
    isProjectModalOpen,
    openProjectModal,
    closeProjectModal,
    toggleProjectModal,
  } = useGameStore();

  const currentSpatial = WORKSTATION_SPATIAL_DATA.find((ws) => ws.id === nearbyZone);

  // Cari proyek terkait untuk workstation yang didekati
  const matchingProject = projects?.find((p) => p.workstation === nearbyZone) || projects?.[0];

  const handleInteract = useCallback(() => {
    audioEngine.playSwitchClick();
    if (matchingProject) {
      openProjectModal(matchingProject);
    } else {
      toggleProjectModal();
    }
  }, [matchingProject, openProjectModal, toggleProjectModal]);

  const handleTogglePortfolio = useCallback(() => {
    audioEngine.playTerminalBoot();
    if (matchingProject) {
      openProjectModal(matchingProject);
    } else {
      toggleProjectModal();
    }
  }, [matchingProject, openProjectModal, toggleProjectModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'KeyE') {
        e.preventDefault();
        handleInteract();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        handleTogglePortfolio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInteract, handleTogglePortfolio]);

  if (!nearbyZone) return null;

  const shortName = currentSpatial?.shortTag || (nearbyZone === 'server_rack' ? 'SERVER RACK' : 'WORKSTATION');
  const portfolioTag = currentSpatial?.portfolioTag || 'LEAD FOH & LIVE EVENT';

  return (
    <div
      className="fixed z-20 pointer-events-auto select-none flex flex-col space-y-2"
      style={{
        top: '60%',
        left: '49%',
        transform: 'translate(0, -50%)',
      }}
    >
      {/* Tombol [E] INTERACT WITH ... */}
      <button
        onClick={handleInteract}
        className="px-3.5 py-1.5 rounded-lg bg-black/75 hover:bg-black/90 border border-cyan-400/50 hover:border-cyan-300 text-left transition-all duration-150 shadow-[0_0_15px_rgba(6,182,212,0.35)] group active:scale-95"
      >
        <span className="font-mono font-extrabold text-[12px] md:text-[13px] text-cyan-400 tracking-wider group-hover:text-cyan-300">
          [E] INTERACT WITH {shortName}
        </span>
      </button>

      {/* Tombol [F] VIEW PORTFOLIO (...) */}
      <button
        onClick={handleTogglePortfolio}
        className="px-3.5 py-1.5 rounded-lg bg-black/75 hover:bg-black/90 border border-cyan-400/50 hover:border-cyan-300 text-left transition-all duration-150 shadow-[0_0_15px_rgba(6,182,212,0.35)] group active:scale-95"
      >
        <span className="font-mono font-extrabold text-[12px] md:text-[13px] text-cyan-400 tracking-wider group-hover:text-cyan-300">
          [F] VIEW PORTFOLIO ({portfolioTag})
        </span>
      </button>
    </div>
  );
}

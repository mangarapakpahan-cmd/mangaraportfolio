'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { WORKSTATION_SPATIAL_DATA } from '../3d/StudioScene';
import { ProjectWithMedia } from '@/lib/types';

interface InteractionPromptProps {
  projects: ProjectWithMedia[];
}

export default function InteractionPrompt({ projects }: InteractionPromptProps) {
  const router = useRouter();
  const {
    nearbyZone,
    cameraState,
    startInspect,
    exitInspect,
    openProjectModal,
    isProjectModalOpen,
  } = useGameStore();

  const activeZoneConfig = WORKSTATION_SPATIAL_DATA.find((ws) => ws.id === nearbyZone);

  // Ambil proyek terkait untuk zona workstation aktif
  const targetProject = projects.find((p) => p.workstation === nearbyZone) || projects[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isProjectModalOpen) return;

      if (e.code === 'KeyE' || e.code === 'KeyF') {
        if (nearbyZone === 'server_rack') {
          router.push('/admin/login');
        } else if (activeZoneConfig) {
          // 1. Jalankan animasi camera lerp (0.4 detik) fokus ke monitor meja
          startInspect(activeZoneConfig.lookAt, activeZoneConfig.inspectCamPosition);

          // 2. Buka Project Showcase HUD Modal jika ada proyek
          if (targetProject) {
            openProjectModal(targetProject);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    nearbyZone,
    activeZoneConfig,
    targetProject,
    cameraState,
    isProjectModalOpen,
    startInspect,
    openProjectModal,
    router,
  ]);

  if (!nearbyZone || isProjectModalOpen) return null;

  const isServerRack = nearbyZone === 'server_rack';

  return (
    <div className="fixed inset-x-0 bottom-24 z-30 flex justify-center pointer-events-none select-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex flex-col items-center space-y-2 bg-slate-950/85 backdrop-blur-xl border border-cyan-500/70 px-6 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.35)]">
        
        {/* Header Nama Workstation Pilar */}
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
            {isServerRack ? 'ROOT ADMIN SERVER RACK' : activeZoneConfig?.name}
          </span>
        </div>

        {/* Prompt Tombol Interaksi */}
        <div className="flex items-center space-x-4 pt-1 font-mono text-xs">
          {isServerRack ? (
            <div className="flex items-center space-x-1.5 text-amber-300">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500 font-bold">
                [E]
              </span>
              <span>ACCESS ROOT ADMIN TERMINAL</span>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-1.5 text-slate-200">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-bold">
                  [E]
                </span>
                <span>INTERACT WITH CONSOLE</span>
              </div>
              <span className="text-slate-600">&bull;</span>
              <div className="flex items-center space-x-1.5 text-slate-200">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-bold">
                  [F]
                </span>
                <span>VIEW PORTFOLIO SPEC</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

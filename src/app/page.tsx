'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ProjectWithMedia } from '@/lib/types';
import { useGameStore } from '@/lib/store';
import { FALLBACK_PROJECTS } from '@/lib/data/fallbackProjects';
import { usePerformanceFallback } from '@/hooks/usePerformanceFallback';

import CanvasContainer from '@/components/3d/CanvasContainer';
import TopNavigation from '@/components/hud/TopNavigation';
import MiniMapRadar from '@/components/hud/MiniMapRadar';
import InteractionPrompt from '@/components/hud/InteractionPrompt';
import ProjectShowcaseModal from '@/components/hud/ProjectShowcaseModal';
import VirtualJoystick from '@/components/hud/VirtualJoystick';
import BentoGridView from '@/components/bento/BentoGridView';

export default function HomePage() {
  const [projects, setProjects] = useState<ProjectWithMedia[]>(FALLBACK_PROJECTS);
  const { displayMode, setDisplayMode, currentFps } = useGameStore();

  // 1. Inisialisasi Deteksi Performa WebGL & Auto-Fallback jika < 20 FPS
  usePerformanceFallback();

  // 2. Ambil data proyek secara dinamis dari Supabase (sinkronisasi live)
  useEffect(() => {
    async function fetchPublishedProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            project_media (*)
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const formatted: ProjectWithMedia[] = data.map((proj: any) => ({
            ...proj,
            project_media: (proj.project_media || []).sort(
              (a: any, b: any) => a.display_order - b.display_order
            ),
          }));
          setProjects(formatted);
        }
      } catch (err) {
        console.warn('Menggunakan data fallback Master Control Room:', err);
      }
    }

    fetchPublishedProjects();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#07090E] overflow-hidden select-none">
      
      {/* 1. Top Navigation Bar (Header) */}
      <TopNavigation />

      {/* 2. Kondisional Render: 3D Studio Hangar vs Bento Grid 2D */}
      {displayMode === '3d' ? (
        <div className="relative w-full h-screen">
          
          {/* WebGL 3D Canvas Scene */}
          <CanvasContainer />

          {/* Sisi Kiri Layar: Telemetri Database Vertikal (Exact match to reference mockup) */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:flex flex-col items-center z-20">
            <div className="[writing-mode:vertical-lr] text-[9.5px] font-mono tracking-widest text-emerald-400/90 font-bold uppercase drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mb-2" />
              <span>DATABASE CONNECTED</span>
            </div>
          </div>

          {/* Sisi Kanan Layar: Telemetri Engine Vertikal (Exact match to reference mockup) */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:flex flex-col items-center z-20">
            <div className="[writing-mode:vertical-lr] text-[9.5px] font-mono tracking-widest text-cyan-400/90 font-bold uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
              <span>3D ENGINE 60 FPS</span>
            </div>
          </div>

          {/* Mini-Map Radar HUD (Pojok Kiri Bawah) */}
          <MiniMapRadar />

          {/* Proximity Interaction Floating Prompt ([E] / [F]) */}
          <InteractionPrompt projects={projects} />

          {/* Project Showcase HUD Modal (Pojok Kanan Bawah, 2x2 Camera Swap Matrix) */}
          <ProjectShowcaseModal projects={projects} />

          {/* Virtual Joystick untuk Mobile / Layar Sentuh */}
          <VirtualJoystick />

        </div>
      ) : (
        /* Alternatif Tampilan Bento Grid Mode (2D) */
        <div className="relative">
          <BentoGridView projects={projects} />
        </div>
      )}

    </div>
  );
}

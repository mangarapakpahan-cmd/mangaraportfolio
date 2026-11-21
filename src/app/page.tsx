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
  const { displayMode, setDisplayMode, currentFps, fallbackTriggered } = useGameStore();

  // 1. Inisialisasi Deteksi Performa WebGL & Auto-Fallback jika < 20 FPS
  usePerformanceFallback();

  // 2. Ambil data proyek secara dinamis dari Supabase
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
        console.warn('Menggunakan fallback data portofolio:', err);
      }
    }

    fetchPublishedProjects();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#07090E] overflow-hidden select-none">
      
      {/* 1. Top Navigation Bar dengan Dual-Mode Switcher */}
      <TopNavigation />

      {/* 2. Kondisional Render: 3D Studio Hangar vs Bento Grid 2D */}
      {displayMode === '3d' ? (
        <div className="relative w-full h-screen">
          
          {/* WebGL 3D Canvas Scene */}
          <CanvasContainer />

          {/* Sisi Kiri: Indikator HUD Vertikal */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block">
            <span className="[writing-mode:vertical-lr] text-[9px] font-mono tracking-widest text-emerald-400/80 uppercase">
              DATABASE CONNECTED &bull; LIVE FEED
            </span>
          </div>

          {/* Sisi Kanan: Indikator HUD Vertikal */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block">
            <span className="[writing-mode:vertical-lr] text-[9px] font-mono tracking-widest text-cyan-400/80 uppercase">
              3D ENGINE &bull; {currentFps} FPS
            </span>
          </div>

          {/* Mini-Map Radar HUD (Pojok Kiri Bawah) */}
          <MiniMapRadar />

          {/* Proximity Action Trigger Floating Prompt ([E] / [F]) */}
          <InteractionPrompt projects={projects} />

          {/* Project Showcase HUD Modal (Multi-View Swap Screen Matrix) */}
          <ProjectShowcaseModal projects={projects} />

          {/* Virtual Joystick untuk Layar Sentuh / Mobile */}
          <VirtualJoystick />

        </div>
      ) : (
        /* Fallback / Alternatif Tampilan Bento Grid Mode */
        <div className="relative">
          <BentoGridView projects={projects} />

          {/* Toast Notifikasi Fallback Otomatis jika GPU drop < 20 FPS */}
          {fallbackTriggered && (
            <div className="fixed bottom-6 inset-x-6 max-w-lg mx-auto z-40 bg-slate-900/95 border border-amber-500/80 text-slate-100 p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between font-sans text-xs animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center space-x-3 pr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                <p className="text-slate-300">
                  <strong className="text-white">Performa Rendah (&lt; 20 FPS) Terdeteksi:</strong> Tampilan dialihkan otomatis ke Bento Grid 2D demi kenyamanan navigasi.
                </p>
              </div>
              <button
                onClick={() => setDisplayMode('3d')}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500 text-amber-300 font-mono text-[10px] whitespace-nowrap transition-colors"
              >
                PAKSA MODE 3D
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

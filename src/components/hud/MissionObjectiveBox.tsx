'use client';

import React from 'react';
import { useGameStore } from '@/lib/store';
import { Target, CheckCircle2, Circle, Radio } from 'lucide-react';
import { WorkstationCategory } from '@/lib/types';

const ZONE_OBJECTIVES: Record<WorkstationCategory | 'server_rack', { name: string; target: string; desc: string }> = {
  foh_av: {
    name: 'FOH AUDIO-VISUAL',
    target: 'PRIMARY TARGET: FOH CONSOLE & STAGE',
    desc: 'Inspect Behringer X32 mixer, Dante snake, and stage audio feeds.',
  },
  led_broadcast: {
    name: 'MAIN LED WALL',
    target: 'PRIMARY TARGET: LED BROADCAST RIG',
    desc: 'Examine NovaStar H9 video processor & multi-view switcher matrix.',
  },
  uiux_motion: {
    name: 'DESIGNER / UI/UX & MOTION',
    target: 'PRIMARY TARGET: CREATIVE SUITE',
    desc: 'Review brand identity design, motion graphics, and UI deliverables.',
  },
  data_analytics: {
    name: 'DATA ANALYTICS HUB',
    target: 'PRIMARY TARGET: TELEMETRY WALL',
    desc: 'Analyze structural equation models, SQL queries, and Azure pipeline.',
  },
  web_dev: {
    name: 'WEB DEV & IOT LAB',
    target: 'PRIMARY TARGET: DEV LAB & HARDWARE',
    desc: 'Inspect Next.js App Router codebase and IoT microcontroller boards.',
  },
  server_rack: {
    name: 'TINY SERVER RACK',
    target: 'PRIMARY TARGET: ROOT ADMIN RACK',
    desc: 'Access database authentication and Supabase credentials.',
  },
};

export default function MissionObjectiveBox() {
  const { nearbyZone, isProjectModalOpen } = useGameStore();

  const currentInfo = nearbyZone ? ZONE_OBJECTIVES[nearbyZone] : null;

  return (
    <div className="fixed top-14 left-4 md:left-6 z-20 pointer-events-none select-none max-w-[280px] sm:max-w-xs transition-opacity duration-200">
      
      {/* Box Container with GTA VI Neon Dusk Sunset Accent */}
      <div className="relative rounded-xl overflow-hidden bg-mcr-black/90 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-3">
        
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-mcr-pink via-mcr-orange to-mcr-cyan" />

        {/* Header Title */}
        <div className="flex items-center justify-between mb-2 pt-0.5">
          <div className="flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-mcr-pink animate-pulse" />
            <span className="text-[10px] font-mono font-black tracking-widest text-mcr-pink uppercase">
              MISSION OBJECTIVE
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-400">GTA HUD</span>
        </div>

        {/* Dynamic Objective Name */}
        <div className="mb-2">
          <h4 className="text-xs font-mono font-bold text-white tracking-wide uppercase line-clamp-1">
            {currentInfo ? currentInfo.target : 'ROAMING: EXPLORE MCR STUDIO'}
          </h4>
          <p className="text-[10px] font-sans text-slate-400 leading-tight mt-0.5">
            {currentInfo
              ? currentInfo.desc
              : 'Approach any illuminated workstation to engage proximity controls.'}
          </p>
        </div>

        {/* Dynamic Interactive Checklist */}
        <div className="space-y-1 pt-1.5 border-t border-white/[0.06] text-[10px] font-mono">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="line-through text-slate-400">Enter Master Control Room</span>
          </div>
          
          <div className={`flex items-center space-x-1.5 ${nearbyZone ? 'text-mcr-cyan font-bold' : 'text-slate-400'}`}>
            {nearbyZone ? (
              <CheckCircle2 className="w-3 h-3 text-mcr-cyan shrink-0" />
            ) : (
              <Circle className="w-3 h-3 text-slate-600 shrink-0" />
            )}
            <span>Proximity lock : {nearbyZone ? currentInfo?.name : 'Roaming'}</span>
          </div>

          <div className={`flex items-center space-x-1.5 ${isProjectModalOpen ? 'text-mcr-orange font-bold' : 'text-slate-400'}`}>
            {isProjectModalOpen ? (
              <CheckCircle2 className="w-3 h-3 text-mcr-orange shrink-0" />
            ) : (
              <Circle className="w-3 h-3 text-slate-600 shrink-0" />
            )}
            <span>Press [F] for Multi-Cam Matrix</span>
          </div>
        </div>

      </div>

    </div>
  );
}

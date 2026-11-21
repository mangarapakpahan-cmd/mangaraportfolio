'use client';

import React from 'react';
import Link from 'next/link';
import { useGameStore } from '@/lib/store';
import { audioEngine } from '@/lib/audioEngine';

export default function TopNavigation() {
  const { displayMode, setDisplayMode } = useGameStore();

  const handleModeSwitch = (mode: '3d' | 'bento') => {
    if (mode !== displayMode) {
      audioEngine.playModeTransition();
      setDisplayMode(mode);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 py-3 bg-black/40 backdrop-blur-sm border-b border-white/5 font-mono text-xs select-none pointer-events-auto">
      
      {/* Kiri: Branding Command OS */}
      <div className="flex items-center space-x-3">
        <div className="px-3 py-1 rounded bg-[#0b101b]/90 border border-cyan-800/60 text-slate-200 font-bold tracking-wider text-[11px] shadow-sm">
          COMMAND OS v1.0
        </div>
      </div>

      {/* Tengah: Dual-Mode Switcher */}
      <div className="flex items-center space-x-1.5 font-bold tracking-wider text-xs">
        <button
          onClick={() => handleModeSwitch('3d')}
          className={`transition-all ${
            displayMode === '3d'
              ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          [3D STUDIO Mode]
        </button>
        <span className="text-slate-500">/</span>
        <button
          onClick={() => handleModeSwitch('bento')}
          className={`transition-all ${
            displayMode === 'bento'
              ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          [BENTO GRID Mode]
        </button>
      </div>

      {/* Kanan: Gateway Root Admin */}
      <div className="flex items-center">
        <Link
          href="/admin/login"
          className="px-3 py-1 rounded bg-[#1e1509]/90 border border-amber-500/80 text-amber-300 hover:bg-amber-900/60 transition-colors font-bold tracking-wider text-[11px] shadow-[0_0_10px_rgba(245,158,11,0.2)]"
        >
          ACCESS LEVEL: ROOT / ADMIN
        </Link>
      </div>

    </header>
  );
}

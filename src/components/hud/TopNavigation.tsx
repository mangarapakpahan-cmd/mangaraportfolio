'use client';

import React from 'react';
import Link from 'next/link';
import { useGameStore } from '@/lib/store';
import { audioEngine } from '@/lib/audioEngine';

export default function TopNavigation() {
  const {
    displayMode,
    setDisplayMode,
    currentFps,
    isAudioMuted,
    toggleAudioMuted,
  } = useGameStore();

  const handleModeSwitch = (mode: '3d' | 'bento') => {
    if (mode !== displayMode) {
      audioEngine.playModeTransition();
      setDisplayMode(mode);
    }
  };

  const handleAudioToggle = () => {
    audioEngine.playSwitchClick();
    toggleAudioMuted();
  };

  return (
    <header className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-6 py-3.5 bg-slate-950/75 backdrop-blur-md border-b border-white/10 font-mono text-xs select-none pointer-events-auto">
      
      {/* Branding OS */}
      <div className="flex items-center space-x-3">
        <span className="px-2.5 py-1 rounded bg-cyan-950/90 border border-cyan-700/80 text-cyan-300 font-bold tracking-wider">
          COMMAND OS v1.0
        </span>
        <span className="hidden md:inline text-slate-400 text-[11px]">
          MASTER CONTROL ROOM HUB
        </span>
      </div>

      {/* Dual Mode Switcher Toggle Permanen */}
      <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 shadow-inner">
        <button
          onClick={() => handleModeSwitch('3d')}
          className={`px-3.5 py-1 rounded-md transition-all font-bold ${
            displayMode === '3d'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          [3D STUDIO Mode]
        </button>
        <button
          onClick={() => handleModeSwitch('bento')}
          className={`px-3.5 py-1 rounded-md transition-all font-bold ${
            displayMode === 'bento'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          [BENTO GRID Mode]
        </button>
      </div>

      {/* Controls Kanan: Audio Mute Toggle, FPS Telemetry & Admin Gateway */}
      <div className="flex items-center space-x-3">
        
        {/* Toggle Audio Sound In-Universe */}
        <button
          onClick={handleAudioToggle}
          className={`px-2.5 py-1 rounded-lg border font-mono text-[10px] font-bold transition-all flex items-center space-x-1.5 ${
            isAudioMuted
              ? 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
              : 'bg-cyan-950/70 border-cyan-700 text-cyan-300 hover:bg-cyan-900'
          }`}
          title="Toggle In-Universe Audio"
        >
          <span>{isAudioMuted ? '🔇 AUDIO: OFF' : '🔊 AUDIO: ON'}</span>
        </button>

        {/* FPS Telemetry */}
        <div className="hidden lg:flex items-center space-x-2 text-slate-400 text-[11px] bg-slate-900/60 px-2.5 py-1 rounded-lg border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{currentFps} FPS</span>
        </div>

        {/* Root Admin Gateway */}
        <Link
          href="/admin/login"
          className="px-3.5 py-1.5 rounded-lg bg-amber-950/80 border border-amber-600 text-amber-300 hover:bg-amber-900 transition-colors font-bold tracking-wider"
        >
          ACCESS LEVEL: ROOT / ADMIN
        </Link>

      </div>

    </header>
  );
}

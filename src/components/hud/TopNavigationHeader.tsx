'use client';

import React from 'react';
import Link from 'next/link';
import { useGameStore } from '@/lib/store';
import { audioEngine } from '@/lib/audioEngine';
import { Volume2, VolumeX, Smartphone, Terminal, Shield } from 'lucide-react';

export default function TopNavigationHeader() {
  const {
    displayMode,
    setDisplayMode,
    isAudioMuted,
    toggleAudioMuted,
    isSmartphoneOpen,
    toggleSmartphone,
    showConfirmation,
  } = useGameStore();

  const handleModeSwitch = (mode: '3d' | 'bento') => {
    if (mode === displayMode) return;
    audioEngine.playModeTransition();
    setDisplayMode(mode);
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    audioEngine.playSwitchClick();
  };

  return (
    <header className="fixed top-0 inset-x-0 h-12 z-40 bg-mcr-black/85 backdrop-blur-md border-b border-white/[0.08] px-4 md:px-6 flex items-center justify-between select-none">
      
      {/* Sisi Kiri: Command OS Logo & Status Online */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-wider text-white">
          <Terminal className="w-3.5 h-3.5 text-mcr-cyan" />
          <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            [ COMMAND OS v1.0 ]
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono font-bold text-emerald-300 tracking-wider">
            ONLINE
          </span>
        </div>
      </div>

      {/* Bagian Tengah: Dual-Mode Switcher [3D STUDIO Mode] / [BENTO GRID Mode] */}
      <div className="flex items-center space-x-1 sm:space-x-2 bg-black/60 p-1 rounded-full border border-white/10 shadow-inner">
        <button
          onClick={() => handleModeSwitch('3d')}
          className={`px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold transition-all duration-200 tracking-wide ${
            displayMode === '3d'
              ? 'bg-mcr-cyan text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          [3D STUDIO Mode]
        </button>
        <span className="text-slate-600 text-xs">/</span>
        <button
          onClick={() => handleModeSwitch('bento')}
          className={`px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold transition-all duration-200 tracking-wide ${
            displayMode === 'bento'
              ? 'bg-gradient-to-r from-mcr-pink to-mcr-orange text-white shadow-[0_0_15px_rgba(255,42,133,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          [BENTO GRID Mode]
        </button>
      </div>

      {/* Sisi Kanan: Sound Toggle, iFruit Phone & Admin Link */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        
        {/* Toggle Sound Mute */}
        <button
          onClick={() => {
            audioEngine.playSwitchClick();
            toggleAudioMuted();
          }}
          title={isAudioMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
          className={`p-1.5 rounded-lg border transition-all text-xs font-mono flex items-center space-x-1 ${
            isAudioMuted
              ? 'bg-red-950/40 border-red-800/60 text-red-400'
              : 'bg-white/[0.04] border-white/10 text-mcr-cyan hover:border-mcr-cyan/50'
          }`}
        >
          {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline text-[10px] uppercase font-bold">
            {isAudioMuted ? 'MUTED' : 'SFX ON'}
          </span>
        </button>

        {/* Toggle iFruit Smartphone */}
        <button
          onClick={() => {
            audioEngine.playSwitchClick();
            toggleSmartphone();
          }}
          className={`p-1.5 px-2.5 rounded-lg border transition-all text-xs font-mono flex items-center space-x-1.5 ${
            isSmartphoneOpen
              ? 'bg-mcr-pink/20 border-mcr-pink text-mcr-pink shadow-[0_0_10px_rgba(255,42,133,0.4)]'
              : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:border-white/20'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[10px] font-bold tracking-wider">iFruit</span>
        </button>

        {/* Root Admin Portal Link */}
        <Link
          href="/admin"
          onClick={handleAdminClick}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 transition-all text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(245,158,11,0.2)]"
        >
          <Shield className="w-3 h-3 text-amber-400" />
          <span className="hidden md:inline">[ ACCESS LEVEL: </span>
          <span>ROOT / ADMIN</span>
          <span className="hidden md:inline"> ]</span>
        </Link>
      </div>

    </header>
  );
}

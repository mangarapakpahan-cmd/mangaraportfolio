'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { audioEngine } from '@/lib/audioEngine';
import { Play, Sparkles, Volume2 } from 'lucide-react';

export default function IntroCoverScreen() {
  const { introCompleted, setIntroCompleted, isAudioMuted } = useGameStore();

  const handleUnlockAndStart = useCallback(() => {
    if (introCompleted) return;
    audioEngine.playTerminalBoot();
    setTimeout(() => {
      audioEngine.playSwitchClick();
    }, 200);
    setIntroCompleted(true);
  }, [introCompleted, setIntroCompleted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleUnlockAndStart();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUnlockAndStart]);

  if (introCompleted) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="gta-vi-intro-cover"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={handleUnlockAndStart}
        className="fixed inset-0 z-50 flex flex-col justify-between items-center cursor-pointer select-none overflow-hidden bg-mcr-black"
      >
        {/* Ken Burns Background Cover Art */}
        <motion.div
          initial={{ scale: 1.0 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 14, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src="/mcr_studio_reference.jpg"
            alt="MCR Studio Grand Stage"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
          />
        </motion.div>

        {/* Cinematic Vignette & Sunset Glow Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, transparent 35%, rgba(5,5,7,0.7) 70%, #050507 95%)',
          }}
        />

        {/* GTA VI Neon Dusk Top/Bottom Gradient Wash */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/80 via-transparent to-black/90" />
        <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-40" />

        {/* Perimeter Sunset Hairline Frame */}
        <div className="absolute inset-3 md:inset-5 border border-white/10 pointer-events-none rounded-2xl flex flex-col justify-between p-4 md:p-6">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono tracking-widest text-mcr-pink font-bold uppercase drop-shadow-[0_0_8px_rgba(255,42,133,0.8)]">
              GTA VI DUSK // ENGINE v1.0
            </span>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-mcr-cyan">
              <span className="w-2 h-2 rounded-full bg-mcr-cyan animate-ping" />
              <span>STATION ONLINE</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
            <span>SECURE TERMINAL : PORT 8080</span>
            <span>MANGARA PAKPAHAN ARCHIVE</span>
          </div>
        </div>

        {/* Top Header Branding */}
        <div className="relative z-10 pt-16 md:pt-24 text-center px-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-mcr-cyan" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-slate-200 uppercase">
              INTERACTIVE 3D MASTER CONTROL ROOM
            </span>
          </motion.div>

          <motion.h1
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.95)]"
          >
            MANGARA PAKPAHAN
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-2 text-sm md:text-lg font-mono font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-mcr-pink via-mcr-orange to-mcr-cyan uppercase"
          >
            PORTFOLIO // MCR STUDIO
          </motion.div>
          <div className="text-[11px] md:text-xs font-mono text-slate-400 tracking-wider mt-1">
            LEAD FOH &bull; BROADCAST DIRECTOR &bull; UI/UX &bull; FULL-STACK &bull; DATA ANALYTICS
          </div>
        </div>

        {/* Center GTA VI Badge / Hero Icon */}
        <div className="relative z-10 flex flex-col items-center my-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-mcr-cyan/40 bg-mcr-surface/80 backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.35)] group-hover:scale-110 transition-transform"
          >
            <Play className="w-7 h-7 text-mcr-cyan fill-mcr-cyan/20 ml-1" />
          </motion.div>
        </div>

        {/* Bottom Call-To-Action & Sound Prompt */}
        <div className="relative z-10 pb-16 md:pb-20 text-center px-4 flex flex-col items-center">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="px-6 py-3 rounded-full bg-black/60 border border-mcr-cyan/50 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.3)] text-mcr-cyan font-mono font-extrabold text-xs md:text-sm tracking-widest uppercase"
          >
            [ CLICK ANYWHERE OR PRESS ANY KEY TO INITIALIZE STUDIO ]
          </motion.div>

          <div className="flex items-center space-x-2 mt-4 text-[10px] font-mono text-slate-400">
            <Volume2 className="w-3.5 h-3.5 text-mcr-orange" />
            <span>SOUND FX ENABLED &bull; BEST EXPERIENCED WITH HEADPHONES</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

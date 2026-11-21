'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { audioEngine } from '@/lib/audioEngine';
import { Volume2, Terminal, ShieldCheck, Sparkles } from 'lucide-react';

export default function IntroCoverScreen() {
  const { introCompleted, setIntroCompleted } = useGameStore();
  const shouldReduceMotion = useReducedMotion();

  const handleUnlockAndStart = useCallback(() => {
    if (introCompleted) return;
    audioEngine.playTerminalBoot();
    setTimeout(() => {
      audioEngine.playSwitchClick();
    }, 150);
    setIntroCompleted(true);
  }, [introCompleted, setIntroCompleted]);

  useEffect(() => {
    const handleKeyDown = () => {
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
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onClick={handleUnlockAndStart}
        className="fixed inset-0 z-50 flex flex-col justify-between items-center cursor-pointer select-none overflow-hidden bg-mcr-black"
        role="button"
        tabIndex={0}
        aria-label="Click or press any key to enter Master Control Room Studio"
      >
        {/* Authentic GTA VI Cover Art: Mangara Pakpahan Artwork */}
        <motion.div
          initial={{ scale: 1.0 }}
          animate={shouldReduceMotion ? { scale: 1.0 } : { scale: 1.04 }}
          transition={{
            duration: 12,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src="/intro_gta_cover.webp"
            alt="Mangara Pakpahan Portfolio GTA VI Style Cover Art"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* Cinematic Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, transparent 45%, rgba(5,5,7,0.4) 75%, #050507 98%)',
          }}
        />

        {/* Ambient Top & Bottom Shades */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-25" />

        {/* Perimeter Telemetry HUD Frame */}
        <div className="absolute inset-3 sm:inset-5 border border-white/10 pointer-events-none rounded-2xl flex flex-col justify-between p-3 sm:p-5">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <div className="flex items-center space-x-2 text-mcr-cyan">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-bold tracking-widest uppercase">MCR COMMAND OS v1.0</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-widest uppercase font-semibold">FEED ONLINE &bull; 60 FPS</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>SECURE ARCHIVE : PORT 8080</span>
            </span>
            <span>MANGARA PAKPAHAN OFFICIAL</span>
          </div>
        </div>

        {/* Top Floating Badge */}
        <div className="relative z-10 pt-8 sm:pt-12 text-center px-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-mcr-cyan" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-200 uppercase">
              INTERACTIVE 3D MASTER CONTROL ROOM
            </span>
          </div>
        </div>

        {/* Spacer for the center artwork to be fully visible */}
        <div className="relative z-10 my-auto pointer-events-none" />

        {/* Bottom Call-To-Action & Audio Unlocker */}
        <div className="relative z-10 pb-8 sm:pb-12 text-center px-4 flex flex-col items-center">
          <motion.div
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="px-6 py-3 rounded-xl bg-black/80 border border-mcr-cyan/60 backdrop-blur-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] text-mcr-cyan font-mono font-extrabold text-xs sm:text-sm tracking-widest uppercase"
          >
            [ CLICK ANYWHERE OR PRESS ANY KEY TO INITIALIZE STUDIO ]
          </motion.div>

          <div className="flex items-center space-x-2 mt-3 text-[10px] font-mono text-slate-300">
            <Volume2 className="w-3.5 h-3.5 text-mcr-orange" />
            <span>SOUND FX ENABLED &bull; BEST EXPERIENCED WITH HEADPHONES</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

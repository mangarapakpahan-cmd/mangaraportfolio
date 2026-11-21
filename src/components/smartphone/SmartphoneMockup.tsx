'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { audioEngine } from '@/lib/audioEngine';
import SmartphoneStatusBar from './SmartphoneStatusBar';
import HardwareSpecsList from './HardwareSpecsList';
import QuickActionButtons from './QuickActionButtons';
import { X, Sparkles, User } from 'lucide-react';

export default function SmartphoneMockup() {
  const { isSmartphoneOpen, toggleSmartphone } = useGameStore();

  if (!isSmartphoneOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
        <motion.div
          initial={{ y: '100%', opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: '100%', opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-[310px] sm:w-[330px] rounded-[36px] bg-[#0c0f17] border-4 border-[#242b38] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(6,182,212,0.15)] overflow-hidden p-3.5 flex flex-col justify-between"
          style={{ height: '540px' }}
        >
          {/* Subtle Outer Metal Sheen & Glass Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-white/[0.05] pointer-events-none rounded-[32px]" />

          {/* Sisi Atas: Status Bar */}
          <div className="relative z-10">
            <SmartphoneStatusBar />
            
            {/* Profile Card Header */}
            <div className="mt-2.5 p-3 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-mcr-pink to-mcr-cyan p-0.5 shadow-md">
                  <div className="w-full h-full rounded-full bg-mcr-surface flex items-center justify-center text-white">
                    <User className="w-5 h-5 text-mcr-cyan" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Mangara F. Pakpahan
                  </h4>
                  <span className="text-[10px] font-mono text-mcr-cyan block">
                    Lead Technical Director
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  audioEngine.playSwitchClick();
                  toggleSmartphone();
                }}
                className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sisi Tengah: Telemetri & Hardware Specs List */}
          <div className="relative z-10 my-2 flex-1 overflow-hidden flex flex-col justify-center">
            <HardwareSpecsList />
          </div>

          {/* Sisi Bawah: Quick Action Buttons & Home Bar */}
          <div className="relative z-10 pt-1">
            <QuickActionButtons />

            {/* iOS / iFruit Home Indicator Bar */}
            <div className="w-24 h-1 rounded-full bg-white/30 mx-auto mt-3 mb-0.5" />
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

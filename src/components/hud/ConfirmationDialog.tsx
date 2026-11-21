'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { audioEngine } from '@/lib/audioEngine';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationDialog() {
  const { confirmationDialog, closeConfirmation } = useGameStore();

  if (!confirmationDialog || !confirmationDialog.isOpen) return null;

  const handleConfirm = () => {
    audioEngine.playSwitchClick();
    confirmationDialog.onConfirm();
    closeConfirmation();
  };

  const handleCancel = () => {
    audioEngine.playSwitchClick();
    closeConfirmation();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md rounded-2xl bg-mcr-surface border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden p-6"
        >
          {/* Top Sunset Gradient Bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-mcr-pink via-mcr-orange to-mcr-cyan" />

          {/* Close button */}
          <button
            onClick={handleCancel}
            aria-label="Close confirmation dialog"
            className="absolute top-4 right-4 p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Dialog Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-mcr-pink uppercase block">
                COMMAND VERIFICATION
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                {confirmationDialog.title}
              </h3>
            </div>
          </div>

          {/* Message */}
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6 font-sans">
            {confirmationDialog.message}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/[0.08] font-mono text-xs">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors uppercase font-semibold"
            >
              {confirmationDialog.cancelText || '[ CANCEL / RETURN ]'}
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-mcr-cyan hover:bg-cyan-400 text-slate-950 transition-colors duration-150 font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              {confirmationDialog.confirmText || '[ CONFIRM / PROCEED ]'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

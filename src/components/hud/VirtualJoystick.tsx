'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/lib/store';

export default function VirtualJoystick() {
  const { setVirtualMoveInput } = useGameStore();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const baseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Deteksi perangkat touch
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setIsTouchDevice(true);
    }
  }, []);

  if (!isTouchDevice) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsActive(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!baseRef.current || touchIdRef.current === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        const rect = baseRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let deltaX = touch.clientX - centerX;
        let deltaY = touch.clientY - centerY;
        const maxRadius = rect.width / 2;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > maxRadius) {
          deltaX = (deltaX / distance) * maxRadius;
          deltaY = (deltaY / distance) * maxRadius;
        }

        setStickPos({ x: deltaX, y: deltaY });

        // Normalisasi input -1 s/d 1
        setVirtualMoveInput({
          x: deltaX / maxRadius,
          y: deltaY / maxRadius,
        });
        break;
      }
    }
  };

  const handleTouchEnd = () => {
    touchIdRef.current = null;
    setIsActive(false);
    setStickPos({ x: 0, y: 0 });
    setVirtualMoveInput({ x: 0, y: 0 });
  };

  return (
    <div className="fixed bottom-8 right-8 z-30 select-none touch-none">
      <div
        ref={baseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`w-32 h-32 rounded-full border-2 border-cyan-500/50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center transition-opacity ${
          isActive ? 'opacity-100' : 'opacity-60'
        }`}
      >
        <div
          className="w-14 h-14 rounded-full bg-cyan-500/80 border border-cyan-300 shadow-[0_0_15px_#22d3ee] flex items-center justify-center font-mono text-[9px] text-slate-950 font-bold"
          style={{
            transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
          }}
        >
          MOVE
        </div>
      </div>
    </div>
  );
}

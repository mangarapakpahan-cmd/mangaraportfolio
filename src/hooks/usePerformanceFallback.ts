'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/lib/store';

export function usePerformanceFallback() {
  const { setDisplayMode, setFallbackTriggered } = useGameStore();
  const fpsSamples = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // 1. Cek Dukungan WebGL pada Browser
    const checkWebGLSupport = (): boolean => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || canvas.getContext('webgl2'))
        );
      } catch (e) {
        return false;
      }
    };

    if (!checkWebGLSupport()) {
      console.warn('Perangkat tidak mendukung WebGL. Mengalihkan ke Bento Grid Mode 2D.');
      setDisplayMode('bento');
      setFallbackTriggered(true);
      return;
    }

    // 2. Benchmark FPS Selama 3.5 Detik Pertama
    const benchmarkDurationMs = 3500;
    const startTime = performance.now();

    const measureFps = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (delta > 0) {
        const instantFps = 1000 / delta;
        fpsSamples.current.push(instantFps);
      }

      // Jika durasi sampling awal belum selesai
      if (now - startTime < benchmarkDurationMs) {
        rafId.current = requestAnimationFrame(measureFps);
      } else {
        // Hitung rata-rata FPS
        if (fpsSamples.current.length > 20) {
          const avgFps =
            fpsSamples.current.reduce((a, b) => a + b, 0) / fpsSamples.current.length;

          // Jika FPS drop di bawah 20 FPS selama startup
          if (avgFps < 20) {
            console.warn(`Performa GPU rendah terdeteksi (Rata-rata: ${Math.round(avgFps)} FPS). Beralih ke Bento Grid Mode.`);
            setDisplayMode('bento');
            setFallbackTriggered(true);
          }
        }
      }
    };

    rafId.current = requestAnimationFrame(measureFps);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [setDisplayMode, setFallbackTriggered]);
}

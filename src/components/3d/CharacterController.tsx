'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/lib/store';
import { audioEngine } from '@/lib/audioEngine';

export default function CharacterController() {
  const {
    playerPosition,
    setPlayerTransform,
    virtualMoveInput,
  } = useGameStore();

  const keys = useRef<{ [key: string]: boolean }>({});
  const moveSpeed = 4.5;
  const rotationY = useRef(0);
  const lastStepTime = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
      keys.current[e.code] = true; 
    };
    const handleKeyUp = (e: KeyboardEvent) => { 
      keys.current[e.code] = false; 
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const moveVec = new THREE.Vector3(0, 0, 0);

    if (keys.current['KeyW'] || keys.current['ArrowUp']) moveVec.z -= 1;
    if (keys.current['KeyS'] || keys.current['ArrowDown']) moveVec.z += 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveVec.x -= 1;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveVec.x += 1;

    if (virtualMoveInput.x !== 0 || virtualMoveInput.y !== 0) {
      moveVec.x += virtualMoveInput.x;
      moveVec.z += virtualMoveInput.y;
    }

    const isMoving = moveVec.lengthSq() > 0;

    if (isMoving) {
      moveVec.normalize();
      
      const targetRot = Math.atan2(-moveVec.x, -moveVec.z);
      rotationY.current = THREE.MathUtils.lerp(rotationY.current, targetRot, 0.2);

      const nextX = playerPosition[0] + moveVec.x * moveSpeed * delta;
      const nextZ = playerPosition[2] + moveVec.z * moveSpeed * delta;

      // Clamping batas jelajah studio (-14 sampai 14 X, -6 sampai 2 Z)
      const clampedX = Math.max(-13.5, Math.min(13.5, nextX));
      const clampedZ = Math.max(-5.5, Math.min(1.5, nextZ));

      setPlayerTransform([clampedX, playerPosition[1], clampedZ], rotationY.current);

      // Footstep sound feedback setiap 0.35 detik saat bergerak
      const now = state.clock.getElapsedTime();
      if (now - lastStepTime.current > 0.35) {
        lastStepTime.current = now;
        audioEngine.playSwitchClick();
      }
    }
  });

  // Invisible functional controller: Karakter manusia realistis terintegrasi langsung dalam backdrop studio
  return null;
}

'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/lib/store';

export default function CharacterController() {
  const { camera, gl } = useThree();
  const avatarRef = useRef<THREE.Group>(null);
  
  const {
    playerPosition,
    setPlayerTransform,
    cameraState,
    inspectTarget,
    inspectCamPos,
    isProjectModalOpen,
    virtualMoveInput
  } = useGameStore();

  const keys = useRef<{ [key: string]: boolean }>({});
  const moveSpeed = 5.2;
  const rotationY = useRef(0);
  const cameraPitch = useRef(0.22); // sudut elevasi vertikal
  const cameraDistance = 3.2; // jarak kamera di belakang karakter

  // Pasang listener keyboard dan pointer-lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
      keys.current[e.code] = true; 
    };
    const handleKeyUp = (e: KeyboardEvent) => { 
      keys.current[e.code] = false; 
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Rotasi kamera hanya aktif saat pointer locked, tidak sedang modal inspect terbuka
      if (document.pointerLockElement && cameraState === 'free' && !isProjectModalOpen) {
        rotationY.current -= e.movementX * 0.0024;
        cameraPitch.current = Math.max(
          -0.1, 
          Math.min(0.75, cameraPitch.current + e.movementY * 0.002)
        );
      }
    };

    const handleCanvasClick = () => {
      if (!isProjectModalOpen && cameraState === 'free') {
        gl.domElement.requestPointerLock?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('click', handleCanvasClick);
    };
  }, [cameraState, isProjectModalOpen, gl.domElement]);

  useFrame((_, delta) => {
    if (!avatarRef.current) return;

    if (cameraState === 'free' && !isProjectModalOpen) {
      // 1. Hitung vektor pergerakan WASD / Virtual Joystick
      const moveVec = new THREE.Vector3(0, 0, 0);

      // Keyboard input
      if (keys.current['KeyW'] || keys.current['ArrowUp']) moveVec.z -= 1;
      if (keys.current['KeyS'] || keys.current['ArrowDown']) moveVec.z += 1;
      if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveVec.x -= 1;
      if (keys.current['KeyD'] || keys.current['ArrowRight']) moveVec.x += 1;

      // Virtual joystick input untuk perangkat mobile
      if (virtualMoveInput.x !== 0 || virtualMoveInput.y !== 0) {
        moveVec.x += virtualMoveInput.x;
        moveVec.z += virtualMoveInput.y;
      }

      if (moveVec.lengthSq() > 0) {
        moveVec.normalize();
        moveVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY.current);
        
        const nextX = avatarRef.current.position.x + moveVec.x * moveSpeed * delta;
        const nextZ = avatarRef.current.position.z + moveVec.z * moveSpeed * delta;

        // Collision Clamping batas ruangan hanggar (-18 sampai 18 X, -14 sampai 14 Z)
        avatarRef.current.position.x = Math.max(-18.5, Math.min(18.5, nextX));
        avatarRef.current.position.z = Math.max(-13.5, Math.min(13.5, nextZ));
      }

      // 2. Sinkronkan rotasi avatar dan update posisi ke Zustand store
      avatarRef.current.rotation.y = rotationY.current;
      setPlayerTransform(
        [avatarRef.current.position.x, avatarRef.current.position.y, avatarRef.current.position.z],
        rotationY.current
      );

      // 3. Posisi kamera Third-Person Over-the-Shoulder
      const charPos = avatarRef.current.position;
      const camTargetPos = new THREE.Vector3(
        charPos.x + Math.sin(rotationY.current) * (cameraDistance * Math.cos(cameraPitch.current)),
        charPos.y + cameraDistance * Math.sin(cameraPitch.current) + 1.25,
        charPos.z + Math.cos(rotationY.current) * (cameraDistance * Math.cos(cameraPitch.current))
      );

      camera.position.lerp(camTargetPos, 0.12);
      camera.lookAt(charPos.x, charPos.y + 1.2, charPos.z);

    } else if (cameraState === 'inspecting' && inspectCamPos && inspectTarget) {
      // 4. Smooth Camera Lerp ke Layar Monitor Workstation (0.4–0.5 detik)
      const targetCam = new THREE.Vector3(...inspectCamPos);
      const targetLook = new THREE.Vector3(...inspectTarget);

      camera.position.lerp(targetCam, 0.08);

      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.add(camera.position);
      currentLookAt.lerp(targetLook, 0.08);
      camera.lookAt(currentLookAt);
    }
  });

  return (
    <group ref={avatarRef} position={playerPosition}>
      {/* Mesh Avatar Teknisi MCR (Kaos abu-abu industri, celana kargo) */}
      <mesh castShadow position={[0, 0.85, 0]}>
        <capsuleGeometry args={[0.32, 1.0, 8, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Kepala Teknisi */}
      <mesh castShadow position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} />
      </mesh>

      {/* Headset Intercom Audio Crew */}
      <mesh position={[0, 1.65, 0]}>
        <torusGeometry args={[0.21, 0.035, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>

      {/* Visor / Indikator Arah Hadap Karakter */}
      <mesh position={[0, 1.63, -0.19]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.06, 0.14, 8]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

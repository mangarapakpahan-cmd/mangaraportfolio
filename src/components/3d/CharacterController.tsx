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
    virtualMoveInput,
  } = useGameStore();

  const keys = useRef<{ [key: string]: boolean }>({});
  const moveSpeed = 4.8;
  const rotationY = useRef(0);
  const mouseLook = useRef({ x: 0, y: 0 });
  const walkCycle = useRef(0);

  // Listener input keyboard dan mouse parallax
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
      keys.current[e.code] = true; 
    };
    const handleKeyUp = (e: KeyboardEvent) => { 
      keys.current[e.code] = false; 
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Mouse Parallax dinamis untuk efek 3D camera depth
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseLook.current = { x: normX * 0.18, y: normY * 0.12 };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((_, delta) => {
    if (!avatarRef.current) return;

    if (cameraState === 'free') {
      // 1. Hitung vektor pergerakan WASD / Virtual Joystick
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
        
        // Arah rotasi hadap avatar
        const targetRot = Math.atan2(-moveVec.x, -moveVec.z);
        rotationY.current = THREE.MathUtils.lerp(rotationY.current, targetRot, 0.15);

        const nextX = avatarRef.current.position.x + moveVec.x * moveSpeed * delta;
        const nextZ = avatarRef.current.position.z + moveVec.z * moveSpeed * delta;

        // Collision Clamping batas studio (-14 sampai 14 X, -6 sampai 2 Z)
        avatarRef.current.position.x = Math.max(-13.5, Math.min(13.5, nextX));
        avatarRef.current.position.z = Math.max(-5.5, Math.min(1.5, nextZ));

        // Animasi siklus langkah kaki
        walkCycle.current += delta * 10;
      } else {
        // Idle breathing
        walkCycle.current += delta * 2;
      }

      avatarRef.current.rotation.y = rotationY.current;
      setPlayerTransform(
        [avatarRef.current.position.x, avatarRef.current.position.y, avatarRef.current.position.z],
        rotationY.current
      );

      // 2. Posisi Kamera Third-Person Over-The-Shoulder dengan Mouse Parallax
      const charPos = avatarRef.current.position;
      const camTargetPos = new THREE.Vector3(
        charPos.x * 0.45 + mouseLook.current.x * 2.2,
        charPos.y + 2.05 + mouseLook.current.y * 0.8,
        charPos.z + 4.8
      );

      camera.position.lerp(camTargetPos, 0.08);
      camera.lookAt(
        charPos.x * 0.55 + mouseLook.current.x,
        charPos.y + 1.6,
        charPos.z - 2.5
      );

    } else if (cameraState === 'inspecting' && inspectCamPos && inspectTarget) {
      // Camera Lerp ke Workstation
      const targetCam = new THREE.Vector3(...inspectCamPos);
      const targetLook = new THREE.Vector3(...inspectTarget);

      camera.position.lerp(targetCam, 0.07);

      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.add(camera.position);
      currentLookAt.lerp(targetLook, 0.07);
      camera.lookAt(currentLookAt);
    }
  });

  const bobOffset = Math.sin(walkCycle.current) * 0.035;

  return (
    <group ref={avatarRef} position={playerPosition}>
      
      {/* Bayangan Karakter di Lantai Beton */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>

      {/* Badan Karakter Humanoid Realistis (Perspektif Punggung/Third-Person) */}
      <group position={[0, bobOffset, 0]}>
        
        {/* Torso / Kaos Abu-Abu Kaos Kru Event */}
        <mesh castShadow position={[0, 1.25, 0]}>
          <boxGeometry args={[0.48, 0.62, 0.28]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>

        {/* Bahu Kiri & Kanan */}
        <mesh position={[-0.27, 1.48, 0]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        <mesh position={[0.27, 1.48, 0]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* Lengan Kaos Pendek & Tangan */}
        <mesh position={[-0.28, 1.15, 0]}>
          <cylinderGeometry args={[0.075, 0.065, 0.45, 12]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        <mesh position={[0.28, 1.15, 0]}>
          <cylinderGeometry args={[0.075, 0.065, 0.45, 12]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* Leher */}
        <mesh position={[0, 1.62, 0]}>
          <cylinderGeometry args={[0.08, 0.09, 0.12, 12]} />
          <meshStandardMaterial color="#e2a76f" roughness={0.6} />
        </mesh>

        {/* Kepala & Rambut Hitam Pendek Kru */}
        <mesh castShadow position={[0, 1.76, 0]}>
          <sphereGeometry args={[0.17, 20, 20]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>

        {/* Pinggang / Sabuk Rigging */}
        <mesh position={[0, 0.92, 0]}>
          <boxGeometry args={[0.42, 0.1, 0.26]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>

        {/* Celana Jeans Hitam / Dark Denim */}
        <mesh position={[-0.13, 0.52, 0]}>
          <cylinderGeometry args={[0.11, 0.095, 0.72, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.85} />
        </mesh>
        <mesh position={[0.13, 0.52, 0]}>
          <cylinderGeometry args={[0.11, 0.095, 0.72, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.85} />
        </mesh>

        {/* Sepatu Kru Hitam */}
        <mesh position={[-0.13, 0.08, 0.04]}>
          <boxGeometry args={[0.13, 0.14, 0.28]} />
          <meshStandardMaterial color="#0a0a0c" roughness={0.7} />
        </mesh>
        <mesh position={[0.13, 0.08, 0.04]}>
          <boxGeometry args={[0.13, 0.14, 0.28]} />
          <meshStandardMaterial color="#0a0a0c" roughness={0.7} />
        </mesh>

      </group>

    </group>
  );
}

import { create } from 'zustand';
import { ProjectWithMedia, WorkstationCategory } from './types';
import { FALLBACK_PROJECTS } from './data/fallbackProjects';

export interface GameState {
  // Display Mode
  displayMode: '3d' | 'bento';
  setDisplayMode: (mode: '3d' | 'bento') => void;

  // Fallback Telemetry
  fallbackTriggered: boolean;
  setFallbackTriggered: (val: boolean) => void;

  // Sound System
  isAudioMuted: boolean;
  toggleAudioMuted: () => void;

  // Avatar & Camera
  playerPosition: [number, number, number];
  playerRotation: number;
  setPlayerTransform: (pos: [number, number, number], rot: number) => void;

  // Proximity & Interaction
  nearbyZone: WorkstationCategory | 'server_rack' | null;
  setNearbyZone: (zone: WorkstationCategory | 'server_rack' | null) => void;
  
  // Camera State (Free Roam vs Inspect Workstation)
  cameraState: 'free' | 'inspecting';
  inspectTarget: [number, number, number] | null;
  inspectCamPos: [number, number, number] | null;
  startInspect: (target: [number, number, number], camPos: [number, number, number]) => void;
  exitInspect: () => void;

  // Project Modal & Active Data
  activeProject: ProjectWithMedia | null;
  isProjectModalOpen: boolean;
  activeCameraSlot: number;
  openProjectModal: (project: ProjectWithMedia) => void;
  closeProjectModal: () => void;
  toggleProjectModal: () => void;
  setActiveCameraSlot: (slot: number) => void;

  // Virtual Joystick input for mobile touch
  virtualMoveInput: { x: number; y: number };
  setVirtualMoveInput: (input: { x: number; y: number }) => void;

  // Performance telemetry
  currentFps: number;
  setCurrentFps: (fps: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  displayMode: '3d',
  setDisplayMode: (mode) => set({ displayMode: mode }),

  fallbackTriggered: false,
  setFallbackTriggered: (val) => set({ fallbackTriggered: val }),

  isAudioMuted: false,
  toggleAudioMuted: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),

  // Spawns standing in front of FOH Audio-Visual console
  playerPosition: [0, 0, -2.8],
  playerRotation: 0,
  setPlayerTransform: (pos, rot) => set({ playerPosition: pos, playerRotation: rot }),

  nearbyZone: 'foh_av',
  setNearbyZone: (zone) => set({ nearbyZone: zone }),

  cameraState: 'free',
  inspectTarget: null,
  inspectCamPos: null,
  startInspect: (target, camPos) => set({ 
    cameraState: 'inspecting', 
    inspectTarget: target, 
    inspectCamPos: camPos 
  }),
  exitInspect: () => set({ 
    cameraState: 'free', 
    inspectTarget: null, 
    inspectCamPos: null 
  }),

  // Project Showcase HUD Modal starts open on bottom-right as in reference image
  activeProject: FALLBACK_PROJECTS[0],
  isProjectModalOpen: true,
  activeCameraSlot: 1,
  openProjectModal: (project) => set({ 
    activeProject: project, 
    isProjectModalOpen: true, 
    activeCameraSlot: 1 
  }),
  closeProjectModal: () => set({ 
    isProjectModalOpen: false, 
  }),
  toggleProjectModal: () => set((state) => ({ 
    isProjectModalOpen: !state.isProjectModalOpen 
  })),
  setActiveCameraSlot: (slot) => set({ activeCameraSlot: slot }),

  virtualMoveInput: { x: 0, y: 0 },
  setVirtualMoveInput: (input) => set({ virtualMoveInput: input }),

  currentFps: 60,
  setCurrentFps: (fps) => set({ currentFps: fps }),
}));

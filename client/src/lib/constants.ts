import * as THREE from 'three';
import { ActivityMode, NetworkConfig, PerformanceConfig } from './types';

/**
 * Palette de couleurs NeuroSynapse
 */
export const COLORS = {
  // Couleurs des neurones
  NEURON_BLUE: new THREE.Color(0x00d4ff), // Bleu électrique
  NEURON_GREEN: new THREE.Color(0x00ff88), // Vert émeraude
  NEURON_PURPLE: new THREE.Color(0xb300ff), // Violet lumineux
  NEURON_ORANGE: new THREE.Color(0xff6b00), // Orange néon
  NEURON_WHITE: new THREE.Color(0xffffff), // Blanc pur
  
  // Couleurs des connexions
  CONNECTION_CYAN: new THREE.Color(0x00d4ff), // Cyan translucide
  CONNECTION_GREEN: new THREE.Color(0x00ff88),
  CONNECTION_PURPLE: new THREE.Color(0xb300ff),
  
  // Fond
  BACKGROUND_BLACK: 0x000000,
  BACKGROUND_BLUE_NIGHT: 0x0a0e27,
};

/**
 * Configuration par mode d'activité
 */
export const MODE_CONFIGS: Record<ActivityMode, Partial<NetworkConfig>> = {
  [ActivityMode.CALM]: {
    initialNeuronCount: 50,
    maxNeuronCount: 100,
    connectionDistance: 2.5,
    connectionProbability: 0.2,
    maxConnectionsPerNeuron: 3,
    growthInterval: 5000, // 5 secondes
    neuronsPerGrowth: 5,
  },
  [ActivityMode.NORMAL]: {
    initialNeuronCount: 100,
    maxNeuronCount: 400,
    connectionDistance: 3.5,
    connectionProbability: 0.3,
    maxConnectionsPerNeuron: 5,
    growthInterval: 2500, // 2.5 secondes
    neuronsPerGrowth: 8,
  },
  [ActivityMode.OVERLOAD]: {
    initialNeuronCount: 300,
    maxNeuronCount: 1500,
    connectionDistance: 4.5,
    connectionProbability: 0.5,
    maxConnectionsPerNeuron: 12,
    growthInterval: 1000, // 1 seconde
    neuronsPerGrowth: 20,
  },
};

/**
 * Configuration de base du réseau
 */
export const DEFAULT_NETWORK_CONFIG: NetworkConfig = {
  initialNeuronCount: 100,
  maxNeuronCount: 400,
  connectionDistance: 3.5,
  connectionProbability: 0.3,
  maxConnectionsPerNeuron: 5,
  sphereRadius: 10,
  growthInterval: 2500,
  neuronsPerGrowth: 8,
};

/**
 * Configuration de performance
 */
export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  useInstancedMesh: true,
  enablePostProcessing: true,
  targetFPS: 60,
  simplifiedMode: false,
};

/**
 * Configuration mobile (simplifiée)
 */
export const MOBILE_PERFORMANCE_CONFIG: PerformanceConfig = {
  useInstancedMesh: true,
  enablePostProcessing: false,
  targetFPS: 30,
  simplifiedMode: true,
};

/**
 * Textes narratifs pour l'expérience
 */
export const NARRATIVE_TEXTS = [
  {
    time: 0,
    text: "Au début, le cerveau est silencieux…",
    duration: 5000,
  },
  {
    time: 10000,
    text: "Puis les premières connexions émergent…",
    duration: 5000,
  },
  {
    time: 20000,
    text: "Chaque pensée crée un nouveau chemin…",
    duration: 5000,
  },
  {
    time: 30000,
    text: "Les neurones s'organisent, se reconnectent…",
    duration: 5000,
  },
  {
    time: 40000,
    text: "Le réseau grandit de façon exponentielle…",
    duration: 5000,
  },
  {
    time: 50000,
    text: "Des milliards de connexions. Une conscience.",
    duration: 5000,
  },
];

/**
 * Paramètres de caméra
 */
export const CAMERA_CONFIG = {
  position: [0, 0, 25] as [number, number, number],
  fov: 60,
  near: 0.1,
  far: 1000,
};

/**
 * Paramètres de taille des particules
 */
export const PARTICLE_SIZES = {
  MIN: 0.05,
  MAX: 0.15,
  ACTIVE_MULTIPLIER: 1.5,
};

/**
 * Paramètres d'opacité des connexions
 */
export const CONNECTION_OPACITY = {
  MIN: 0.1,
  MAX: 0.7,
  ACTIVE: 0.9,
};

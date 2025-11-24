import * as THREE from 'three';

/**
 * Représente un neurone dans le réseau
 */
export interface Neuron {
  id: number;
  position: THREE.Vector3;
  color: THREE.Color;
  size: number;
  active: boolean;
  connections: number[]; // IDs des neurones connectés
  activationLevel: number; // 0-1, intensité d'activation
}

/**
 * Représente une connexion synaptique entre deux neurones
 */
export interface Connection {
  id: number;
  from: number; // ID du neurone source
  to: number; // ID du neurone cible
  strength: number; // Force de la connexion (0-1)
  opacity: number; // Opacité visuelle (0-1)
  active: boolean;
}

/**
 * Modes d'activité du réseau neuronal
 */
export enum ActivityMode {
  CALM = 'calm',
  NORMAL = 'normal',
  OVERLOAD = 'overload'
}

/**
 * État global du réseau neuronal
 */
export interface NetworkState {
  neurons: Neuron[];
  connections: Connection[];
  mode: ActivityMode;
  activityLevel: number; // 0-100, contrôlé par le slider
  neuronCount: number;
  connectionCount: number;
  isGrowing: boolean;
  growthSpeed: number; // Vitesse de croissance (neurones ajoutés par seconde)
  selectedNeuronId: number | null; // ID du neurone sélectionné
  history: {
    timestamp: number;
    neuronCount: number;
    connectionCount: number;
  }[]; // Historique pour les graphiques
}

/**
 * Paramètres de configuration du réseau
 */
export interface NetworkConfig {
  initialNeuronCount: number;
  maxNeuronCount: number;
  connectionDistance: number; // Distance maximale pour créer une connexion
  connectionProbability: number; // Probabilité de connexion (0-1)
  maxConnectionsPerNeuron: number;
  sphereRadius: number; // Rayon de la sphère contenant les neurones
  growthInterval: number; // Intervalle entre ajouts de neurones (ms)
  neuronsPerGrowth: number; // Nombre de neurones ajoutés à chaque croissance
}

/**
 * Paramètres de performance
 */
export interface PerformanceConfig {
  useInstancedMesh: boolean; // Utiliser InstancedMesh pour optimisation
  enablePostProcessing: boolean; // Activer bloom et effets
  targetFPS: number;
  simplifiedMode: boolean; // Mode simplifié pour mobile
}

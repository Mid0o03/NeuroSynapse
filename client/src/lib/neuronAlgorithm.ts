import * as THREE from 'three';
import { Neuron, Connection, NetworkConfig, ActivityMode } from './types';
import { COLORS, MODE_CONFIGS } from './constants';

/**
 * Génère une position aléatoire dans une sphère
 */
export function generateRandomPositionInSphere(radius: number): THREE.Vector3 {
  // Méthode de rejection sampling pour distribution uniforme dans une sphère
  const u = Math.random();
  const v = Math.random();
  const theta = u * 2.0 * Math.PI;
  const phi = Math.acos(2.0 * v - 1.0);
  const r = Math.cbrt(Math.random()) * radius;
  
  const sinPhi = Math.sin(phi);
  const x = r * sinPhi * Math.cos(theta);
  const y = r * sinPhi * Math.sin(theta);
  const z = r * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

/**
 * Génère une couleur de neurone selon son niveau d'activation
 */
export function getNeuronColor(activationLevel: number, mode: ActivityMode): THREE.Color {
  const color = new THREE.Color();
  
  if (mode === ActivityMode.CALM) {
    // Bleu froid pour mode calme
    color.lerpColors(COLORS.NEURON_BLUE, COLORS.NEURON_WHITE, activationLevel * 0.3);
  } else if (mode === ActivityMode.NORMAL) {
    // Mix bleu-vert pour mode normal
    if (activationLevel < 0.5) {
      color.lerpColors(COLORS.NEURON_BLUE, COLORS.NEURON_GREEN, activationLevel * 2);
    } else {
      color.lerpColors(COLORS.NEURON_GREEN, COLORS.NEURON_WHITE, (activationLevel - 0.5) * 2);
    }
  } else {
    // Mix vert-violet-orange pour mode overload
    if (activationLevel < 0.33) {
      color.lerpColors(COLORS.NEURON_GREEN, COLORS.NEURON_PURPLE, activationLevel * 3);
    } else if (activationLevel < 0.66) {
      color.lerpColors(COLORS.NEURON_PURPLE, COLORS.NEURON_ORANGE, (activationLevel - 0.33) * 3);
    } else {
      color.lerpColors(COLORS.NEURON_ORANGE, COLORS.NEURON_WHITE, (activationLevel - 0.66) * 3);
    }
  }
  
  return color;
}

/**
 * Crée un nouveau neurone
 */
export function createNeuron(
  id: number,
  position: THREE.Vector3,
  mode: ActivityMode = ActivityMode.NORMAL
): Neuron {
  const activationLevel = Math.random();
  
  return {
    id,
    position,
    color: getNeuronColor(activationLevel, mode),
    size: 0.08 + Math.random() * 0.07, // Taille variable
    active: Math.random() > 0.5,
    connections: [],
    activationLevel,
  };
}

/**
 * Génère un réseau initial de neurones
 */
export function generateInitialNeurons(
  count: number,
  radius: number,
  mode: ActivityMode = ActivityMode.NORMAL
): Neuron[] {
  const neurons: Neuron[] = [];
  
  for (let i = 0; i < count; i++) {
    const position = generateRandomPositionInSphere(radius);
    neurons.push(createNeuron(i, position, mode));
  }
  
  return neurons;
}

/**
 * Calcule la distance entre deux neurones
 */
export function calculateDistance(neuron1: Neuron, neuron2: Neuron): number {
  return neuron1.position.distanceTo(neuron2.position);
}

/**
 * Détermine si deux neurones doivent être connectés
 */
export function shouldConnect(
  neuron1: Neuron,
  neuron2: Neuron,
  config: NetworkConfig
): boolean {
  // Vérifier la distance
  const distance = calculateDistance(neuron1, neuron2);
  if (distance > config.connectionDistance) {
    return false;
  }
  
  // Vérifier le nombre maximum de connexions
  if (
    neuron1.connections.length >= config.maxConnectionsPerNeuron ||
    neuron2.connections.length >= config.maxConnectionsPerNeuron
  ) {
    return false;
  }
  
  // Vérifier si déjà connectés
  if (neuron1.connections.includes(neuron2.id)) {
    return false;
  }
  
  // Probabilité de connexion
  return Math.random() < config.connectionProbability;
}

/**
 * Crée une connexion entre deux neurones
 */
export function createConnection(
  id: number,
  neuron1: Neuron,
  neuron2: Neuron
): Connection {
  // Ajouter la connexion aux neurones
  neuron1.connections.push(neuron2.id);
  neuron2.connections.push(neuron1.id);
  
  const strength = 0.3 + Math.random() * 0.7;
  
  return {
    id,
    from: neuron1.id,
    to: neuron2.id,
    strength,
    opacity: strength * 0.5,
    active: Math.random() > 0.7,
  };
}

/**
 * Génère les connexions pour un réseau de neurones
 */
export function generateConnections(
  neurons: Neuron[],
  config: NetworkConfig
): Connection[] {
  const connections: Connection[] = [];
  let connectionId = 0;
  
  // Parcourir toutes les paires de neurones
  for (let i = 0; i < neurons.length; i++) {
    for (let j = i + 1; j < neurons.length; j++) {
      if (shouldConnect(neurons[i], neurons[j], config)) {
        connections.push(
          createConnection(connectionId++, neurons[i], neurons[j])
        );
      }
    }
  }
  
  return connections;
}

/**
 * Ajoute de nouveaux neurones au réseau existant
 */
export function addNeurons(
  existingNeurons: Neuron[],
  count: number,
  radius: number,
  config: NetworkConfig,
  mode: ActivityMode = ActivityMode.NORMAL
): { neurons: Neuron[]; newConnections: Connection[] } {
  const startId = existingNeurons.length;
  const newNeurons: Neuron[] = [];
  const newConnections: Connection[] = [];
  let connectionId = existingNeurons.reduce(
    (max, n) => Math.max(max, ...n.connections),
    0
  ) + 1;
  
  // Créer les nouveaux neurones
  for (let i = 0; i < count; i++) {
    const position = generateRandomPositionInSphere(radius);
    newNeurons.push(createNeuron(startId + i, position, mode));
  }
  
  // Connecter les nouveaux neurones aux existants et entre eux
  const allNeurons = [...existingNeurons, ...newNeurons];
  
  for (const newNeuron of newNeurons) {
    for (const existingNeuron of allNeurons) {
      if (newNeuron.id === existingNeuron.id) continue;
      
      if (shouldConnect(newNeuron, existingNeuron, config)) {
        newConnections.push(
          createConnection(connectionId++, newNeuron, existingNeuron)
        );
      }
    }
  }
  
  return {
    neurons: newNeurons,
    newConnections,
  };
}

/**
 * Met à jour les couleurs des neurones selon le mode
 */
export function updateNeuronColors(neurons: Neuron[], mode: ActivityMode): void {
  for (const neuron of neurons) {
    neuron.color = getNeuronColor(neuron.activationLevel, mode);
  }
}

/**
 * Anime l'activation des neurones (effet de pulsation)
 */
export function animateNeuronActivation(neuron: Neuron, deltaTime: number): void {
  // Variation sinusoïdale de l'activation
  const time = Date.now() * 0.001;
  neuron.activationLevel = 0.3 + Math.sin(time + neuron.id * 0.1) * 0.3 + 0.4;
  
  // Mouvement brownien léger
  const brownianSpeed = 0.01;
  neuron.position.x += (Math.random() - 0.5) * brownianSpeed * deltaTime;
  neuron.position.y += (Math.random() - 0.5) * brownianSpeed * deltaTime;
  neuron.position.z += (Math.random() - 0.5) * brownianSpeed * deltaTime;
  
  // Garder dans la sphère
  const distance = neuron.position.length();
  if (distance > 10) {
    neuron.position.multiplyScalar(10 / distance);
  }
}

/**
 * Anime les connexions (pulsations)
 */
export function animateConnection(connection: Connection, neurons: Neuron[]): void {
  const fromNeuron = neurons.find(n => n.id === connection.from);
  const toNeuron = neurons.find(n => n.id === connection.to);
  
  if (fromNeuron && toNeuron) {
    // La connexion est active si les deux neurones sont activés
    connection.active = fromNeuron.active && toNeuron.active;
    
    // Opacité basée sur l'activation des neurones
    const avgActivation = (fromNeuron.activationLevel + toNeuron.activationLevel) / 2;
    connection.opacity = connection.strength * avgActivation * 0.7;
  }
}

/**
 * Obtient la configuration selon le mode d'activité
 */
export function getConfigForMode(
  baseConfig: NetworkConfig,
  mode: ActivityMode
): NetworkConfig {
  return {
    ...baseConfig,
    ...MODE_CONFIGS[mode],
  };
}

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Connection, Neuron } from '@/lib/types';
import { animateConnection } from '@/lib/neuronAlgorithm';
import { COLORS } from '@/lib/constants';

interface ConnectionSystemProps {
  connections: Connection[];
  neurons: Neuron[];
}

/**
 * Composant qui affiche les connexions entre neurones
 */
export function ConnectionSystem({ connections, neurons }: ConnectionSystemProps) {
  const lineSegmentsRef = useRef<THREE.LineSegments>(null);
  const connectionsRef = useRef<Connection[]>(connections);
  const neuronsRef = useRef<Neuron[]>(neurons);
  
  // Mettre à jour les références
  useEffect(() => {
    connectionsRef.current = connections;
    neuronsRef.current = neurons;
  }, [connections, neurons]);
  
  // Créer la géométrie et le matériau
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    return { geometry: geo, material: mat };
  }, []);
  
  // Créer une map pour accès rapide aux neurones par ID
  const neuronMap = useMemo(() => {
    const map = new Map<number, Neuron>();
    neurons.forEach(n => map.set(n.id, n));
    return map;
  }, [neurons]);
  
  // Mettre à jour les connexions à chaque frame
  useFrame(() => {
    if (!lineSegmentsRef.current) return;
    
    const positions: number[] = [];
    const colors: number[] = [];
    
    connectionsRef.current.forEach(connection => {
      // Animer la connexion
      animateConnection(connection, neuronsRef.current);
      
      const fromNeuron = neuronMap.get(connection.from);
      const toNeuron = neuronMap.get(connection.to);
      
      if (!fromNeuron || !toNeuron) return;
      
      // Position de départ
      positions.push(
        fromNeuron.position.x,
        fromNeuron.position.y,
        fromNeuron.position.z
      );
      
      // Position d'arrivée
      positions.push(
        toNeuron.position.x,
        toNeuron.position.y,
        toNeuron.position.z
      );
      
      // Couleur basée sur l'opacité et l'activation
      const color = connection.active 
        ? COLORS.CONNECTION_GREEN 
        : COLORS.CONNECTION_CYAN;
      
      const opacity = connection.opacity;
      
      // Couleur pour le point de départ
      colors.push(color.r * opacity, color.g * opacity, color.b * opacity);
      
      // Couleur pour le point d'arrivée
      colors.push(color.r * opacity, color.g * opacity, color.b * opacity);
    });
    
    // Mettre à jour les attributs
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    );
    
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.computeBoundingSphere();
  });
  
  return (
    <lineSegments ref={lineSegmentsRef} geometry={geometry} material={material} />
  );
}

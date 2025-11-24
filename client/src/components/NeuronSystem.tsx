import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Neuron } from '@/lib/types';
import { animateNeuronActivation, getNeuronColor } from '@/lib/neuronAlgorithm';

interface NeuronSystemProps {
  neurons: Neuron[];
  mode: string;
  onNeuronClick?: (neuronId: number) => void;
  selectedNeuronId?: number | null;
}

/**
 * Composant qui affiche les neurones sous forme de particules lumineuses
 */
export function NeuronSystem({ neurons, mode, onNeuronClick, selectedNeuronId }: NeuronSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const neuronsRef = useRef<Neuron[]>(neurons);

  // Mettre à jour la référence des neurones
  useEffect(() => {
    neuronsRef.current = neurons;
  }, [neurons]);

  // Créer la géométrie et le matériau
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat };
  }, []);

  // Mettre à jour les positions et couleurs à chaque frame
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    neuronsRef.current.forEach(neuron => {
      // Animer le neurone
      animateNeuronActivation(neuron, delta);

      // Déterminer si le neurone est sélectionné ou connecté au sélectionné
      const isSelected = selectedNeuronId === neuron.id;
      const isConnected = selectedNeuronId !== null && selectedNeuronId !== undefined
        ? neuron.connections.includes(selectedNeuronId)
        : false;

      // Mettre à jour la couleur selon l'activation
      let color = getNeuronColor(neuron.activationLevel, mode as any);

      // Modifier la couleur si sélectionné
      if (isSelected) {
        color = new THREE.Color(1, 1, 1); // Blanc pur pour la sélection
      } else if (selectedNeuronId !== null && selectedNeuronId !== undefined && !isConnected) {
        // Assombrir les non-connectés si une sélection est active
        color = color.clone().multiplyScalar(0.3);
      }

      neuron.color = color;

      // Ajouter position
      positions.push(neuron.position.x, neuron.position.y, neuron.position.z);

      // Ajouter couleur
      colors.push(color.r, color.g, color.b);

      // Ajouter taille (varie selon l'activation et la sélection)
      let sizeMultiplier = neuron.active ? 1.5 : 1.0;
      if (isSelected) sizeMultiplier = 2.5;
      else if (isConnected) sizeMultiplier = 1.8;

      sizes.push(neuron.size * sizeMultiplier);
    });

    // Mettre à jour les attributs de la géométrie
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    );

    // Note: Three.js Points ne supporte pas nativement les tailles variables par particule
    // Pour cela, il faudrait un shader personnalisé
    // Pour l'instant, on utilise une taille fixe mais on pourrait changer la taille globale
    // si un neurone est sélectionné pour faire un effet de focus

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.computeBoundingSphere();
  });

  const handleClick = (event: any) => {
    if (!onNeuronClick || !neuronsRef.current) return;

    // L'index du point cliqué est dans event.index
    const index = event.index;
    if (index !== undefined && neuronsRef.current[index]) {
      event.stopPropagation();
      onNeuronClick(neuronsRef.current[index].id);
    }
  };

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      onClick={handleClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    />
  );
}

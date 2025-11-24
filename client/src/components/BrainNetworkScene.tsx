import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { NeuronSystem } from './NeuronSystem';
import { ConnectionSystem } from './ConnectionSystem';
import { Annotations } from './Annotations';
import { NetworkState } from '@/lib/types';
import { CAMERA_CONFIG } from '@/lib/constants';

interface BrainNetworkSceneProps {
  networkState: NetworkState;
  onNeuronSelect: (id: number | null) => void;
}

/**
 * Composant qui gère le mouvement de caméra vers le neurone sélectionné
 */
function CameraController({ selectedNeuronId, neurons }: { selectedNeuronId: number | null, neurons: any[] }) {
  const { camera, controls } = useThree();
  const targetPosition = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (selectedNeuronId !== null) {
      const neuron = neurons.find(n => n.id === selectedNeuronId);
      if (neuron) {
        // Définir la position cible (un peu décalée pour voir le neurone)
        targetPosition.current = new THREE.Vector3(
          neuron.position.x,
          neuron.position.y,
          neuron.position.z
        );
      }
    } else {
      targetPosition.current = null;
    }
  }, [selectedNeuronId, neurons]);

  useFrame((state, delta) => {
    if (targetPosition.current) {
      const controls = (state.controls as any);
      if (controls) {
        // Interpoler la cible des contrôles vers le neurone
        controls.target.lerp(targetPosition.current, 2 * delta);
        controls.update();
      }
    }
  });

  return null;
}

/**
 * Scène 3D principale contenant le réseau neuronal
 */
export function BrainNetworkScene({ networkState, onNeuronSelect }: BrainNetworkSceneProps) {
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        camera={{
          position: CAMERA_CONFIG.position,
          fov: CAMERA_CONFIG.fov,
          near: CAMERA_CONFIG.near,
          far: CAMERA_CONFIG.far,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onPointerMissed={() => onNeuronSelect(null)}
      >
        {/* Lumière ambiante */}
        <ambientLight intensity={0.3} />

        {/* Lumière directionnelle */}
        <directionalLight position={[10, 10, 5]} intensity={0.5} />

        {/* Étoiles en arrière-plan pour effet spatial */}
        <Stars
          radius={100}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* Contrôleur de caméra pour le focus */}
        <CameraController
          selectedNeuronId={networkState.selectedNeuronId}
          neurons={networkState.neurons}
        />

        {/* Annotations pour le neurone sélectionné */}
        <Annotations
          selectedNeuronId={networkState.selectedNeuronId}
          neurons={networkState.neurons}
        />

        {/* Système de neurones */}
        <NeuronSystem
          neurons={networkState.neurons}
          mode={networkState.mode}
          onNeuronClick={onNeuronSelect}
          selectedNeuronId={networkState.selectedNeuronId}
        />

        {/* Système de connexions */}
        <ConnectionSystem
          connections={networkState.connections}
          neurons={networkState.neurons}
        />

        {/* Contrôles de caméra */}
        <OrbitControls
          makeDefault
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
          minDistance={2}
          maxDistance={50}
          autoRotate={!networkState.selectedNeuronId} // Arrêter la rotation si sélectionné
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}

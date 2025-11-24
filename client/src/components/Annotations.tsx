import { Html } from '@react-three/drei';
import { Neuron } from '@/lib/types';

interface AnnotationsProps {
    selectedNeuronId: number | null;
    neurons: Neuron[];
}

/**
 * Affiche des annotations 3D pour le neurone sélectionné
 */
export function Annotations({ selectedNeuronId, neurons }: AnnotationsProps) {
    if (selectedNeuronId === null) return null;

    const selectedNeuron = neurons.find(n => n.id === selectedNeuronId);
    if (!selectedNeuron) return null;

    return (
        <group position={[selectedNeuron.position.x, selectedNeuron.position.y, selectedNeuron.position.z]}>
            <Html distanceFactor={10}>
                <div className="bg-black/80 border border-blue-500/50 p-2 rounded text-xs text-blue-100 backdrop-blur-sm pointer-events-none select-none whitespace-nowrap transform -translate-y-8">
                    <div className="font-bold text-blue-400">Neurone #{selectedNeuron.id}</div>
                    <div>Activation: {Math.round(selectedNeuron.activationLevel * 100)}%</div>
                    <div>Connexions: {selectedNeuron.connections.length}</div>
                </div>
            </Html>
        </group>
    );
}

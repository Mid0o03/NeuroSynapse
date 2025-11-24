import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Neuron } from '@/lib/types';

interface NeuronDetailsProps {
    selectedNeuronId: number | null;
    neurons: Neuron[];
    onClose: () => void;
}

/**
 * Affiche les détails du neurone sélectionné
 */
export function NeuronDetails({ selectedNeuronId, neurons, onClose }: NeuronDetailsProps) {
    if (selectedNeuronId === null) return null;

    const neuron = neurons.find(n => n.id === selectedNeuronId);
    if (!neuron) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-20 left-6 bg-card/80 backdrop-blur-md border border-border/50 rounded-lg p-4 w-72 shadow-lg z-10"
        >
            <div className="flex justify-between items-center mb-4 border-b border-border/30 pb-2">
                <h3 className="text-lg font-bold text-primary">Neurone #{neuron.id}</h3>
                <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Activation:</span>
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-secondary/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-secondary transition-all duration-300"
                                style={{ width: `${neuron.activationLevel * 100}%` }}
                            />
                        </div>
                        <span className="font-mono">{Math.round(neuron.activationLevel * 100)}%</span>
                    </div>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">Connexions:</span>
                    <span className="font-mono">{neuron.connections.length}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">Position:</span>
                    <span className="font-mono text-xs text-muted-foreground">
                        [{neuron.position.x.toFixed(1)}, {neuron.position.y.toFixed(1)}, {neuron.position.z.toFixed(1)}]
                    </span>
                </div>

                <div className="pt-2">
                    <div className="text-xs text-muted-foreground mb-1">Activité récente</div>
                    <div className="h-10 flex items-end gap-[2px]">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-primary/40 rounded-t-sm"
                                style={{
                                    height: `${Math.random() * 100}%`,
                                    opacity: 0.3 + Math.random() * 0.7
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

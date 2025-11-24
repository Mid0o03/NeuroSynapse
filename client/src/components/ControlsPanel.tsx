import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ActivityMode } from '@/lib/types';
import { Zap, Wind, Flame } from 'lucide-react';

interface ControlsPanelProps {
  activityLevel: number;
  mode: ActivityMode;
  onActivityChange: (value: number) => void;
  onModeChange: (mode: ActivityMode) => void;
  neuronCount: number;
  connectionCount: number;
}

/**
 * Panneau de contrôle pour ajuster l'activité du réseau
 */
export function ControlsPanel({
  activityLevel,
  mode,
  onActivityChange,
  onModeChange,
  neuronCount,
  connectionCount,
}: ControlsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed bottom-6 right-6 bg-card/80 backdrop-blur-md border border-border rounded-xl p-6 shadow-2xl min-w-[320px]"
    >
      {/* Titre */}
      <h3 className="text-sm font-semibold mb-4 text-foreground/90 uppercase tracking-wider">
        Contrôle d'activité
      </h3>
      
      {/* Slider d'activité */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-muted-foreground">
            Activité cérébrale
          </label>
          <span className="text-xs font-mono text-primary">
            {activityLevel}%
          </span>
        </div>
        <Slider
          value={[activityLevel]}
          onValueChange={(values) => onActivityChange(values[0])}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
      
      {/* Boutons de mode */}
      <div className="space-y-2 mb-6">
        <p className="text-xs text-muted-foreground mb-2">Mode</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={mode === ActivityMode.CALM ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange(ActivityMode.CALM)}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Wind className="w-4 h-4" />
            <span className="text-xs">Calme</span>
          </Button>
          
          <Button
            variant={mode === ActivityMode.NORMAL ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange(ActivityMode.NORMAL)}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Zap className="w-4 h-4" />
            <span className="text-xs">Normal</span>
          </Button>
          
          <Button
            variant={mode === ActivityMode.OVERLOAD ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange(ActivityMode.OVERLOAD)}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Flame className="w-4 h-4" />
            <span className="text-xs">Intense</span>
          </Button>
        </div>
      </div>
      
      {/* Statistiques */}
      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Neurones</span>
          <span className="text-xs font-mono text-secondary">
            {neuronCount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Connexions</span>
          <span className="text-xs font-mono text-accent">
            {connectionCount.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

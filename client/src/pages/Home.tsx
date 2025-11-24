import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ControlsPanel } from '@/components/ControlsPanel';
import { NarrativeText } from '@/components/NarrativeText';
import { InfoOverlay } from '@/components/InfoOverlay';
import { StatsDisplay } from '@/components/StatsDisplay';
import { NeuronDetails } from '@/components/NeuronDetails';
import { useNeuronNetwork } from '@/hooks/useNeuronNetwork';

// Lazy load du composant 3D pour éviter les erreurs de chargement
const BrainNetworkScene = lazy(() =>
  import('@/components/BrainNetworkScene').then(module => ({
    default: module.BrainNetworkScene
  }))
);

/**
 * Page principale de l'expérience NeuroSynapse
 */
export default function Home() {
  const {
    networkState,
    setMode,
    setActivityLevel,
    selectNeuron,
    exportData,
  } = useNeuronNetwork();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Titre principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="fixed top-6 left-6 z-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-wider">
          NeuroSynapse
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visualisation de la plasticité cérébrale
        </p>
      </motion.div>

      {/* Scène 3D avec Suspense pour le chargement */}
      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Chargement de la scène 3D...</p>
          </div>
        </div>
      }>
        <BrainNetworkScene
          networkState={networkState}
          onNeuronSelect={selectNeuron}
        />
      </Suspense>

      {/* Textes narratifs */}
      <NarrativeText />

      {/* Panneau de contrôle */}
      <ControlsPanel
        activityLevel={networkState.activityLevel}
        mode={networkState.mode}
        onActivityChange={setActivityLevel}
        onModeChange={setMode}
        neuronCount={networkState.neuronCount}
        connectionCount={networkState.connectionCount}
      />

      {/* Statistiques */}
      <StatsDisplay
        neuronCount={networkState.neuronCount}
        connectionCount={networkState.connectionCount}
        history={networkState.history}
        onExport={exportData}
      />

      {/* Détails du neurone sélectionné */}
      <NeuronDetails
        selectedNeuronId={networkState.selectedNeuronId}
        neurons={networkState.neurons}
        onClose={() => selectNeuron(null)}
      />

      {/* Overlay d'informations */}
      <InfoOverlay />
    </div>
  );
}

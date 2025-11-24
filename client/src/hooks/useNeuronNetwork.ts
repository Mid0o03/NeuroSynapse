import { useState, useCallback, useRef, useEffect } from 'react';
import { NetworkState, ActivityMode, NetworkConfig } from '@/lib/types';
import {
  generateInitialNeurons,
  generateConnections,
  addNeurons,
  updateNeuronColors,
  getConfigForMode,
} from '@/lib/neuronAlgorithm';
import { DEFAULT_NETWORK_CONFIG } from '@/lib/constants';

/**
 * Hook personnalisé pour gérer le réseau neuronal
 */
export function useNeuronNetwork(initialConfig: NetworkConfig = DEFAULT_NETWORK_CONFIG) {
  const [networkState, setNetworkState] = useState<NetworkState>(() => {
    const neurons = generateInitialNeurons(
      initialConfig.initialNeuronCount,
      initialConfig.sphereRadius,
      ActivityMode.NORMAL
    );
    const connections = generateConnections(neurons, initialConfig);

    return {
      neurons,
      connections,
      mode: ActivityMode.NORMAL,
      activityLevel: 50,
      neuronCount: neurons.length,
      connectionCount: connections.length,
      isGrowing: true,
      growthSpeed: 1,
      selectedNeuronId: null,
      history: [{
        timestamp: Date.now(),
        neuronCount: neurons.length,
        connectionCount: connections.length
      }],
    };
  });

  const configRef = useRef<NetworkConfig>(initialConfig);
  const growthTimerRef = useRef<number | null>(null);

  /**
   * Change le mode d'activité du réseau
   */
  const setMode = useCallback((mode: ActivityMode) => {
    setNetworkState(prev => {
      const newConfig = getConfigForMode(configRef.current, mode);
      configRef.current = newConfig;

      // Mettre à jour les couleurs des neurones
      updateNeuronColors(prev.neurons, mode);

      return {
        ...prev,
        mode,
      };
    });
  }, []);

  /**
   * Change le niveau d'activité (0-100)
   */
  const setActivityLevel = useCallback((level: number) => {
    setNetworkState(prev => ({
      ...prev,
      activityLevel: Math.max(0, Math.min(100, level)),
    }));

    // Ajuster la configuration selon le niveau
    const normalizedLevel = level / 100;
    configRef.current = {
      ...configRef.current,
      connectionProbability: 0.2 + normalizedLevel * 0.4,
      growthInterval: 5000 - normalizedLevel * 4000, // 5s à 1s
      neuronsPerGrowth: Math.floor(5 + normalizedLevel * 15), // 5 à 20
    };
  }, []);

  /**
   * Ajoute de nouveaux neurones au réseau
   */
  const growNetwork = useCallback(() => {
    setNetworkState(prev => {
      // Ne pas dépasser le maximum
      if (prev.neuronCount >= configRef.current.maxNeuronCount) {
        return prev;
      }

      const count = Math.min(
        configRef.current.neuronsPerGrowth,
        configRef.current.maxNeuronCount - prev.neuronCount
      );

      const { neurons: newNeurons, newConnections } = addNeurons(
        prev.neurons,
        count,
        configRef.current.sphereRadius,
        configRef.current,
        prev.mode
      );

      const allNeurons = [...prev.neurons, ...newNeurons];
      const allConnections = [...prev.connections, ...newConnections];

      return {
        ...prev,
        neurons: allNeurons,
        connections: allConnections,
        neuronCount: allNeurons.length,
        connectionCount: allConnections.length,
      };
    });
  }, []);

  /**
   * Démarre la croissance automatique
   */
  const startGrowth = useCallback(() => {
    setNetworkState(prev => ({ ...prev, isGrowing: true }));
  }, []);

  /**
   * Arrête la croissance automatique
   */
  const stopGrowth = useCallback(() => {
    setNetworkState(prev => ({ ...prev, isGrowing: false }));
    if (growthTimerRef.current) {
      clearInterval(growthTimerRef.current);
      growthTimerRef.current = null;
    }
  }, []);

  /**
   * Réinitialise le réseau
   */
  const resetNetwork = useCallback(() => {
    const neurons = generateInitialNeurons(
      configRef.current.initialNeuronCount,
      configRef.current.sphereRadius,
      networkState.mode
    );
    const connections = generateConnections(neurons, configRef.current);

    setNetworkState(prev => ({
      ...prev,
      neurons,
      connections,
      neuronCount: neurons.length,
      connectionCount: connections.length,
    }));
  }, [networkState.mode]);

  /**
   * Gère la croissance automatique
   */
  useEffect(() => {
    if (networkState.isGrowing && networkState.neuronCount < configRef.current.maxNeuronCount) {
      growthTimerRef.current = window.setInterval(() => {
        growNetwork();
      }, configRef.current.growthInterval);

      return () => {
        if (growthTimerRef.current) {
          clearInterval(growthTimerRef.current);
        }
      };
    }
  }, [networkState.isGrowing, networkState.neuronCount, growNetwork]);

  /**
   * Sélectionne un neurone
   */
  const selectNeuron = useCallback((neuronId: number | null) => {
    setNetworkState(prev => ({
      ...prev,
      selectedNeuronId: neuronId
    }));
  }, []);

  /**
   * Exporte les données du réseau
   */
  const exportData = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
      stats: {
        neuronCount: networkState.neuronCount,
        connectionCount: networkState.connectionCount,
        activityLevel: networkState.activityLevel,
        mode: networkState.mode
      },
      history: networkState.history
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neurosynapse-data-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [networkState]);

  // Mettre à jour l'historique périodiquement
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkState(prev => {
        const newHistory = [...prev.history, {
          timestamp: Date.now(),
          neuronCount: prev.neuronCount,
          connectionCount: prev.connectionCount
        }];

        // Garder seulement les 50 derniers points pour éviter de surcharger
        if (newHistory.length > 50) {
          newHistory.shift();
        }

        return {
          ...prev,
          history: newHistory
        };
      });
    }, 2000); // Toutes les 2 secondes

    return () => clearInterval(interval);
  }, []);

  return {
    networkState,
    setMode,
    setActivityLevel,
    growNetwork,
    startGrowth,
    stopGrowth,
    resetNetwork,
    selectNeuron,
    exportData,
  };
}

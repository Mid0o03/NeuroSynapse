import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface StatsDisplayProps {
  neuronCount: number;
  connectionCount: number;
  history: {
    timestamp: number;
    neuronCount: number;
    connectionCount: number;
  }[];
  onExport: () => void;
}

/**
 * Affiche les statistiques en temps réel en haut à droite
 */
export function StatsDisplay({ neuronCount, connectionCount, history, onExport }: StatsDisplayProps) {
  const [fps, setFps] = useState(60);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);

    return () => cancelAnimationFrame(rafId);
  }, []);

  // Préparer les données pour le graphique (formatage du temps)
  const chartData = history.map(h => ({
    ...h,
    time: new Date(h.timestamp).toLocaleTimeString([], { second: '2-digit' })
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="fixed top-6 right-6 flex flex-col items-end gap-2"
    >
      <div
        className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3 font-mono text-xs space-y-1 w-64 cursor-pointer hover:bg-card/80 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Neurones:</span>
          <span className="text-secondary font-semibold">
            {neuronCount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Connexions:</span>
          <span className="text-accent font-semibold">
            {connectionCount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">FPS:</span>
          <span className={`font-semibold ${fps >= 50 ? 'text-green-500' : fps >= 30 ? 'text-yellow-500' : 'text-red-500'}`}>
            {fps}
          </span>
        </div>

        <div className="pt-2 text-[10px] text-center text-muted-foreground opacity-70">
          {expanded ? "Cliquer pour réduire" : "Cliquer pour voir les graphiques"}
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card/80 backdrop-blur-md border border-border/50 rounded-lg p-4 w-80 space-y-4"
        >
          <div className="h-32 w-full">
            <div className="text-xs text-muted-foreground mb-1">Évolution du réseau</div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorNeurons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="neuronCount"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorNeurons)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onExport();
            }}
            className="w-full flex items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary text-xs py-2 rounded transition-colors border border-primary/30"
          >
            <Download size={14} />
            Exporter les données
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

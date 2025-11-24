import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Info, X } from 'lucide-react';

/**
 * Overlay d'informations scientifiques sur le cerveau et les neurones
 */
export function InfoOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Bouton d'ouverture */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="fixed bottom-6 left-6"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="bg-card/80 backdrop-blur-md border-border hover:bg-card"
        >
          <Info className="w-5 h-5" />
        </Button>
      </motion.div>
      
      {/* Overlay modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center p-6"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-card border border-border rounded-2xl p-8 max-w-3xl max-h-[80vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bouton de fermeture */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4"
              >
                <X className="w-5 h-5" />
              </Button>
              
              {/* Contenu */}
              <div className="space-y-6 pr-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">NeuroSynapse</h2>
                  <p className="text-muted-foreground">
                    Une visualisation immersive de la plasticité cérébrale
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Le cerveau humain</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Le cerveau humain contient environ <strong>86 milliards de neurones</strong>, 
                    chacun capable de former des milliers de connexions synaptiques. Ces connexions 
                    ne sont pas figées : elles se créent, se renforcent, s'affaiblissent ou 
                    disparaissent en fonction de notre expérience, de nos apprentissages et de 
                    nos pensées. C'est ce qu'on appelle la <strong>plasticité neuronale</strong>.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Les neurones</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Chaque neurone est une cellule spécialisée qui transmet des signaux électriques 
                    et chimiques. Dans cette visualisation, chaque <strong>point lumineux</strong> représente 
                    un neurone. La couleur et l'intensité varient selon son niveau d'activation, 
                    simulant l'activité électrique réelle du cerveau.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Les connexions synaptiques</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Les neurones communiquent entre eux via des <strong>synapses</strong>, représentées 
                    ici par des lignes lumineuses. Lorsque vous apprenez quelque chose de nouveau, 
                    votre cerveau crée de nouvelles connexions. Plus une connexion est utilisée, 
                    plus elle devient forte et efficace.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">La croissance exponentielle</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Cette expérience illustre comment les connexions neuronales peuvent croître 
                    de façon <strong>exponentielle</strong>. Chaque nouveau neurone peut potentiellement 
                    se connecter à plusieurs neurones existants, créant un réseau de plus en plus 
                    dense et complexe. C'est cette capacité qui permet au cerveau d'apprendre, 
                    de s'adapter et de créer.
                  </p>
                </div>
                
                <div className="border-t border-border pt-6">
                  <h3 className="text-xl font-semibold mb-3">Contrôles</h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li><strong>Slider d'activité :</strong> Contrôle la vitesse de croissance du réseau</li>
                    <li><strong>Mode Calme :</strong> Peu de connexions, mouvement lent (méditation, repos)</li>
                    <li><strong>Mode Normal :</strong> Activité équilibrée (pensée quotidienne, apprentissage)</li>
                    <li><strong>Mode Intense :</strong> Connexions denses, activité frénétique (créativité, résolution de problèmes)</li>
                    <li><strong>Souris/Touch :</strong> Rotation, zoom et déplacement de la caméra</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

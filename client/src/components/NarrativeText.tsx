import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NARRATIVE_TEXTS } from '@/lib/constants';

/**
 * Affiche les textes narratifs qui apparaissent et disparaissent
 */
export function NarrativeText() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [startTime] = useState(Date.now());
  
  useEffect(() => {
    const checkNarrative = () => {
      const elapsed = Date.now() - startTime;
      
      // Trouver le texte actuel selon le temps écoulé
      let foundIndex = -1;
      for (let i = 0; i < NARRATIVE_TEXTS.length; i++) {
        const narrative = NARRATIVE_TEXTS[i];
        if (elapsed >= narrative.time && elapsed < narrative.time + narrative.duration) {
          foundIndex = i;
          break;
        }
      }
      
      if (foundIndex !== -1 && foundIndex !== currentTextIndex) {
        setCurrentTextIndex(foundIndex);
        setIsVisible(true);
      } else if (foundIndex === -1) {
        setIsVisible(false);
      }
    };
    
    // Vérifier toutes les 500ms
    const interval = setInterval(checkNarrative, 500);
    
    return () => clearInterval(interval);
  }, [startTime, currentTextIndex]);
  
  const currentText = NARRATIVE_TEXTS[currentTextIndex];
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && currentText && (
        <motion.div
          key={currentTextIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 text-center px-8"
        >
          <p className="text-lg md:text-xl text-foreground/80 font-light italic max-w-2xl">
            {currentText.text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

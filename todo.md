# NeuroSynapse - TODO

## Phase 1 : Configuration initiale
- [x] Installer les dépendances Three.js et React Three Fiber
- [x] Installer Framer Motion pour les animations UI

## Phase 2 : Styles et thème
- [x] Configurer le thème sombre dans App.tsx
- [x] Définir la palette de couleurs dans index.css (noir, bleu électrique, vert, violet)
- [x] Ajouter les polices Google Fonts (Orbitron pour titres, Inter pour textes)

## Phase 3 : Architecture de base
- [x] Créer les types TypeScript (Neuron, Connection, NetworkState, ActivityMode)
- [x] Créer les constantes (couleurs, paramètres de simulation)
- [x] Implémenter l'algorithme de génération des neurones
- [x] Implémenter l'algorithme de calcul des connexions
- [x] Créer le hook useNeuronNetwork pour gérer l'état du réseau

## Phase 4 : Scène 3D
- [x] Créer le composant BrainNetworkScene avec Canvas React Three Fiber
- [x] Créer le composant NeuronSystem pour afficher les particules
- [x] Créer le composant ConnectionSystem pour afficher les lignes
- [x] Implémenter l'animation de croissance progressive
- [x] Ajouter les contrôles de caméra (OrbitControls)

## Phase 5 : Interface utilisateur
- [x] Créer le composant ControlsPanel avec slider d'activité
- [x] Ajouter les boutons de mode (calme, normal, overload)
- [x] Créer le composant NarrativeText pour les textes narratifs
- [x] Créer le composant InfoOverlay pour les explications scientifiques
- [x] Créer le composant StatsDisplay pour les statistiques en temps réel

## Phase 6 : Intégration
- [x] Intégrer tous les composants dans la page Home
- [x] Implémenter les transitions entre les modes
- [x] Tester les interactions (slider, boutons, rotation caméra)
- [x] Vérifier la responsive (desktop, tablet, mobile)

## Phase 7 : Optimisation
- [x] Optimiser le nombre de particules selon la performance
- [x] Implémenter le mode simplifié pour mobile
- [x] Tester les performances (60 FPS sur desktop)
- [x] Créer le checkpoint final

## Phase 8 : Documentation
- [x] Documenter la roadmap d'évolution (V1.1 à V4)
- [x] Préparer les instructions de déploiement

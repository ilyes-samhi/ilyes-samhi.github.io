/* =====================================================
   CONFIG : tous les réglages du site au même endroit.
   Tu peux changer les valeurs pour voir l'effet, sans toucher à la logique.
   ===================================================== */

// "App" est l'objet global qui regroupe tous nos modules.
// Chaque fichier JS y ajoute sa partie (App.audio, App.ui, ...).
// Ça évite de polluer l'espace global avec des dizaines de variables.
window.App = {};

// true si l'utilisateur a demandé "moins d'animations" dans son système.
// Les modules visuels le consultent pour se calmer.
App.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

App.config = {

  // Langue affichée si aucun choix n'est mémorisé ('en' ou 'fr')
  defaultLang: 'en',

  // ----- Fond animé : matrice de LED (js/modules/background.js) -----
  background: {
    cell: 10,               // distance entre 2 LED (px) : plus petit = grille plus dense
    cellSmallScreen: 14,    // idem sur petit écran (téléphone) : moins de points, moins de batterie
    smallScreenBelow: 760,  // largeur d'écran (px) en dessous de laquelle on utilise la grille "petit écran"
    frameInterval: 40,      // ms entre 2 images (40 ms = 25 images/seconde)
    frameIntervalSmallScreen: 66,   // idem sur petit écran (~15 images/seconde)

    centerVisibility: 0.34, // visibilité du fond au centre, sous le texte (0 = invisible, 1 = comme sur les côtés)
    sideStart: 0.20,        // à partir de quelle fraction de la largeur (depuis le centre) le fond devient plus visible

    rippleSpeed: 300,       // vitesse de l'onde au clic / sur la musique (px/seconde)
    rippleDuration: 2.8     // durée de vie de l'onde (secondes)
  },

  // ----- Musique générative (js/modules/audio.js) -----
  audio: {
    bpm: 74,                // tempo (battements/minute)
    stepsPerChord: 32,      // nombre de croches avant de changer d'accord (~13 s à 74 bpm)
    masterVolume: 0.3,      // volume général (0 à 1)
    fadeInTime: 1.2,        // durée (approx.) de la montée du volume au démarrage (s)
    pluckProbability: 0.65, // probabilité qu'une note "pincée" soit jouée à chaque croche
    busCutoff: 2800,        // fréquence de coupure du filtre général (Hz) : plus bas = plus sourd
    reverbSeconds: 3.2,     // durée de la réverbération
    reverbMix: 0.55,        // quantité de réverbération (0 à 1)
    // Notes MIDI de chaque accord (60 = do central). Ordre : basse, puis 4 notes.
    // Progression : Ré mineur, Si♭, Sol mineur, Do
    chords: [
      [50, 57, 62, 65, 69],
      [46, 53, 58, 62, 65],
      [43, 50, 55, 58, 62],
      [48, 55, 60, 64, 67]
    ]
  },


  // ----- Interface (js/modules/ui.js) -----
  ui: {
    backToTopAfter: 500     // le bouton "↑" apparaît après X px de scroll
  }
};
/* =====================================================
   CONFIG : tous les réglages du site au même endroit.
   Tu peux changer les valeurs pour voir l'effet, sans toucher à la logique.
   ===================================================== */

// "App" est l'objet global qui regroupe tous nos modules.
// Chaque fichier JS y ajoute sa partie (App.audio, App.scope, ...).
// Ça évite de polluer l'espace global avec des dizaines de variables.
window.App = {};

// true si l'utilisateur a demandé "moins d'animations" dans son système.
// Les modules visuels le consultent pour se calmer.
App.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

App.config = {

  // Langue affichée si aucun choix n'est mémorisé ('en' ou 'fr')
  defaultLang: 'en',

  // ----- Fond ASCII animé (js/modules/background.js) -----
  background: {
    cellWidth: 10,          // largeur d'une "case" de caractère (px)
    cellHeight: 16,         // hauteur d'une case (px)
    fontSize: 13,           // taille de police des caractères (px)
    ramp: ' .:-+*=%#@',     // du plus "vide" au plus "plein" : l'intensité choisit le caractère
    frameInterval: 33,      // ms entre 2 images (33 ms ≈ 30 images/seconde)

    // Zone centrale gardée vide pour que le texte reste lisible :
    clearHalfWidth: 520,    // demi-largeur de la zone vide (px)
    fadeInner: 40,          // le fondu commence X px avant le bord de cette zone...
    fadeOuter: 230,         // ...et finit X px après (le fond apparaît progressivement)

    // Couleurs : un dégradé de teinte (hue, en degrés 0-360) de gauche à droite
    colorSlices: 12,        // nombre de "tranches" de couleur
    levels: 6,              // nombre de niveaux de transparence
    hueStart: 225,          // teinte de départ (225 = bleu)
    hueRange: 170,          // de combien la teinte glisse (225+170 ≈ 395 → rose/orange)
    saturationStart: 100,   // saturation (%) au départ...
    saturationDrop: 24,     // ...et de combien elle baisse vers la droite
    lightnessStart: 74,     // luminosité (%) au départ...
    lightnessDrop: 8,       // ...et de combien elle baisse
    maxAlpha: 0.5,          // opacité maximale des caractères (0 à 1)

    // Effet de la souris
    mouseRange: 260,        // distance (px) à laquelle la souris a un effet
    mouseSigma: 110,        // "largeur" de la lueur (plus grand = plus étalé)
    mouseBoost: 0.7,        // intensité ajoutée par la souris
    mouseVisibility: 0.4,   // la souris fait apparaître le fond même dans la zone centrale

    // Ondes (au clic et au rythme de la musique)
    rippleSpeed: 340,       // vitesse de propagation (px/seconde)
    rippleWidth: 38,        // épaisseur de l'anneau (px)
    rippleDuration: 3,      // durée de vie (secondes)
    rippleVisibility: 0.7   // visibilité de l'onde dans la zone centrale
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

  // ----- Oscilloscope (js/modules/scope.js) -----
  scope: {
    samples: 900,           // nombre de points de la courbe
    gain: 5,                // amplification du signal (pour qu'il remplisse l'écran)
    smoothing: 0.3,         // fluidité (petit = très doux, 1 = instantané)
    idleNoise: 0.07,        // petit bruit affiché quand le son est coupé
    gridColor: 'rgba(124,155,255,.12)',
    glowColor: 'rgba(200,155,216,.75)',
    gradient: ['#7C9BFF', '#C99BD8', '#E8B063']  // couleurs de la courbe (gauche → droite)
  },

  // ----- Interface (js/modules/ui.js) -----
  ui: {
    backToTopAfter: 500,    // le bouton "↑" apparaît après X px de scroll
    revealThreshold: 0.15   // une section apparaît quand 15 % d'elle est visible
  }
};
/* =====================================================
   BACKGROUND : fond ASCII animé sur les côtés de la page.

   Principe : on découpe l'écran en une grille de cases. Pour chaque case on calcule
   une "intensité" v (0 → 1) avec des vagues + l'effet de la souris + les ondes de clic.
   Plus v est grande, plus le caractère choisi est "plein" (. : - + * = % # @).
   Les caractères sont ensuite dessinés sur un <canvas>.
   ===================================================== */
(function (App) {

  var cfg = App.config.background;
  var u = App.utils;
  var canvas = document.getElementById('bg');
  var g = canvas.getContext('2d');   // "g" = le pinceau pour dessiner sur le canvas
  var MONO = '"DejaVu Sans Mono",Menlo,Consolas,"Liberation Mono",monospace';
  var RAMP = cfg.ramp;
  var LV = cfg.levels, CS = cfg.colorSlices;

  var W, H, cols, rows;              // taille de l'écran et nombre de colonnes/lignes de cases
  var mouseX = -999, mouseY = -999;  // position de la souris (hors écran au départ)
  var ripples = [];                  // ondes en cours (clics + musique)
  var lastFrame = 0;

  // ----- Palette précalculée -----
  // STYLES[tranche de couleur][niveau de transparence] = couleur CSS "hsla(...)".
  // On les calcule UNE fois ici, car recalculer des couleurs à chaque image serait lent.
  var STYLES = (function () {
    var s = [];
    for (var k = 0; k < CS; k++) {
      var f = k / (CS - 1);                                        // 0 → 1 de gauche à droite
      var hue = (cfg.hueStart + cfg.hueRange * f) % 360;
      var sat = cfg.saturationStart - cfg.saturationDrop * f;
      var light = cfg.lightnessStart - cfg.lightnessDrop * f;
      s[k] = [];
      for (var l = 0; l < LV; l++) {
        var alpha = ((l + 1) / LV * cfg.maxAlpha).toFixed(2);
        s[k][l] = 'hsla(' + hue.toFixed(0) + ',' + sat.toFixed(0) + '%,' + light.toFixed(0) + '%,' + alpha + ')';
      }
    }
    return s;
  })();

  // ----- Adapte le canvas à la taille de la fenêtre -----
  function resize() {
    var d = Math.min(window.devicePixelRatio || 1, 2); // écrans "retina" : plus de pixels (max x2)
    W = innerWidth; H = innerHeight;
    canvas.width = W * d; canvas.height = H * d;       // taille réelle en pixels
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; // taille affichée
    g.setTransform(d, 0, 0, d, 0, 0);
    g.font = cfg.fontSize + 'px ' + MONO;
    g.textBaseline = 'top';
    cols = Math.ceil(W / cfg.cellWidth);
    rows = Math.ceil(H / cfg.cellHeight);
    if (App.reduceMotion) draw(3); // pas d'animation : on dessine UNE image fixe
  }

  // ----- Ondes -----
  // Crée une onde circulaire qui part du point (x, y) ; strength = force (1 = normal)
  function ripple(x, y, strength) {
    ripples.push({ x: x, y: y, t0: performance.now() / 1000, s: strength || 1 });
  }
  // Onde à un endroit aléatoire d'un des deux côtés (déclenchée par la musique)
  function burst(strength) {
    var left = Math.random() < 0.5;
    ripple(left ? u.rand(0, 170) : W - u.rand(0, 170), u.rand(0, H), strength);
  }

  // ----- Dessin d'une image ; t = temps en secondes -----
  function draw(t) {
    g.clearRect(0, 0, W, H);
    var cx = W / 2;
    var inner = Math.min(cfg.clearHalfWidth, W / 2);

    // Les caractères sont regroupés par couleur ("buckets") : changer de couleur est coûteux,
    // donc on dessine toutes les cases de même couleur d'un coup.
    var buckets = [];
    for (var k = 0; k < CS * LV; k++) buckets[k] = [];

    // Supprime les ondes trop vieilles
    ripples = ripples.filter(function (r) { return t - r.t0 < cfg.rippleDuration; });

    for (var r = 0; r < rows; r++) {
      var y = r * cfg.cellHeight + cfg.cellHeight / 2;           // centre de la case
      for (var c = 0; c < cols; c++) {
        var x = c * cfg.cellWidth + cfg.cellWidth / 2;

        // 1) Masque : 0 au centre (texte lisible) → 1 sur les côtés
        var edge = u.smoothstep(inner - cfg.fadeInner, inner + cfg.fadeOuter, Math.abs(x - cx));

        // 2) Vagues : somme de 4 sinusoïdes qui bougent avec le temps t
        var v = (Math.sin(x * 0.012 + t * 0.5) +
                 Math.sin(y * 0.015 - t * 0.4) +
                 Math.sin((x + y) * 0.008 + t * 0.25) +
                 Math.sin(Math.hypot(x - cx * 0.4, y - H * 0.5) * 0.012 - t * 0.6) + 4) / 8;
        v = Math.pow(v, 2.4) * 1.05;   // la puissance creuse les contrastes

        // 3) Souris : lueur en cloche (gaussienne) autour du curseur
        var extra = 0; // "extra" = visibilité forcée, même dans la zone centrale
        var dm = Math.hypot(x - mouseX, y - mouseY);
        if (dm < cfg.mouseRange) {
          var glow = Math.exp(-Math.pow(dm / cfg.mouseSigma, 2));
          v += glow * cfg.mouseBoost;
          extra = glow * cfg.mouseVisibility;
        }

        // 4) Ondes : anneau qui grandit (rayon = âge × vitesse) et s'estompe avec l'âge
        for (var i = 0; i < ripples.length; i++) {
          var q = ripples[i];
          var age = t - q.t0;
          var dd = Math.hypot(x - q.x, y - q.y);
          var w = Math.exp(-Math.pow((dd - age * cfg.rippleSpeed) / cfg.rippleWidth, 2)) *
                  (1 - age / cfg.rippleDuration) * q.s;
          v += w;
          extra = Math.max(extra, w * cfg.rippleVisibility);
        }

        // 5) Visibilité finale : trop faible → on ne dessine rien
        var visibility = Math.max(edge, extra);
        if (visibility < 0.03) continue;

        // 6) Choix du caractère selon l'intensité (index 0 = espace = rien)
        var charIdx = Math.floor(u.clamp(v, 0, 0.999) * RAMP.length);
        if (!charIdx) continue;

        // 7) Choix du niveau de transparence et de la tranche de couleur (selon la position)
        var level = Math.min(LV - 1, Math.floor(visibility * Math.min(1, 0.3 + v) * LV));
        var slice = Math.min(CS - 1, Math.floor((0.65 * x / W + 0.35 * y / H) * CS));
        // "+1" : léger décalage pour centrer le caractère dans sa case
        buckets[slice * LV + level].push(c * cfg.cellWidth + 1, r * cfg.cellHeight, RAMP[charIdx]);
      }
    }

    // Dessin : une couleur à la fois. Chaque caractère = 3 valeurs (x, y, lettre) dans le tableau.
    for (k = 0; k < buckets.length; k++) {
      var arr = buckets[k];
      if (!arr.length) continue;
      g.fillStyle = STYLES[Math.floor(k / LV)][k % LV];
      for (var j = 0; j < arr.length; j += 3) g.fillText(arr[j + 2], arr[j], arr[j + 1]);
    }
  }

  // ----- Boucle d'animation -----
  function loop(now) {
    requestAnimationFrame(loop);                       // programme l'image suivante
    if (now - lastFrame < cfg.frameInterval) return;   // limite à ~30 images/s (économise la batterie)
    lastFrame = now;
    draw(now / 1000);
  }

  function init() {
    window.addEventListener('resize', resize);
    resize();
    if (App.reduceMotion) return; // pas d'animation → on s'arrête là

    window.addEventListener('mousemove', function (e) { mouseX = e.clientX; mouseY = e.clientY; });
    // Souris sortie de la page : on la renvoie "très loin" pour éteindre la lueur
    document.addEventListener('mouseleave', function () { mouseX = mouseY = -999; });
    // La musique demande une onde via l'événement "burst" (voir audio.js)
    document.addEventListener('burst', function (e) { burst(e.detail.strength); });

    requestAnimationFrame(loop);
  }

  App.background = { init: init, ripple: ripple };

})(window.App);
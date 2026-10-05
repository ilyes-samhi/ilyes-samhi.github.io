/* =====================================================
   SCOPE : oscilloscope qui affiche le signal audio en direct.
   - Son actif  : on lit la forme d'onde via App.audio.readWaveform().
   - Son coupé  : légère ligne bruitée (comme un vrai scope sans signal).
   ===================================================== */
(function (App) {

  var cfg = App.config.scope;
  var clamp = App.utils.clamp;
  var N = cfg.samples;
  var canvas = document.getElementById('scope');
  var g = canvas.getContext('2d');
  var shown = new Float32Array(N);  // ce qui est affiché (lissé)
  var target = new Float32Array(N); // ce qu'on voudrait afficher
  var W, H;

  function resize() {
    var d = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect(); // taille réelle du canvas dans la page
    W = r.width; H = r.height;
    canvas.width = W * d; canvas.height = H * d;
    g.setTransform(d, 0, 0, d, 0, 0);
  }

  // Calcule la courbe "cible" (valeurs de -1 à 1)
  function updateTarget() {
    var wave = App.audio.readWaveform();
    var i;
    if (wave) {
      // "Trigger" : comme un vrai oscilloscope, on démarre à un passage par zéro
      // (de négatif vers positif) pour que la courbe soit stable et ne "tremble" pas.
      var start = 0;
      for (i = 1; i < wave.length - N; i++) {
        if (wave[i - 1] < 0 && wave[i] >= 0) { start = i; break; }
      }
      for (i = 0; i < N; i++) target[i] = clamp(wave[start + i] * cfg.gain, -1, 1);
    } else {
      for (i = 0; i < N; i++) target[i] = (Math.random() - 0.5) * (App.reduceMotion ? 0 : cfg.idleNoise);
    }
  }

  function draw() {
    var i;
    updateTarget();
    // Lissage : la courbe affichée "rattrape" la cible progressivement
    for (i = 0; i < N; i++) shown[i] += (target[i] - shown[i]) * cfg.smoothing;

    g.clearRect(0, 0, W, H);

    // Quadrillage (10 colonnes x 4 lignes)
    g.lineWidth = 1;
    g.strokeStyle = cfg.gridColor;
    g.beginPath();
    for (i = 1; i < 10; i++) { g.moveTo(W * i / 10, 0); g.lineTo(W * i / 10, H); }
    for (i = 1; i < 4; i++)  { g.moveTo(0, H * i / 4);  g.lineTo(W, H * i / 4); }
    g.stroke();

    // Courbe : dégradé horizontal + halo lumineux (shadowBlur)
    var gr = g.createLinearGradient(0, 0, W, 0);
    gr.addColorStop(0, cfg.gradient[0]);
    gr.addColorStop(0.5, cfg.gradient[1]);
    gr.addColorStop(1, cfg.gradient[2]);
    g.strokeStyle = gr;
    g.lineWidth = 1.8;
    g.shadowColor = cfg.glowColor;
    g.shadowBlur = 9;
    g.lineJoin = 'round';
    g.beginPath();
    for (i = 0; i < N; i += 2) { // un point sur deux suffit visuellement (et c'est 2x plus rapide)
      var x = i / (N - 1) * W;
      var y = H / 2 - shown[i] * H * 0.45;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
    g.shadowBlur = 0; // coupe le halo pour ne pas affecter d'autres dessins
  }

  function loop() { requestAnimationFrame(loop); draw(); }

  function init() {
    window.addEventListener('resize', resize);
    resize();
    if (App.reduceMotion) draw(); else requestAnimationFrame(loop); // pas d'animation si demandé
  }

  App.scope = { init: init };

})(window.App);
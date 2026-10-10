/*
 * Fond animé : matrice de LED.
 * Grille fine de points, marée de lumière lente, bande de balayage discrète,
 * lueur qui suit la souris (avec une courte traînée) et onde circulaire au clic
 * ou au rythme de la musique. Le centre (le texte) reste plus calme.
 */
(function (App) {
  var cfg = App.config.background;
  var canvas = document.getElementById('bg');
  var g = canvas.getContext('2d');
  var W = 0, H = 0, lastFrame = 0, cell = 10, interval = 40;
  var mouseX = -999, mouseY = -999, trail = [], ripples = [];
  var dark = document.documentElement.dataset.theme === 'dark';
  var reduced = App.reduceMotion;
  var ink = function (alpha) { return dark ? 'rgba(218,225,224,' + alpha + ')' : 'rgba(44,54,57,' + alpha + ')'; };

  function resize() {
    var d = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    var small = W < cfg.smallScreenBelow;                      // petit écran : grille plus large, moins d'images/s
    cell = small ? cfg.cellSmallScreen : cfg.cell;
    interval = small ? cfg.frameIntervalSmallScreen : cfg.frameInterval;
    canvas.width = W * d; canvas.height = H * d;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    g.setTransform(d, 0, 0, d, 0, 0);
    if (reduced) draw(performance.now() / 1000);
  }

  // Visibilité selon la position horizontale : réduite au centre, pleine sur les côtés
  function mask(x) {
    var edge = Math.abs(x - W / 2), start = W * cfg.sideStart, c = cfg.centerVisibility;
    return Math.max(c, Math.min(1, c + (edge - start) / Math.max(90, W * .15)));
  }

  // Onde circulaire qui part du point (x, y)
  function ripple(x, y, strength) { ripples.push({ x: x, y: y, t: performance.now() / 1000, s: strength || 1 }); }

  // La musique demande une onde sur un des côtés (événement "burst", voir audio.js)
  function burst(strength) {
    var x = Math.random() < .5 ? 20 + Math.random() * Math.min(170, W * .22) : W - 20 - Math.random() * Math.min(170, W * .22);
    ripple(x, Math.random() * H, strength);
  }

  function draw(t) {
    g.clearRect(0, 0, W, H);
    if (mouseX > -900) trail.push({ x: mouseX, y: mouseY, t: t, s: 1 });
    trail = trail.filter(function (q) { return t - q.t < 1.25; });
    ripples = ripples.filter(function (q) { return t - q.t < cfg.rippleDuration; });
    for (var y = cell / 2; y < H; y += cell) for (var x = cell / 2; x < W; x += cell) {
      var m = mask(x); if (m < .025) continue;
      var nx = x / W, ny = y / H;
      var tide = Math.sin(y * .011 + x * .003 - t * .55) * .5 + .5; tide *= tide; tide *= tide;
      var scanPhase = ((nx * .8 + ny * .62 - t * .16) % 1 + 1) % 1;
      var scan = Math.exp(-Math.pow(Math.min(scanPhase, 1 - scanPhase) / .045, 2));
      var d = Math.hypot(x - mouseX, y - mouseY), cursor = Math.exp(-Math.pow(d / 100, 2));
      var glow = 0, i;
      for (i = 0; i < trail.length; i++) {
        var q = trail[i], qx = x - q.x, qy = y - q.y;
        if (qx * qx + qy * qy > 14400) continue;   // trop loin (> 120 px) : effet nul
        glow = Math.max(glow, Math.exp(-(qx * qx + qy * qy) / 2304) * (1 - (t - q.t) / 1.25) * (q.s || 1));
      }
      var wave = 0;
      for (i = 0; i < ripples.length; i++) {
        var r = ripples[i], ra = t - r.t, rd = Math.hypot(x - r.x, y - r.y) - ra * cfg.rippleSpeed;
        if (rd < 90 && rd > -90) wave += Math.exp(-rd * rd / 900) * (1 - ra / cfg.rippleDuration) * r.s;
      }
      var level = .055 + tide * .5 + scan * .22 + cursor * .72 + glow * .75 + wave * .8;
      var radius = .8 + Math.min(2.2, tide + scan * .5 + cursor * 1.2 + glow * .7 + wave * 1.1);
      g.beginPath(); g.arc(x, y, radius, 0, Math.PI * 2);
      g.fillStyle = ink(Math.min(.86, m * level)); g.fill();
    }
  }

  function loop(now) {
    requestAnimationFrame(loop);
    if (now - lastFrame < interval) return;
    lastFrame = now;
    draw(now / 1000);
  }

  function init() {
    resize(); window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) { mouseX = e.clientX; mouseY = e.clientY; });
    document.addEventListener('mouseleave', function () { mouseX = mouseY = -999; });
    window.addEventListener('click', function (e) {
      if (e.target.closest('a,button')) return;
      ripple(e.clientX, e.clientY, 1.2);
    });
    document.addEventListener('burst', function (e) { burst(e.detail.strength); });
    document.addEventListener('themechange', function () {
      dark = document.documentElement.dataset.theme === 'dark';
      draw(performance.now() / 1000);
    });
    if (!reduced) requestAnimationFrame(loop); else draw(3);
  }

  App.background = { init: init, ripple: ripple };
})(window.App);

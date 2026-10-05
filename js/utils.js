/* =====================================================
   UTILS : petites fonctions mathématiques réutilisables
   ===================================================== */
(function (App) {

  // Nombre aléatoire entre a et b
  function rand(a, b) { return a + Math.random() * (b - a); }

  // Force x à rester entre min et max
  function clamp(x, min, max) { return Math.max(min, Math.min(max, x)); }

  // Transition douce de 0 à 1 quand x passe de a à b ("smoothstep").
  // Sert à faire des fondus sans cassure visible.
  function smoothstep(a, b, x) {
    x = clamp((x - a) / (b - a), 0, 1);
    return x * x * (3 - 2 * x);
  }

  App.utils = { rand: rand, clamp: clamp, smoothstep: smoothstep };

})(window.App);
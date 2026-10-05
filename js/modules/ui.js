/* =====================================================
   UI : petits comportements de l'interface.
   1. Bouton son (texte + état + légende de l'oscilloscope)
   2. Bouton "retour en haut"
   3. Apparition des sections au scroll
   4. Année du pied de page
   ===================================================== */
(function (App) {

  var cfg = App.config.ui;

  // ----- 1. Bouton son -----
  function initSoundButton() {
    var btn = document.getElementById('snd');
    var caption = document.querySelector('.cap'); // "Turn on the sound..." sous le scope

    // Met à jour le bouton selon la langue ET l'état du son
    function refresh() {
      var playing = App.audio.isPlaying();
      btn.textContent = App.i18n.t(playing ? 'snd_on' : 'snd_off');
      btn.setAttribute('aria-pressed', playing);
      if (caption) caption.style.visibility = playing ? 'hidden' : 'visible';
    }

    btn.addEventListener('click', function () { App.audio.toggle(); });
    document.addEventListener('langchange', refresh);
    document.addEventListener('soundchange', refresh);
  }

  // ----- 2. Retour en haut -----
  function initBackToTop() {
    var btn = document.getElementById('top');
    // Affiche le bouton après X px de scroll ({passive:true} = scroll plus fluide)
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > cfg.backToTopAfter);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: App.reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // ----- 3. Apparition au scroll -----
  function initReveal() {
    var sections = document.querySelectorAll('.sr');
    if ('IntersectionObserver' in window && !App.reduceMotion) {
      // IntersectionObserver prévient quand un élément entre dans l'écran
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in'); // déclenche la transition CSS (.sr.in)
            io.unobserve(e.target);       // une seule fois suffit
          }
        });
      }, { threshold: cfg.revealThreshold });
      sections.forEach(function (s) { io.observe(s); });
    } else {
      // Pas d'observer ou animations désactivées : tout est visible tout de suite
      sections.forEach(function (s) { s.classList.add('in'); });
    }
  }

  function init() {
    initSoundButton();
    initBackToTop();
    initReveal();
    document.getElementById('y').textContent = new Date().getFullYear(); // 4. année
  }

  App.ui = { init: init };

})(window.App);
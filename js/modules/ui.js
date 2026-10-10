/* =====================================================
   UI : petits comportements de l'interface.
   1. Bouton son (texte + état)
   2. Bouton "retour en haut"
   3. Année du pied de page
   ===================================================== */
(function (App) {

  var cfg = App.config.ui;

  // ----- 1. Bouton son -----
  function initSoundButton() {
    var btn = document.getElementById('snd');

    // Met à jour le bouton selon la langue ET l'état du son
    function refresh() {
      var playing = App.audio.isPlaying();
      var label = App.i18n.t(playing ? 'snd_on' : 'snd_off');
      btn.setAttribute('aria-label', label);
      btn.title = label;
      btn.setAttribute('aria-pressed', playing);
    }

    btn.addEventListener('click', function () { App.audio.toggle(); });
    document.addEventListener('langchange', refresh);
    document.addEventListener('soundchange', refresh);
  }

  // ----- Thème clair / sombre -----
  // Le thème initial est posé par le petit script du <head> (attribut data-theme sur <html>).
  function initTheme() {
    var btn = document.getElementById('theme');
    var root = document.documentElement;

    // Le bouton propose l'AUTRE thème que celui affiché
    function refresh() {
      btn.textContent = App.i18n.t(root.dataset.theme === 'dark' ? 'theme_light' : 'theme_dark');
    }

    btn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      refresh();
      var tc = document.querySelector('meta[name="theme-color"]');   // barre du navigateur (mobile)
      if (tc) tc.content = next === 'dark' ? '#14171A' : '#ECEEEA';
      document.dispatchEvent(new CustomEvent('themechange')); // le fond LED et la vidéo du projet changent
    });
    document.addEventListener('langchange', refresh);
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

  function init() {
    initSoundButton();
    initTheme();
    initBackToTop();
    document.getElementById('y').textContent = new Date().getFullYear(); // 3. année
  }

  App.ui = { init: init };

})(window.App);
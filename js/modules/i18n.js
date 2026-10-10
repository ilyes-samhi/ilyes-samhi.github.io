/* =====================================================
   I18N (internationalisation) : changement de langue.
   - Remplace le texte de tous les éléments [data-i] par la traduction.
   - Mémorise le choix dans le navigateur (localStorage).
   - Prévient les autres modules via l'événement "langchange".
   ===================================================== */
(function (App) {

  var translations = App.translations;
  var defaultLang = App.config.defaultLang;
  var current = defaultLang;

  // Renvoie le texte de la clé dans la langue courante.
  // Si la clé n'existe pas, on prend la langue par défaut, puis la clé elle-même.
  function t(key) {
    var dict = translations[current];
    if (dict && dict[key] !== undefined) return dict[key];
    if (translations[defaultLang][key] !== undefined) return translations[defaultLang][key];
    return key;
  }

  function setLang(lang) {
    if (!translations[lang]) lang = defaultLang; // langue inconnue → défaut
    current = lang;

    // <html lang="..."> et titre de l'onglet
    document.documentElement.lang = lang;
    document.title = t('title');

    // Textes : <... data-i="clé"> reçoit la traduction
    document.querySelectorAll('[data-i]').forEach(function (el) {
      el.textContent = t(el.dataset.i);
    });

    // Attributs aria-label : <... data-i-aria="clé"> (dataset.iAria = attribut data-i-aria)
    document.querySelectorAll('[data-i-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.dataset.iAria));
    });

    // Met en surbrillance le bouton de la langue active
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.dataset.lang === lang);
    });

    // Mémorise le choix (try/catch : le stockage peut être bloqué par le navigateur)
    try { localStorage.setItem('lang', lang); } catch (e) {}

    // Prévient les autres modules (bouton son, projets...) qu'il faut rafraîchir leurs textes
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  function init() {
    // Clic sur un bouton de langue
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(btn.dataset.lang); });
    });

    // Langue mémorisée lors d'une précédente visite (sinon langue par défaut)
    var saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) {}
    // Pas de choix mémorisé : on suit la langue du navigateur (fr si elle commence par "fr")
    var browser = (navigator.language || '').slice(0, 2).toLowerCase();
    setLang(saved || (translations[browser] ? browser : defaultLang));
  }

  App.i18n = { init: init, t: t, setLang: setLang };

})(window.App);
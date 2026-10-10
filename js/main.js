/* =====================================================
   MAIN : le chef d'orchestre. Il ne fait que démarrer les modules
   et brancher ceux qui doivent réagir ensemble.
   ===================================================== */
(function (App) {

  // Chaque module s'initialise (branche ses écouteurs, démarre ses animations)
  App.background.init();
  App.audio.init();
  App.projects.init();
  App.ui.init();

  // i18n EN DERNIER : il émet "langchange", et tous les modules doivent déjà être
  // à l'écoute (ui, projects) pour afficher le bon texte dès le chargement.
  App.i18n.init();

})(window.App);
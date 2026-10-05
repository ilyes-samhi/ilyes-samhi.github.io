/* =====================================================
   MAIN : le chef d'orchestre. Il ne fait que démarrer les modules
   et brancher ceux qui doivent réagir ensemble.
   ===================================================== */
(function (App) {

  // Chaque module s'initialise (branche ses écouteurs, démarre ses animations)
  App.background.init();
  App.audio.init();
  App.scope.init();
  App.projects.init();
  App.ui.init();

  // Clic n'importe où sur la page :
  //  - une onde visuelle (sauf si animations réduites)
  //  - une note de musique (sauf si on clique sur un bouton ou un lien)
  // Ce code est ici car il relie deux modules (background + audio) qui ne se connaissent pas.
  window.addEventListener('click', function (e) {
    if (!App.reduceMotion) App.background.ripple(e.clientX, e.clientY, 1.2);
    if (!e.target.closest('button,a')) App.audio.clickNote();
  });

  // i18n EN DERNIER : il émet "langchange", et tous les modules doivent déjà être
  // à l'écoute (ui, projects) pour afficher le bon texte dès le chargement.
  App.i18n.init();

})(window.App);
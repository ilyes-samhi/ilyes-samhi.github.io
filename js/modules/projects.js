/* =====================================================
   PROJECTS : affiche les cartes de projets à partir de js/data/projects.js.
   Se redessine à chaque changement de langue.
   ===================================================== */
(function (App) {

  // Un champ peut être un texte simple ou { en: "...", fr: "..." }
  function pick(value) {
    if (typeof value === 'string') return value;
    var lang = document.documentElement.lang;
    return value[lang] || value[App.config.defaultLang] || '';
  }

  function render() {
    var list = document.getElementById('projects-list');
    var emptyMsg = document.querySelector('[data-i="proj"]');
    var items = App.projectsData;

    // Message "rien à montrer" visible seulement s'il n'y a aucun projet
    emptyMsg.hidden = items.length > 0;
    list.innerHTML = ''; // vide la liste avant de la reconstruire

    items.forEach(function (p) {
      // On crée les éléments avec textContent (et non innerHTML) : plus sûr, pas d'injection de HTML
      var card = document.createElement('article');
      card.className = 'project';

      var title = document.createElement('h3');
      title.textContent = pick(p.title);
      card.appendChild(title);

      var desc = document.createElement('p');
      desc.textContent = pick(p.description);
      card.appendChild(desc);

      if (p.tags && p.tags.length) {
        var ul = document.createElement('ul');
        ul.className = 'tags';
        p.tags.forEach(function (tag) {
          var li = document.createElement('li');
          li.textContent = tag;
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }

      if (p.link) {
        var a = document.createElement('a');
        a.href = p.link;
        a.textContent = App.i18n.t('proj_link');
        card.appendChild(a);
      }

      list.appendChild(card);
    });
  }

  function init() {
    // Le rendu initial a lieu quand i18n.init() émet "langchange" (voir main.js)
    document.addEventListener('langchange', render);
  }

  App.projects = { init: init };

})(window.App);
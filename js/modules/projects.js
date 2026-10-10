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

  // ----- Vidéos : une par thème (seule celle du thème actif est chargée) -----
  var videos = [];
  function setVideo(v, p) {
    var light = document.documentElement.dataset.theme !== 'dark' && p.videoLight;
    var base = light ? p.videoLight : p.video;
    if (v.dataset.base === base) return;
    v.dataset.base = base;
    v.poster = base + '.jpg';
    v.textContent = '';   // MP4 d'abord (le plus léger et accéléré par le matériel), WebM en secours
    [['mp4', 'video/mp4'], ['webm', 'video/webm']].forEach(function (f) {
      var src = document.createElement('source');
      src.src = base + '.' + f[0]; src.type = f[1];
      v.appendChild(src);
    });
    v.load();
    if (!App.reduceMotion) v.play().catch(function () {});
  }

  function render() {
    videos = [];
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

      // Visuel : vidéo en boucle (une version par thème) ou, à défaut, image fixe
      if (p.video) {
        var v = document.createElement('video');
        v.className = 'media';
        v.muted = true; v.loop = true; v.playsInline = true;
        v.autoplay = !App.reduceMotion;          // "moins d'animations" : image fixe, pas de lecture
        v.preload = 'metadata';
        v.setAttribute('role', 'img');
        v.setAttribute('aria-label', p.imageAlt ? pick(p.imageAlt) : '');
        v.style.aspectRatio = p.videoRatio || '1 / 1';
        setVideo(v, p);
        videos.push({ el: v, data: p });
        card.appendChild(v);
      } else if (p.image) {
        var img = document.createElement('img');
        img.className = 'media';
        img.src = p.image;
        img.alt = p.imageAlt ? pick(p.imageAlt) : '';
        img.loading = 'lazy';
        card.appendChild(img);
      }

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
    // Changement de thème : on charge la vidéo qui correspond
    document.addEventListener('themechange', function () {
      videos.forEach(function (x) { setVideo(x.el, x.data); });
    });
  }

  App.projects = { init: init };

})(window.App);

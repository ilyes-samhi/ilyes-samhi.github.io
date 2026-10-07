/* =====================================================
   PROJETS : la liste affichée dans la section "Projects".
   Pour AJOUTER un projet : copie le modèle ci-dessous, retire les "//" et remplis-le.
   Tant que la liste est vide, le message "Nothing finished to show yet" s'affiche.

   - title / description : soit un simple texte, soit { en: "...", fr: "..." }
   - tags : petites étiquettes (technos, domaines)
   - image / imageAlt : (facultatif) capture ou GIF dans img/, et son texte alternatif
   - link : (facultatif) lien vers GitHub ou une démo
   ===================================================== */
window.App.projectsData = [

  {
    title: "Enhanced spinning donut",
    description: {
      en: "Messing around with 3D ASCII graphics in the terminal. Four shapes built from their parametric equations, spinning and blending into each other under a moving light. Just Python, NumPy and a bit of patience.",
      fr: "Je bidouille de la 3D en ASCII dans le terminal. Quatre objets construits à partir de leurs équations paramétriques, qui tournent et se transforment l'un en l'autre, sous une lumière mobile. Juste Python, NumPy et un peu de patience."
    },
    image: "img/donut-spin.gif",
    imageAlt: {
      en: "A spinning ASCII torus rendered in a terminal",
      fr: "Un tore ASCII en rotation dans un terminal"
    },
    tags: ["Python", "NumPy", "3D", "ASCII"],
    link: "https://github.com/otakilly/enhanced-spinning-donut/"
  },

  // {
  //   title: "Simulateur de filtre RC",
  //   description: {
  //     en: "Interactive Bode plot of an RC low-pass filter.",
  //     fr: "Diagramme de Bode interactif d'un filtre RC passe-bas."
  //   },
  //   tags: ["JavaScript", "Signal", "Électronique"],
  //   link: "https://github.com/ilyes-samhi/rc-filter"
  // },

];

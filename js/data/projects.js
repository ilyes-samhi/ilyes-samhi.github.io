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
      en: "3D shapes (torus, cube, möbius strip, sphere) rendered in ASCII in the terminal, with morphing, a moving light and a hand-made z-buffer. Pure Python + NumPy, no graphics library.",
      fr: "Formes 3D (tore, cube, ruban de Möbius, sphère) rendues en ASCII dans le terminal, avec morphing, lumière mobile et z-buffer maison. Python + NumPy uniquement, aucune bibliothèque graphique."
    },
    image: "img/donut-spin.gif",
    imageAlt: {
      en: "A spinning ASCII torus rendered in a terminal",
      fr: "Un tore ASCII en rotation dans un terminal"
    },
    tags: ["Python", "NumPy", "3D", "ASCII"],
    link: "https://github.com/otakilly/enhanced-spinning-donut/"
  },

];

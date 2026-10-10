/* =====================================================
   TRADUCTIONS : TOUS les textes du site, par langue.
   - La clé (ex: "lead") correspond à l'attribut data-i="lead" dans index.html.
   - Si une clé manque dans une langue, la langue par défaut (en) est utilisée.

   Pour AJOUTER UNE LANGUE (ex: espagnol) :
     1. Copie le bloc "fr" ci-dessous, renomme-le "es" et traduis.
     2. Dans index.html, ajoute <button type="button" data-lang="es" aria-pressed="false">ES</button>
   ===================================================== */
window.App.translations = {

  en: {
    // --- Métadonnées / accessibilité ---
    title: "Ilyes Samhi – Engineering student at Polytech Montpellier",
    nav: "Main navigation",
    top: "Back to top",

    // --- Menu ---
    n_proj: "Projects", n_edu: "Education", n_contact: "Contact",

    // --- Hero ---
    lead: "Engineering student at Polytech Montpellier. I'm interested in semiconductors and in how circuits are designed. This is where I share the projects I build along the way.",

    // --- Boutons de l'en-tête ---
    theme_dark: "Dark",
    theme_light: "Light",
    snd_on: "Music on",
    snd_off: "Music off",

    // --- Projets ---
    h_proj: "Projects",
    proj: "Nothing finished to show just yet. This section will be updated very soon, so check back shortly.",
    proj_link: "View the project",   // texte du lien sur chaque carte de projet

    // --- Formation ---
    h_edu: "Education",
    edu1: "Engineering degree (Master's level), specialisation in Electronics and Industrial Computing, MEA track: Microelectronics and Automation",
    edu2: "Preparatory classes (CPGE) in maths, physics and chemistry (PCSI, then PC)",

    // --- Contact ---
    h_contact: "Contact",
    contact: "You can reach me here."
  },

  fr: {
    title: "Ilyes Samhi – Élève ingénieur à Polytech Montpellier",
    nav: "Navigation principale",
    top: "Retour en haut",

    n_proj: "Projets", n_edu: "Formation", n_contact: "Contact",

    lead: "Élève ingénieur à Polytech Montpellier. Je m'intéresse aux semi-conducteurs et à la façon dont on conçoit les circuits. Je partage ici les projets que je mène au fil de ma formation.",

    theme_dark: "Sombre",
    theme_light: "Clair",
    snd_on: "Musique activée",
    snd_off: "Musique coupée",

    h_proj: "Projets",
    proj: "Rien de terminé à montrer pour l'instant. Cette section sera mise à jour très bientôt.",
    proj_link: "Voir le projet",

    h_edu: "Formation",
    edu1: "Diplôme d'ingénieur (grade de master), spécialité Électronique et Informatique Industrielle, parcours MEA : Microélectronique et Automatique",
    edu2: "Classes préparatoires (CPGE) : PCSI puis PC",

    h_contact: "Contact",
    contact: "Vous pouvez me joindre ici."
  }
};

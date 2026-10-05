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
    title: "Ilyes Samhi – Microelectronics & Automation student",
    nav: "Main navigation",
    top: "Back to top",

    // --- Menu ---
    n_about: "About", n_edu: "Education", n_skills: "Skills", n_proj: "Projects", n_contact: "Contact",

    // --- Hero ---
    lead: "Engineering student in Microelectronics and Automation at Polytech Montpellier. What interests me most is microelectronics: how circuits and chips are designed, and how they make everyday devices work. I also have a strong background in chemistry, useful for understanding the materials and manufacturing behind components.",
    b_contact: "Get in touch",
    scope_cap: "Live audio signal. Turn on the sound to see it move.",
    snd_on: "♪ Sound on",
    snd_off: "♪ Sound off",

    // --- À propos ---
    h_about: "About",
    about: "I spent two years in preparatory classes (CPGE, PCSI then PC), an intensive two-year undergraduate programme in mathematics, physics and chemistry that prepares for the entrance exams of French engineering schools. I did it at Lycée Aristide Briand in Évreux. I have now joined Polytech Montpellier, where I am working towards a French engineering degree (Master's level) in the MEA track (Microelectronics and Automation), with a clear interest in microelectronics.",

    // --- Formation ---
    h_edu: "Education",
    edu1: "Engineering degree (Master's level), specialisation in Electronics and Industrial Computing, MEA track: Microelectronics and Automation",
    edu2: "Preparatory classes (CPGE): intensive two-year programme in maths, physics and chemistry (PCSI, then PC)",

    // --- Compétences (t = titre, sans t = contenu) ---
    h_skills: "Skills",
    s1t: "Interests",    s1: "Microelectronics, automation, semiconductor materials, computer architecture",
    s2t: "Foundations",  s2: "Mathematics, physics and chemistry (two years of CPGE), analytical problem solving",
    s4t: "Programming",  s4: "Python",
    s3t: "Languages",    s3: "French, English (fluent)",

    // --- Projets ---
    h_proj: "Projects",
    proj: "Nothing finished to show just yet. This section will be updated very soon, so check back shortly.",
    proj_link: "View the project →",   // texte du lien sur chaque carte de projet

    // --- Contact ---
    h_contact: "Contact",
    contact: "Questions, opportunities, or just want to chat? Get in touch."
  },

  fr: {
    title: "Ilyes Samhi – Étudiant en Microélectronique et Automatique",
    nav: "Navigation principale",
    top: "Retour en haut",

    n_about: "À propos", n_edu: "Formation", n_skills: "Compétences", n_proj: "Projets", n_contact: "Contact",

    lead: "Élève ingénieur en Microélectronique et Automatique à Polytech Montpellier. Ce qui m'intéresse le plus, c'est la microélectronique : comment on conçoit les circuits et les puces, et comment ils font fonctionner les appareils du quotidien. J'ai aussi de solides bases en chimie, utiles pour comprendre les matériaux et la fabrication des composants.",
    b_contact: "Me contacter",
    scope_cap: "Signal audio en direct. Activez le son pour le voir bouger.",
    snd_on: "♪ Son activé",
    snd_off: "♪ Son coupé",

    h_about: "À propos",
    about: "J'ai fait deux ans de classes préparatoires (CPGE, PCSI puis PC) au lycée Aristide Briand d'Évreux, où j'ai acquis une solide base en mathématiques, en physique et en chimie. J'ai maintenant rejoint Polytech Montpellier, où je prépare le diplôme d'ingénieur, spécialité Électronique et Informatique Industrielle, parcours MEA (Microélectronique et Automatique), avec un intérêt marqué pour la microélectronique.",

    h_edu: "Formation",
    edu1: "Diplôme d'ingénieur (grade de master), spécialité Électronique et Informatique Industrielle, parcours MEA : Microélectronique et Automatique",
    edu2: "Classes préparatoires (CPGE) : PCSI puis PC",

    h_skills: "Compétences",
    s1t: "Centres d'intérêt", s1: "Microélectronique, automatique, matériaux semi-conducteurs, architecture des ordinateurs",
    s2t: "Bases",             s2: "Mathématiques, physique et chimie (deux ans de CPGE), résolution de problèmes",
    s4t: "Programmation",     s4: "Python",
    s3t: "Langues",           s3: "Français, anglais (courant)",

    h_proj: "Projets",
    proj: "Rien de terminé à montrer pour l'instant. Cette section sera mise à jour très bientôt.",
    proj_link: "Voir le projet →",

    h_contact: "Contact",
    contact: "Une question, une opportunité, ou simplement envie d'échanger ? Écrivez-moi."
  }
};
/* =====================================================
   AUDIO : musique d'ambiance générée en direct (Web Audio API).
   Rien n'est un fichier mp3 : le navigateur synthétise le son avec des oscillateurs.
   Ne démarre que sur clic du bouton ♪ (jamais tout seul).

   Les "briques" de la musique :
   - playChord : nappe d'accord (pad) + basse, change toutes les stepsPerChord croches
   - pluck     : petites notes pincées aléatoires dans l'accord courant
   - hat       : charleston (bruit aigu court) sur les temps faibles
   - Le tout passe par un filtre, un compresseur et une réverbération.

   Événements émis :
   - "soundchange" {playing}  → le son vient d'être activé/coupé
   - "burst" {strength}       → demande une onde visuelle (écoutée par background.js)
   ===================================================== */
(function (App) {

  var cfg = App.config.audio;
  var rand = App.utils.rand;
  var STEP = 60 / cfg.bpm / 2; // durée d'une croche en secondes

  var ctx, master, bus, noiseBuf, timer;
  var nextT = 0;                  // moment (en s) où jouer la prochaine croche
  var step = 0;                   // compteur de croches
  var chordIdx = 0;               // accord en cours dans la progression
  var curChord = cfg.chords[0];
  var poolIdx = 0;                // position actuelle de la "mélodie" dans la gamme
  var playing = false;

  // Convertit une note MIDI (69 = La 440 Hz) en fréquence (Hz)
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function emitSoundChange() {
    document.dispatchEvent(new CustomEvent('soundchange', { detail: { playing: playing } }));
  }

  // Demande une onde visuelle, au moment précis où la note est jouée (time = temps audio)
  function scheduleBurst(time, strength) {
    var delay = Math.max(0, (time - ctx.currentTime) * 1000);
    setTimeout(function () {
      document.dispatchEvent(new CustomEvent('burst', { detail: { strength: strength } }));
    }, delay);
  }

  // ----- Création de la chaîne audio -----
  // oscillateurs → bus (filtre) → master (volume) → compresseur → haut-parleurs
  //                       └→ réverbération ↗
  function setup() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false; // navigateur sans Web Audio
    ctx = new AC();

    // Compresseur : évite la saturation quand beaucoup de sons jouent ensemble
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.ratio.value = 3;

    // Volume général (démarre à 0, on le monte en douceur)
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(comp);
    comp.connect(ctx.destination);


    // "bus" : tous les instruments y passent. Filtre passe-bas = coupe les aigus (son plus doux)
    bus = ctx.createBiquadFilter();
    bus.type = 'lowpass';
    bus.frequency.value = cfg.busCutoff;
    bus.connect(master);

    // Réverbération : on fabrique une "réponse impulsionnelle" = du bruit qui s'éteint progressivement
    var len = Math.floor(ctx.sampleRate * cfg.reverbSeconds);
    var ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = ir.getChannelData(ch);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    var rev = ctx.createConvolver();
    rev.buffer = ir;
    var wet = ctx.createGain();   // quantité de réverbération
    wet.gain.value = cfg.reverbMix;
    bus.connect(rev); rev.connect(wet); wet.connect(master);

    // Court échantillon de bruit blanc, réutilisé pour le charleston
    noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.2), ctx.sampleRate);
    var nd = noiseBuf.getChannelData(0);
    for (var j = 0; j < nd.length; j++) nd[j] = Math.random() * 2 - 1;

    return true;
  }

  // ----- Une note d'oscillateur avec enveloppe de volume -----
  // Options : type (forme d'onde), note (MIDI), time (début, s), attack (montée), hold (maintien),
  //           release (extinction), volume, detune (désaccord en cents), dest (sortie), pan (-1 gauche, +1 droite)
  function tone(o) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = o.type;
    osc.frequency.value = mtof(o.note);
    osc.detune.value = o.detune || 0;

    // Enveloppe : 0 → volume (attack) → maintien (hold) → extinction exponentielle (release)
    var t = o.time;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(o.volume, t + o.attack);
    gain.gain.setValueAtTime(o.volume, t + o.attack + o.hold);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + o.attack + o.hold + o.release);

    osc.connect(gain);
    var out = o.dest || bus;
    if (o.pan && ctx.createStereoPanner) { // positionnement gauche/droite si supporté
      var p = ctx.createStereoPanner();
      p.pan.value = o.pan;
      gain.connect(p); p.connect(out);
    } else {
      gain.connect(out);
    }
    osc.start(t);
    osc.stop(t + o.attack + o.hold + o.release + 0.1); // libère l'oscillateur après usage
  }

  // Note "pincée" : triangle + sinus à l'octave, filtre qui se ferme vite (son de pizzicato)
  function pluck(note, t, volume, pan) {
    var lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.Q.value = 1;
    lp.frequency.setValueAtTime(3200, t);
    lp.frequency.exponentialRampToValueAtTime(500, t + 0.4);
    lp.connect(bus);
    tone({ type: 'triangle', note: note,      time: t, attack: 0.005, hold: 0, release: 1,   volume: volume,       dest: lp, pan: pan });
    tone({ type: 'sine',     note: note + 12, time: t, attack: 0.005, hold: 0, release: 0.6, volume: volume * 0.3, dest: lp, pan: pan });
  }

  // Charleston : bruit blanc filtré (aigus seulement) très court
  function hat(t) {
    var src = ctx.createBufferSource();
    var gain = ctx.createGain();
    var hp = ctx.createBiquadFilter();
    src.buffer = noiseBuf;
    hp.type = 'highpass'; hp.frequency.value = 7000;
    gain.gain.setValueAtTime(0.012, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    src.connect(hp); hp.connect(gain); gain.connect(master);
    src.start(t);
  }

  // Accord : 4 notes en dents de scie (désaccordées = effet "chorus") + basse. Le filtre s'ouvre puis se referme.
  function playChord(t) {
    var c = curChord = cfg.chords[chordIdx++ % cfg.chords.length];
    var len = cfg.stepsPerChord * STEP;

    var lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.Q.value = 0.7;
    lp.frequency.setValueAtTime(450, t);
    lp.frequency.linearRampToValueAtTime(1300, t + len * 0.5);
    lp.frequency.linearRampToValueAtTime(500, t + len);
    lp.connect(bus);

    [1, 2, 3, 4].forEach(function (i, k) {
      // Deux oscillateurs par note, désaccordés dans des sens opposés et placés à gauche/droite
      tone({ type: 'sawtooth', note: c[i], time: t, attack: 2.5, hold: len - 4, release: 3, volume: 0.02, detune: k * 5 - 8, dest: lp, pan: k % 2 ? 0.3 : -0.3 });
      tone({ type: 'sawtooth', note: c[i], time: t, attack: 2.5, hold: len - 4, release: 3, volume: 0.02, detune: 8 - k * 5, dest: lp, pan: k % 2 ? -0.3 : 0.3 });
    });
    // Basse : une octave sous la fondamentale
    tone({ type: 'triangle', note: c[0] - 12, time: t, attack: 1.2, hold: len - 2, release: 2.5, volume: 0.2 });
    tone({ type: 'sine',     note: c[0] - 12, time: t, attack: 1.2, hold: len - 2, release: 2.5, volume: 0.2 });

    scheduleBurst(t, 1.6); // grosse onde visuelle à chaque changement d'accord
  }

  // Notes utilisables pour la mélodie : celles de l'accord courant (+ certaines à l'octave)
  function notePool() {
    var c = curChord;
    return [c[1], c[2], c[3], c[4], c[2] + 12, c[3] + 12, c[4] + 12];
  }

  // ----- Séquenceur -----
  // Appelé toutes les 100 ms. Programme à l'avance (0,3 s) les prochaines croches :
  // c'est plus précis que de jouer les notes "à la volée" avec setTimeout.
  function schedule() {
    while (nextT < ctx.currentTime + 0.3) {
      if (step % cfg.stepsPerChord === 0) playChord(nextT);

      if (Math.random() < cfg.pluckProbability) {
        var P = notePool();
        // Marche aléatoire dans la gamme : surtout vers le haut (+1, +1, +2), parfois vers le bas (-1)
        poolIdx = (poolIdx + [1, 1, 2, -1, 3][Math.floor(Math.random() * 5)] + P.length) % P.length;
        pluck(P[poolIdx], nextT, rand(0.05, 0.09), rand(-0.5, 0.5));
        if (Math.random() < 0.2) scheduleBurst(nextT, 0.6); // petite onde de temps en temps
      }

      if (step % 2 === 1) hat(nextT); // charleston sur les croches impaires
      nextT += STEP;
      step++;
    }
  }

  function start() {
    if (playing) return; // déjà lancé (évite un double démarrage)
    if (!ctx && !setup()) return;
    ctx.resume(); // les navigateurs créent le contexte "suspendu" tant qu'il n'y a pas eu de clic
    playing = true;
    emitSoundChange();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(cfg.masterVolume, ctx.currentTime, cfg.fadeInTime); // montée douce
    nextT = ctx.currentTime + 0.1;
    step = 0;
    timer = setInterval(schedule, 100);
  }

  function stop() {
    playing = false;
    emitSoundChange();
    clearInterval(timer);
    var closing = ctx;
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.5); // descente douce
    // Après 2,5 s (le temps du fondu), on libère les ressources audio sauf si on a relancé entre-temps
    setTimeout(function () {
      if (!playing && ctx === closing) { closing.close(); ctx = null; }
    }, 2500);
  }

  function toggle() { playing ? stop() : start(); }

  function init() {
    // Onglet caché : on met le son en pause pour ne pas déranger ni consommer inutilement
    document.addEventListener('visibilitychange', function () {
      if (!ctx || !playing) return;
      document.hidden ? ctx.suspend() : ctx.resume();
    });
  }

  App.audio = {
    init: init,
    toggle: toggle,
    isPlaying: function () { return playing; }
  };

})(window.App);
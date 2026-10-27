// Som do jogo feito em código (Web Audio), sem arquivos: trilha chiptune por fase e efeitos curtos.
// A trilha é gerada a partir de uma progressão de acordes + arpejo + baixo + bateria de 16 passos.

type Theme = { bpm: number; prog: [number, keyof typeof Q][]; lead: (number | null)[]; leadWave: OscillatorType; bass: number[]; bassWave: OscillatorType; drums: string };
const Q = { M: [0, 4, 7], m: [0, 3, 7], M7: [0, 4, 7, 11], m7: [0, 3, 7, 10] };
const _ = null;
// lead: índice no acorde (2 oitavas); bass: 1 = fundamental, 2 = oitava acima; drums: k bumbo, h chimbal, x os dois
const THEMES: Theme[] = [
  // fase 1 · canteiro: animada, dó maior
  { bpm: 132, prog: [[48, "M"], [43, "M"], [45, "m"], [41, "M"]], leadWave: "square", bassWave: "triangle",
    lead: [0, 2, 4, 2, 3, 2, 1, 2, 0, 2, 4, 5, 4, 2, 1, _], bass: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 2, 0, 0], drums: "k.h.k.h.k.h.k.hh" },
  // fase 2 · escritório: calma, acordes com sétima
  { bpm: 100, prog: [[53, "M7"], [52, "m7"], [50, "m7"], [48, "M7"]], leadWave: "triangle", bassWave: "triangle",
    lead: [0, _, 2, _, 3, _, 2, 1, _, 0, _, 2, 4, _, _, _], bass: [1, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0], drums: "..h...h...h...h." },
  // fase 3 · servidores: lá menor, pulsante
  { bpm: 138, prog: [[45, "m"], [45, "m"], [41, "M"], [43, "M"]], leadWave: "square", bassWave: "square",
    lead: [0, 1, 2, 3, 0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 1, 2], bass: [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0], drums: "x.h.k.h.x.h.k.hh" },
  // fase 4 · fliperama: mi menor, rápida
  { bpm: 152, prog: [[52, "m"], [48, "M"], [50, "M"], [47, "M"]], leadWave: "square", bassWave: "triangle",
    lead: [0, 2, 4, 5, 4, 2, 0, 2, 3, _, 3, 4, 5, 4, 3, 2], bass: [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 2, 1, 2], drums: "x.hhk.hhx.hhk.hx" },
];
export type Sfx = "jump" | "jump2" | "item" | "punch" | "hit" | "stomp" | "hurt" | "drop" | "door" | "close" | "win";
const MUSIC = 0.32, DUCK = 0.1;

export function createSom(muted: boolean) {
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ac = new AC();
  const master = ac.createGain(), music = ac.createGain(), sfx = ac.createGain();
  master.gain.value = muted ? 0 : 1; music.gain.value = MUSIC; sfx.gain.value = 0.5;
  music.connect(master); sfx.connect(master); master.connect(ac.destination);
  const mtof = (m: number) => 440 * 2 ** ((m - 69) / 12);

  function note(f: number, t: number, d: number, type: OscillatorType, v: number, out: AudioNode, f2?: number) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(out); o.start(t); o.stop(t + d + 0.02);
  }
  const noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.3, ac.sampleRate);
  noiseBuf.getChannelData(0).forEach((_, i, a) => (a[i] = Math.random() * 2 - 1));
  function noise(t: number, d: number, v: number, out: AudioNode, freq: number, type: BiquadFilterType) {
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf; f.type = type; f.frequency.value = freq;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(f).connect(g).connect(out); s.start(t); s.stop(t + d);
  }

  const SFX: Record<Sfx, (t: number) => void> = {
    jump: (t) => note(320, t, 0.14, "square", 0.25, sfx, 640),
    jump2: (t) => note(480, t, 0.12, "square", 0.22, sfx, 960),
    item: (t) => { note(988, t, 0.07, "square", 0.22, sfx); note(1319, t + 0.07, 0.28, "square", 0.22, sfx); },
    punch: (t) => { noise(t, 0.08, 0.4, sfx, 800, "lowpass"); note(140, t, 0.08, "square", 0.2, sfx, 60); },
    hit: (t) => { noise(t, 0.12, 0.5, sfx, 1500, "lowpass"); note(220, t, 0.15, "square", 0.25, sfx, 50); },
    stomp: (t) => note(500, t, 0.16, "square", 0.25, sfx, 90),
    hurt: (t) => { note(330, t, 0.35, "sawtooth", 0.22, sfx, 70); noise(t, 0.2, 0.25, sfx, 1200, "lowpass"); },
    drop: (t) => note(520, t, 0.14, "triangle", 0.3, sfx, 220),
    door: (t) => [523, 659, 784, 1047].forEach((f, i) => note(f, t + i * 0.05, 0.12, "triangle", 0.3, sfx)),
    close: (t) => [1047, 784, 523].forEach((f, i) => note(f, t + i * 0.05, 0.1, "triangle", 0.25, sfx)),
    win: (t) => { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => note(f, t + i * 0.09, 0.14, "square", 0.2, sfx)); note(1319, t + 0.54, 0.7, "square", 0.22, sfx); },
  };

  // sequenciador com antecipação: agenda os passos dos próximos 120 ms; troca de fase só no começo do compasso
  let cur = -1, want = 0, step = 0, next = 0;
  const tick = () => {
    if (cur < 0) { cur = want; next = ac.currentTime + 0.05; }
    while (next < ac.currentTime + 0.12) {
      if (step % 16 === 0 && want !== cur) { cur = want; step = 0; }
      const th = THEMES[cur], s = step % 16, dt = 60 / th.bpm / 4;
      const [root, q] = th.prog[Math.floor(step / 16) % th.prog.length];
      const tones = [...Q[q], ...Q[q].map((i) => i + 12)];
      const l = th.lead[s];
      if (l != null) note(mtof(root + 24 + tones[l % tones.length]), next, dt * 0.9, th.leadWave, 0.1, music);
      const b = th.bass[s];
      if (b) note(mtof(root + (b === 2 ? 12 : 0)), next, dt * 1.8, th.bassWave, 0.22, music);
      const d = th.drums[s];
      if (d === "k" || d === "x") note(150, next, 0.12, "sine", 0.5, music, 40);
      if (d === "h" || d === "x") noise(next, 0.03, 0.08, music, 7000, "highpass");
      next += dt; step++;
    }
  };
  const timer = setInterval(tick, 25);
  // aba escondida: suspende para não acumular notas atrasadas
  const onVis = () => { if (document.hidden) ac.suspend(); else { ac.resume(); next = ac.currentTime + 0.05; } };
  document.addEventListener("visibilitychange", onVis);

  return {
    sfx: (n: Sfx) => SFX[n](ac.currentTime),
    fase: (i: number) => { want = Math.min(i, THEMES.length - 1); },
    duck: (on: boolean) => music.gain.setTargetAtTime(on ? DUCK : MUSIC, ac.currentTime, 0.15),
    mute: (on: boolean) => master.gain.setTargetAtTime(on ? 0 : 1, ac.currentTime, 0.05),
    resume: () => { if (ac.state === "suspended" && !document.hidden) ac.resume(); },
    stop: () => { clearInterval(timer); document.removeEventListener("visibilitychange", onVis); ac.close(); },
  };
}
export type Som = ReturnType<typeof createSom>;

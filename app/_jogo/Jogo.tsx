"use client";

// Portfólio como jogo de plataforma, em fases empilhadas num mundo contínuo.
// Modo leitura: a página normal, com os cases completos em texto.
// Modo jogo: canvas em tela cheia. Você desce o mundo pelas 4 fases: canteiro de obras, escritório de RH,
// sala de servidores e fliperama. Cada fase tem cenário, plataformas, item, inimigo e roupa próprios;
// o cenário faz a transição suave entre fases. Cada projeto é um lugar (contêiner, sala): na porta,
// ↑ abre o case. Os itens do caminho revelam os impactos do projeto ao serem coletados.
// Arte: pixel art gerada no ChatGPT e processada em public/jogo (personagem e fase1/ a fase4/).

import { useEffect, useRef, useState } from "react";
import { createSom, type Som } from "./som";
import Leitura, { CONTATOS, Stack } from "./Leitura";
import Player from "./Player";
import obj1 from "@/public/jogo/fase1/obj.json";
import obj2 from "@/public/jogo/fase2/obj.json";
import obj3 from "@/public/jogo/fase3/obj.json";
import obj4 from "@/public/jogo/fase4/obj.json";

/* ---------------- conteúdo ---------------- */
export type Case = { key: string; kicker: string; title: string; badge?: string; ideia: string; dores: string[]; impactos: string[]; stack: string[]; stackMais: string[]; demo?: string; demoSoDesktop?: boolean };
// stack: destaques na ordem código, integração/ERP, acesso, banco (e RLS); stackMais: o resto, aberto pelo "+N".
// Levantado dos repositórios em 27/10/2026.
const CASES: Case[] = [
  {
    key: "audit", kicker: "GPL Incorporadora · BIM", title: "Audit BIM", demo: "/demo/auditbim/index.html",
    ideia: "Auditoria de modelos BIM por disciplina, com checklist, não conformidades rastreadas até a correção e score de qualidade por projeto.",
    dores: ["Auditoria feita em planilha, item a item", "Não conformidade apontada e esquecida, sem vínculo com a correção", "Ninguém sabia o nível de qualidade real de cada projeto"],
    impactos: ["A auditoria saiu da planilha e virou um fluxo guiado", "Cada NC fica ligada à correção no Construflow", "A qualidade do modelo virou um score comparável"],
    stack: ["Next.js 15", "TypeScript", "Azure AD", "Supabase", "RLS"],
    stackMais: ["React 19", "Tailwind CSS 4", "TanStack Query", "Zustand", "React Hook Form", "Zod", "Recharts", "jsPDF", "Construflow", "Vercel", "GitHub Actions"],
  },
  {
    key: "edifica", kicker: "GPL Incorporadora · Obra", title: "Edifica", demo: "/demo/edifica/index.html",
    ideia: "Diário de obra pensado para o tablet, que também funciona no celular, e folha de pagamento das equipes integrada aos ERPs, com dupla aprovação antes de ir para o sistema.",
    dores: ["Diários de obra num sistema externo, com pouco controle", "Folha enviada colaborador por colaborador, num app do Power Apps", "Pouco rastreio do que foi produzido em relação ao que foi pago", "Quase nenhum relatório de folha, e indicadores fracos sobre os diários"],
    impactos: ["R$ 2,5M+ em folha geridos", "9 obras integradas", "Integração de ponta a ponta com 2 ERPs: UAU e ALMOB", "Relatórios com indicadores diferentes, para ver só o que importa", "Em média, por mês: 4.861 visualizações, 638 acessos e 67 pessoas usando"],
    stack: ["Next.js 15", "TypeScript", "ERP UAU", "ALMOB", "Azure AD", "Supabase", "RLS"],
    stackMais: ["React 19", "Tailwind CSS 4", "shadcn/ui", "TanStack Query", "React Hook Form", "Zod", "Recharts", "visx", "GSAP", "dnd-kit", "jsPDF", "xlsx", "Microsoft Graph", "Discord", "Supabase Edge Functions", "Supabase Storage", "Upstash Redis", "GlitchTip", "PostHog", "Playwright", "Vercel Cron", "GitHub Actions", "AES-256-GCM (LGPD)"],
  },
  {
    key: "databook", kicker: "GPL Incorporadora · Qualidade", title: "Databook", demo: "/demo/databook/index.html", demoSoDesktop: true, badge: "Em desenvolvimento",
    ideia: "Laudos e ensaios num lugar só, com revisões preservadas e aprovação do SGQ com trilha de auditoria.",
    dores: ["Laudos espalhados em pastas, difíceis de achar na entrega", "Versões sobrescritas, sem histórico", "Aprovação do SGQ sem trilha de auditoria"],
    impactos: ["Documentação pronta para a entrega da obra", "Cada revisão preservada, sem sobrescrever", "Aprovado não se edita mais"],
    stack: ["Next.js 15", "TypeScript", "Azure AD", "Supabase", "RLS"],
    stackMais: ["React 19", "Tailwind CSS", "Supabase Storage", "Resend", "PostHog", "Vercel", "GitHub Actions"],
  },
  {
    key: "tempus", kicker: "GPL Incorporadora · RH", title: "Tempus", demo: "/demo/tempus/index.html",
    ideia: "Portal de ponto: cada colaborador acompanha o próprio ponto no dia a dia e pede ajustes num fluxo formal, com aprovação do gestor.",
    dores: ["Batida faltando e saldo negativo só apareciam no fechamento", "Ajustes pedidos por WhatsApp e e-mail, sem trilha", "O DP virava gargalo de toda correção"],
    impactos: ["O colaborador vê o próprio saldo todo dia, não só no fechamento", "Ajuste de ponto vira solicitação formal, com aprovação do gestor", "Trilha imutável: a marcação original do relógio nunca é alterada"],
    stack: ["Next.js 16", "TypeScript", "Secullum Ponto4", "Azure AD", "Supabase", "SQL Server", "RLS"],
    stackMais: ["React 19", "Tailwind CSS 4", "Vitest", "Docker", "GHCR", "IIS", "GitHub Actions"],
  },
  {
    key: "hub", kicker: "GPL Incorporadora · DevOps", title: "HUB", demo: "/demo/hub/index.html",
    ideia: "Painel que acompanha todos os repositórios do time: PRs, branches paradas e padrões de CI, com um botão que abre a correção sozinho.",
    dores: ["PRs esquecidas por dias sem review", "Cada repositório com um padrão diferente de CI e release", "Ninguém via o estado do time inteiro numa tela só"],
    impactos: ["O estado de todos os repositórios numa tela só", "Cada PR ganha uma nota de S a D e entra numa fila de review", "Padrão fora do lugar se corrige com um clique, que abre a PR"],
    stack: ["JavaScript", "GitHub API", "Discord", "GitHub Actions"],
    stackMais: ["HTML/CSS", "Node.js", "GraphQL", "GitHub Pages"],
  },
  {
    key: "partietta", kicker: "Projeto pessoal · Games", title: "Partietta", demo: "/demo/partietta/index.html", badge: "Em desenvolvimento",
    ideia: "Plataforma para encontrar parceiros de jogo por compatibilidade explicável: você vê quanto cada critério pesou no match. Para jogadores maiores de 18 anos.",
    dores: ["Achar gente compatível para jogar é pura sorte", "Matchmaking caixa-preta, sem explicar o porquê", "Grupos que não fecham por falta de canal de voz"],
    impactos: ["Match explicado: 9 critérios com pesos que dá para conferir", "Party com call temporária no Discord, criada na hora", "Conexões com moderação e público só de maiores de 18"],
    stack: ["Next.js 16", "TypeScript", "Discord API", "Supabase Auth", "Supabase", "RLS"],
    stackMais: ["React 19", "Tailwind CSS 4", "shadcn/ui", "Jotai", "Zod", "Google OAuth", "Supabase Storage", "GlitchTip", "Playwright", "Vercel Cron", "GitHub Actions"],
  },
];
const ALL_SKILLS = [...new Set(CASES.flatMap((c) => c.stack))];

/* ---------------- fases ---------------- */
// tiles: recuo do topo de cada peça até onde o pé pisa. horizon: altura da base do skyline no fundo (0..1)
const FASES = [
  { id: "fase1", from: 0, hero: "obra", horizon: 0.58, tiles: { laje: 2, viga: 1, and: 2, chao: 9 } as Record<string, number>,
    item: ["obj-planta1", "obj-planta2"], itemName: "PLANTA", bug: ["obj-bug1", "obj-bug2", "obj-bug3"], bugScale: 0.6 },
  { id: "fase2", from: 2260, hero: "rh", horizon: 0.6, tiles: { mesa: 1, est: 2, duto: 3, chao: 2 } as Record<string, number>,
    item: ["obj-item1", "obj-item2"], itemName: "CARTÃO", bug: ["obj-bug1", "obj-bug2", "obj-bug3"], bugScale: 0.85 },
  { id: "fase3", from: 3080, hero: "server", horizon: 0.55, tiles: { rack: 1, cabo: 2, tubo: 3, chao: 3 } as Record<string, number>,
    item: ["obj-item1", "obj-item2"], itemName: "PENDRIVE", bug: ["obj-bug1", "obj-bug2", "obj-bug3"], bugScale: 1 },
  { id: "fase4", from: 3900, hero: "arcade", horizon: 0.52, tiles: { arcade: 1, neon: 1, balcao: 1, chao: 2 } as Record<string, number>,
    item: ["obj-item1", "obj-item2"], itemName: "FICHA", bug: ["obj-bug1", "obj-bug2", "obj-bug3"], bugScale: 0.7 },
];
const IMGS = [
  ...["laje", "viga", "and", "chao"].flatMap((t) => ["l", "m", "r"].map((s) => `fase1/tile-${t}-${s}`)),
  ...["mesa", "est", "duto", "chao"].flatMap((t) => ["l", "m", "r"].map((s) => `fase2/tile-${t}-${s}`)),
  ...["conteiner", "cone", "sacos", "betoneira", "carrinho", "tijolos", "placa", "planta1", "planta2", "bug1", "bug2", "bug3"].map((n) => `fase1/obj-${n}`),
  ...["porta", "relogio", "bebedouro", "cadeira", "impressora", "vaso", "arquivo", "item1", "item2", "bug1", "bug2", "bug3"].map((n) => `fase2/obj-${n}`),
  ...["rack", "cabo", "tubo", "chao"].flatMap((t) => ["l", "m", "r"].map((s) => `fase3/tile-${t}-${s}`)),
  ...["porta", "rack", "monitor", "ar", "switch", "extintor", "carrinho", "item1", "item2", "bug1", "bug2", "bug3"].map((n) => `fase3/obj-${n}`),
  ...["arcade", "neon", "balcao", "chao"].flatMap((t) => ["l", "m", "r"].map((s) => `fase4/tile-${t}-${s}`)),
  ...["porta", "arcade", "garra", "hockey", "pinball", "sofa", "fichas", "item1", "item2", "bug1", "bug2", "bug3"].map((n) => `fase4/obj-${n}`),
  "fase1/predio", "fase2/predio", "fase3/predio", "fase4/predio",
];
// zona atual (HUD) pela altura do personagem
const ZONES: [number, string][] = [[300, "FASE 1 · CANTEIRO"], [840, "FASE 1 · AUDIT BIM"], [1420, "FASE 1 · EDIFICA"], [2000, "FASE 1 · DATABOOK"], [2260, "FASE 1 · FIM"], [3080, "FASE 2 · TEMPUS"], [3900, "FASE 3 · HUB"], [1e9, "FASE 4 · PARTIETTA"]];

/* ---------------- física e sprite ---------------- */
const CELL = 64, BASE = 62, SCALE = 1.25;
const ANIM = { idle: { row: 0, n: 4, fps: 6 }, run: { row: 1, n: 6, fps: 12 }, jump: { row: 2, n: 4, fps: 0 }, punch: { row: 3, n: 3, fps: 16 } };
const HALF_W = 11, GRAV = 2000, RUN = 270, JUMP = 780, MAX_FALL = 1100;

type Plat = { x: number; y: number; w: number; f: number; tile: string; solid?: boolean };
// door: trecho da porta em px a partir da borda esquerda do objeto; sign: centro e tamanho do texto da placa
type Prop = { img: string; x: number; y: number; dy?: number; label?: string[]; case?: string; door?: [number, number]; sign?: [number, number, number] };
type Item = { x: number; y: number; f: number; caseKey: string; idx: number; got: boolean };
type Bug = { x: number; y: number; f: number; min: number; max: number; dir: number; dead: number; t: number };

// monta o mundo na largura da tela: x em frações da faixa central, y em pixels
function buildLevel(vw: number) {
  const SW = Math.min(1000, vw > 900 ? vw - 2 * 180 : vw - 16);
  const X0 = (vw - SW) / 2;
  const fx = (f: number) => X0 + f * SW;
  const plats: Plat[] = [], props: Prop[] = [], items: Item[] = [], bugs: Bug[] = [];
  let F = 0; // fase sendo montada
  const P = (a: number, b: number, y: number, tile: string, solid = false) => { plats.push({ x: fx(a), w: fx(b) - fx(a), y, f: F, tile, solid }); return plats[plats.length - 1]; };
  const item = (p: Plat, caseKey: string, idx: number) => items.push({ x: p.x + p.w / 2, y: p.y - 30, f: F, caseKey, idx, got: false });
  const bug = (p: Plat, f: number) => bugs.push({ x: p.x + p.w * f, y: p.y, f: F, min: p.x + 20, max: p.x + p.w - 20, dir: -1, dead: 0, t: Math.random() });
  const prop = (img: string, p: Plat, f: number, extra: Partial<Prop> = {}) => props.push({ img: `${FASES[F].id}/obj-${img}`, x: p.x + p.w * f, y: p.y, ...extra });
  const conteiner = (p: Plat, f: number, c: string) => prop("conteiner", p, f, { case: c, door: [60, 92], sign: [129, 18, 9] });

  /* fase 1 · canteiro */
  const start = P(0.03, 0.45, 260, "laje");
  prop("placa", start, 0.78, { label: ["FASE 1", "CANTEIRO"] });
  const a1 = P(0.5, 0.68, 395, "viga"), a2 = P(0.72, 0.96, 525, "and"), a3 = P(0.44, 0.62, 655, "viga");
  [a1, a2, a3].forEach((p, i) => item(p, "audit", i));
  const g1 = P(0, 0.8, 820, "chao");
  prop("cone", g1, 0.06); prop("cone", g1, 0.12); prop("sacos", g1, 0.3); conteiner(g1, 0.58, "audit"); bug(g1, 0.2);
  const b1 = P(0.8, 0.99, 975, "and"), b2 = P(0.5, 0.7, 1105, "viga"), b3 = P(0.14, 0.44, 1235, "laje");
  [b1, b2, b3].forEach((p, i) => item(p, "edifica", i));
  const g2 = P(0.2, 1, 1400, "chao");
  prop("carrinho", g2, 0.1); conteiner(g2, 0.52, "edifica"); prop("betoneira", g2, 0.88); bug(g2, 0.7);
  const c1 = P(0.01, 0.2, 1555, "viga"), c2 = P(0.25, 0.5, 1685, "and"), c3 = P(0.55, 0.86, 1815, "laje");
  [c1, c2, c3].forEach((p, i) => item(p, "databook", i));
  const g3 = P(0, 0.8, 1980, "chao");
  prop("tijolos", g3, 0.06); conteiner(g3, 0.38, "databook"); prop("placa", g3, 0.7, { label: ["EM", "DESENV."] });
  bug(g3, 0.6); bug(c3, 0.5);
  // fim da fase 1: vão à direita leva à fase 2
  const end1 = P(0, 0.8, 2200, "chao");
  prop("cone", end1, 0.2); prop("placa", end1, 0.66, { label: ["FASE 2", "→ ↓"] }); prop("cone", end1, 0.93);

  /* fase 2 · escritório (Tempus) */
  F = 1;
  const t1 = P(0.8, 0.99, 2385, "mesa"), t2 = P(0.48, 0.72, 2515, "est"), t3 = P(0.14, 0.4, 2645, "duto");
  [t1, t2, t3].forEach((p, i) => item(p, "tempus", i));
  const h1 = P(0, 1, 2820, "chao");
  prop("bebedouro", h1, 0.06); prop("cadeira", h1, 0.18);
  prop("relogio", h1, 0.44, { dy: -44 }); // relógio de ponto na parede, ao lado da porta
  prop("porta", h1, 0.52, { case: "tempus", door: [8, 48], sign: [28, 2, 7] });
  prop("impressora", h1, 0.72); prop("vaso", h1, 0.86); prop("arquivo", h1, 0.95);
  bug(h1, 0.3); bug(t2, 0.5);
  // fim da fase 2: vão à direita leva à fase 3
  const end2 = P(0, 0.8, 3020, "chao");
  prop("vaso", end2, 0.1); prop("arquivo", end2, 0.7);

  /* fase 3 · sala de servidores (HUB) */
  F = 2;
  const s1 = P(0.8, 0.99, 3205, "cabo"), s2 = P(0.48, 0.72, 3335, "tubo"), s3 = P(0.14, 0.4, 3465, "rack");
  [s1, s2, s3].forEach((p, i) => item(p, "hub", i));
  const h3 = P(0, 1, 3640, "chao");
  prop("ar", h3, 0.05); prop("rack", h3, 0.15); prop("monitor", h3, 0.3);
  prop("porta", h3, 0.52, { case: "hub", door: [8, 52], sign: [31, 3, 8] });
  prop("carrinho", h3, 0.74); prop("rack", h3, 0.9);
  bug(h3, 0.3); bug(s2, 0.5);
  // fim da fase 3: vão à direita leva à fase 4
  const end3 = P(0, 0.8, 3840, "chao");
  prop("switch", end3, 0.14); prop("extintor", end3, 0.7);

  /* fase 4 · fliperama (Partietta) */
  F = 3;
  const k1 = P(0.8, 0.99, 4025, "neon"), k2 = P(0.48, 0.72, 4155, "balcao"), k3 = P(0.14, 0.4, 4285, "arcade");
  [k1, k2, k3].forEach((p, i) => item(p, "partietta", i));
  const h4 = P(0, 1, 4460, "chao");
  prop("fichas", h4, 0.05); prop("arcade", h4, 0.14); prop("garra", h4, 0.24); prop("arcade", h4, 0.34);
  prop("porta", h4, 0.52, { case: "partietta", door: [12, 52], sign: [32, 3, 8] });
  prop("pinball", h4, 0.7); prop("hockey", h4, 0.82); prop("arcade", h4, 0.94);
  bug(h4, 0.3); bug(k2, 0.5);
  const end4 = P(0, 1, 4660, "chao", true);
  prop("arcade", end4, 0.08); prop("sofa", end4, 0.25); prop("garra", end4, 0.92);
  const notes = [{ x: fx(0.55), y: end4.y - 120, text: "FIM DO JOGO · VALEU POR JOGAR!" }];
  // vãos de descida: onde um chão (que não é o último) termina antes da borda da faixa
  const gaps = plats.filter((p) => p.tile === "chao" && !p.solid).flatMap((p) => [
    ...(p.x > X0 + 8 ? [{ x: (X0 + p.x) / 2, y: p.y }] : []),
    ...(p.x + p.w < X0 + SW - 8 ? [{ x: (p.x + p.w + X0 + SW) / 2, y: p.y }] : []),
  ]);

  // tela estreita: objeto de cenário que encosta em outro sai (porta de projeto primeiro, depois placas, depois o resto)
  const SIZES = [obj1, obj2, obj3, obj4] as unknown as Record<string, number[]>[];
  const width = (p: Prop) => SIZES[Number(p.img[4]) - 1][p.img.split("/obj-")[1]]?.[0] ?? 40;
  const rank = (p: Prop) => (p.case ? 0 : p.label ? 1 : 2);
  const kept: Prop[] = [];
  for (const p of [...props].sort((a, b) => rank(a) - rank(b))) {
    // não deixa o objeto passar da ponta da plataforma em que está
    const base = plats.find((q) => q.y === p.y && p.x >= q.x && p.x <= q.x + q.w);
    if (base) p.x = Math.min(Math.max(p.x, base.x + width(p) / 2 + 2), base.x + base.w - width(p) / 2 - 2);
    const a = p.x - width(p) / 2 - 4, b = p.x + width(p) / 2 + 4;
    const hit = kept.some((q) => q.y === p.y && a < q.x + width(q) / 2 && b > q.x - width(q) / 2);
    if (p.case || !hit) kept.push(p);
  }
  props.splice(0, props.length, ...props.filter((p) => kept.includes(p)));

  return {
    SW, X0, plats, props, items, bugs, notes, gaps, worldH: end4.y + 60, // o mundo termina no último piso (sem faixa vazia)
    spawns: [{ x: start.x + 50, y: start.y - 160 }, { x: fx(0.9), y: t1.y - 120 }, { x: fx(0.9), y: s1.y - 120 }, { x: fx(0.9), y: k1.y - 120 }], // reaparecer no começo da fase atual
  };
}

export default function Jogo() {
  const [playing, setPlaying] = useState(false);
  const [hud, setHud] = useState({ hearts: 3, items: 0, total: 12, skills: 0, zone: ZONES[0][1] });
  const [toast, setToast] = useState<{ k: number; title: string; text: string } | null>(null);
  const [open, setOpen] = useState<Case | null>(null);
  const [intro, setIntro] = useState(false); // tutorial ao começar o jogo
  const startBtn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const keys = useRef<Record<string, boolean>>({});
  const paused = useRef(false);
  const openCase = useRef<(c: Case) => void>(() => {});
  const closeBtn = useRef<HTMLButtonElement>(null);
  const som = useRef<Som | null>(null);
  const [muted, setMuted] = useState(false);
  const wasOpen = useRef(false);
  // fim da run: nota pela vida que sobrou, itens e skills
  type Result = { vidas: number; items: number; totalItems: number; skills: number; cases: number; kills: number; tempo: number; nota: number; grade: string };
  const [result, setResult] = useState<Result | null>(null);
  const [run, setRun] = useState(0); // trocar remonta o jogo do zero
  const resultBtn = useRef<HTMLButtonElement>(null);

  // abrir o case pausa o jogo; fechar devolve
  useEffect(() => {
    paused.current = !!open || intro || !!result;
    // foco sem rolar: o botão fica no fim da janela, e a janela deve abrir mostrando o topo
    const btn = open ? closeBtn.current : intro ? startBtn.current : result ? resultBtn.current : null;
    btn?.focus({ preventScroll: true }); btn?.closest(".jg-window")?.scrollTo(0, 0);
    som.current?.duck(!!open || intro || !!result); // música baixa com o jogo pausado
    if (wasOpen.current && !open) som.current?.sfx("close");
    wasOpen.current = !!open;
  }, [open, intro, result]);
  // tela de nota: Esc volta a explorar
  useEffect(() => {
    if (!result) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); setResult(null); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [result]);
  // som: preferência de mudo guardada neste navegador
  useEffect(() => { try { setMuted(localStorage.getItem("jg-mudo") === "1"); } catch {} }, []);
  const toggleMute = () => setMuted((m) => {
    try { localStorage.setItem("jg-mudo", m ? "0" : "1"); } catch {}
    som.current?.mute(!m); return !m;
  });
  // tutorial: Enter, espaço ou Esc começam o jogo
  useEffect(() => {
    if (!intro) return;
    const k = (e: KeyboardEvent) => { if (["Enter", " ", "Escape"].includes(e.key)) { e.preventDefault(); setIntro(false); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [intro]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    document.documentElement.style.overflow = playing ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const img: Record<string, HTMLImageElement> = {};
    const load = (key: string, src: string) => { const im = new Image(); im.src = src; img[key] = im; };
    for (const n of IMGS) load(n, `/jogo/${n}.png`);
    som.current = createSom(muted); som.current.duck(intro);
    for (const f of FASES) { load(`${f.id}/fundo`, `/jogo/${f.id}/fundo.webp`); load(`hero/${f.hero}`, `/jogo/${f.hero}.png`); }

    let L = buildLevel(innerWidth);
    const touch = matchMedia("(pointer: coarse)").matches;
    const pl = { x: L.spawns[0].x, y: L.spawns[0].y, vx: 0, vy: 0, face: 1, ground: null as Plat | null, jumps: 0, drop: 0, punch: 0, hurt: 0, anim: "idle", t: 0, still: 0 };
    let hearts = 3, got = 0, camY = 0, last = performance.now(), raf = 0;
    let hits = 0, kills = 0, finished = false;
    const t0 = performance.now();
    const opened = new Set<string>();
    const skills = new Set<string>();
    let zone = ZONES[0][1];
    const push = () => setHud({ hearts, items: got, total: L.items.length, skills: skills.size, zone });
    push();
    (window as unknown as { __jg: unknown }).__jg = { pl, L: () => L }; // gancho de depuração (usado nos testes com Playwright)

    openCase.current = (c: Case) => {
      opened.add(c.key); c.stack.forEach((s) => skills.add(s)); push();
      som.current?.sfx("door"); setOpen(c);
    };

    const resize = () => {
      const d = window.devicePixelRatio || 1;
      cv.width = Math.round(innerWidth * d); cv.height = Math.round(innerHeight * d);
      ctx.setTransform(d, 0, 0, d, 0, 0); ctx.imageSmoothingEnabled = false;
    };
    resize();
    const onResize = () => {
      // remonta o mundo na nova largura mantendo o progresso
      const fx = (pl.x - L.X0) / L.SW;
      const gotSet = L.items.map((p) => p.got);
      L = buildLevel(innerWidth); L.items.forEach((p, i) => (p.got = gotSet[i]));
      pl.x = L.X0 + fx * L.SW; resize();
    };
    window.addEventListener("resize", onResize);

    const faseAt = (y: number) => { let f = 0; FASES.forEach((F, i) => { if (y >= F.from) f = i; }); return f; };
    const ready = (n: string) => img[n]?.complete && img[n].naturalWidth > 0;
    const doorAt = () => {
      if (!pl.ground) return null;
      return L.props.find((p) => {
        if (!p.door || p.y !== pl.ground!.y || !ready(p.img)) return false;
        const X = p.x - img[p.img].width / 2;
        return pl.x > X + p.door[0] - 6 && pl.x < X + p.door[1] + 6;
      }) ?? null;
    };

    function jump() {
      if (pl.ground || pl.jumps < 2) { som.current?.sfx(pl.ground ? "jump" : "jump2"); pl.vy = -JUMP * (pl.ground ? 1 : 0.85); pl.jumps = pl.ground ? 1 : pl.jumps + 1; pl.ground = null; }
    }
    function punch() { if (pl.punch <= 0) { pl.punch = 3 / ANIM.punch.fps; som.current?.sfx("punch"); } }
    function up() {
      const d = doorAt();
      if (d) openCase.current(CASES.find((c) => c.key === d.case)!); else jump();
    }
    function down() { if (pl.ground && !pl.ground.solid) { pl.drop = 0.25; som.current?.sfx("drop"); } }

    const onKey = (e: KeyboardEvent) => {
      som.current?.resume();
      if (e.key === "m" && !e.repeat) return toggleMute();
      if (paused.current) return;
      const k = e.key;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(k)) e.preventDefault();
      if (k === "Escape") return setPlaying(false);
      if (!e.repeat) {
        if (k === " " || k === "z") jump();
        if (k === "ArrowUp" || k === "w" || k === "Enter") up();
        if (k === "x") punch();
        if (k === "ArrowDown" || k === "s") down();
      }
      keys.current[k] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => { keys.current[e.key] = false; };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    const onTouch = (e: Event) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-k]"); if (!t || paused.current) return;
      const k = t.dataset.k!, on = e.type === "pointerdown";
      if (!on) { keys.current[k] = false; return; }
      if (k === "jump") jump(); else if (k === "up") up(); else if (k === "punch") punch(); else if (k === "down") down(); else keys.current[k] = true;
    };
    document.addEventListener("pointerdown", onTouch);
    document.addEventListener("pointerup", onTouch);
    document.addEventListener("pointercancel", onTouch);

    const step = (dt: number) => {
      const k = keys.current;
      const dir = (k.ArrowRight || k.d || k.right ? 1 : 0) - (k.ArrowLeft || k.a || k.left ? 1 : 0);
      pl.vx = dir * RUN; if (dir) pl.face = dir;
      pl.vy = Math.min(MAX_FALL, pl.vy + GRAV * dt);
      const prevY = pl.y;
      pl.x = Math.max(HALF_W, Math.min(innerWidth - HALF_W, pl.x + pl.vx * dt));
      pl.y += pl.vy * dt;
      pl.drop = Math.max(0, pl.drop - dt); pl.punch = Math.max(0, pl.punch - dt); pl.hurt = Math.max(0, pl.hurt - dt);

      pl.ground = null;
      if (pl.vy >= 0 && pl.drop <= 0) {
        for (const p of L.plats) {
          const top = p.y + FASES[p.f].tiles[p.tile];
          if (pl.x + HALF_W < p.x || pl.x - HALF_W > p.x + p.w) continue;
          if (prevY <= top + 1 && pl.y >= top) { pl.y = top; pl.vy = 0; pl.ground = p; pl.jumps = 0; break; }
        }
      }
      if (pl.y > L.worldH) { const s = L.spawns[faseAt(prevY - 300)]; pl.x = s.x; pl.y = s.y; pl.vy = 0; } // caiu do mundo

      const z = ZONES.find(([until]) => pl.y < until)![1];
      if (z !== zone) { zone = z; push(); }
      som.current?.fase(faseAt(pl.y));
      // pisou no último piso (o único sólido): fim da run, uma vez por partida
      if (!finished && pl.ground?.solid) {
        finished = true;
        const vidas = Math.max(0, 3 - hits);
        const nota = Math.round((got / L.items.length) * 40 + (skills.size / ALL_SKILLS.length) * 40 + (vidas / 3) * 20);
        const grade = nota >= 95 ? "S" : nota >= 80 ? "A" : nota >= 60 ? "B" : nota >= 40 ? "C" : "D";
        som.current?.sfx("win");
        setResult({ vidas, items: got, totalItems: L.items.length, skills: skills.size, cases: opened.size, kills, tempo: (performance.now() - t0) / 1000, nota, grade });
      }

      // itens: coletar mostra um impacto do projeto
      for (const p of L.items) {
        if (!p.got && Math.abs(p.x - pl.x) < 26 && Math.abs(p.y - (pl.y - 30)) < 34) {
          p.got = true; got++; push(); som.current?.sfx("item");
          const c = CASES.find((c) => c.key === p.caseKey)!;
          setToast({ k: performance.now(), title: `${FASES[p.f].itemName} ${p.idx + 1}/3 · ${c.title.toUpperCase()}`, text: c.impactos[p.idx] });
        }
      }
      // inimigos: soco ou pisar em cima mata; encostar machuca
      for (const b of L.bugs) {
        if (b.dead) { b.dead += dt; continue; }
        b.t += dt; b.x += b.dir * 55 * dt;
        if (b.x < b.min || b.x > b.max) { b.dir *= -1; b.x = Math.max(b.min, Math.min(b.max, b.x)); }
        const dx = Math.abs(b.x - pl.x), feet = pl.y - b.y;
        const ahead = pl.face > 0 ? b.x > pl.x && b.x - pl.x < 48 : b.x < pl.x && pl.x - b.x < 48;
        if (pl.punch > 0 && ahead && Math.abs(feet) < 30) { b.dead = 0.01; kills++; som.current?.sfx("hit"); continue; }
        if (dx < 24 && pl.vy > 0 && feet > -30 && feet < -6) { b.dead = 0.01; kills++; som.current?.sfx("stomp"); pl.vy = -460; pl.jumps = 1; continue; }
        if (dx < 20 && Math.abs(feet) < 10 && pl.hurt <= 0) {
          hearts -= 1; hits++; pl.hurt = 1.2; som.current?.sfx("hurt"); pl.vy = -380; pl.x += (pl.x < b.x ? -1 : 1) * 34;
          if (hearts <= 0) { // perdeu as 3 vidas: a run recomeça do zero
            setToast({ k: performance.now(), title: "GAME OVER", text: "Suas vidas acabaram. A run recomeça do início." });
            setRun((r) => r + 1); return;
          }
          push();
        }
      }

      pl.anim = pl.punch > 0 ? "punch" : !pl.ground ? "jump" : dir ? "run" : "idle";
      pl.t += dt;
      pl.still = pl.ground && !dir ? pl.still + dt : 0;
      // toque: os botões ocupam o rodapé, então a câmera mostra o personagem mais alto e o mundo rola um pouco além do fim
      const pad = touch ? 150 : 0;
      const target = Math.max(0, Math.min(L.worldH - innerHeight + pad, pl.y - innerHeight * (touch ? 0.45 : 0.55)));
      camY += (target - camY) * Math.min(1, dt * 6);
    };

    const drawPlat = (p: Plat, y: number) => {
      const base = `${FASES[p.f].id}/tile-${p.tile}`;
      const l = img[`${base}-l`], m = img[`${base}-m`], r = img[`${base}-r`];
      if (!ready(`${base}-m`) || !ready(`${base}-l`) || !ready(`${base}-r`)) return;
      const X = Math.round(p.x), W = Math.round(p.w), Y = Math.round(y);
      const cap = Math.min(l.width, W / 2);
      ctx.drawImage(l, 0, 0, cap, l.height, X, Y, cap, l.height);
      ctx.drawImage(r, r.width - cap, 0, cap, r.height, X + W - cap, Y, cap, r.height);
      ctx.save(); ctx.beginPath(); ctx.rect(X + cap, Y - 4, W - 2 * cap, 80); ctx.clip();
      for (let x = X + cap; x < X + W - cap; x += m.width) ctx.drawImage(m, x, Y);
      ctx.restore();
      if (p.tile === "chao" && p.f === 0) { ctx.fillStyle = "#3a2618"; ctx.fillRect(X, Y + m.height - 2, W, 14); } // terra continua para baixo
    };

    // cenário de uma fase: céu/vista ao fundo, interior do prédio abaixo do horizonte, prédios nas laterais
    const drawScenery = (fi: number, alpha: number) => {
      const F = FASES[fi], vw = innerWidth, vh = innerHeight;
      const bg = img[`${F.id}/fundo`], pr = img[`${F.id}/predio`];
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.fillStyle = "#0b1224"; ctx.fillRect(0, 0, vw, vh);
      let horizon = 0;
      if (bg?.complete && bg.naturalWidth) {
        const s = Math.max(vw / bg.width, (vh * 1.15) / bg.height);
        const top = Math.round((F.from - (fi ? 260 : 0) - camY) * 0.3);
        ctx.drawImage(bg, Math.round((vw - bg.width * s) / 2), top, Math.round(bg.width * s), Math.round(bg.height * s));
        horizon = top + bg.height * s * F.horizon;
      }
      if (ready(`${F.id}/predio`)) {
        if (horizon < vh) {
          const y0 = Math.max(0, Math.round(horizon));
          ctx.save(); ctx.beginPath(); ctx.rect(0, y0, vw, vh - y0); ctx.clip();
          ctx.fillStyle = "#0b1224"; ctx.fillRect(0, y0, vw, vh - y0);
          ctx.globalAlpha = alpha * 0.32;
          const off = -((camY * 0.65) % pr.height);
          for (let x = Math.round(L.X0 % pr.width) - pr.width; x < vw; x += pr.width)
            for (let y = off - pr.height; y < vh; y += pr.height) ctx.drawImage(pr, x, Math.round(y));
          ctx.globalAlpha = alpha;
          const g = ctx.createLinearGradient(0, y0, 0, y0 + 90);
          g.addColorStop(0, "rgba(14,23,48,1)"); g.addColorStop(1, "rgba(14,23,48,0)");
          ctx.fillStyle = g; ctx.fillRect(0, y0, vw, 90);
          ctx.restore();
        }
        const off = -((camY * 0.5) % pr.height);
        ctx.globalAlpha = alpha * (vw > 900 ? 0.9 : 0.35);
        for (let y = off - pr.height; y < vh; y += pr.height) {
          ctx.drawImage(pr, Math.round(L.X0 - pr.width - 10), Math.round(y));
          ctx.save(); ctx.translate(Math.round(L.X0 + L.SW + 10 + pr.width), Math.round(y)); ctx.scale(-1, 1); ctx.drawImage(pr, 0, 0); ctx.restore();
        }
      }
      ctx.restore();
    };

    const draw = () => {
      const vw = innerWidth, vh = innerHeight, now = performance.now();
      ctx.fillStyle = "#0e1730"; ctx.fillRect(0, 0, vw, vh);
      // transição entre fases: a nova entra por cima da anterior em 320px de descida
      const mid = camY + vh / 2, fi = faseAt(mid);
      if (fi > 0) {
        const t = Math.min(1, Math.max(0, (mid - FASES[fi].from) / 320));
        if (t < 1) drawScenery(fi - 1, 1);
        drawScenery(fi, t);
      } else drawScenery(0, 1);

      const sy = (y: number) => y - camY;
      // vigas sendo içadas: cabo da grua sobe até a plataforma acima, com cintas e gancho
      for (const p of L.plats) {
        if (p.tile !== "viga" || sy(p.y) < -10 || sy(p.y) > vh + 10) continue;
        // o cabo sobe até o topo da tela por um ponto sem plataforma acima; sem ponto livre, a viga fica sem cabo
        const livre = (x: number) => !L.plats.some((q) => q.y < p.y - 20 && x > q.x - 6 && x < q.x + q.w + 6);
        const cx = [0.5, 0.3, 0.7, 0.18, 0.82].map((f) => Math.round(p.x + p.w * f)).find((x) => x - 20 > p.x && x + 20 < p.x + p.w && livre(x));
        if (cx === undefined) continue;
        const y = Math.round(sy(p.y)), cy0 = 0;
        ctx.fillStyle = "#151b2a";
        ctx.fillRect(cx - 1, cy0, 2, Math.max(0, y - 14 - cy0));
        ctx.fillRect(cx - 18, y - 14, 2, 14); ctx.fillRect(cx + 16, y - 14, 2, 14); ctx.fillRect(cx - 18, y - 16, 36, 2);
        ctx.fillStyle = "#c9a227"; ctx.fillRect(cx - 4, y - 24, 8, 8);
      }
      // abaixo do último chão: piso de concreto até o fim do mundo
      const lastP = L.plats[L.plats.length - 1];
      if (sy(lastP.y) < vh) { ctx.fillStyle = "#151a26"; ctx.fillRect(0, Math.round(sy(lastP.y) + 40), vw, vh); }
      for (const p of L.plats) if (sy(p.y) > -80 && sy(p.y) < vh + 10) drawPlat(p, sy(p.y));

      // objetos apoiados nas plataformas (base no topo da peça)
      for (const p of L.props) {
        if (!ready(p.img)) continue;
        const im = img[p.img], top = sy(p.y) + 6 + (p.dy ?? 0);
        if (top < -150 || top - im.height > vh) continue;
        const X = Math.round(p.x - im.width / 2), Y = Math.round(top - im.height);
        ctx.drawImage(im, X, Y);
        if (p.label) label(ctx, p.label, X + im.width / 2, Y + 5, "#2a1e05", 8);
        if (p.case && p.sign) {
          const c = CASES.find((c) => c.key === p.case)!;
          label(ctx, [c.title.toUpperCase()], X + p.sign[0], Y + p.sign[1], "#1c2433", p.sign[2]);
          if (opened.has(p.case)) { ctx.fillStyle = "#4fd16b"; ctx.fillRect(X + im.width - 8, Y + 2, 6, 6); }
        }
      }
      // itens (2 quadros brilhando)
      for (const p of L.items) {
        if (p.got) continue;
        const F = FASES[p.f], n = `${F.id}/${F.item[Math.floor(now / 300) % 2]}`; if (!ready(n)) continue;
        const im = img[n], bob = Math.sin(now / 320 + p.x) * 3;
        ctx.drawImage(im, Math.round(p.x - im.width / 2), Math.round(sy(p.y) - im.height / 2 + bob));
      }
      // inimigos; o derrotado some depois de 0,6s
      for (const b of L.bugs) {
        if (b.dead > 0.6) continue;
        const F = FASES[b.f], n = `${F.id}/${b.dead ? F.bug[2] : F.bug[Math.floor(b.t * 6) % 2]}`; if (!ready(n)) continue;
        const im = img[n], w = Math.round(im.width * F.bugScale), h = Math.round(im.height * F.bugScale);
        ctx.save(); ctx.translate(Math.round(b.x), Math.round(sy(b.y) + 4)); ctx.scale(b.dir > 0 ? 1 : -1, 1);
        ctx.drawImage(im, -w / 2, -h, w, h); ctx.restore();
      }
      for (const n of L.notes) if (sy(n.y) > -30 && sy(n.y) < vh) bubble(ctx, n.x, sy(n.y), n.text);
      // passagens: seta fixa balançando sobre cada vão de descida
      for (const g of L.gaps) {
        const y = sy(g.y) - 34 + Math.abs(Math.sin(now / 260)) * 10;
        if (y > -30 && y < vh) arrow(ctx, g.x, y, true);
      }
      // porta: aviso para entrar
      const d = doorAt();
      if (d) bubble(ctx, d.x - img[d.img].width / 2 + (d.door![0] + d.door![1]) / 2, sy(d.y) - img[d.img].height - 18, "↑ ENTRAR");
      // dica: parado, aponta o próximo objetivo (item ou porta ainda não visitada)
      if (pl.still > 1.4 && !d) {
        const nextItem = L.items.find((p) => !p.got);
        const nextDoor = L.props.find((p) => p.case && !opened.has(p.case));
        const tgt = [nextItem && { x: nextItem.x, y: nextItem.y - 24 },
          nextDoor && ready(nextDoor.img) && { x: nextDoor.x - img[nextDoor.img].width / 2 + (nextDoor.door![0] + nextDoor.door![1]) / 2, y: nextDoor.y - img[nextDoor.img].height - 20 }]
          .filter(Boolean).sort((a, b) => (a as { y: number }).y - (b as { y: number }).y)[0] as { x: number; y: number } | undefined;
        if (tgt && Math.floor(now / 350) % 4 !== 3) {
          const ty = Math.max(70, Math.min(vh - 30, sy(tgt.y))) - Math.abs(Math.sin(now / 220)) * 8;
          arrow(ctx, tgt.x, ty, sy(tgt.y) > vh - 30);
        }
      }
      // personagem, com a roupa da fase onde está
      const hero = img[`hero/${FASES[faseAt(pl.y)].hero}`];
      if (!(pl.hurt > 0 && Math.floor(pl.hurt * 12) % 2) && hero?.complete) {
        const a = ANIM[pl.anim as keyof typeof ANIM];
        let fr = a.fps ? Math.floor(pl.t * a.fps) % a.n : pl.vy < 0 ? (pl.vy < -300 ? 0 : 1) : pl.vy < 300 ? 2 : 3;
        if (pl.anim === "punch") fr = Math.min(2, Math.floor((3 / ANIM.punch.fps - pl.punch) * a.fps));
        ctx.save(); ctx.translate(Math.round(pl.x), Math.round(sy(pl.y))); ctx.scale(pl.face * SCALE, SCALE);
        ctx.drawImage(hero, fr * CELL, a.row * CELL, CELL, CELL, -CELL / 2, -BASE, CELL, CELL); ctx.restore();
      }
    };

    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000); last = t;
      if (!paused.current) step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      som.current?.stop(); som.current = null;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("pointerdown", onTouch);
      document.removeEventListener("pointerup", onTouch);
      document.removeEventListener("pointercancel", onTouch);
      keys.current = {};
    };
  }, [playing, run]);

  // Esc fecha o case (o jogo ignora teclas enquanto pausado)
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "ArrowDown") { e.preventDefault(); setOpen(null); } };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <div className="jg">
      <header className="jg-hero">
        <div className="jg-hero-txt">
        <p className="jg-kicker">Raphael Martins · Goiânia GO</p>
        <h1 className="jg-name">RAPHAEL<br />MARTINS</h1>
        <p className="jg-lead">Desenvolvedor full-stack. Construo sistemas para a construção civil e para quem mais tiver um processo travado em planilha.</p>
        <p className="jg-cta">
          <button type="button" className="jg-play" onClick={() => { setPlaying(true); setIntro(firstTime()); }}>▶ JOGAR</button>
          <a href="#fase1" className="jg-read">SÓ QUERO LER ↓</a>
        </p>
        <p className="jg-help">← → anda · espaço pula (2× no ar) · ↓ desce (atravessa o chão) · ↑ entra na porta · X soca · Esc sai</p>
        </div>
        <Player skills={ALL_SKILLS.length} />
      </header>

      <Leitura cases={CASES} onPlay={() => { setPlaying(true); setIntro(firstTime()); }} />

      {playing && (
        <div className="jg-stage">
          <canvas ref={canvas} className="jg-canvas" aria-hidden="true" />
          <div className="jg-hud" role="status">
            <span className="jg-hearts" aria-label={`${hud.hearts} vidas`}>{"♥".repeat(hud.hearts)}<i>{"♥".repeat(3 - hud.hearts)}</i></span>
            <span><b className="jg-lbl">ITENS </b>{hud.items}/{hud.total}</span>
            <span><b className="jg-lbl">SKILLS </b>{hud.skills}/{ALL_SKILLS.length}</span>
            <span className="jg-zone">{hud.zone}</span>
            <button type="button" onClick={toggleMute} aria-pressed={muted}>{muted ? "SOM: OFF" : "SOM: ON"}<span className="jg-hint"> (M)</span></button>
            <button type="button" onClick={() => setPlaying(false)}>SAIR<span className="jg-hint"> (Esc)</span></button>
          </div>
          {toast && (
            <div className="jg-toast" key={toast.k} role="status">
              <b>{toast.title}</b>
              <span>{toast.text}</span>
            </div>
          )}
          {result && (
            <div className="jg-modal" role="dialog" aria-modal="true" aria-labelledby="jg-res-title">
              <div className="jg-window jg-result">
                <p className="jg-tag">Fim da run</p>
                <div className="jg-res-top">
                  <div className="jg-grade" data-g={result.grade} aria-label={`Nota ${result.grade}`}>{result.grade}</div>
                  <div>
                    <h2 id="jg-res-title">{FRASES[result.grade][0]}</h2>
                    <p className="jg-ideia">{FRASES[result.grade][1]}</p>
                    <p className="jg-pontos">{result.nota} / 100 pontos</p>
                  </div>
                </div>
                <dl className="jg-stats">
                  <div><dt>Vidas</dt><dd className="jg-hearts">{"♥".repeat(result.vidas)}<i>{"♥".repeat(3 - result.vidas)}</i></dd></div>
                  <div><dt>Itens</dt><dd>{result.items}/{result.totalItems}</dd></div>
                  <div><dt>Skills</dt><dd>{result.skills}/{ALL_SKILLS.length}</dd></div>
                  <div><dt>Projetos</dt><dd>{result.cases}/{CASES.length}</dd></div>
                  <div><dt>Bugs</dt><dd>{result.kills}</dd></div>
                  <div><dt>Tempo</dt><dd>{Math.floor(result.tempo / 60)}:{String(Math.floor(result.tempo % 60)).padStart(2, "0")}</dd></div>
                </dl>
                <p className="jg-res-contato">Gostou? Vamos conversar:{" "}
                  {CONTATOS.map((c) => <a key={c.label} href={c.href} target="_blank" rel="noreferrer">{c.label}</a>)}
                </p>
                <p className="jg-cta">
                  <button ref={resultBtn} type="button" className="jg-back" onClick={() => { setResult(null); setRun((r) => r + 1); }}>↻ JOGAR DE NOVO</button>
                  <button type="button" className="jg-read" onClick={() => setResult(null)}>CONTINUAR EXPLORANDO</button>
                </p>
              </div>
            </div>
          )}
          {intro && (
            <div className="jg-modal" role="dialog" aria-modal="true" aria-labelledby="jg-intro-title">
              <div className="jg-window jg-intro">
                <p className="jg-tag">Tutorial</p>
                <h2 id="jg-intro-title">COMO JOGAR</h2>
                <p className="jg-ideia">Cada projeto é um lugar do mapa. Desça pelas 4 fases e entre em cada um.</p>
                <ol className="jg-steps">
                  <li><img src="/jogo/fase1/obj-conteiner.png" alt="" /><span><b>Entre pela porta.</b> Parado na porta, aperte <kbd><span className="jg-k">↑</span><span className="jg-t">▲</span></kbd> para abrir o case do projeto: a ideia, a dor que resolve e o impacto.</span></li>
                  <li><img src="/jogo/fase1/obj-planta1.png" alt="" /><span><b>Pegue os itens do caminho.</b> Cada um revela um impacto do projeto. Abrir um case desbloqueia as skills da stack.</span></li>
                  <li><i className="jg-down" aria-hidden="true">↓</i><span><b>Desça o mapa.</b> <kbd><span className="jg-k">↓</span><span className="jg-t">▼</span></kbd> atravessa o chão, e as setas laranja mostram os vãos para a fase de baixo.</span></li>
                </ol>
                <p className="jg-ctrl jg-ctrl-keys"><kbd>← →</kbd> anda · <kbd>espaço</kbd> pula (2× no ar) · <kbd>↓</kbd> desce · <kbd>↑</kbd> entra · <kbd>X</kbd> soca · <kbd>Esc</kbd> sai</p>
                <p className="jg-ctrl jg-ctrl-touch"><kbd>◀ ▶</kbd> anda · <kbd>⤒</kbd> pula · <kbd>▼</kbd> desce · <kbd>▲</kbd> entra · <kbd>X</kbd> soca</p>
                <p className="jg-cta">
                  <button ref={startBtn} type="button" className="jg-back" onClick={() => setIntro(false)}>▶ COMEÇAR</button>
                  <a href="#fase1" className="jg-read" onClick={() => { setIntro(false); setPlaying(false); }}>PREFIRO LER</a>
                </p>
              </div>
            </div>
          )}
          {open && (
            <div className="jg-modal" role="dialog" aria-modal="true" aria-labelledby="jg-case-title">
              <div className="jg-window">
                <CaseBody c={open} as="div" titleId="jg-case-title" />
                <button ref={closeBtn} type="button" className="jg-back" onClick={() => setOpen(null)}>VOLTAR AO JOGO<span className="jg-hint"> (Esc)</span></button>
              </div>
            </div>
          )}
          <div className="jg-pad" aria-hidden="true">
            <div className="jg-dpad">
              <button type="button" data-k="up" className="is-up">▲</button>
              <button type="button" data-k="left" className="is-left">◀</button>
              <button type="button" data-k="right" className="is-right">▶</button>
              <button type="button" data-k="down" className="is-down">▼</button>
            </div>
            <div className="jg-act">
              <button type="button" data-k="punch" className="is-b"><b>B</b><small>SOCO</small></button>
              <button type="button" data-k="jump" className="is-a"><b>A</b><small>PULO</small></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CaseBody({ c, as: Tag, titleId }: { c: Case; as: "article" | "div"; titleId?: string }) {
  return (
    <Tag className="jg-case">
      <p className="jg-tag">{c.kicker}{c.badge && <span className="jg-badge">{c.badge}</span>}</p>
      <h2 id={titleId}>{c.title}</h2>
      <p className="jg-ideia">{c.ideia}</p>
      <div className="jg-cols">
        <div><h3>Por que existe</h3><ul className="jg-dores">{c.dores.map((d) => <li key={d}>{d}</li>)}</ul></div>
        <div><h3>{c.badge ? "O que vai mudar" : "Impacto"}</h3><ul className="jg-wins">{c.impactos.map((d) => <li key={d}>{d}</li>)}</ul></div>
      </div>
      <Stack c={c} />
    </Tag>
  );
}

const FRASES: Record<string, [string, string]> = {
  S: ["RUN PERFEITA", "Você viu tudo: cada projeto, cada impacto, cada skill."],
  A: ["QUASE TUDO", "Faltou bem pouco. Dá para voltar e pegar o que ficou para trás."],
  B: ["BOA RUN", "Você conheceu a maior parte. Ainda tem item e porta esperando."],
  C: ["DEU PARA CONHECER", "Você passou pelo básico. Os cases têm muito mais por trás das portas."],
  D: ["SPEEDRUN, HEIN?", "Muita coisa ficou para trás. Volte e entre nas portas para ver os projetos."],
};

// tutorial só na primeira vez neste navegador; sem storage (aba privada), mostra sempre
function firstTime() {
  try {
    if (localStorage.getItem("jg-tutorial")) return false;
    localStorage.setItem("jg-tutorial", "1");
  } catch {}
  return true;
}

// texto em pixel (fonte monoespaçada pequena)
function label(c: CanvasRenderingContext2D, lines: string[], cx: number, y: number, color: string, size: number) {
  c.save(); c.font = `800 ${size}px ui-monospace, Consolas, monospace`; c.textAlign = "center"; c.textBaseline = "top"; c.fillStyle = color;
  lines.forEach((l, i) => c.fillText(l, Math.round(cx), Math.round(y + i * (size + 2))));
  c.restore();
}
function bubble(c: CanvasRenderingContext2D, x: number, y: number, text: string) {
  c.save(); c.font = "800 11px ui-monospace, Consolas, monospace";
  const w = Math.ceil(c.measureText(text).width) + 14, X = Math.round(x - w / 2), Y = Math.round(y);
  c.fillStyle = "#0b0d13"; c.fillRect(X - 2, Y - 2, w + 4, 22);
  c.fillStyle = "#f2c230"; c.fillRect(X, Y, w, 18);
  c.fillStyle = "#14110a"; c.textBaseline = "middle"; c.textAlign = "center"; c.fillText(text, X + w / 2, Y + 9);
  c.restore();
}
function arrow(c: CanvasRenderingContext2D, x: number, y: number, downEdge: boolean) {
  const X = Math.round(x), Y = Math.round(y - 18);
  c.fillStyle = "#14110a"; c.fillRect(X - 4, Y - 1, 8, 12); c.fillRect(X - 10, Y + 9, 20, 4); c.fillRect(X - 7, Y + 13, 14, 3); c.fillRect(X - 4, Y + 16, 8, 3);
  c.fillStyle = downEdge ? "#ff9d3a" : "#f2c230"; c.fillRect(X - 3, Y, 6, 11); c.fillRect(X - 9, Y + 10, 18, 2); c.fillRect(X - 6, Y + 12, 12, 3); c.fillRect(X - 3, Y + 15, 6, 3);
}

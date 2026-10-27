"use client";

// Modo leitura no mesmo mundo do jogo: cada fase é uma seção com o cenário dela ao fundo (troca suave ao rolar),
// cada case é uma janela de jogo apoiada no piso da fase, e dores, impactos e skills entram ao rolar.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Case } from "./Jogo";

const FASES_LEITURA = [
  { id: "fase1", nome: "CANTEIRO DE OBRAS", sub: "Sistemas para quem constrói: do modelo BIM ao canteiro e à entrega da obra.", hero: "obra", acc: "#f2c230",
    door: "fase1/obj-conteiner", item: "fase1/obj-planta1", bug: "fase1/obj-bug1", chao: "fase1/tile-chao-m", cases: ["audit", "edifica", "databook"] },
  { id: "fase2", nome: "ESCRITÓRIO", sub: "Sistemas para quem cuida das pessoas.", hero: "rh", acc: "#6fb2ff",
    door: "fase2/obj-porta", item: "fase2/obj-item1", bug: "fase2/obj-bug1", chao: "fase2/tile-chao-m", cases: ["tempus"] },
  { id: "fase3", nome: "SALA DE SERVIDORES", sub: "Ferramentas para o time que desenvolve.", hero: "server", acc: "#3ad1a0",
    door: "fase3/obj-rack", item: "fase3/obj-item1", bug: "fase3/obj-bug1", chao: "fase3/tile-chao-m", cases: ["hub"] },
  { id: "fase4", nome: "FLIPERAMA", sub: "Projeto pessoal, fora do expediente.", hero: "arcade", acc: "#d66bff",
    door: "fase4/obj-arcade", item: "fase4/obj-item1", bug: "fase4/obj-bug1", chao: "fase4/tile-chao-m", cases: ["partietta"] },
];
const src = (n: string) => `/jogo/${n}.png`;
export const CONTATOS = [
  { label: "E-mail", href: "mailto:raphaelmartinns54@gmail.com" },
  { label: "WhatsApp", href: "https://wa.me/5562998387048" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/raphael-martins-47604a381" },
];

// stack do projeto: destaques primeiro e um "+N" que abre o resto
export function Stack({ c, reveal }: { c: Case; reveal?: boolean }) {
  const [aberta, setAberta] = useState(false);
  const rv = reveal ? "jg-rv" : "";
  return (
    <ul className="jg-skills" aria-label="Stack">
      {c.stack.map((s, j) => (
        <li key={s} className={rv} style={{ "--i": j + 2 } as CSSProperties}><i aria-hidden="true">+</i>{s}</li>
      ))}
      {aberta && c.stackMais.map((s, j) => (
        <li key={s} className="is-mais" style={{ "--i": j } as CSSProperties}>{s}</li>
      ))}
      {c.stackMais.length > 0 && (
        <li className={rv} style={{ "--i": c.stack.length + 2 } as CSSProperties}>
          <button type="button" className="jg-mais" aria-expanded={aberta} onClick={() => setAberta(!aberta)}>
            {aberta ? "− menos" : `+${c.stackMais.length}`}
          </button>
        </li>
      )}
    </ul>
  );
}

export default function Leitura({ cases, onPlay }: { cases: Case[]; onPlay: () => void }) {
  const root = useRef<HTMLElement>(null);
  const [ativa, setAtiva] = useState(0);

  // a barra de rolagem da página acompanha a cor da fase
  useEffect(() => {
    const h = document.documentElement;
    h.style.setProperty("--jg-acc", FASES_LEITURA[ativa].acc); // Firefox
    h.dataset.jgF = String(ativa); // Chrome
    // shortcut: força o Chrome a redesenhar a barra (ele não repinta só com a troca de estilo)
    if (h.style.overflow === "") { h.style.overflow = "hidden"; void h.offsetHeight; h.style.overflow = ""; }
  }, [ativa]);
  useEffect(() => () => { document.documentElement.style.removeProperty("--jg-acc"); delete document.documentElement.dataset.jgF; }, []);

  useEffect(() => {
    const el = root.current!;
    // revela itens ao entrar na tela (uma vez)
    const rv = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); rv.unobserve(e.target); }
    }), { rootMargin: "0px 0px -4% 0px" });
    el.querySelectorAll(".jg-rv").forEach((n) => rv.observe(n));
    // fase ativa = seção que cruza o meio da tela; troca o cenário de fundo
    const fs = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) setAtiva(Number((e.target as HTMLElement).dataset.f));
    }), { rootMargin: "-50% 0px -50% 0px" });
    el.querySelectorAll(".jg-fase").forEach((n) => fs.observe(n));
    return () => { rv.disconnect(); fs.disconnect(); };
  }, []);

  return (
    <section id="fase1" ref={root} className="jg-read-mode" style={{ "--acc": FASES_LEITURA[ativa].acc } as CSSProperties}>
      <div className="jg-bd" aria-hidden="true">
        {FASES_LEITURA.map((f, i) => (
          <div key={f.id} className={`jg-bd-layer${i === ativa ? " is-on" : ""}`} style={{ backgroundImage: `url(/jogo/${f.id}/fundo.webp)` }}>
            <span className="jg-bd-side" style={{ backgroundImage: `url(${src(`${f.id}/predio`)})` }} />
            <span className="jg-bd-side is-r" style={{ backgroundImage: `url(${src(`${f.id}/predio`)})` }} />
          </div>
        ))}
      </div>

      {FASES_LEITURA.map((f, i) => (
        <div key={f.id} className="jg-fase" data-f={i} style={{ "--acc": f.acc } as CSSProperties}>
          <header className="jg-fase-head jg-rv">
            <span className="jg-spr" style={{ backgroundImage: `url(/jogo/${f.hero}.png)` }} aria-hidden="true" />
            <div>
              <p className="jg-tagline">FASE {i + 1}</p>
              <h2 className="jg-fase-nome">{f.nome}</h2>
              <p className="jg-fase-sub">{f.sub}</p>
            </div>
          </header>
          {f.cases.map((k) => {
            const c = cases.find((c) => c.key === k)!;
            return (
              <div key={k} className="jg-stage-case">
                <article className="jg-card jg-rv">
                  <div className="jg-card-top">
                    <img className="jg-door" src={src(f.door)} alt="" />
                    <div>
                      <p className="jg-tag">{c.kicker}{c.badge && <span className="jg-badge">{c.badge}</span>}</p>
                      <h3 className="jg-card-title">{c.title}</h3>
                      <p className="jg-ideia">{c.ideia}</p>
                    </div>
                  </div>
                  <div className="jg-cols">
                    <div>
                      <h4>Por que existe</h4>
                      <ul className="jg-list">
                        {c.dores.map((d, j) => (
                          <li key={d} className="jg-rv" style={{ "--i": j } as CSSProperties}><img src={src(f.bug)} alt="" />{d}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>{c.badge ? "O que vai mudar" : "Impacto"}</h4>
                      <ul className="jg-list is-win">
                        {c.impactos.map((d, j) => (
                          <li key={d} className="jg-rv" style={{ "--i": j + 1 } as CSSProperties}><img src={src(f.item)} alt="" />{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Stack c={c} reveal />
                </article>
                <div className="jg-floor" style={{ backgroundImage: `url(${src(f.chao)})` }} aria-hidden="true" />
              </div>
            );
          })}
        </div>
      ))}

      {/* fim: continua no cenário da última fase */}
      <div className="jg-fase jg-fim" data-f={FASES_LEITURA.length - 1}>
        <div className="jg-fim-box jg-rv">
          <span className="jg-spr is-win" style={{ backgroundImage: "url(/jogo/base.png)" }} aria-hidden="true" />
          <p className="jg-tagline">FIM DA LEITURA</p>
          <h2 className="jg-fase-nome">OBRIGADO POR LER</h2>
          <p className="jg-fase-sub">Se você tem um processo travado em planilha, vamos conversar.</p>
          <p className="jg-cta">
            {CONTATOS.map((c, i) => (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className={i === 0 ? "jg-play" : "jg-read"}>{c.label.toUpperCase()}</a>
            ))}
          </p>
          <button type="button" className="jg-again" onClick={onPlay}>▶ OU JOGUE A VERSÃO JOGO</button>
        </div>
        <div className="jg-floor" style={{ backgroundImage: `url(${src("fase4/tile-chao-m")})` }} aria-hidden="true" />
        <p className="jg-credit">Raphael Martins · Goiânia GO · 2026</p>
      </div>
    </section>
  );
}

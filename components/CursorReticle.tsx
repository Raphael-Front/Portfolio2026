"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Cursor "retículo de CAD" — combina com a estética de prancha técnica.
 * - Anel + ponto central seguem o mouse com lag diferente (parallax) via gsap.quickTo.
 * - Leitura de coordenadas x/y em monospace ao lado do retículo.
 * - Sobre elementos interativos, o anel vira um quadro de seleção com cantoneiras.
 * - Só ativa em ponteiro fino (mouse) e com prefers-reduced-motion desligado;
 *   em toque/reduzido mantém o cursor nativo e não renderiza nada.
 */
export default function CursorReticle() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const coord = coordRef.current;
    if (!ring || !dot || !coord) return;

    document.body.classList.add("cursor-active");

    // centraliza os elementos no ponteiro; posição é controlada só por x/y
    gsap.set([ring, dot], { xPercent: -50, yPercent: -50 });

    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

    const pad = (n: number) => String(Math.round(n)).padStart(4, "0");

    let lastX = 0;
    let lastY = 0;
    let shown = false;

    // coordenadas de página (incluem o scroll), atualizadas no mover E no rolar
    const writeCoord = () => {
      coord.textContent = `x${pad(lastX + window.scrollX)} y${pad(lastY + window.scrollY)}`;
    };

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!shown) {
        // aparece só depois do primeiro movimento (evita "flash" no canto)
        shown = true;
        gsap.set([ring, dot], { x: lastX, y: lastY });
        gsap.to([ring, dot], { opacity: 1, duration: 0.25 });
      }
      ringX(lastX);
      ringY(lastY);
      dotX(lastX);
      dotY(lastY);
      writeCoord();
    };

    const onScroll = () => {
      if (shown) writeCoord();
    };

    // seletor dos alvos "mira"
    const interactive = "a, button, .case2, .stat, .diff, .col, [data-cursor]";
    const onOver = (e: PointerEvent) => {
      if ((e.target as Element)?.closest?.(interactive)) {
        ring.classList.add("is-hover");
      }
    };
    const onOut = (e: PointerEvent) => {
      const to = e.relatedTarget as Element | null;
      if (!to?.closest?.(interactive)) ring.classList.remove("is-hover");
    };

    const onDown = () => gsap.to([ring, dot], { scale: 0.75, duration: 0.18, ease: "power2" });
    const onUp = () => gsap.to([ring, dot], { scale: 1, duration: 0.25, ease: "power2" });

    const onLeave = () => gsap.to([ring, dot], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to([ring, dot], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.body.classList.remove("cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="reticle-dot" aria-hidden="true" />
      <div ref={ringRef} className="reticle-ring" aria-hidden="true">
        <span className="rt-tick t" />
        <span className="rt-tick r" />
        <span className="rt-tick b" />
        <span className="rt-tick l" />
        <span className="rt-corner tl" />
        <span className="rt-corner tr" />
        <span className="rt-corner bl" />
        <span className="rt-corner br" />
        <span ref={coordRef} className="rt-coord" />
      </div>
    </>
  );
}

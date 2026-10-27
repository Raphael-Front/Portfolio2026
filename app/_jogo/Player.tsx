"use client";

// Card de "seleção de personagem" do hero: a foto entra pixelizada e vai ganhando resolução,
// e o personagem padrão fica no canto da foto, olhando para o mesmo lado. Passar o mouse volta a foto para pixel art.
import { useEffect, useRef } from "react";

const W = 440, H = 540;
const STEPS = [44, 30, 20, 14, 10, 7, 5, 3, 2, 1]; // tamanho do pixel em cada quadro da entrada

export default function Player() {
  const cv = useRef<HTMLCanvasElement>(null);
  const draw = useRef<(px: number) => void>(() => {});

  useEffect(() => {
    const c = cv.current!, ctx = c.getContext("2d")!;
    const small = document.createElement("canvas"), sctx = small.getContext("2d")!;
    const img = new Image();
    let timer = 0;
    draw.current = (px) => {
      if (!img.complete || !img.naturalWidth) return;
      // desenha pequeno e amplia sem suavizar: cada bloco vira um "pixel" de px por px
      small.width = Math.ceil(W / px); small.height = Math.ceil(H / px);
      sctx.drawImage(img, 0, 0, small.width, small.height);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, small.width * px, small.height * px);
    };
    img.onload = () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return draw.current(1);
      let i = 0;
      const tick = () => { draw.current(STEPS[i]); if (++i < STEPS.length) timer = window.setTimeout(tick, i < 3 ? 260 : 110); };
      tick();
    };
    img.src = "/jogo/perfil.webp";
    return () => clearTimeout(timer);
  }, []);

  return (
    <figure className="jg-player" onMouseEnter={() => draw.current(9)} onMouseLeave={() => draw.current(1)}>
      <p className="jg-player-tag"><span>PLAYER 1</span><i>PRONTO</i></p>
      <div className="jg-player-photo">
        <canvas ref={cv} width={W} height={H} role="img" aria-label="Foto de Raphael Martins" />
        <span className="jg-spr jg-player-spr" style={{ backgroundImage: "url(/jogo/base.png)" }} aria-hidden="true" />
      </div>
      <dl className="jg-player-stats">
        <div><dt>Classe</dt><dd>Dev full-stack</dd></div>
        <div><dt>Base</dt><dd>Goiânia GO</dd></div>
        <div><dt>Foco</dt><dd>Construção civil</dd></div>
        <div><dt>Skills</dt><dd>17</dd></div>
      </dl>
    </figure>
  );
}

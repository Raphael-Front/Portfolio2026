// PROTÓTIPO DESCARTÁVEL: portfólio como jogo de plataforma (hero + fase 1 no canteiro).
// Pergunta que ele responde: "como é jogar descendo a página?". Não vai para a main.
import type { Metadata } from "next";
import Jogo from "./Jogo";
import "./jogo.css";

export const metadata: Metadata = {
  title: "Protótipo · Jogo",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Jogo />;
}

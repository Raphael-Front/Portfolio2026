import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://raphaelmdev.vercel.app"),
  title: "Raphael Martins · Desenvolvedor Full-stack",
  description:
    "Portfólio jogável de Raphael Martins, desenvolvedor full-stack: sistemas para a construção civil (Audit BIM, Edifica, Databook), RH (Tempus), DevOps (HUB) e games (Partietta).",
  openGraph: {
    title: "Raphael Martins · Desenvolvedor Full-stack",
    description:
      "Transformo planilhas e processos manuais da construção civil em sistemas em produção.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" style={{ colorScheme: "light" }}>
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body>{children}</body>
    </html>
  );
}

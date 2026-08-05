import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio2026.vercel.app"),
  title: "Raphael Martins · Desenvolvedor Full-stack",
  description:
    "Desenvolvedor full-stack focado em aplicações web para a construção civil. Criador dos sistemas Audit BIM, Edifica e Databook.",
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
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}

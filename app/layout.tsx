import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IL Business Network | Instituto da Liderança",
  description: "Rede B2B curada para organizações acessarem soluções confiáveis, talentos e conhecimento.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..800;1,9..40,300..800&family=Cormorant+Garamond:wght@400;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

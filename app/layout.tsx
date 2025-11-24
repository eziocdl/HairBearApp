import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HairBearApp | Simulador de Cortes & Barba com IA",
  description: "Visualize seu novo corte ANTES de ir ao barbeiro. 100% privado e gratuito.",
  keywords: ["corte de cabelo", "barba", "simulador", "IA", "barbeiro"],
  openGraph: {
    title: "HairBearApp - Seu Novo Visual em Segundos",
    description: "Experimente diferentes cortes e estilos de barba com IA",
    type: "website",
  },
};

import ReactQueryProvider from '@/lib/react-query-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}

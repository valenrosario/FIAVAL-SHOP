import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "fiaval shop · Papelería e impresiones", template: "%s · fiaval shop" },
  description: "Cuadernos, agendas, útiles, stickers e impresiones. Hacé tu pedido online y coordinamos por WhatsApp.",
};

export const viewport: Viewport = { themeColor: "#141414", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}

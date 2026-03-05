// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Senior Chat App | Architecture Demo",
  description: "DDD + Hexagonal Architecture + WebSockets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-zinc-50 dark:bg-black text-black dark:text-zinc-50`}>
        {/* Aquí podrías poner un Navbar global si el dominio lo requiere */}
        {children}
      </body>
    </html>
  );
}
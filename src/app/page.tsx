// frontend/src/app/page.tsx
import Image from "next/image";
import { ChatRoom } from "@/app/modules/chat/components/ChatRoom";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <main className="flex w-full max-w-4xl flex-col gap-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        
        {/* Header con Branding */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
          <div className="flex items-center gap-4">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
            <span className="text-zinc-400 text-sm font-mono">v1.0.0</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Real-Time System <span className="text-blue-500">.</span>
          </h1>
        </header>

        {/* Sección de Dominio (Chat) */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-white">
              Communication Gateway
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Conectado mediante WebSockets al core de Express con Arquitectura Hexagonal.
            </p>
          </div>
          
          {/* Inyección del Componente de Dominio */}
          <div className="mt-2">
            <ChatRoom />
          </div>
        </section>

        {/* Footer Técnico */}
        <footer className="flex flex-col gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800 sm:flex-row text-xs text-zinc-500">
          <a
            className="hover:text-black dark:hover:text-white transition-colors"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Architecture Documentation →
          </a>
          <span className="hidden sm:inline">•</span>
          <p>Patrones: Hexagonal, DDD, Screaming Architecture</p>
        </footer>
      </main>
    </div>
  );
}
import Link from 'next/link';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';

/** Minimal chrome for interior pages (services, projects). */
export default function SubPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-space-950">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-space-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-bold">
            Mark<span className="text-gradient">Labs</span>
          </Link>
          <Link
            href="/#contact"
            className="rounded-full border border-electric/40 bg-electric/10 px-5 py-2 text-sm text-white transition-colors hover:bg-electric/20"
          >
            Обговорити проєкт
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-32">{children}</main>

      <footer className="border-t border-white/5 py-10 text-center text-sm text-muted">
        <p>
          © 2026 {site.name} · {site.city}
        </p>
        <Link href="/" className="mt-2 inline-block text-electric hover:underline">
          ← На головну
        </Link>
      </footer>
    </div>
  );
}

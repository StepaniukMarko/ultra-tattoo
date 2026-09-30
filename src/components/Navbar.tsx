'use client';

import { useEffect, useState } from 'react';
import { nav } from '@/lib/site';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] transition-all duration-300 ${
        scrolled ? 'border-b border-white/5 bg-space-950/80 backdrop-blur-xl' : ''
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Головна навігація">
        <a href="#top" className="font-display text-lg font-bold tracking-wide" data-cursor="">
          Mark<span className="text-gradient">Labs</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="text-sm text-muted transition-colors hover:text-white">
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-full border border-electric/40 bg-electric/10 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-electric/20 md:inline-flex"
          data-cursor="→"
        >
          Обговорити проєкт
        </a>

        <button
          className="relative z-[71] flex h-10 w-10 items-center justify-center md:hidden"
          aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full bg-white transition-transform duration-300 ${
                open ? 'translate-y-[6px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-full bg-white transition-transform duration-300 ${
                open ? '-translate-y-[6px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-space-950/95 backdrop-blur-xl transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {nav.map((n) => (
          <a
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className="font-display text-2xl text-white/90"
          >
            {n.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="mt-4 rounded-full bg-electric px-6 py-3 font-medium text-white"
        >
          Обговорити проєкт →
        </a>
      </div>
    </header>
  );
}

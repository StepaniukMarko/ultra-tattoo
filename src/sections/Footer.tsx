'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { site, nav } from '@/lib/site';

export default function Footer() {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const letters = el.querySelectorAll<HTMLElement>('[data-fl]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        letters,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power4.out',
          stagger: 0.04,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const word = 'MarkLabs';

  return (
    <footer className="relative overflow-hidden border-t border-white/5 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 pb-14 md:grid-cols-3">
          <div>
            <p className="max-w-xs text-sm text-muted">{site.tagline}</p>
            <p className="mt-3 text-sm text-muted">📍 {site.city}, Україна</p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Розділи</h4>
            <ul className="space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-sm text-muted transition-colors hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Контакти</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`mailto:${site.contacts.email}`} className="text-muted hover:text-white">
                  {site.contacts.email}
                </a>
              </li>
              <li>
                <a href={site.contacts.telegram} target="_blank" rel="noopener" className="text-muted hover:text-white">
                  Telegram
                </a>
              </li>
              <li>
                <a href={site.contacts.instagram} target="_blank" rel="noopener" className="text-muted hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href={`tel:${site.contacts.phone}`} className="text-muted hover:text-white">
                  {site.contacts.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant assembling logo */}
        <div
          ref={logoRef}
          className="flex justify-center overflow-hidden pt-4"
          aria-hidden="true"
        >
          <span className="font-display text-[18vw] font-bold leading-none tracking-tight">
            {Array.from(word).map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span data-fl className={`inline-block ${i >= 4 ? 'text-gradient' : 'text-white'}`}>
                  {ch}
                </span>
              </span>
            ))}
          </span>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 py-6 text-sm text-muted sm:flex-row">
          <span>© 2026 {site.name}</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Політика конфіденційності
            </Link>
            <Link href="/terms" className="hover:text-white">
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

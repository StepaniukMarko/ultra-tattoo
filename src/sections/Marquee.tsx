'use client';

import { useEffect, useRef } from 'react';

const items = [
  'Створення сайтів',
  'Інтернет-магазини',
  'UX/UI дизайн',
  'Telegram боти',
  'AI автоматизація',
  'CRM-інтеграції',
  'Лендинги',
  'Підтримка проєктів',
];

/**
 * Infinite marquee whose speed reacts to scroll velocity.
 * Pure transform loop (no layout thrash). Static-ish on reduced-motion.
 */
export default function Marquee() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let offset = 0;
    let base = 0.6; // px per frame baseline
    let velocity = 0;
    let lastScroll = window.scrollY;
    let raf = 0;
    const half = () => el.scrollWidth / 2;

    const onScroll = () => {
      const dy = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      velocity = Math.min(Math.abs(dy) * 0.35, 14);
    };

    const loop = () => {
      velocity *= 0.92; // decay
      offset -= base + velocity;
      const h = half();
      if (h > 0 && -offset >= h) offset += h;
      el.style.transform = `translate3d(${offset}px,0,0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-6">
          <span className="font-display text-2xl font-medium text-white/80 sm:text-3xl">{t}</span>
          <span className="text-electric">✦</span>
        </span>
      ))}
    </>
  );

  return (
    <section
      aria-hidden="true"
      className="relative overflow-hidden border-y border-white/5 bg-space-900/40 py-6"
    >
      <div ref={track} className="flex w-max gap-6 whitespace-nowrap will-change-transform">
        <div className="flex gap-6">{row}</div>
        <div className="flex gap-6">{row}</div>
      </div>
    </section>
  );
}

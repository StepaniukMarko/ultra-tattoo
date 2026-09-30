'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';

type Props = {
  children: ReactNode; // plain text expected
  className?: string;
  delay?: number;
};

/**
 * Word + letter split reveal. Splits text manually (no paid plugin) into
 * per-letter spans and staggers them in. Falls back to plain rendered text
 * for reduced-motion (and remains fully readable / selectable-ish).
 */
export default function SplitReveal({ children, className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const text = typeof children === 'string' ? children : String(children);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const letters = el.querySelectorAll<HTMLElement>('[data-l]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        letters,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power4.out',
          stagger: 0.03,
          delay,
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, text]);

  // Split into words (keep spaces) then letters, so words don't break mid-air.
  const words = text.split(' ');

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {Array.from(word).map((ch, ci) => (
            <span key={ci} className="inline-block overflow-hidden align-bottom">
              <span data-l className="inline-block will-change-transform">
                {ch}
              </span>
            </span>
          ))}
          {wi < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  );
}

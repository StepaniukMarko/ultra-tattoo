'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  value: string; // e.g. "2–4", "100%", "2 год"
  className?: string;
};

/**
 * Counts up numeric portions of a label when scrolled into view.
 * Preserves non-numeric characters (–, %, spaces, words).
 * Static final value if reduced-motion.
 */
export default function CountUp({ value, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    // Extract the FIRST number in the string to animate; keep template.
    const match = value.match(/\d+(?:[.,]\d+)?/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const target = parseFloat(match[0].replace(',', '.'));
    const prefix = value.slice(0, match.index ?? 0);
    const suffix = value.slice((match.index ?? 0) + match[0].length);
    const decimals = match[0].includes('.') || match[0].includes(',') ? 1 : 0;

    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const dur = 1200;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const n = (target * eased).toFixed(decimals);
        setDisplay(`${prefix}${n}${suffix}`);
        if (p < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Cinematic preloader: counts 0 → 100, then curtain-reveals the site.
 * Respects reduced-motion (instant dismiss).
 */
export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setCount(100);
      setDone(true);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const dur = 1400;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden={done}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-space-950 transition-[clip-path,opacity] duration-700 ease-expo ${
        done ? 'pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <span className="font-display text-2xl tracking-[0.3em] text-white/80">
          MARK<span className="text-gradient">LABS</span>
        </span>
        <div className="relative h-px w-56 overflow-hidden bg-white/10">
          <span
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-electric to-cyan"
            style={{ width: `${count}%` }}
          />
        </div>
        <span className="font-display text-6xl tabular-nums text-white/90">{count}</span>
      </div>
    </div>
  );
}

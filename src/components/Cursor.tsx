'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Blob cursor that morphs on hover over interactive elements.
 * Only mounts on fine-pointer, no-reduced-motion devices.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add('cursor-none');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
      const el = (e.target as HTMLElement)?.closest('[data-cursor]') as HTMLElement | null;
      setLabel(el?.dataset.cursor ?? '');
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('cursor-none');
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[90] -ml-1 -mt-1 h-2 w-2 rounded-full bg-cyan mix-blend-difference"
      />
      <div
        ref={ring}
        className={`pointer-events-none fixed left-0 top-0 z-[89] flex items-center justify-center rounded-full border border-white/40 text-[10px] font-medium uppercase tracking-widest text-white transition-[width,height] duration-300 ease-expo ${
          label ? 'h-16 w-16 bg-white/10 backdrop-blur' : 'h-8 w-8'
        }`}
        style={{ marginLeft: label ? '-2rem' : '-1rem', marginTop: label ? '-2rem' : '-1rem' }}
      >
        {label}
      </div>
    </>
  );
}

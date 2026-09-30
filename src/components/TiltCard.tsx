'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  cursorLabel?: string;
};

/**
 * 3D-tilt card with a cursor-following spotlight (CSS radial gradient driven
 * by CSS variables). Disabled on touch / reduced-motion (renders flat).
 */
export default function TiltCard({ children, className = '', href, cursorLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    const rx = (0.5 - py) * 8;
    const ry = (px - 0.5) * 10;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
  };

  const inner = (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor={cursorLabel}
      className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-md transition-transform duration-200 ease-expo will-change-transform ${className}`}
      style={{ ['--mx' as string]: '50%', ['--my' as string]: '50%' }}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(320px circle at var(--mx) var(--my), rgba(59,130,246,0.18), transparent 60%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}

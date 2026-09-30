'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  cursorLabel?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
};

/**
 * Magnetic hover: element eases toward the pointer, snaps back on leave.
 * Falls back to a static element with no JS motion for touch/reduced-motion.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  cursorLabel,
  type = 'button',
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  };

  const common = {
    ref: ref as never,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    'data-cursor': cursorLabel,
    className: `inline-flex items-center justify-center transition-transform duration-300 ease-expo will-change-transform ${className}`,
  };

  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} {...common}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} {...common}>
      {children}
    </button>
  );
}

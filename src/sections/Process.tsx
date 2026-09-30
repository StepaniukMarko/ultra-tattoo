'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { processSteps } from '@/lib/site';
import Reveal from '@/components/Reveal';

export default function Process() {
  const wrap = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(processSteps.length - 1);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const p = path.current;
      if (p) {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 1,
          },
        });
      }
      // Highlight steps sequentially.
      processSteps.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: `#proc-step-${i}`,
          start: 'top 70%',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mb-16 max-w-2xl">
          <h2 className="font-display text-display font-bold leading-tight">
            Як ми <span className="text-gradient">працюємо</span>
          </h2>
          <p className="mt-4 text-muted">Чотири прозорі кроки від ідеї до запуску</p>
        </Reveal>

        <div ref={wrap} className="relative grid gap-10 md:grid-cols-[80px_1fr]">
          {/* Scroll-drawn connector (desktop) */}
          <svg
            className="pointer-events-none absolute left-[39px] top-0 hidden h-full w-2 md:block"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M1 0 L1 100" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            <path
              ref={path}
              d="M1 0 L1 100"
              stroke="url(#procGrad)"
              strokeWidth="2"
              fill="none"
            />
            <defs>
              <linearGradient id="procGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>

          <div className="col-span-full grid gap-8 md:grid-cols-[80px_1fr]">
            {processSteps.map((s, i) => (
              <div
                key={s.n}
                id={`proc-step-${i}`}
                className="contents"
              >
                {/* Node */}
                <div className="relative md:col-start-1">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl border font-display text-xl font-bold transition-all duration-500 ${
                      active >= i
                        ? 'border-electric/50 bg-electric/15 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)]'
                        : 'border-white/10 bg-white/[0.03] text-muted'
                    }`}
                  >
                    {s.n}
                  </div>
                </div>
                {/* Content */}
                <div
                  className={`pb-2 transition-opacity duration-500 md:col-start-2 ${
                    active >= i ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                  <p className="mt-2 max-w-xl text-muted">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/lib/site';
import Reveal from '@/components/Reveal';

function ConceptBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/70 backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
      Концепт
    </span>
  );
}

/** Video slot with graceful placeholder (no real asset yet). */
function ProjectVisual({ accent, name }: { accent: string; name: string }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl"
      style={{
        background: `radial-gradient(120% 120% at 20% 0%, ${accent}22, transparent 55%), linear-gradient(160deg, #0b0e18, #05060a)`,
      }}
    >
      {/*
        Lazy <video> slot — drop a WebM/MP4 preview at /public/projects/<slug>.webm
        and swap this block. Placeholder keeps layout stable (no CLS).
      */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display text-5xl font-bold tracking-tight sm:text-7xl"
          style={{ color: accent, opacity: 0.28 }}
        >
          {name}
        </span>
      </div>
      <div className="absolute left-5 top-5">
        <ConceptBadge />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-space-950/70 to-transparent" />
    </div>
  );
}

export default function Projects() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [horizontal, setHorizontal] = useState(false);

  // Step 1: decide layout mode on mount (desktop + motion-friendly → horizontal).
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    if (!reduced && wide) setHorizontal(true);
  }, []);

  // Step 2: wire GSAP only AFTER the horizontal track is actually in the DOM.
  useEffect(() => {
    if (!horizontal) return;
    const t = track.current;
    const w = wrap.current;
    if (!t || !w) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const distance = t.scrollWidth - window.innerWidth;
      if (distance <= 0) return;
      gsap.to(t, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: w,
          start: 'top top',
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => setProgress(self.progress),
          invalidateOnRefresh: true,
        },
      });
    }, w);
    return () => ctx.revert();
  }, [horizontal]);

  return (
    <section id="projects" className="relative">
      {/* Heading */}
      <div className="mx-auto max-w-7xl px-6 pt-24 sm:pt-32">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-display font-bold leading-tight">
            Демонстраційні <span className="text-gradient">проєкти</span>
          </h2>
          <p className="mt-4 text-muted">
            Концепти, створені для демонстрації нашого підходу до дизайну, UX та сучасної
            веб-розробки. Це не кейси реальних клієнтів.
          </p>
        </Reveal>
      </div>

      {horizontal ? (
        // Desktop: pinned horizontal scroll
        <div ref={wrap} className="relative mt-14 h-screen overflow-hidden">
          <div
            ref={track}
            className="flex h-full items-center gap-8 px-[6vw] will-change-transform"
            style={{ width: 'max-content' }}
          >
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                data-cursor="view"
                className="group relative block h-[62vh] w-[78vw] shrink-0 md:w-[62vw] lg:w-[46vw]"
              >
                <ProjectVisual accent={p.accent} name={p.name} />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-white">{p.name}</h3>
                    <p className="text-sm text-muted">{p.niche}</p>
                  </div>
                  <span className="rounded-full border border-white/15 px-4 py-2 text-xs text-white transition-colors group-hover:bg-white/10">
                    Відкрити →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-8 left-1/2 h-0.5 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full origin-left bg-gradient-to-r from-electric to-cyan"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </div>
      ) : (
        // Mobile / reduced-motion: vertical cards
        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-5 px-6 pb-4 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <Link
                href={`/projects/${p.slug}`}
                className="group relative block h-64 overflow-hidden rounded-2xl"
              >
                <ProjectVisual accent={p.accent} name={p.name} />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">{p.name}</h3>
                    <p className="text-sm text-muted">{p.niche}</p>
                  </div>
                  <span className="text-xs text-white">→</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}

      <p className="mx-auto mt-6 max-w-7xl px-6 text-sm text-muted">
        Демо кожного проєкту:{' '}
        <span className="text-white/70">«Концепт — демо скоро»</span> (будуть доступні через піддомени).
      </p>
    </section>
  );
}

'use client';

import dynamic from 'next/dynamic';
import { useDeviceCapabilities } from '@/lib/useDeviceCapabilities';
import { heroMetrics } from '@/lib/site';
import SplitReveal from '@/components/SplitReveal';
import CountUp from '@/components/CountUp';
import MagneticButton from '@/components/MagneticButton';
import Reveal from '@/components/Reveal';

// Lazy, client-only WebGL — never in the initial bundle.
const ParticleField = dynamic(() => import('@/components/hero/ParticleField'), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const caps = useDeviceCapabilities();
  // Use WebGL only on capable, motion-friendly devices.
  const useWebGL = caps.ready && !caps.lowPower && !caps.reducedMotion;

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Background: WebGL for capable devices, CSS aurora otherwise */}
      <div className="absolute inset-0 -z-10 bg-space-950">
        <div className="absolute inset-0 bg-aurora" />
        {useWebGL && <ParticleField />}
        {/* Vignette for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-space-950/60" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <p className="mb-6 flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-muted">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
            Digital Agency · Вінниця
          </p>
        </Reveal>

        <h1 className="font-display font-bold leading-[0.95] text-mega">
          <span className="block">
            <SplitReveal delay={0.1}>Ми будуємо</SplitReveal>
          </span>
          <span className="block text-gradient">
            <SplitReveal delay={0.35}>цифрові продукти</SplitReveal>
          </span>
          <span className="block">
            <SplitReveal delay={0.6}>що працюють</SplitReveal>
          </span>
        </h1>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-lg text-muted">
            Преміальний дизайн. Запуск за 2–4 тижні. Прозорі умови та передбачуваний
            результат — без прихованих сюрпризів.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-4">
          <MagneticButton
            href="#projects"
            cursorLabel="view"
            className="rounded-full bg-electric px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(59,130,246,0.4)]"
          >
            Дивитися роботи
          </MagneticButton>
          <MagneticButton
            href="#contact"
            cursorLabel="→"
            className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-white backdrop-blur"
          >
            Обговорити проєкт
          </MagneticButton>
        </Reveal>

        {/* Metrics with count-up */}
        <Reveal delay={0.4} className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-6">
          {heroMetrics.map((m, i) => (
            <div key={i} className="flex items-baseline gap-3">
              <CountUp
                value={m.value}
                className="font-display text-3xl font-bold text-gradient sm:text-4xl"
              />
              <span className="max-w-[9rem] text-xs uppercase tracking-wider text-muted">
                {m.label}
              </span>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
        <div className="h-10 w-px animate-pulse bg-gradient-to-b from-transparent via-electric to-transparent" />
      </div>
    </section>
  );
}

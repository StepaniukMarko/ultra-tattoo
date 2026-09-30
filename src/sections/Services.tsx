import { services } from '@/lib/site';
import TiltCard from '@/components/TiltCard';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-14 max-w-2xl">
          <h2 className="font-display text-display font-bold leading-tight">
            Наші <span className="text-gradient">послуги</span>
          </h2>
          <p className="mt-4 text-muted">Що ми вміємо та пропонуємо бізнесу</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05}>
              <TiltCard href={`/services/${s.slug}`} cursorLabel="view" className="h-full">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-electric/25 bg-electric/10 text-electric">
                  <Icon name={s.icon} className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.short}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-electric">
                  Детальніше
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

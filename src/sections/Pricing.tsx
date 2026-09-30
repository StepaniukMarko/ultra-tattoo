import { pricing } from '@/lib/site';
import Reveal from '@/components/Reveal';

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-14 max-w-2xl">
          <h2 className="font-display text-display font-bold leading-tight">
            Вартість <span className="text-gradient">проєктів</span>
          </h2>
          <p className="mt-4 text-muted">
            Орієнтовні ціни. Точна вартість — після безкоштовного брифу та затвердження ТЗ.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pricing.map((p, i) => (
            <Reveal key={p.tier} delay={i * 0.05}>
              <div
                className={`relative flex h-full flex-col rounded-2xl p-6 ${
                  p.featured
                    ? 'rotating-border bg-electric/[0.06]'
                    : 'border border-white/8 bg-white/[0.03]'
                } backdrop-blur-md`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-electric to-cyan px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    Популярне
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold">{p.tier}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>

                <div className="mt-5">
                  <span className="text-xs uppercase tracking-wider text-muted">від</span>{' '}
                  <span className="font-display text-3xl font-bold text-gradient">
                    {p.price.toLocaleString('uk-UA')}
                  </span>{' '}
                  <span className="text-sm text-muted">грн</span>
                </div>
                <p className="mt-1 text-xs text-muted">Точна вартість після безкоштовного брифу</p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/85">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="mt-0.5 shrink-0 text-electric"
                        aria-hidden="true"
                      >
                        <path
                          d="M20 6 9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  data-cursor="→"
                  className={`mt-7 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                    p.featured
                      ? 'bg-electric text-white hover:bg-electric/90'
                      : 'border border-white/15 text-white hover:bg-white/10'
                  }`}
                >
                  Обговорити
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Special offer */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 flex max-w-3xl items-center gap-4 rounded-2xl border border-electric/20 bg-electric/[0.06] p-6 backdrop-blur-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-electric/25 bg-electric/10 text-electric">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            </div>
            <p className="text-sm leading-relaxed text-white/85">
              Для перших клієнтів MarkLabs доступні спеціальні умови та індивідуальні знижки на
              запуск проєкту.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

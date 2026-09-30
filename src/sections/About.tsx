import { site } from '@/lib/site';
import Reveal from '@/components/Reveal';

const principles = [
  'Прозорість на кожному етапі',
  'Фіксована ціна після ТЗ',
  'Дизайн узгоджуємо до розробки',
  'Підтримка після запуску',
];

const stack = ['Next.js', 'React', 'TypeScript', 'Python', 'Flask', 'Telegram API', 'AI / LLM'];

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-14 max-w-2xl">
          <h2 className="font-display text-display font-bold leading-tight">
            Хто стоїть за <span className="text-gradient">MarkLabs</span>
          </h2>
          <p className="mt-4 text-muted">Персональний підхід замість безликої агенції</p>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-[280px_1fr] md:items-start">
          {/* Photo slot */}
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] shadow-[0_0_40px_rgba(59,130,246,0.12)]">
              {/*
                Founder photo slot — drop /public/founder.jpg and replace this
                block with next/image. Placeholder avoids CLS.
              */}
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-16 w-16 opacity-50" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
                <span className="text-xs tracking-wider">Фото засновника</span>
              </div>
            </div>
          </Reveal>

          {/* Text */}
          <div>
            <Reveal>
              <p className="text-xl font-semibold text-white">Привіт. Мене звати Марко.</p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-4 max-w-xl text-muted">
                Я займаюсь створенням сучасних сайтів, UX/UI дизайном та AI-рішеннями для бізнесу.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-3 max-w-xl text-muted">
                Моя мета — створювати цифрові продукти, які виглядають професійно, працюють швидко
                та допомагають бізнесу залучати клієнтів.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-2">
                {stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-white/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {principles.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-white/85">
                    <span className="mt-0.5 text-electric">✦</span>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.25}>
              <a
                href="#contact"
                data-cursor="→"
                className="mt-8 inline-flex rounded-full bg-electric px-7 py-3.5 text-sm font-semibold text-white"
              >
                Обговорити ваш проєкт
              </a>
            </Reveal>
          </div>
        </div>

        {/* Transparency — brand signature block */}
        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-col gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-8 backdrop-blur-md sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-electric/25 bg-electric/10 text-electric">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
                <path d="M12 2l7 4v6c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="text-sm leading-relaxed text-muted">
              <p className="mb-2 font-semibold text-white">Прозорий підхід</p>
              <p>
                MarkLabs активно формує перші комерційні кейси. Тут представлені демонстраційні
                проєкти, які показують наш підхід до дизайну, UX та створення сучасних цифрових
                продуктів. Ми не використовуємо вигаданих результатів чи неіснуючих клієнтів — коли
                зʼявляться перші реальні кейси, вони будуть опубліковані тут разом із результатами
                та відгуками.
              </p>
              <p className="mt-3">
                📍 {site.city}, Україна
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

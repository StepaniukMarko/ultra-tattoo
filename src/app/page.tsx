import Navbar from '@/components/Navbar';
import StickyCta from '@/components/StickyCta';
import MagneticButton from '@/components/MagneticButton';
import Reveal from '@/components/Reveal';

export default function Home() {
  return (
    <>
      <Navbar />
      <StickyCta />

      <main>
        {/* Hero placeholder — replaced by WebGL hero in Slice 2 */}
        <section
          id="hero"
          className="relative flex min-h-[100svh] items-center overflow-hidden bg-aurora"
        >
          <div className="mx-auto w-full max-w-7xl px-6">
            <Reveal>
              <p className="mb-6 text-sm uppercase tracking-[0.3em] text-muted">
                Digital Agency · Вінниця
              </p>
            </Reveal>
            <Reveal as="h1" className="font-display text-display font-bold leading-[0.95]">
              Ми будуємо <span className="text-gradient">цифрові продукти</span>,<br />
              що працюють на бізнес
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg text-muted">
                Преміальний дизайн. Запуск за 2–4 тижні. Прозорі умови та передбачуваний результат.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-4">
              <MagneticButton
                href="#projects"
                cursorLabel="view"
                className="rounded-full bg-electric px-7 py-3.5 text-sm font-semibold text-white"
              >
                Дивитися роботи
              </MagneticButton>
              <MagneticButton
                href="#contact"
                cursorLabel="→"
                className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-white"
              >
                Обговорити проєкт
              </MagneticButton>
            </Reveal>
          </div>
        </section>

        {/* Anchor stubs so nav/sticky-CTA work end-to-end this slice */}
        <section id="services" className="min-h-[40vh]" />
        <section id="projects" className="min-h-[40vh]" />
        <section id="process" className="min-h-[40vh]" />
        <section id="pricing" className="min-h-[40vh]" />
        <section id="faq" className="min-h-[40vh]" />
        <section id="contact" className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted">Секція контактів — Slice 6</p>
        </section>
      </main>
    </>
  );
}

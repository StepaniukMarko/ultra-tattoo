import Navbar from '@/components/Navbar';
import StickyCta from '@/components/StickyCta';
import Hero from '@/sections/Hero';
import Marquee from '@/sections/Marquee';
import Services from '@/sections/Services';
import Projects from '@/sections/Projects';

export default function Home() {
  return (
    <>
      <Navbar />
      <StickyCta />

      <main>
        <Hero />
        <Marquee />
        <Services />
        <Projects />

        {/* Anchor stubs — filled in Slices 5–6 */}
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

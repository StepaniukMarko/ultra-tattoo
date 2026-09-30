import Navbar from '@/components/Navbar';
import StickyCta from '@/components/StickyCta';
import Hero from '@/sections/Hero';
import Marquee from '@/sections/Marquee';
import Services from '@/sections/Services';
import Projects from '@/sections/Projects';
import Process from '@/sections/Process';
import Pricing from '@/sections/Pricing';
import Calculator from '@/sections/Calculator';

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
        <Process />
        <Pricing />
        <Calculator />

        {/* Anchor stubs — filled in Slice 6 */}
        <section id="faq" className="min-h-[40vh]" />
        <section id="contact" className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted">Секція контактів — Slice 6</p>
        </section>
      </main>
    </>
  );
}

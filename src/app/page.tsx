import Navbar from '@/components/Navbar';
import StickyCta from '@/components/StickyCta';
import Hero from '@/sections/Hero';

export default function Home() {
  return (
    <>
      <Navbar />
      <StickyCta />

      <main>
        <Hero />

        {/* Anchor stubs — filled in Slices 3–6 */}
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

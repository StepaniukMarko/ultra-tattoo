import Navbar from '@/components/Navbar';
import StickyCta from '@/components/StickyCta';
import Hero from '@/sections/Hero';
import Marquee from '@/sections/Marquee';
import Services from '@/sections/Services';
import Projects from '@/sections/Projects';
import Process from '@/sections/Process';
import Pricing from '@/sections/Pricing';
import Calculator from '@/sections/Calculator';
import About from '@/sections/About';
import Faq from '@/sections/Faq';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';

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
        <About />
        <Faq />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

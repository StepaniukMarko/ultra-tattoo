'use client';

import { useEffect, useState } from 'react';

/**
 * Sticky "Обговорити проєкт" button that appears after the hero
 * and hides when the contact section is in view.
 */
export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9;
      const contact = document.getElementById('contact');
      const contactVisible = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.8
        : false;
      setVisible(past && !contactVisible);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href="#contact"
      data-cursor="→"
      className={`fixed bottom-5 left-1/2 z-[65] -translate-x-1/2 rounded-full border border-white/10 bg-electric px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(59,130,246,0.4)] transition-all duration-500 ease-expo ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'
      }`}
    >
      Обговорити проєкт →
    </a>
  );
}

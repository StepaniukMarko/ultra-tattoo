'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[80] h-0.5 bg-transparent">
      <div
        className="h-full origin-left bg-gradient-to-r from-electric via-cyan to-violet"
        style={{ transform: `scaleX(${p})` }}
      />
    </div>
  );
}

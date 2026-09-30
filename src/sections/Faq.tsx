'use client';

import { useRef, useState, useId } from 'react';
import { faq } from '@/lib/site';
import Reveal from '@/components/Reveal';

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const btnId = `${baseId}-btn`;
  const panelId = `${baseId}-panel`;

  return (
    <div className="border-b border-white/8">
      <h3>
        <button
          id={btnId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-4 py-5 text-left"
        >
          <span className="font-display text-base font-medium text-white sm:text-lg">{q}</span>
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/12 text-electric transition-transform duration-300 ${
              open ? 'rotate-45' : ''
            }`}
            aria-hidden="true"
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        ref={panelRef}
        style={{ maxHeight: open ? `${panelRef.current?.scrollHeight ?? 400}px` : '0px' }}
        className="overflow-hidden transition-[max-height] duration-400 ease-expo"
      >
        <p className="pb-5 pr-12 text-sm leading-relaxed text-muted">{a}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-display font-bold leading-tight">
            Часті <span className="text-gradient">запитання</span>
          </h2>
        </Reveal>
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-6 backdrop-blur-md">
          {faq.map((f, i) => (
            <Item key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

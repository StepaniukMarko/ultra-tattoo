'use client';

import { useState, type FormEvent } from 'react';
import { site } from '@/lib/site';
import { submitLead } from '@/lib/api';
import Reveal from '@/components/Reveal';
import SplitReveal from '@/components/SplitReveal';

type Status = 'idle' | 'sending' | 'ok' | 'error';

const slots = ['Будь-коли', 'Ранок (9–12)', 'День (12–17)', 'Вечір (17–20)'];

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const telegram = String(fd.get('telegram') ?? '').trim();
    const slot = String(fd.get('slot') ?? '').trim();
    const msg = String(fd.get('message') ?? '').trim();

    const nextErrors: typeof errors = {};
    if (!name) nextErrors.name = "Вкажіть імʼя";
    if (!phone) nextErrors.phone = 'Вкажіть телефон';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus('sending');
    const message = `${msg || 'Заявка з сайту'}${slot ? ` · Зручний час: ${slot}` : ''}`;
    const ok = await submitLead({ name, phone, telegram, message });
    setStatus(ok ? 'ok' : 'error');
    if (ok) form.reset();
  };

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-aurora opacity-60" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="font-display text-mega font-bold leading-[0.95]">
            <SplitReveal>Створимо</SplitReveal>{' '}
            <span className="text-gradient">
              <SplitReveal delay={0.15}>разом</SplitReveal>
            </span>
          </h2>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-muted">
              Безкоштовна консультація · Відповідь протягом 2 годин
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-[1fr_1.1fr]">
          {/* Quick contacts */}
          <Reveal className="flex flex-col gap-3">
            <a
              href={site.contacts.telegram}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 transition-colors hover:border-electric/30"
            >
              <span className="text-sm text-white">Telegram</span>
              <span className="text-sm text-electric">Написати →</span>
            </a>
            <a
              href={`tel:${site.contacts.phone}`}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 transition-colors hover:border-electric/30"
            >
              <span className="text-sm text-white">Дзвінок</span>
              <span className="text-sm text-electric">{site.contacts.phoneDisplay}</span>
            </a>
            <a
              href={site.contacts.instagram}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 transition-colors hover:border-electric/30"
            >
              <span className="text-sm text-white">Instagram</span>
              <span className="text-sm text-electric">{site.contacts.instagramHandle}</span>
            </a>
            <a
              href={`mailto:${site.contacts.email}`}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 transition-colors hover:border-electric/30"
            >
              <span className="text-sm text-white">Email</span>
              <span className="text-sm text-electric">{site.contacts.email}</span>
            </a>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.05}>
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-md sm:p-8"
            >
              <div className="grid gap-4">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-sm text-white/80">
                    Імʼя <span className="text-electric">*</span>
                  </label>
                  <input
                    id="c-name"
                    name="name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    className={`w-full rounded-xl border bg-space-900/60 px-4 py-3 text-sm text-white outline-none transition-colors ${
                      errors.name ? 'border-red-500/70' : 'border-white/12 focus:border-electric/60'
                    }`}
                    placeholder="Ваше імʼя"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="c-phone" className="mb-1.5 block text-sm text-white/80">
                    Телефон <span className="text-electric">*</span>
                  </label>
                  <input
                    id="c-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    aria-invalid={!!errors.phone}
                    className={`w-full rounded-xl border bg-space-900/60 px-4 py-3 text-sm text-white outline-none transition-colors ${
                      errors.phone ? 'border-red-500/70' : 'border-white/12 focus:border-electric/60'
                    }`}
                    placeholder="+380 ..."
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="c-tg" className="mb-1.5 block text-sm text-white/80">
                    Telegram (необовʼязково)
                  </label>
                  <input
                    id="c-tg"
                    name="telegram"
                    className="w-full rounded-xl border border-white/12 bg-space-900/60 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-electric/60"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label htmlFor="c-slot" className="mb-1.5 block text-sm text-white/80">
                    Зручний час для дзвінка
                  </label>
                  <select
                    id="c-slot"
                    name="slot"
                    className="w-full rounded-xl border border-white/12 bg-space-900/60 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-electric/60"
                    defaultValue={slots[0]}
                  >
                    {slots.map((s) => (
                      <option key={s} value={s} className="bg-space-900">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="c-msg" className="mb-1.5 block text-sm text-white/80">
                    Коротко про задачу
                  </label>
                  <textarea
                    id="c-msg"
                    name="message"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/12 bg-space-900/60 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-electric/60"
                    placeholder="Опишіть, що потрібно..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  data-cursor="→"
                  className="mt-1 inline-flex items-center justify-center rounded-full bg-electric px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-electric/90 disabled:opacity-60"
                >
                  {status === 'sending' ? 'Надсилаємо…' : 'Отримати безкоштовну консультацію'}
                </button>

                <div aria-live="polite" className="min-h-[1.25rem] text-sm">
                  {status === 'ok' && (
                    <p className="text-emerald-400">Дякуємо! Ми звʼяжемося з вами найближчим часом.</p>
                  )}
                  {status === 'error' && (
                    <p className="text-amber-400">
                      Не вдалося надіслати. Напишіть, будь ласка, у{' '}
                      <a href={site.contacts.telegram} target="_blank" rel="noopener" className="underline">
                        Telegram
                      </a>
                      .
                    </p>
                  )}
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

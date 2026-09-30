'use client';

import { useMemo, useRef, useState } from 'react';
import { calcTypes, calcOptions } from '@/lib/site';
import { submitLead } from '@/lib/api';
import Reveal from '@/components/Reveal';

function useRollingNumber(target: number) {
  const [display, setDisplay] = useState(target);
  const raf = useRef(0);
  const from = useRef(target);

  const animate = (to: number) => {
    cancelAnimationFrame(raf.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(to);
      from.current = to;
      return;
    }
    const start = performance.now();
    const startVal = from.current;
    const dur = 500;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(startVal + (to - startVal) * eased);
      setDisplay(val);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else from.current = to;
    };
    raf.current = requestAnimationFrame(tick);
  };

  return [display, animate] as const;
}

export default function Calculator() {
  const [typeIdx, setTypeIdx] = useState<number | null>(null);
  const [opts, setOpts] = useState<Record<string, boolean>>({});
  const [error, setError] = useState(false);
  const [sent, setSent] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle');
  const [display, animate] = useRollingNumber(0);

  const { total, term } = useMemo(() => {
    if (typeIdx === null) return { total: 0, term: '' };
    const t = calcTypes[typeIdx];
    let sum = t.value;
    let extra = 0;
    let urgent = false;
    calcOptions.forEach((o) => {
      if (opts[o.key]) {
        sum += o.add;
        if (o.key === 'urgent') urgent = true;
        else extra += 1;
      }
    });
    let lo = t.min + Math.floor(extra / 2);
    let hi = t.max + Math.ceil(extra / 2);
    if (urgent) {
      lo = Math.max(1, lo - 1);
      hi = Math.max(lo + 1, hi - 1);
    }
    return { total: sum, term: `${lo}–${hi} тижнів` };
  }, [typeIdx, opts]);

  const recalc = (nextIdx: number | null, nextOpts: Record<string, boolean>) => {
    if (nextIdx === null) return;
    const t = calcTypes[nextIdx];
    let sum = t.value;
    calcOptions.forEach((o) => {
      if (nextOpts[o.key]) sum += o.add;
    });
    animate(sum);
  };

  const onType = (i: number) => {
    setTypeIdx(i);
    setError(false);
    recalc(i, opts);
  };

  const toggle = (key: string) => {
    const next = { ...opts, [key]: !opts[key] };
    setOpts(next);
    recalc(typeIdx, next);
  };

  const format = (n: number) => n.toLocaleString('uk-UA');

  const sendToTelegram = async () => {
    if (typeIdx === null) {
      setError(true);
      return;
    }
    setSent('sending');
    const chosen = calcOptions.filter((o) => opts[o.key]).map((o) => o.label);
    const message =
      `Розрахунок з калькулятора: ${calcTypes[typeIdx].label.split(' —')[0]}. ` +
      `Опції: ${chosen.length ? chosen.join(', ') : 'без додаткових'}. ` +
      `Орієнтовно ${format(total)} грн, ${term}.`;
    const ok = await submitLead({ name: 'Заявка з калькулятора', message });
    setSent(ok ? 'ok' : 'fail');
  };

  return (
    <section id="calculator" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-display font-bold leading-tight">
            Калькулятор <span className="text-gradient">вартості</span>
          </h2>
          <p className="mt-4 text-muted">
            Дайте відповідь на кілька питань і отримайте орієнтовну вартість за секунду
          </p>
        </Reveal>

        <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-md sm:p-8">
          {/* Type */}
          <label className="mb-2 block text-sm font-medium text-white/80" htmlFor="calc-type">
            Тип проєкту
          </label>
          <select
            id="calc-type"
            aria-label="Тип проєкту"
            className={`w-full rounded-xl border bg-space-900/60 px-4 py-3 text-sm text-white outline-none transition-colors ${
              error ? 'border-red-500/70' : 'border-white/12 focus:border-electric/60'
            }`}
            value={typeIdx ?? ''}
            onChange={(e) => onType(Number(e.target.value))}
          >
            <option value="" disabled>
              Оберіть тип проєкту
            </option>
            {calcTypes.map((t, i) => (
              <option key={i} value={i} className="bg-space-900">
                {t.label}
              </option>
            ))}
          </select>
          {error && <p className="mt-2 text-xs text-red-400">Оберіть тип проєкту</p>}

          {/* Options */}
          <div className="mt-6 space-y-3">
            {calcOptions.map((o) => {
              const on = !!opts[o.key];
              return (
                <div
                  key={o.key}
                  className="flex items-center justify-between rounded-xl border border-white/7 bg-white/[0.03] px-4 py-3"
                >
                  <span className="text-sm text-white/90">{o.label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={o.label}
                    onClick={() => toggle(o.key)}
                    className={`relative h-7 w-14 rounded-full border transition-colors ${
                      on ? 'border-electric/50 bg-electric/30' : 'border-white/10 bg-black/30'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform duration-300 ease-expo ${
                        on ? 'translate-x-7' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Result */}
          <div className="mt-8 rounded-2xl border border-electric/20 bg-electric/[0.06] p-6 text-center">
            <p className="text-xs uppercase tracking-wider text-muted">Орієнтовна вартість</p>
            <p className="mt-1 font-display text-4xl font-bold tabular-nums text-gradient">
              {format(display)} <span className="text-2xl">грн</span>
            </p>
            <p className="mt-3 text-xs uppercase tracking-wider text-muted">Термін реалізації</p>
            <p className="font-display text-xl font-semibold text-white">
              {term || '— тижнів'}
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm text-muted">
              Це попередній розрахунок. Для точного кошторису залиште заявку.
            </p>

            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={sendToTelegram}
                disabled={sent === 'sending'}
                data-cursor="→"
                className="w-full rounded-full bg-electric px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-electric/90 disabled:opacity-60 sm:w-auto"
              >
                {sent === 'sending'
                  ? 'Надсилаємо…'
                  : sent === 'ok'
                    ? 'Надіслано ✓'
                    : 'Надіслати розрахунок у Telegram'}
              </button>
              <a
                href="#contact"
                className="w-full rounded-full border border-white/15 px-6 py-3 text-sm text-white sm:w-auto"
              >
                Обговорити проєкт
              </a>
            </div>
            {sent === 'fail' && (
              <p className="mt-3 text-xs text-amber-400">
                Не вдалося надіслати автоматично. Напишіть нам у Telegram або через форму нижче.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

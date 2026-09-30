import Link from 'next/link';

export const metadata = { title: '404 — сторінку не знайдено' };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-space-950 px-6 text-center">
      <p className="font-display text-mega font-bold leading-none text-gradient">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">Сторінку не знайдено</h1>
      <p className="mt-3 max-w-md text-muted">
        Схоже, цієї сторінки не існує або її було переміщено.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-electric px-7 py-3.5 text-sm font-semibold text-white"
      >
        ← На головну
      </Link>
    </main>
  );
}

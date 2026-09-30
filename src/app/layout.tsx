import type { Metadata, Viewport } from 'next';
import { Unbounded, Inter_Tight } from 'next/font/google';
import './globals.css';
import { site } from '@/lib/site';
import SmoothScroll from '@/components/SmoothScroll';
import Preloader from '@/components/Preloader';
import Cursor from '@/components/Cursor';
import ScrollProgress from '@/components/ScrollProgress';

// Unbounded: geometric display face with full Cyrillic support.
const display = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

// Inter Tight: UI/body face with Cyrillic support.
const sans = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'MarkLabs — створення сайтів, магазинів та AI-автоматизація | Вінниця',
    template: '%s | MarkLabs',
  },
  description:
    'MarkLabs — digital-агентство з Вінниці. Створюємо сайти, інтернет-магазини, Telegram-ботів та AI-автоматизацію. Запуск за 2–4 тижні, фіксована ціна після ТЗ.',
  keywords: [
    'створення сайтів Вінниця',
    'розробка інтернет-магазинів',
    'digital агентство',
    'Telegram боти',
    'AI автоматизація',
  ],
  authors: [{ name: site.legalName }],
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: site.url,
    siteName: site.legalName,
    title: 'MarkLabs — сайти та автоматизація для бізнесу',
    description: 'Сучасні сайти, інтернет-магазини та AI-автоматизація. Швидкий запуск, преміальний дизайн.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarkLabs — сайти та автоматизація для бізнесу',
    description: 'Digital-агентство. Сайти, магазини, боти та AI-рішення.',
  },
  alternates: {
    canonical: site.url,
    languages: { 'uk-UA': site.url },
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#05060a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${display.variable} ${sans.variable}`}>
      <body className="grain">
        <Preloader />
        <ScrollProgress />
        <Cursor />
        <SmoothScroll />
        <div id="top" />
        {children}
      </body>
    </html>
  );
}

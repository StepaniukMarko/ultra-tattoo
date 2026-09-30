import type { Metadata } from 'next';
import SubPageShell from '@/components/SubPageShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Умови використання',
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <SubPageShell>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Умови використання</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>Використовуючи сайт, ви погоджуєтесь із наведеними нижче умовами.</p>
        <h2 className="mt-6 font-display text-lg font-semibold text-white">1. Загальні положення</h2>
        <p>
          {site.name} надає послуги зі створення сайтів, UX/UI дизайну, розробки Telegram-ботів та
          впровадження AI-рішень для бізнесу.
        </p>
        <h2 className="mt-6 font-display text-lg font-semibold text-white">2. Демонстраційні проєкти</h2>
        <p>
          Проєкти у розділі «Демонстраційні проєкти» є концептами, створеними для демонстрації
          підходу {site.name} до дизайну та розробки. Вони не є кейсами реальних клієнтів, якщо
          прямо не зазначено інше.
        </p>
        <h2 className="mt-6 font-display text-lg font-semibold text-white">3. Консультації та заявки</h2>
        <p>
          Залишаючи заявку, ви погоджуєтесь, що з вами може звʼязатися представник {site.name} для
          обговорення вашого запиту.
        </p>
        <h2 className="mt-6 font-display text-lg font-semibold text-white">4. Контакти</h2>
        <p>
          З питань співпраці:{' '}
          <a href={`mailto:${site.contacts.email}`} className="text-electric hover:underline">
            {site.contacts.email}
          </a>
          .
        </p>
        <p className="pt-4 text-xs">Останнє оновлення: 2026</p>
      </div>
    </SubPageShell>
  );
}

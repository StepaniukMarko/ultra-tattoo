import type { Metadata } from 'next';
import SubPageShell from '@/components/SubPageShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Політика конфіденційності',
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <SubPageShell>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Політика конфіденційності</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Ця Політика описує, як {site.name} збирає, використовує та захищає інформацію, яку ви
          надаєте під час використання сайту.
        </p>
        <h2 className="mt-6 font-display text-lg font-semibold text-white">1. Які дані ми збираємо</h2>
        <p>Імʼя, контактні дані (телефон, Telegram, email) та повідомлення, які ви залишаєте у формах.</p>
        <h2 className="mt-6 font-display text-lg font-semibold text-white">2. Як ми використовуємо дані</h2>
        <p>Виключно для звʼязку з вами щодо вашого запиту. Ми не передаємо дані третім особам.</p>
        <h2 className="mt-6 font-display text-lg font-semibold text-white">3. Ваші права</h2>
        <p>
          Ви можете у будь-який момент звернутися із запитом на видалення ваших даних, написавши на{' '}
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

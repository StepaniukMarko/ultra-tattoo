import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { services, serviceDetails, site } from '@/lib/site';
import SubPageShell from '@/components/SubPageShell';
import Icon from '@/components/Icon';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = services.find((x) => x.slug === params.slug);
  const d = serviceDetails[params.slug];
  if (!s || !d) return {};
  const title = `${d.title} — послуга`;
  return {
    title,
    description: d.lead,
    alternates: { canonical: `${site.url}/services/${s.slug}` },
    openGraph: { title: `${d.title} | ${site.name}`, description: d.lead, type: 'website' },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const s = services.find((x) => x.slug === params.slug);
  const d = serviceDetails[params.slug];
  if (!s || !d) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: d.title,
    description: d.lead,
    provider: { '@type': 'Organization', name: site.legalName },
    areaServed: site.city,
    ...(d.priceFrom
      ? { offers: { '@type': 'Offer', price: d.priceFrom, priceCurrency: 'UAH' } }
      : {}),
  };

  return (
    <SubPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Хлібні крихти" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-white">
          Головна
        </Link>{' '}
        / <span className="text-white">{d.title}</span>
      </nav>

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-electric/25 bg-electric/10 text-electric">
        <Icon name={s.icon} className="h-7 w-7" />
      </div>

      <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">{d.title}</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">{d.lead}</p>

      {d.priceFrom ? (
        <p className="mt-6 text-sm text-muted">
          Орієнтовно{' '}
          <span className="font-display text-xl font-bold text-gradient">
            від {d.priceFrom.toLocaleString('uk-UA')} грн
          </span>{' '}
          · точна вартість після безкоштовного брифу
        </p>
      ) : null}

      <h2 className="mt-12 font-display text-2xl font-semibold">Що входить</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {d.points.map((p, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-4"
          >
            <span className="mt-0.5 text-electric">✦</span>
            <span className="text-sm text-white/85">{p}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/#contact"
          className="rounded-full bg-electric px-7 py-3.5 text-sm font-semibold text-white"
        >
          Обговорити проєкт
        </Link>
        <Link
          href="/#pricing"
          className="rounded-full border border-white/15 px-7 py-3.5 text-sm text-white"
        >
          Переглянути ціни
        </Link>
      </div>
    </SubPageShell>
  );
}

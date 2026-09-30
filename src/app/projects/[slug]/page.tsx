import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { projects, projectDetails, site } from '@/lib/site';
import SubPageShell from '@/components/SubPageShell';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const d = projectDetails[params.slug];
  if (!d) return {};
  return {
    title: `${d.name} — концепт (${d.niche})`,
    description: d.summary,
    alternates: { canonical: `${site.url}/projects/${params.slug}` },
    openGraph: { title: `${d.name} — концепт | ${site.name}`, description: d.summary },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const d = projectDetails[params.slug];
  if (!d) notFound();

  return (
    <SubPageShell>
      <nav aria-label="Хлібні крихти" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-white">
          Головна
        </Link>{' '}
        / <Link href="/#projects" className="hover:text-white">Проєкти</Link> /{' '}
        <span className="text-white">{d.name}</span>
      </nav>

      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/70">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
        Концепт
      </span>

      <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl">{d.name}</h1>
      <p className="mt-2 text-muted">{d.niche}</p>

      <div
        className="mt-8 flex h-64 items-center justify-center rounded-2xl sm:h-80"
        style={{
          background: `radial-gradient(120% 120% at 20% 0%, ${d.accent}22, transparent 55%), linear-gradient(160deg, #0b0e18, #05060a)`,
        }}
      >
        <span className="font-display text-5xl font-bold sm:text-7xl" style={{ color: d.accent, opacity: 0.3 }}>
          {d.name}
        </span>
      </div>

      <p className="mt-8 max-w-2xl text-lg text-muted">{d.summary}</p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Що показує концепт</h2>
      <ul className="mt-5 flex flex-wrap gap-2">
        {d.features.map((f) => (
          <li
            key={f}
            className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-white/85"
          >
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-xl border border-white/8 bg-white/[0.03] p-5 text-sm text-muted">
        Живе демо: <span className="text-white/80">Концепт — демо скоро</span>. Реальні кейси
        зʼявляться тут разом із результатами та відгуками, коли будуть готові.
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/#contact" className="rounded-full bg-electric px-7 py-3.5 text-sm font-semibold text-white">
          Хочу схожий проєкт
        </Link>
        <Link href="/#projects" className="rounded-full border border-white/15 px-7 py-3.5 text-sm text-white">
          ← Усі проєкти
        </Link>
      </div>
    </SubPageShell>
  );
}

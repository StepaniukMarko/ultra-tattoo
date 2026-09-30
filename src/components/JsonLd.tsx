import { site, faq } from '@/lib/site';

/** Organization + LocalBusiness + FAQPage structured data. */
export default function JsonLd() {
  const graph = [
    {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': `${site.url}/#organization`,
      name: site.legalName,
      url: site.url,
      description:
        'Digital-агентство. Створення сайтів, інтернет-магазинів, Telegram-ботів та AI-автоматизація для бізнесу.',
      founder: { '@type': 'Person', name: site.founder },
      areaServed: site.city,
      address: {
        '@type': 'PostalAddress',
        addressCountry: site.country,
        addressLocality: site.city,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: site.contacts.phone,
        contactType: 'sales',
        availableLanguage: 'Ukrainian',
      },
      email: site.contacts.email,
      sameAs: [site.contacts.telegram, site.contacts.instagram],
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      name: site.legalName,
      url: site.url,
      inLanguage: 'uk-UA',
      publisher: { '@id': `${site.url}/#organization` },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  const json = { '@context': 'https://schema.org', '@graph': graph };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}

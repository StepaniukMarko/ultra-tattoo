// Central site data — single source of truth for copy, contacts, nav.
// All Ukrainian copy preserved from the existing MarkLabs site.

export const site = {
  name: 'MarkLabs',
  legalName: 'MarkLabs Agency',
  city: 'Вінниця',
  country: 'UA',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mark-labs.com.ua',
  apiBase: process.env.NEXT_PUBLIC_API_BASE ?? '',
  tagline: 'Сучасні сайти, UX/UI дизайн та AI-рішення для бізнесу.',
  founder: 'Марко Степанюк',
  contacts: {
    email: 'stepaniukmarko@gmail.com',
    phone: '+380731828248',
    phoneDisplay: '+380 73 182 82 48',
    telegram: 'https://t.me/MarkoStepaniuk',
    instagram: 'https://www.instagram.com/marklabs.web',
    instagramHandle: '@marklabs.web',
  },
} as const;

export const nav = [
  { href: '#services', label: 'Послуги' },
  { href: '#projects', label: 'Проєкти' },
  { href: '#process', label: 'Процес' },
  { href: '#pricing', label: 'Ціни' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Контакти' },
] as const;

export type Metric = { value: string; label: string };

export const heroMetrics: Metric[] = [
  { value: '2–4', label: 'тижні до запуску' },
  { value: '100%', label: 'фіксована ціна після ТЗ' },
  { value: '2 год', label: 'середній час відповіді' },
];

export const services = [
  {
    slug: 'websites',
    title: 'Створення сайтів',
    short: 'Адаптивні сайти з SEO-оптимізацією та зрозумілою навігацією',
    icon: 'monitor',
  },
  {
    slug: 'ecommerce',
    title: 'Інтернет-магазини',
    short: 'E-commerce з каталогом, кошиком, системою замовлень та імпортом товарів',
    icon: 'bag',
  },
  {
    slug: 'ai',
    title: 'AI автоматизація',
    short: 'Чат-боти та AI-асистенти для обслуговування клієнтів',
    icon: 'spark',
  },
  {
    slug: 'telegram-bots',
    title: 'Telegram боти',
    short: 'Боти для запису, замовлень, підтримки та розсилок',
    icon: 'send',
  },
  {
    slug: 'automation',
    title: 'Бізнес автоматизація',
    short: 'CRM-інтеграції, нагадування, follow-up та зв\u2019язка сервісів',
    icon: 'flow',
  },
] as const;

export type Service = (typeof services)[number];

// Extended per-service content for /services/[slug] pages.
export const serviceDetails: Record<
  string,
  { title: string; lead: string; points: string[]; priceFrom?: number }
> = {
  websites: {
    title: 'Створення сайтів',
    lead: 'Адаптивні сайти з чистим кодом, SEO-базою та зрозумілою навігацією — від лендингу до багатосторінкового корпоративного сайту.',
    points: [
      'Адаптивна верстка під усі пристрої',
      'SEO-оптимізація та швидке завантаження',
      'Форми заявок з інтеграцією у Telegram/CRM',
      'Прототип і узгодження дизайну до розробки',
    ],
    priceFrom: 8000,
  },
  ecommerce: {
    title: 'Інтернет-магазини',
    lead: 'E-commerce «під ключ»: каталог, кошик, замовлення, онлайн-оплата та імпорт товарів. Зручна адмін-панель для власника.',
    points: [
      'Каталог, кошик та система замовлень',
      'Онлайн-оплата й інтеграції доставки',
      'Імпорт товарів та керування наявністю',
      'Адмін-панель і базова аналітика',
    ],
    priceFrom: 20000,
  },
  ai: {
    title: 'AI автоматизація',
    lead: 'Чат-боти та AI-асистенти, що беруть на себе рутину: відповідають клієнтам, кваліфікують заявки та економлять ваш час.',
    points: [
      'AI-асистент для типових питань клієнтів',
      'Кваліфікація й маршрутизація заявок',
      'Інтеграція з базою знань бізнесу',
      'Аналітика діалогів',
    ],
    priceFrom: 7000,
  },
  'telegram-bots': {
    title: 'Telegram боти',
    lead: 'Боти для запису, замовлень, підтримки та розсилок. Зручні сценарії, адмін-повідомлення та інтеграції.',
    points: [
      'Запис, замовлення та оплата в боті',
      'Сповіщення адміну про нові заявки',
      'Розсилки та сегментація',
      'Інтеграція з сайтом і CRM',
    ],
    priceFrom: 7000,
  },
  automation: {
    title: 'Бізнес автоматизація',
    lead: 'Звʼязуємо ваші сервіси в один потік: CRM-інтеграції, нагадування, follow-up і автоматизація рутинних процесів.',
    points: [
      'CRM-інтеграції та передача заявок',
      'Автонагадування та follow-up',
      'Звʼязка сервісів через API',
      'Прозорі сценарії без «чорних скриньок»',
    ],
    priceFrom: 7000,
  },
};

export const projects = [
  { slug: 'smiledent', name: 'SmileDent', niche: 'Стоматологія', accent: '#0EA5E9' },
  { slug: 'blackhorse', name: 'BlackHorse', niche: "Men\u2019s Club", accent: '#C8A654' },
  { slug: 'detaillab', name: 'DetailLab', niche: 'Автодетейлінг', accent: '#00D4FF' },
  { slug: 'fitcore', name: 'FitCore', niche: 'Transformation', accent: '#7CFF6B' },
  { slug: 'urbanbuild', name: 'UrbanBuild', niche: 'Будівництво', accent: '#2196F3' },
  { slug: 'autofix', name: 'AutoFix Pro', niche: 'AI діагностика', accent: '#60a5fa' },
  { slug: 'aura', name: 'Aura Studio', niche: 'Beauty & SPA', accent: '#a78bfa' },
] as const;

export type Project = (typeof projects)[number];

// Extended per-project content for /projects/[slug]. All are concepts.
export const projectDetails: Record<
  string,
  { name: string; niche: string; accent: string; summary: string; features: string[] }
> = {
  smiledent: {
    name: 'SmileDent',
    niche: 'Стоматологія',
    accent: '#0EA5E9',
    summary: 'Концепт сайту стоматологічної клініки: онлайн-запис, довіра через відгуки та зручна навігація послугами.',
    features: ['Онлайн-запис', 'Каталог послуг', 'Блок довіри', 'Адаптив'],
  },
  blackhorse: {
    name: 'BlackHorse',
    niche: "Men\u2019s Club",
    accent: '#C8A654',
    summary: 'Концепт барбершопу преміум-класу: атмосферний дизайн, бронювання крісла та стиль-меч.',
    features: ['Бронювання', 'Преміум-візуал', 'Прайс-меню', 'Галерея'],
  },
  detaillab: {
    name: 'DetailLab',
    niche: 'Автодетейлінг',
    accent: '#00D4FF',
    summary: 'Концепт студії детейлінгу: калькулятор вартості, портфоліо робіт і онлайн-заявка.',
    features: ['Калькулятор', 'Before/After', 'Портфоліо', 'Заявка'],
  },
  fitcore: {
    name: 'FitCore',
    niche: 'Transformation',
    accent: '#7CFF6B',
    summary: 'Концепт фітнес-платформи: програми трансформації, мотиваційний контент і запис на консультацію.',
    features: ['Програми', 'Прогрес', 'Тарифи', 'Запис'],
  },
  urbanbuild: {
    name: 'UrbanBuild',
    niche: 'Будівництво',
    accent: '#2196F3',
    summary: 'Концепт сайту будівельної компанії: обʼєкти, етапи робіт і форма прорахунку проєкту.',
    features: ['Обʼєкти', 'Етапи', 'Прорахунок', 'Контакти'],
  },
  autofix: {
    name: 'AutoFix Pro',
    niche: 'AI діагностика',
    accent: '#60a5fa',
    summary: 'Концепт сервісу автодіагностики з AI: попередня оцінка вартості та розумний підбір рішень.',
    features: ['AI-діагностика', 'Оцінка вартості', 'Запис', 'Історія'],
  },
  aura: {
    name: 'Aura Studio',
    niche: 'Beauty & SPA',
    accent: '#a78bfa',
    summary: 'Концепт сайту салону краси та SPA: послуги, майстри, онлайн-запис і подарункові сертифікати.',
    features: ['Онлайн-запис', 'Майстри', 'Сертифікати', 'Галерея'],
  },
};

export const pricing = [
  {
    tier: 'Landing Page',
    price: 8000,
    desc: 'Односторінковий сайт для запуску продукту чи послуги',
    features: ['Адаптивна верстка', 'SEO-база', 'Форма заявки', 'Запуск за 2 тижні'],
    featured: false,
  },
  {
    tier: 'Корпоративний сайт',
    price: 12000,
    desc: 'Багатосторінковий сайт компанії з SEO та формами',
    features: ['До 8 сторінок', 'SEO-оптимізація', 'Блог/новини', 'Інтеграції форм'],
    featured: false,
  },
  {
    tier: 'Інтернет-магазин',
    price: 20000,
    desc: 'E-commerce з каталогом, кошиком та системою замовлень',
    features: ['Каталог + кошик', 'Онлайн-оплата', 'Імпорт товарів', 'Адмін-панель'],
    featured: true,
  },
  {
    tier: 'AI автоматизація',
    price: 7000,
    desc: 'Чат-боти, CRM-інтеграції та автоматизація процесів',
    features: ['Telegram/веб-бот', 'CRM-інтеграція', 'Автовідповіді', 'Аналітика'],
    featured: false,
  },
] as const;

export const faq = [
  {
    q: 'Скільки коштує сайт?',
    a: 'Орієнтовні ціни вказані в блоці «Ціни»: від 8 000 грн за лендинг до 20 000 грн за інтернет-магазин. Точна вартість фіксується після безкоштовного брифу та затвердження ТЗ.',
  },
  {
    q: 'Як відбувається оплата та підтримка?',
    a: 'Оплата поетапна: аванс після затвердження ТЗ і решта після здачі. Усі витрати обговорюються заздалегідь, без прихованих платежів. Після запуску допомагаємо з базовими питаннями та налаштуваннями.',
  },
  {
    q: 'Скільки часу займає розробка?',
    a: 'Типовий проєкт запускається за 2–4 тижні залежно від обсягу. Терміновий запуск можливий за окремою домовленістю.',
  },
  {
    q: 'Чи можна вносити правки в дизайн?',
    a: 'Так. Ми узгоджуємо дизайн на етапі прототипу — до початку розробки. Ви бачите макет і вносите правки, поки результат вас повністю не влаштує. Розробка стартує тільки після вашого затвердження.',
  },
  {
    q: 'Ви допомагаєте з доменом і хостингом?',
    a: 'Так — допомагаємо з реєстрацією домену, налаштуванням хостингу та запуском проєкту «під ключ».',
  },
] as const;

export const guarantees = [
  {
    title: 'Фіксована вартість після затвердження ТЗ',
    text: 'Після погодження обсягу робіт вартість не змінюється без додаткових погоджених задач.',
  },
  {
    title: 'Без прихованих платежів',
    text: 'Усі витрати обговорюються заздалегідь до початку роботи.',
  },
  {
    title: 'Адаптація під мобільні пристрої',
    text: "Сайт коректно працює на телефонах, планшетах та комп\u2019ютерах.",
  },
  {
    title: 'Допомога з доменом та хостингом',
    text: 'Допомагаємо з реєстрацією домену, налаштуванням хостингу та запуском проєкту.',
  },
  {
    title: 'Підтримка після запуску',
    text: 'Після здачі проєкту допомагаємо з базовими питаннями та налаштуваннями.',
  },
] as const;

// Calculator config — mirrors the existing site's pricing logic.
export const calcTypes = [
  { value: 8000, label: 'Landing Page — від 8 000 грн', min: 2, max: 3 },
  { value: 12000, label: 'Корпоративний сайт — від 12 000 грн', min: 3, max: 5 },
  { value: 20000, label: 'Інтернет-магазин — від 20 000 грн', min: 4, max: 7 },
  { value: 7000, label: 'AI-рішення — від 7 000 грн', min: 2, max: 4 },
] as const;

export const calcOptions = [
  { key: 'design', label: 'Дизайн', add: 5000 },
  { key: 'booking', label: 'Онлайн запис', add: 3000 },
  { key: 'shop', label: 'Інтернет-магазин', add: 10000 },
  { key: 'ai', label: 'AI-функції', add: 7000 },
  { key: 'urgent', label: 'Терміновий запуск', add: 5000 },
] as const;

export const processSteps = [
  { n: '01', title: 'Бриф', text: 'Безкоштовна консультація: розбираємо задачу, цілі та референси.' },
  { n: '02', title: 'Дизайн', text: 'Прототип і візуал. Узгоджуємо до старту розробки.' },
  { n: '03', title: 'Розробка', text: 'Верстка, інтеграції, наповнення. Адаптив і швидкість.' },
  { n: '04', title: 'Запуск', text: 'Домен, хостинг, тести. Передаємо проєкт і підтримуємо.' },
] as const;

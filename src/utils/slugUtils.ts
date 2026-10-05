import { Article } from '../types';

export const DOMAIN_NAME = 'https://www.almaghreb-alyoum.com';

/**
 * Generate a clean, SEO-friendly, permanent slug for any article.
 * Once created and published, the slug should remain permanent.
 */
export function generateArticleSlug(title: string, customSlug?: string): string {
  if (customSlug && customSlug.trim()) {
    return customSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u0600-\u06FF\-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  if (!title || !title.trim()) {
    return `article-${Date.now()}`;
  }

  // Generate clean slug from title, preserving Arabic and Latin characters
  return title
    .trim()
    .toLowerCase()
    .replace(/["'«»()[\]{}.,،:;!?]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Returns the relative internal URL for an article (e.g. /article/morocco-news-today)
 */
export function getArticleUrl(article: { slug?: string; id: string }): string {
  const slug = (article.slug && article.slug.trim()) ? article.slug.trim() : article.id;
  return `/article/${encodeURIComponent(slug)}`;
}

/**
 * Returns the canonical absolute URL for an article (e.g. https://www.almaghreb-alyoum.com/article/morocco-news-today)
 */
export function getFullArticleUrl(article: { slug?: string; id: string }): string {
  const slug = (article.slug && article.slug.trim()) ? article.slug.trim() : article.id;
  return `${DOMAIN_NAME}/article/${encodeURIComponent(slug)}`;
}

/**
 * Known aliases to ensure historical links and alternative slugs work 100% reliably
 */
const KNOWN_SLUG_ALIASES: Record<string, string> = {
  'el-mansouri-government-formation-parliament-opening-race': 'mor-mansouri-gov-formation-2026',
  'parliament-opening-pressures-mansouri-government-consultations': 'mor-mansouri-gov-formation-2026',
  'mansouri-gov-formation-2026': 'mor-mansouri-gov-formation-2026',
  'wafacash-agency-morocco-guide-2026': 'art-wafacash-agency-guide-2026',
  'how-to-start-wafacash-agency-morocco-2026-guide': 'art-wafacash-agency-guide-2026',
  'art-wafacash-agency-guide-2026': 'art-wafacash-agency-guide-2026',
  'how-to-start-lana-cash-agency-morocco-2026-guide': 'agency-lana-cash-morocco-2026',
  'lana-cash-agency-morocco-2026-guide': 'agency-lana-cash-morocco-2026',
  'lana-cash-morocco-2026': 'agency-lana-cash-morocco-2026',
  'art-lana-cash-agency-guide-2026': 'agency-lana-cash-morocco-2026',
  'agency-lana-cash-morocco-2026': 'agency-lana-cash-morocco-2026',
  'كيفية-إنشاء-وكالة-لانا-كاش-المغرب-2026': 'agency-lana-cash-morocco-2026',
  'كيفية-إنشاء-lana-cash-لانا-كاش-التابعة-لـ-cih-bank-في-المغرب-2026-الشروط-والوثائق-والتكلفة-والأرباح': 'agency-lana-cash-morocco-2026',
  'mansouri-government-latest-updates-parliament-opening-2026': 'mor-mansouri-latest-updates-5-october-2026',
  'mor-mansouri-latest-updates-5-october-2026': 'mor-mansouri-latest-updates-5-october-2026',
  'حكومة-فاطمة-الزهراء-المنصوري-آخر-مستجدات-تشكيل-الحكومة-المغربية': 'mor-mansouri-latest-updates-5-october-2026',
  // Morocco
  'morocco-ev-gigafactory-automotive-boom-2026': 'mor-ev-gigafactory-automotive-2026',
  'morocco-world-cup-2030-hassan-ii-grand-stadium-infrastructure': 'mor-world-cup-2030-mega-stadium-hassan2',
  // Algeria
  'algeria-gara-djebilet-iron-mine-railway-steel-boom': 'alg-gara-djebilet-iron-railway-2026',
  'algeria-green-hydrogen-renewable-energy-south2-corridor': 'alg-green-hydrogen-sout-h2-europe-2026',
  // Tunisia
  'tunisia-startups-ai-innovation-hub-strategy-2026': 'tun-startups-ai-digital-transformation-2026',
  'tunisia-olive-oil-exports-eco-tourism-record-season': 'tun-olive-oil-record-exports-eco-tourism-2026',
  // Libya
  'libya-national-reconstruction-plan-infrastructure-mega-projects': 'lby-reconstruction-plan-infrastructure-investments-2026',
  'libya-oil-production-two-million-barrels-solar-transition': 'lby-oil-production-expansion-solar-energy-2026',
  // Mauritania
  'mauritania-gta-lng-export-historic-economic-transformation': 'mrt-gta-lng-gas-export-economic-boom-2026',
  'mauritania-aman-green-hydrogen-renewable-energy-hub': 'mrt-aman-green-hydrogen-mega-hub-2026',
  // Egypt
  'egypt-new-administrative-capital-monorail-smart-governance': 'egy-new-administrative-capital-monorail-2026',
  'egypt-suez-canal-economic-zone-green-hydrogen-investments': 'egy-sczone-suez-canal-green-hydrogen-hub-2026',
  // Saudi
  'saudi-vision-2030-decade-of-achievements-economic-transformation': 'sau-vision-2030-decade-of-transformation-2026',
  'saudi-arabia-40-billion-ai-fund-supercomputing-global-hub': 'sau-ai-supercomputing-global-hub-riyadh-2026',
  // UAE
  'uae-future-economy-2031-digital-trade-fintech-boom': 'uae-future-economy-2031-trade-fintech-2026',
  'uae-space-exploration-barakah-nuclear-energy-leadership': 'uae-space-missions-barakah-nuclear-clean-energy-2026',
  // Qatar
  'qatar-north-field-lng-mega-expansion-energy-security': 'qat-north-field-lng-mega-expansion-energy-2026',
  'qatar-third-national-development-strategy-lusail-smart-cities': 'qat-national-strategy-2030-smart-cities-lusail-2026',
  // Kuwait
  'kuwait-mubarak-al-kabeer-port-silk-city-mega-project': 'kwt-mubarak-port-silk-city-economic-corridor-2026',
  'kuwait-shagaya-renewable-energy-park-solar-wind-transition': 'kwt-shagaya-renewable-energy-strategy-2026',
  // Oman
  'oman-vision-2040-duqm-port-special-economic-zone-success': 'omn-vision-2040-duqm-economic-turnaround-2026',
  'oman-green-hydrogen-global-hub-hydrom-mega-contracts': 'omn-green-hydrogen-global-export-hub-hydrom-2026',
  // Bahrain
  'bahrain-fintech-bay-open-banking-crypto-capital-middle-east': 'bhr-fintech-hub-open-banking-crypto-2026',
  'bahrain-king-hamad-causeway-metro-mega-infrastructure': 'bhr-king-hamad-causeway-metro-infrastructure-2026',
};

/**
 * Robust search to find an article by slug or ID
 */
export function findArticleBySlugOrId(articles: Article[], rawSlugOrId: string): Article | undefined {
  if (!rawSlugOrId) return undefined;

  let decoded = rawSlugOrId.trim();
  try {
    decoded = decodeURIComponent(rawSlugOrId).trim();
  } catch {
    decoded = rawSlugOrId.trim();
  }

  const normalizedQuery = decoded.toLowerCase();

  // 1. Check known aliases
  const targetId = KNOWN_SLUG_ALIASES[normalizedQuery];
  if (targetId) {
    const aliasedArticle = articles.find((a) => a.id === targetId || a.slug === targetId);
    if (aliasedArticle) return aliasedArticle;
  }

  // 2. Direct slug match (case-insensitive)
  let found = articles.find((a) => a.slug && a.slug.toLowerCase() === normalizedQuery);
  if (found) return found;

  // 3. Direct ID match (case-insensitive)
  found = articles.find((a) => a.id.toLowerCase() === normalizedQuery);
  if (found) return found;

  // 4. Encoded slug comparison
  found = articles.find((a) => {
    if (!a.slug) return false;
    const encoded = encodeURIComponent(a.slug).toLowerCase();
    return encoded === normalizedQuery || encoded === encodeURIComponent(normalizedQuery).toLowerCase();
  });
  if (found) return found;

  // 5. Title slug match (allowing users to access /article/عنوان-المقال)
  found = articles.find((a) => {
    const generatedSlug = generateArticleSlug(a.title);
    return (
      generatedSlug.toLowerCase() === normalizedQuery ||
      encodeURIComponent(generatedSlug).toLowerCase() === normalizedQuery
    );
  });
  if (found) return found;

  // 6. Loose match without dashes
  const queryNoDashes = normalizedQuery.replace(/[-_]/g, '');
  found = articles.find((a) => {
    const slugNoDashes = (a.slug || '').toLowerCase().replace(/[-_]/g, '');
    const idNoDashes = a.id.toLowerCase().replace(/[-_]/g, '');
    return slugNoDashes === queryNoDashes || idNoDashes === queryNoDashes;
  });

  return found;
}

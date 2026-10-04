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

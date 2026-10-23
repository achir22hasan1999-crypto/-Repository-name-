import { Article, Category, Country } from '../types';

/**
 * High quality curated fallback images for Arab and Maghreb news categories
 */
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  cooking: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=80',
  agency: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  ai: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  economy: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
  sports: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  culture: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80',
  society: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  morocco: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
  algeria: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
  tunisia: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
  libya: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
  mauritania: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  gulf: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  saudi: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
  uae: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  world: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Intelligent topic-aware fallback image selector
 */
export function getFallbackArticleImage(article?: Partial<Article>): string {
  if (!article) {
    return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';
  }

  const title = (article.title || '').toLowerCase();

  // 1. Topic-specific keyword detection
  if (title.includes('قمر اصطناعي') || title.includes('فضائي') || title.includes('فضاء') || title.includes('satellite')) {
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('مطار') || title.includes('ملاحة') || title.includes('طيران') || title.includes('airport')) {
    return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('حرفية') || title.includes('نسيج') || title.includes('زربية') || title.includes('فخار') || title.includes('تقليدي') || title.includes('معرض الجزائر')) {
    return 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('صيد') || title.includes('أسماك') || title.includes('بحر') || title.includes('موريتانيا')) {
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('جامعة') || title.includes('أكاديمي') || title.includes('بحث علمي') || title.includes('زراعة ذكية')) {
    return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('فوتسال') || title.includes('كرة قدم') || title.includes('مونديال') || title.includes('ملعب')) {
    return 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('طنجية') || title.includes('حريرة') || title.includes('كسكس') || title.includes('طبخ') || title.includes('وصفة')) {
    return 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=80';
  }
  if (title.includes('كاش') || title.includes('وكالة') || title.includes('مشروع')) {
    return 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80';
  }

  // 2. Category / Country match
  if (article.category && CATEGORY_FALLBACK_IMAGES[article.category]) {
    return CATEGORY_FALLBACK_IMAGES[article.category];
  }

  if (article.country && CATEGORY_FALLBACK_IMAGES[article.country]) {
    return CATEGORY_FALLBACK_IMAGES[article.country];
  }

  return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';
}

/**
 * Resolves an article image URL, fixing relative dev paths like /src/assets/images/...
 */
export function resolveArticleImageUrl(rawUrl?: string, article?: Partial<Article>): string {
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '' || rawUrl.includes('placeholder')) {
    return getFallbackArticleImage(article);
  }

  const trimmed = rawUrl.trim();

  // If path is a local /src/assets/images/... reference, rewrite to /assets/images/...
  if (trimmed.startsWith('/src/assets/images/')) {
    return trimmed.replace('/src/assets/images/', '/assets/images/');
  }

  return trimmed;
}

import { Article, Category, Country } from '../types';

/**
 * High quality curated fallback images for Arab and Maghreb news categories
 */
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  cooking: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=80',
  agency: '/assets/images/wafacash_agency_morocco.jpg',
  tech: '/assets/images/tunisia_carthage_tech_1790615024218.jpg',
  ai: '/assets/images/tunisia_carthage_tech_1790615024218.jpg',
  economy: '/assets/images/morocco_solar_energy_1790615012294.jpg',
  sports: '/assets/images/fifa_worldcup_stadium_2030.jpg',
  culture: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80',
  society: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  morocco: '/assets/images/unsc_sahara_draft_2026.jpg',
  algeria: '/assets/images/morocco_algeria_relations.jpg',
  tunisia: '/assets/images/tunisia_carthage_tech_1790615024218.jpg',
  libya: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
  mauritania: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  gulf: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  saudi: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
  uae: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  world: '/assets/images/unsc_sahara_draft_2026.jpg',
};

/**
 * Intelligent topic-aware fallback image selector
 */
export function getFallbackArticleImage(article?: Partial<Article>): string {
  if (!article) {
    return '/assets/images/fifa_worldcup_stadium_2030.jpg';
  }

  const title = (article.title || '').toLowerCase();

  // 1. Topic-specific keyword detection
  if (title.includes('بوتين') || title.includes('المنصوري') || title.includes('mansouri') || title.includes('putin')) {
    return '/assets/images/putin_mansouri_russia_africa_summit.jpg';
  }
  if (title.includes('مبابي') || title.includes('mbappe')) {
    return '/assets/images/mbappe_china_sponsorship_loss.jpg';
  }
  if (title.includes('ميسي') || title.includes('كرة ذهبية') || title.includes('ballon')) {
    return '/assets/images/messi_ballon_dor_2026.jpg';
  }
  if (title.includes('مونديال') || title.includes('فيفا') || title.includes('ملعب') || title.includes('كرة قدم') || title.includes('فوتسال') || title.includes('رياضة') || title.includes('الرجاء') || title.includes('الوداد')) {
    return '/assets/images/fifa_worldcup_stadium_2030.jpg';
  }
  if (title.includes('صحراء') || title.includes('مينورسو') || title.includes('مجلس أمن') || title.includes('حكم ذاتي')) {
    return '/assets/images/unsc_sahara_draft_2026.jpg';
  }
  if (title.includes('ملك') || title.includes('برقية') || title.includes('محمد السادس') || title.includes('أردني') || title.includes('البرلمان')) {
    return '/assets/images/king_parliament_morocco_opening_1791484769185.jpg';
  }
  if (title.includes('طاقة') || title.includes('شمسية') || title.includes('اقتصاد') || title.includes('غاز') || title.includes('نفط') || title.includes('استثمار')) {
    return '/assets/images/morocco_solar_energy_1790615012294.jpg';
  }
  if (title.includes('كاش') || title.includes('بنك') || title.includes('وفاكاش') || title.includes('تسهيلات') || title.includes('تحويل أموال')) {
    return '/assets/images/wafacash_agency_morocco.jpg';
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

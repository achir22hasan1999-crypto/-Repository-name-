export type Country = 
  | 'morocco' 
  | 'algeria' 
  | 'tunisia' 
  | 'libya' 
  | 'mauritania' 
  | 'saudi'
  | 'uae'
  | 'qatar'
  | 'kuwait'
  | 'oman'
  | 'bahrain'
  | 'gulf'
  | 'iraq'
  | 'jordan'
  | 'lebanon'
  | 'palestine'
  | 'yemen'
  | 'sudan'
  | 'somalia'
  | 'djibouti'
  | 'syria'
  | 'egypt'
  | 'comoros'
  | 'arab' 
  | 'world' 
  | 'all';

export type Category = 
  | 'all'
  | 'morocco'
  | 'algeria'
  | 'tunisia'
  | 'libya'
  | 'mauritania'
  | 'gulf'
  | 'saudi'
  | 'uae'
  | 'qatar'
  | 'kuwait'
  | 'oman'
  | 'bahrain'
  | 'iraq'
  | 'jordan'
  | 'lebanon'
  | 'palestine'
  | 'yemen'
  | 'sudan'
  | 'somalia'
  | 'djibouti'
  | 'syria'
  | 'egypt'
  | 'comoros'
  | 'arab'
  | 'world'
  | 'economy'
  | 'sports'
  | 'tech'
  | 'society'
  | 'culture'
  | 'cooking'
  | 'agency'
  | 'ai'
  | 'video'
  | 'variety';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface RecipeData {
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  calories?: string;
  ingredients: string[];
  instructions: string[];
  category: string;
  chefTips?: string;
  isoPrepTime?: string;
  isoCookTime?: string;
  isoTotalTime?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  leadImage: string;
  imageCaption?: string;
  altText?: string;
  country: Country;
  category: Category;
  contentType?: 'news' | 'article' | 'recipe';
  recipeData?: RecipeData;
  city?: string;
  isBreaking: boolean;
  isLead?: boolean;
  publishDate: string;
  updatedDate?: string;
  scheduledFor?: string;
  publishStatus?: 'published' | 'scheduled' | 'draft';
  isAutoPublished?: boolean;
  author: Author | any;
  source: string;
  sourceUrl?: string;
  sourceDate?: string;
  facts?: string[];
  faq?: any[];
  tags: string[];
  keywords?: string[];
  focusKeyword?: string;
  readsCount: number;
  views?: number;
  likesCount: number;
  likes?: number;
  commentsCount: number;
  videoUrl?: string;
  videoDuration?: string;
  audioLengthMinutes?: number;
  trendingKeywords?: string[];
  wordCount?: number;
  readingTimeMinutes?: number;
  readTime?: string;
  publishedAt?: string;
  imageUrl?: string;
  reactions?: Record<string, number>;
  seo?: SEOData;
}

export interface AutoPublishConfig {
  enabled: boolean;
  publishTime: string; // e.g. "09:00"
  frequency: 'once_daily' | 'twice_daily' | 'thrice_daily';
  categories: Category[];
  autoQueueRefill: boolean;
  lastRunDate?: string;
  notifyOnPublish: boolean;
}

export interface AutoPublishLog {
  id: string;
  articleId: string;
  articleTitle: string;
  category: Category;
  publishedAt: string;
  scheduledFor: string;
  readsCount?: number;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  country?: string;
  date: string;
  content: string;
  likes: number;
}

export interface RssFeedItem {
  id: string;
  title: string;
  source: string;
  sourceAgency: string;
  country: Country;
  category: Category;
  originalSummary: string;
  editorialSummary: string;
  date: string;
  originalUrl: string;
  status: 'pending' | 'published' | 'dismissed';
  imageUrl?: string;
}

export type ViewMode = 
  | 'home'
  | 'category'
  | 'country'
  | 'article'
  | 'admin'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'cookies'
  | 'terms'
  | 'disclaimer'
  | 'corrections'
  | 'copyright'
  | 'author'
  | 'seo-tools'
  | '404';


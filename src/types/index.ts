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
  author: Author;
  source: string;
  sourceUrl?: string;
  sourceDate?: string;
  facts?: string[];
  tags: string[];
  focusKeyword?: string;
  readsCount: number;
  likesCount: number;
  commentsCount: number;
  videoUrl?: string;
  videoDuration?: string;
  audioLengthMinutes?: number;
  wordCount?: number;
  seo: SEOData;
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


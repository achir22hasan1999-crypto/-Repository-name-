export type Country = 'morocco' | 'algeria' | 'tunisia' | 'libya' | 'mauritania' | 'arab' | 'world' | 'all';

export type Category = 
  | 'all'
  | 'morocco'
  | 'algeria'
  | 'tunisia'
  | 'libya'
  | 'mauritania'
  | 'arab'
  | 'world'
  | 'economy'
  | 'sports'
  | 'tech'
  | 'society'
  | 'video'
  | 'variety';

export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  leadImage: string;
  imageCaption?: string;
  country: Country;
  category: Category;
  isBreaking: boolean;
  isLead?: boolean;
  publishDate: string;
  scheduledFor?: string;
  author: Author;
  source: string;
  sourceUrl?: string;
  tags: string[];
  readsCount: number;
  likesCount: number;
  commentsCount: number;
  videoUrl?: string;
  videoDuration?: string;
  audioLengthMinutes?: number;
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
  | 'seo-tools';

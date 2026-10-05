import React, { useState } from 'react';
import { Clock, Eye, Play, Sparkles } from 'lucide-react';
import { Article } from '../types';
import { CATEGORIES_CONFIG, ARAB_COUNTRIES } from '../data/initialArticles';
import { formatSafeArabicDate } from '../utils/dateFormatter';
import { getArticleUrl } from '../utils/slugUtils';

interface ArticleCardProps {
  article: Article;
  variant?: 'lead' | 'standard' | 'horizontal' | 'compact' | 'video';
  index?: number;
  onOpen: (id: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
  index,
  onOpen,
}) => {
  const [imgError, setImgError] = useState(false);

  const getCountryName = (c: string) => {
    const match = ARAB_COUNTRIES.find((item: any) => item.id === c);
    return match ? `${match.flag} ${match.shortName || match.name}` : 'العالم العربي';
  };

  const getCategoryLabel = (cat: string) => {
    const match = CATEGORIES_CONFIG.find((item) => item.id === cat);
    return match ? match.label : cat;
  };

  const formattedDate = formatSafeArabicDate(article.publishDate);
  const articleUrl = getArticleUrl(article);

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) {
      return; // let native new tab behavior occur
    }
    e.preventDefault();
    onOpen(article.id);
  };

  // --- Lead Variant ---
  if (variant === 'lead') {
    return (
      <article
        onClick={handleClick}
        className="group cursor-pointer bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden transition-all hover:shadow-md"
      >
        <a href={articleUrl} onClick={handleClick} className="block relative aspect-[16/9] w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
          {!imgError ? (
            <img
              src={article.leadImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-stone-800 to-stone-950 text-white">
              <span className="text-xl font-bold font-['Cairo']">{article.title}</span>
            </div>
          )}

          {article.isBreaking && (
            <div className="absolute top-4 right-4 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded shadow-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>عاجل</span>
            </div>
          )}
        </a>

        <div className="p-6">
          {/* Zero-Pill Metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
            <span className="font-semibold text-red-700 dark:text-red-400">
              {getCountryName(article.country)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{getCategoryLabel(article.category)}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50 leading-snug font-['Cairo'] group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2">
            <a href={articleUrl} onClick={handleClick} className="hover:underline">
              {article.title}
            </a>
          </h2>

          <p className="mt-3 text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed line-clamp-3">
            {article.summary}
          </p>

          <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-2">
              {article.author?.avatar && (
                <img
                  src={article.author.avatar}
                  alt={article.author.name || 'المحرر'}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span className="font-medium text-stone-800 dark:text-stone-200">
                {article.author?.name || 'فريق التحرير'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {(article.readsCount ?? 0).toLocaleString('ar-MA')}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // --- Horizontal Variant (for feed & list) ---
  if (variant === 'horizontal') {
    return (
      <article
        onClick={handleClick}
        className="group cursor-pointer bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 pb-4 mb-4 last:border-0 flex flex-col sm:flex-row gap-4 items-start"
      >
        <a href={articleUrl} onClick={handleClick} className="w-full sm:w-44 h-32 shrink-0 rounded overflow-hidden bg-stone-200 dark:bg-stone-800 relative block">
          {!imgError ? (
            <img
              src={article.leadImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-300 dark:bg-stone-800 text-stone-500 text-xs">
              صورة الخبر
            </div>
          )}
          {article.isBreaking && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              عاجل
            </span>
          )}
        </a>

        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            <span className="font-bold text-red-700 dark:text-red-400">
              {getCountryName(article.country)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{getCategoryLabel(article.category)}</span>
            <span aria-hidden="true">·</span>
            <span>{formattedDate}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
            <a href={articleUrl} onClick={handleClick} className="hover:underline">
              {article.title}
            </a>
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>

          <div className="mt-2 text-xs text-stone-400 flex items-center gap-3">
            <span>بقلم: {article.author?.name || 'فريق التحرير'}</span>
            <span aria-hidden="true">·</span>
            <span>{(article.readsCount ?? 0).toLocaleString('ar-MA')} مشاهدة</span>
          </div>
        </div>
      </article>
    );
  }

  // --- Compact Variant (e.g. for "أكثر قراءة" with editorial numbering) ---
  if (variant === 'compact') {
    return (
      <article
        onClick={handleClick}
        className="group cursor-pointer py-3 border-b border-stone-200 dark:border-stone-800 last:border-0 flex items-start gap-3"
      >
        {typeof index === 'number' && (
          <span className="font-mono text-2xl font-black text-stone-300 dark:text-stone-700 group-hover:text-red-600 transition-colors shrink-0 w-8 text-center">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mb-1">
            <span className="font-semibold text-stone-600 dark:text-stone-300">
              {getCountryName(article.country)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formattedDate}</span>
          </div>
          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
            <a href={articleUrl} onClick={handleClick} className="hover:underline">
              {article.title}
            </a>
          </h4>
        </div>
      </article>
    );
  }

  // --- Video Variant ---
  if (variant === 'video') {
    return (
      <article
        onClick={handleClick}
        className="group cursor-pointer bg-stone-900 text-white rounded-lg overflow-hidden border border-stone-800 transition-all hover:border-red-600"
      >
        <a href={articleUrl} onClick={handleClick} className="relative aspect-video w-full overflow-hidden bg-stone-950 block">
          <img
            src={article.leadImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-current mr-0.5" />
            </div>
          </div>
          {article.videoDuration && (
            <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
              {article.videoDuration}
            </span>
          )}
        </a>
        <div className="p-4">
          <div className="text-xs text-red-400 font-bold mb-1">
            {getCountryName(article.country)} · فيديو
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
            <a href={articleUrl} onClick={handleClick} className="hover:underline">
              {article.title}
            </a>
          </h3>
        </div>
      </article>
    );
  }

  // --- Standard Grid Card (Default) ---
  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden flex flex-col transition-all hover:shadow-md"
    >
      <a href={articleUrl} onClick={handleClick} className="relative aspect-[16/10] w-full overflow-hidden bg-stone-200 dark:bg-stone-800 block">
        {!imgError ? (
          <img
            src={article.leadImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-200 dark:bg-stone-800 text-stone-500 text-xs">
            صورة الخبر
          </div>
        )}
        {article.isBreaking && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            عاجل
          </span>
        )}
      </a>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-2">
            <span className="font-bold text-red-700 dark:text-red-400">
              {getCountryName(article.country)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{getCategoryLabel(article.category)}</span>
            <span aria-hidden="true">·</span>
            <span>{formattedDate}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
            <a href={articleUrl} onClick={handleClick} className="hover:underline">
              {article.title}
            </a>
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
          <span>{article.author?.name || 'فريق التحرير'}</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {(article.readsCount ?? 0).toLocaleString('ar-MA')}
          </span>
        </div>
      </div>
    </article>
  );
};

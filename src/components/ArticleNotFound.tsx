import React from 'react';
import { FileQuestion, Home, Search, ArrowRight, Clock, Newspaper } from 'lucide-react';
import { Article } from '../types';
import { getArticleUrl } from '../utils/slugUtils';

interface ArticleNotFoundProps {
  requestedSlug: string;
  articles: Article[];
  onOpenArticle: (id: string) => void;
  onBackToHome: () => void;
  onSearch?: (query: string) => void;
}

export const ArticleNotFound: React.FC<ArticleNotFoundProps> = ({
  requestedSlug,
  articles,
  onOpenArticle,
  onBackToHome,
  onSearch,
}) => {
  const [searchInput, setSearchInput] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && onSearch) {
      onSearch(searchInput.trim());
    }
  };

  const suggestedArticles = articles.slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 font-['Tajawal'] text-right">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-12 shadow-sm text-center">
        {/* Error Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center justify-center mb-6 shadow-inner">
          <FileQuestion className="w-9 h-9 sm:w-11 sm:h-11" />
        </div>

        <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 rounded-full text-xs font-bold font-mono mb-3">
          خطأ 404 · مقال غير موجود
        </span>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white font-['Cairo'] mb-4">
          عذراً، المقال المطلوب غير متوفر حالياً
        </h1>

        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6">
          قد يكون الرابط الذي اتبعته غير صحيح أو تم تحديث الرابط الدائم للمقال. يمكنك البحث عن الموضوع أو تصفح أحدث أخبار البوابة.
        </p>

        {requestedSlug && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs text-stone-500 font-mono mb-8 max-w-full overflow-hidden text-ellipsis">
            <span>الرابط المطلوب:</span>
            <span className="text-red-600 dark:text-red-400 truncate dir-ltr">/article/{requestedSlug}</span>
          </div>
        )}

        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto mb-8 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث في أرشيف الأخبار والمقالات..."
              className="w-full px-4 py-3 pr-10 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>بحث</span>
          </button>
        </form>

        {/* Action Button to Home */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onBackToHome();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 dark:bg-stone-100 hover:bg-red-700 dark:hover:bg-red-600 text-white dark:text-stone-900 dark:hover:text-white rounded-xl text-sm font-bold transition shadow-xs cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>العودة للصفحة الرئيسية</span>
          </a>
        </div>

        {/* Suggested Recent Articles */}
        <div className="pt-8 border-t border-stone-200 dark:border-stone-800 text-right">
          <h2 className="text-base sm:text-lg font-bold font-['Cairo'] text-stone-900 dark:text-white flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5 text-red-600" />
            <span>أحدث المقالات والأخبار المقترحة للقراءة:</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestedArticles.map((art) => (
              <a
                key={art.id}
                href={getArticleUrl(art)}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenArticle(art.id);
                }}
                className="group p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-red-600 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition flex items-start gap-3 cursor-pointer text-right"
              >
                <img
                  src={art.leadImage}
                  alt={art.title}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-stone-400 mb-1 flex items-center gap-1.5">
                    <span className="text-red-700 dark:text-red-400 font-bold">{art.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(art.publishDate).toLocaleDateString('ar-MA')}</span>
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-red-600 line-clamp-2 leading-snug">
                    {art.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

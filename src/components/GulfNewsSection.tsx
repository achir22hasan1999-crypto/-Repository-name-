import React, { useState } from 'react';
import { 
  Flame, 
  TrendingUp, 
  MapPin, 
  Eye, 
  Calendar, 
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Share2,
  Building2
} from 'lucide-react';
import { Article, Country } from '../types';
import { GULF_COUNTRIES } from '../data/initialArticles';
import { getArticleUrl } from '../utils/slugUtils';

interface GulfNewsSectionProps {
  articles: Article[];
  onOpenArticle: (id: string) => void;
  onSelectCountry?: (country: Country) => void;
  variant?: 'full' | 'sidebar';
}

export const GulfNewsSection: React.FC<GulfNewsSectionProps> = ({
  articles,
  onOpenArticle,
  onSelectCountry,
  variant = 'full',
}) => {
  const [selectedGulfCountry, setSelectedGulfCountry] = useState<string>('all');

  // Filter only Gulf articles (countries: saudi, uae, qatar, kuwait, oman, bahrain)
  const gulfArticles = articles.filter((a) =>
    ['saudi', 'uae', 'qatar', 'kuwait', 'oman', 'bahrain'].includes(a.country)
  );

  const displayedArticles = selectedGulfCountry === 'all'
    ? gulfArticles
    : gulfArticles.filter((a) => a.country === selectedGulfCountry);

  const activeCountryData = GULF_COUNTRIES.find((c) => c.id === selectedGulfCountry);

  // If sidebar variant (compact widget)
  if (variant === 'sidebar') {
    return (
      <aside className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-stone-900 dark:text-white font-['Cairo']">
              أخبار الخليج العربي الرائجة 🌴
            </h3>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold">
            رائج الآن
          </span>
        </div>

        {/* Gulf Country Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 mb-4">
          <button
            onClick={() => setSelectedGulfCountry('all')}
            className={`px-2 py-1 text-xs font-bold rounded text-center transition ${
              selectedGulfCountry === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            الكل (12)
          </button>
          {GULF_COUNTRIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedGulfCountry(c.id)}
              className={`px-2 py-1 text-xs font-bold rounded flex items-center justify-center gap-1 transition ${
                selectedGulfCountry === c.id
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>{c.flag}</span>
              <span className="truncate">{c.shortName}</span>
            </button>
          ))}
        </div>

        {/* Compact Articles List */}
        <div className="space-y-3">
          {displayedArticles.slice(0, 6).map((item) => (
            <article
              key={item.id}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onOpenArticle(item.id);
                }
              }}
              className="group cursor-pointer flex gap-3 p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/60 transition border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
            >
              <a
                href={getArticleUrl(item)}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    e.preventDefault();
                    onOpenArticle(item.id);
                  }
                }}
                className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-md overflow-hidden bg-stone-100 dark:bg-stone-800 relative block"
              >
                <img
                  src={item.leadImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <span className="absolute bottom-1 right-1 text-xs bg-black/70 text-white px-1 rounded text-[10px]">
                  {GULF_COUNTRIES.find((c) => c.id === item.country)?.flag}
                </span>
              </a>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400 font-bold mb-1">
                  <Flame className="w-3 h-3 text-red-600 animate-pulse" />
                  <span>{item.city || 'الخليج'}</span>
                  <span className="text-stone-300 dark:text-stone-700">·</span>
                  <span className="text-stone-500 text-[10px]">
                    {item.readsCount} مشاهدة
                  </span>
                </div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-red-700 line-clamp-2 leading-snug">
                  <a
                    href={getArticleUrl(item)}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault();
                        onOpenArticle(item.id);
                      }
                    }}
                    className="hover:underline"
                  >
                    {item.title}
                  </a>
                </h4>
              </div>
            </article>
          ))}
        </div>
      </aside>
    );
  }

  // Full section variant (for Homepage main flow)
  return (
    <section className="my-14 font-['Tajawal']">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-3 border-b-2 border-amber-600">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-8 bg-amber-600 inline-block rounded-xs"></span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-['Cairo'] flex items-center gap-2">
              <span>أخبار دول الخليج العربي الرائجة</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold">
                تغطية خاصة 🔥
              </span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              متابعة حية لأبرز المشاريع التنموية، الاقتصاد الرقمي، والطاقة النظيفة في دول مجلس التعاون (مقالان رائج لكل دولة)
            </p>
          </div>
        </div>

        {/* Gulf Country Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedGulfCountry('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition shrink-0 ${
              selectedGulfCountry === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
            }`}
          >
            جميع دول الخليج ({gulfArticles.length})
          </button>
          {GULF_COUNTRIES.map((c) => {
            const count = gulfArticles.filter((a) => a.country === c.id).length;
            const isSelected = selectedGulfCountry === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedGulfCountry(c.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.shortName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-red-900 text-red-100' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Country banner if specific country is selected */}
      {activeCountryData && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeCountryData.flag}</span>
            <div>
              <h3 className="font-black text-stone-900 dark:text-white font-['Cairo'] text-base">
                {activeCountryData.name}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                العاصمة: <span className="font-semibold text-stone-800 dark:text-stone-200">{activeCountryData.capital}</span> · 
                العملة: <span className="font-semibold text-stone-800 dark:text-stone-200">{activeCountryData.currency}</span>
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-stone-950">
            أبرز خبرين رائجين اليوم 🔥
          </span>
        </div>
      )}

      {/* Grid of 2 Trending Articles per country (or all 12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedArticles.map((item) => {
          const countryInfo = GULF_COUNTRIES.find((c) => c.id === item.country);
          return (
            <article
              key={item.id}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onOpenArticle(item.id);
                }
              }}
              className="group cursor-pointer bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden hover:shadow-lg transition duration-200 flex flex-col justify-between"
            >
              <div>
                <a
                  href={getArticleUrl(item)}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      onOpenArticle(item.id);
                    }
                  }}
                  className="relative aspect-video overflow-hidden bg-stone-100 dark:bg-stone-800 block"
                >
                  <img
                    src={item.leadImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-xs">
                    <span>{countryInfo?.flag}</span>
                    <span>{countryInfo?.shortName}</span>
                  </div>
                  <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 animate-pulse" />
                    خبر رائج
                  </span>
                  {item.city && (
                    <span className="absolute bottom-2 right-2 bg-stone-900/80 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.city}
                    </span>
                  )}
                </a>

                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base group-hover:text-red-700 dark:group-hover:text-red-400 transition line-clamp-2 mb-2 font-['Cairo'] leading-snug">
                    <a
                      href={getArticleUrl(item)}
                      onClick={(e) => {
                        if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                          e.preventDefault();
                          onOpenArticle(item.id);
                        }
                      }}
                      className="hover:underline"
                    >
                      {item.title}
                    </a>
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed mb-3">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-stone-100 dark:border-stone-800/60 mt-auto flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-medium text-stone-700 dark:text-stone-300">
                  {item.author.name}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Eye className="w-3.5 h-3.5 text-stone-400" />
                  {item.readsCount}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { 
  Flame, 
  TrendingUp, 
  Clock, 
  ChevronLeft, 
  Sparkles, 
  Eye, 
  Compass, 
  Filter,
  CheckCircle,
  Share2
} from 'lucide-react';
import { Article, Category, Country } from '../types';
import { ArticleCard } from './ArticleCard';
import { AdSenseBanner } from './AdSenseBanner';
import { VideoSection } from './VideoSection';
import { CATEGORIES_CONFIG, MAGHREB_COUNTRIES } from '../data/initialArticles';

interface HomePageProps {
  articles: Article[];
  currentCategory: Category;
  selectedCountry: Country;
  searchQuery: string;
  onOpenArticle: (id: string) => void;
  onSelectCategory: (cat: Category) => void;
  onSelectCountry: (c: Country) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  articles,
  currentCategory,
  selectedCountry,
  searchQuery,
  onOpenArticle,
  onSelectCategory,
  onSelectCountry,
}) => {
  const [countryFilterTab, setCountryFilterTab] = useState<Country>('all');

  // Filter articles based on search, category, and country
  let filtered = [...articles];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.author.name.toLowerCase().includes(q)
    );
  } else if (currentCategory !== 'all') {
    filtered = filtered.filter(
      (a) => a.category === currentCategory || a.country === (currentCategory as any)
    );
  }

  // Active country tab filter on homepage
  const countryArticles = (c: Country) =>
    articles.filter((a) => a.country === c);

  // Sorting
  const leadArticle = articles.find((a) => a.isLead) || articles[0];
  const breakingNews = articles.filter((a) => a.isBreaking);
  const mostReadArticles = [...articles].sort((a, b) => b.readsCount - a.readsCount).slice(0, 5);
  const latestArticles = [...articles].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  // Department blocks
  const economyArticles = articles.filter((a) => a.category === 'economy');
  const sportsArticles = articles.filter((a) => a.category === 'sports');
  const techArticles = articles.filter((a) => a.category === 'tech');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-['Tajawal']">
      {/* 1. Top Google AdSense Leaderboard Banner */}
      <AdSenseBanner slot="top-leaderboard" />

      {/* If search query is active, show Search Results view */}
      {searchQuery.trim() ? (
        <section className="my-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200 dark:border-stone-800">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-['Cairo']">
              نتائج البحث عن: <span className="text-red-700">"{searchQuery}"</span>
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              ({filtered.length} نتيجة)
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
              <p className="text-stone-500 text-sm">
                لم نتمكن من العثور على مقالات مطابقة لبحثك. جرب استخدام كلمات عامة مثل "المغرب"، "طاقة"، أو "اقتصاد".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <ArticleCard
                  key={item.id}
                  article={item}
                  variant="standard"
                  onOpen={onOpenArticle}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* 2. Top Hero Section: Dominant Lead Story + 2 Side Features + Breaking Rail */}
          <section className="mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Lead Headline Story (8 cols) */}
              <div className="lg:col-span-8">
                {leadArticle && (
                  <ArticleCard
                    article={leadArticle}
                    variant="lead"
                    onOpen={onOpenArticle}
                  />
                )}
              </div>

              {/* Side Stories & Breaking Stream (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200 dark:border-stone-800">
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5 font-['Cairo']">
                      <Flame className="w-4 h-4 text-red-600" />
                      <span>آخر الأخبار والمستجدات</span>
                    </h3>
                    <span className="text-[11px] text-stone-400 font-mono">تحديث مستمر</span>
                  </div>

                  <div className="space-y-1">
                    {latestArticles.slice(1, 5).map((item, idx) => (
                      <ArticleCard
                        key={item.id}
                        article={item}
                        variant="compact"
                        index={idx}
                        onOpen={onOpenArticle}
                      />
                    ))}
                  </div>
                </div>

                {/* Sidebar AdSense Placement */}
                <AdSenseBanner slot="sidebar" />
              </div>
            </div>
          </section>

          {/* 3. Section: أخبار كل دولة من دول المغرب العربي (Interactive Country Deck) */}
          <section className="my-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-2 border-b-2 border-stone-900 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <span className="w-3 h-7 bg-red-700 rounded-xs"></span>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-['Cairo']">
                  أخبار بلدان المغرب العربي
                </h2>
              </div>

              {/* Country Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setCountryFilterTab('all')}
                  className={`px-3 py-1 text-xs font-bold rounded transition ${
                    countryFilterTab === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
                  }`}
                >
                  الكل
                </button>
                {MAGHREB_COUNTRIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCountryFilterTab(c.id as Country)}
                    className={`px-3 py-1 text-xs font-bold rounded transition flex items-center gap-1 ${
                      countryFilterTab === c.id
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Country News Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(countryFilterTab === 'all'
                ? articles.filter((a) => a.id !== leadArticle?.id).slice(0, 6)
                : countryArticles(countryFilterTab)
              ).map((item) => (
                <ArticleCard
                  key={item.id}
                  article={item}
                  variant="standard"
                  onOpen={onOpenArticle}
                />
              ))}
            </div>
          </section>

          {/* 4. Between-Sections Billboard AdSense */}
          <AdSenseBanner slot="between-sections" />

          {/* 5. Section: أكثر الأخبار قراءة & التغطية الميدانية */}
          <section className="my-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left/Main Column: Latest Chronological Stream (8 cols) */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-6 bg-red-700 rounded-xs"></span>
                    <h3 className="text-xl font-black text-stone-900 dark:text-white font-['Cairo']">
                      تغطيات وتقارير متتابعة
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {latestArticles.slice(2, 6).map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      variant="horizontal"
                      onOpen={onOpenArticle}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: الأكثر قراءة (4 cols) */}
              <div className="lg:col-span-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200 dark:border-stone-800">
                  <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2 font-['Cairo']">
                    <TrendingUp className="w-4 h-4 text-red-700" />
                    <span>الأكثر قراءة اليوم</span>
                  </h3>
                  <span className="text-xs text-stone-400">تحديث حي</span>
                </div>

                <div className="space-y-2">
                  {mostReadArticles.map((art, idx) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      variant="compact"
                      index={idx}
                      onOpen={onOpenArticle}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 6. Video Hub Section (قسم الفيديو والوثائقيات) */}
          <VideoSection articles={articles} onOpenArticle={onOpenArticle} />

          {/* 7. Department Blocks: اقتصاد وأعمال + رياضة + تكنولوجيا */}
          <section className="my-14 space-y-12">
            {/* Economy Block */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-6 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-amber-600 rounded-xs"></span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-white font-['Cairo']">
                    اقتصاد وأعمال المغرب العربي
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('economy')}
                  className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <span>عرض المزيد</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(economyArticles.length > 0 ? economyArticles : articles.slice(0, 3)).slice(0, 3).map((item) => (
                  <ArticleCard
                    key={item.id}
                    article={item}
                    variant="standard"
                    onOpen={onOpenArticle}
                  />
                ))}
              </div>
            </div>

            {/* Sports Block */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-6 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-emerald-600 rounded-xs"></span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-white font-['Cairo']">
                    رياضة مغاربية ودولية
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('sports')}
                  className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <span>عرض المزيد</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(sportsArticles.length > 0 ? sportsArticles : articles.slice(3, 6)).slice(0, 3).map((item) => (
                  <ArticleCard
                    key={item.id}
                    article={item}
                    variant="standard"
                    onOpen={onOpenArticle}
                  />
                ))}
              </div>
            </div>

            {/* Technology Block */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-6 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-blue-600 rounded-xs"></span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-white font-['Cairo']">
                    تكنولوجيا وابتكار
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('tech')}
                  className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <span>عرض المزيد</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(techArticles.length > 0 ? techArticles : articles.slice(0, 3)).slice(0, 3).map((item) => (
                  <ArticleCard
                    key={item.id}
                    article={item}
                    variant="standard"
                    onOpen={onOpenArticle}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

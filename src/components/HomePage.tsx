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
  Share2,
  Home,
  FolderOpen
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

  // Category & Country metadata lookup
  const categoryConfig = CATEGORIES_CONFIG.find((c) => c.id === currentCategory);
  const countryConfig = MAGHREB_COUNTRIES.find((m) => m.id === (currentCategory as any));
  const categoryTitle = categoryConfig?.label || (countryConfig ? `أخبار ${countryConfig.name}` : currentCategory);
  const categoryFlag = categoryConfig?.flag || countryConfig?.flag;

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
    filtered = filtered.filter((a) => {
      // 1. Direct category match
      if (a.category === currentCategory) return true;
      // 2. Tech includes AI
      if (currentCategory === 'tech' && a.category === 'ai') return true;
      // 3. Country match
      if (a.country === (currentCategory as any)) return true;
      // 4. Moroccan news includes all Moroccan tags and country
      if (currentCategory === 'morocco' && (a.country === 'morocco' || a.tags.some((t) => t.includes('المغرب')))) return true;
      // 5. World news includes world country or world tag
      if (currentCategory === 'world' && (a.country === 'world' || a.tags.some((t) => t.includes('العالم') || t.includes('دولي')))) return true;
      // 6. Cooking and recipes
      if (currentCategory === 'cooking' && (a.contentType === 'recipe' || a.category === 'cooking' || a.tags.some((t) => t.includes('طبخ') || t.includes('مطبخ') || t.includes('وصفة')))) return true;
      // 7. Artificial Intelligence
      if (currentCategory === 'ai' && (a.category === 'ai' || a.tags.some((t) => t.includes('ذكاء اصطناعي') || t.toLowerCase().includes('ai')))) return true;
      // 8. Video section
      if (currentCategory === 'video' && (!!a.videoUrl || a.category === 'video')) return true;
      // 9. Economy
      if (currentCategory === 'economy' && (a.category === 'economy' || a.tags.some((t) => t.includes('اقتصاد')))) return true;
      // 10. Sports
      if (currentCategory === 'sports' && (a.category === 'sports' || a.tags.some((t) => t.includes('رياضة')))) return true;
      // 11. Culture
      if (currentCategory === 'culture' && (a.category === 'culture' || a.tags.some((t) => t.includes('ثقافة') || t.includes('تراث')))) return true;
      // 12. Society
      if (currentCategory === 'society' && (a.category === 'society' || a.tags.some((t) => t.includes('مجتمع')))) return true;
      return false;
    });
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
  const techArticles = articles.filter((a) => a.category === 'tech' || a.category === 'ai');
  const cookingArticles = articles.filter((a) => a.category === 'cooking');
  const aiArticles = articles.filter((a) => a.category === 'ai');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-['Tajawal']">
      {/* 1. Top Google AdSense Leaderboard Banner */}
      <AdSenseBanner slot="top-leaderboard" />

      {/* Case A: If search query is active, show Search Results view */}
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
      ) : currentCategory !== 'all' ? (
        /* Case B: Specific Category / Section View */
        <section className="my-6">
          {/* Breadcrumbs & Back Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-stone-200 dark:border-stone-800">
            <nav className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <button 
                onClick={() => onSelectCategory('all')}
                className="hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1 font-bold text-stone-700 dark:text-stone-300 transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>الرئيسية</span>
              </button>
              <span className="text-stone-400">/</span>
              <span className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1">
                {categoryFlag && <span>{categoryFlag}</span>}
                <span>{categoryTitle}</span>
              </span>
            </nav>

            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs px-3.5 py-1.5 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-red-700 hover:text-white dark:hover:bg-red-700 dark:hover:text-white text-stone-700 dark:text-stone-300 font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
              <span>العودة للرئيسية (كل الأخبار)</span>
            </button>
          </div>

          {/* Category Banner Title Card */}
          <div className="bg-stone-900 text-white rounded-xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-r-4 border-red-700">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-700 text-xs font-bold text-white shadow-xs">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>تغطية إخبارية حصرية</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-['Cairo'] flex items-center gap-2.5">
                {categoryFlag && <span className="text-3xl">{categoryFlag}</span>}
                <span>{categoryTitle}</span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                متابعة دقيقة وشاملة لأحدث المقالات، التحليلات والتقارير الميدانية الخاصة بـ {categoryTitle}.
              </p>
            </div>
            <div className="shrink-0 bg-stone-800/90 border border-stone-700 px-5 py-3 rounded-lg text-center">
              <span className="block text-3xl font-black text-amber-400 font-mono">{filtered.length}</span>
              <span className="text-xs text-stone-300 font-medium">مقالاً متوفراً</span>
            </div>
          </div>

          {/* Quick Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
            <span className="text-xs text-stone-400 font-bold shrink-0 ml-1">تصفح الأقسام:</span>
            {CATEGORIES_CONFIG.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as Category)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                  currentCategory === cat.id
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {cat.flag && <span>{cat.flag}</span>}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Articles Render */}
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
              <p className="text-stone-500 text-sm mb-4">
                لا توجد مقالات متوفرة حالياً في هذا القسم. يواصل فريق التحرير إضافة تقارير جديدة بانتظام.
              </p>
              <button
                onClick={() => onSelectCategory('all')}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition shadow"
              >
                العودة للصفحة الرئيسية
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured article if available */}
              {filtered.length > 0 && (
                <div>
                  <ArticleCard
                    article={filtered[0]}
                    variant="lead"
                    onOpen={onOpenArticle}
                  />
                </div>
              )}

              {/* In-feed AdSense Banner */}
              <AdSenseBanner slot="between-sections" />

              {/* Grid of remaining articles */}
              {filtered.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.slice(1).map((item) => (
                    <ArticleCard
                      key={item.id}
                      article={item}
                      variant="standard"
                      onOpen={onOpenArticle}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      ) : (
        /* Case C: Full Default Homepage */
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

            {/* Cooking & Authentic Recipes Block */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-6 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-red-700 rounded-xs"></span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-white font-['Cairo']">
                    مطبخ ووصفات المغرب العربي والعالم
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('cooking')}
                  className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <span>عرض جميع الوصفات</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(cookingArticles.length > 0 ? cookingArticles : articles.slice(0, 3)).slice(0, 3).map((item) => (
                  <ArticleCard
                    key={item.id}
                    article={item}
                    variant="standard"
                    onOpen={onOpenArticle}
                  />
                ))}
              </div>
            </div>

            {/* Artificial Intelligence & Tech Block */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-6 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-blue-600 rounded-xs"></span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-white font-['Cairo']">
                    الذكاء الاصطناعي والتكنولوجيا المتقدمة
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('ai')}
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

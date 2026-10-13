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
  FolderOpen,
  ArrowRight,
  UtensilsCrossed,
  Layers,
  Newspaper
} from 'lucide-react';
import { Article, Category, Country } from '../types';
import { ArticleCard } from './ArticleCard';
import { AdSenseBanner } from './AdSenseBanner';
import { VideoSection } from './VideoSection';
import { GulfNewsSection } from './GulfNewsSection';
import { CATEGORIES_CONFIG, MAGHREB_COUNTRIES, GULF_COUNTRIES } from '../data/initialArticles';

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
  const [recipeSubfilter, setRecipeSubfilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'popular'>('latest');

  // Helper for category metadata & descriptions
  const getCategoryMeta = (cat: Category) => {
    const country = MAGHREB_COUNTRIES.find((c) => c.id === cat);
    if (country) {
      return {
        title: `أخبار ${country.name}`,
        flag: country.flag,
        description: `متابعة حية وشاملة ومستمرة لأحدث الأخبار والتطورات السياسية والاقتصادية والاجتماعية في ${country.name}.`,
        badge: country.capital ? `العاصمة: ${country.capital} · العملة: ${country.currency}` : undefined,
      };
    }

    const gulfCountry = GULF_COUNTRIES.find((c) => c.id === cat);
    if (gulfCountry) {
      return {
        title: `أخبار ${gulfCountry.name}`,
        flag: gulfCountry.flag,
        description: `متابعة حية وشاملة ومستمرة لأحدث الأخبار والتطورات الاقتصادية والتكنولوجية والاستثمارية في ${gulfCountry.name}.`,
        badge: `العاصمة: ${gulfCountry.capital} · العملة: ${gulfCountry.currency}`,
      };
    }

    switch (cat) {
      case 'morocco':
        return {
          title: 'أخبار المملكة المغربية',
          flag: '🇲🇦',
          description: 'تغطية إخبارية حصرية للمشاريع التنموية الكبرى، البنية التحتية، الدبلوماسية، والاقتصاد الوطني.',
        };
      case 'world':
        return {
          title: 'أخبار العالم',
          flag: '🌍',
          description: 'تغطيات جيوسياسية استقصائية وتحليلات لأبرز الملفات الدولية في إفريقيا وأوروبا والشرق الأوسط والعالم.',
        };
      case 'economy':
        return {
          title: 'اقتصاد وأعمال المغرب العربي',
          icon: '📈',
          description: 'تحليلات أسواق المال، مشاريع الطاقة النظيفة، التجارة المغاربية المشتركة، والفرص الاستثمارية الواعدة.',
        };
      case 'agency':
        return {
          title: 'كيف أنشئ وكالة - دليل المشاريع والاستثمار 2026',
          icon: '💼',
          description: 'دليلك الشامل لإنشاء وتأسيس الوكالات في المغرب والعالم العربي: شروط وكالات تحويل الأموال والخدمات المالية (وفاكاش وغيرها)، وكالات الخدمات الرقمية والتجارية، دراسات الجدوى، التكاليف والأرباح.',
        };
      case 'cooking':
        return {
          title: 'مطبخ ووصفات المغرب العربي والعالم',
          icon: '🍲',
          description: 'موسوعة غنية من أشهى أطباق الطهي المغربي التقليدي (الكسكس، الطواجن، البسطيلة)، مع وصفات عربية وعالمية بمقادير دقيقة وخطوات واضحة.',
        };
      case 'ai':
        return {
          title: 'الذكاء الاصطناعي والثورة الرقمية',
          icon: '🤖',
          description: 'مستجدات نماذج الذكاء الاصطناعي التوليدي، معالجة اللغات، وتحولات سوق العمل والابتكارات الرقمية.',
        };
      case 'tech':
        return {
          title: 'تكنولوجيا وابتكار',
          icon: '💻',
          description: 'جديد الهواتف، الأجهزة الذكية، الحوسبة السحابية، الأمن السيبراني، ومنظومة الشركات الناشئة المغاربية.',
        };
      case 'sports':
        return {
          title: 'رياضة مغاربية وعالمية',
          icon: '🏆',
          description: 'أخبار بطولات كرة القدم، تصفيات كأس العالم 2030، الكؤوس الإفريقية، ونتائج المحترفين في كبرى الدوريات العالمية.',
        };
      case 'video':
        return {
          title: 'فيديو ووثائقيات',
          icon: '🎬',
          description: 'تقارير مصورة، وثائقيات حصرية، وتغطيات ميدانية تجسد نبض الشارع المغاربي بالصوت والصورة.',
        };
      case 'society':
        return {
          title: 'شؤون المجتمع والتعليم',
          icon: '👥',
          description: 'قضايا التعليم العالي، الصحة، الأسرة، الشباب، والتنمية البشرية في بلدان المغرب العربي.',
        };
      case 'culture':
        return {
          title: 'ثقافة وتراث وفنون',
          icon: '📚',
          description: 'الذاكرة المغاربية المشتركة، معارض الفنون، المهرجانات، والإصدارات الأدبية والفكرية.',
        };
      case 'variety':
        return {
          title: 'منوعات وإضاءات',
          icon: '✨',
          description: 'قصص نجاح ملهمة، غرائب العلوم والطبيعة، وأسرار الوجهات السياحية المغاربية الاستثنائية.',
        };
      case 'gulf':
        return {
          title: 'أخبار دول الخليج العربي الرائجة',
          flag: '🌴',
          description: 'تغطية إخبارية حصرية للمشاريع التنموية الكبرى، الاستثمارات الاقتصادية، والذكاء الاصطناعي في دول مجلس التعاون الخليجي الست.',
        };
      default:
        const conf = CATEGORIES_CONFIG.find((c) => c.id === cat);
        return {
          title: conf?.label || 'أخبار',
          flag: conf?.flag,
          description: 'تغطية إخبارية شاملة وموثوقة لحظة بلحظة.',
        };
    }
  };

  // 1. Filter articles based on search, category, and country
  let filtered = [...articles];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags?.some((t) => t.toLowerCase().includes(q)) ||
        a.author.name.toLowerCase().includes(q)
    );
  } else if (currentCategory !== 'all') {
    filtered = filtered.filter((a) => {
      // Maghreb Country matches
      if (currentCategory === 'morocco') return a.country === 'morocco' || a.category === 'morocco';
      if (currentCategory === 'algeria') return a.country === 'algeria' || a.category === 'algeria';
      if (currentCategory === 'tunisia') return a.country === 'tunisia' || a.category === 'tunisia';
      if (currentCategory === 'libya') return a.country === 'libya' || a.category === 'libya';
      if (currentCategory === 'mauritania') return a.country === 'mauritania' || a.category === 'mauritania';
      if (currentCategory === 'world') return a.country === 'world' || a.category === 'world';

      // Gulf Countries matches
      if (currentCategory === 'gulf') {
        return ['saudi', 'uae', 'qatar', 'kuwait', 'oman', 'bahrain'].includes(a.country);
      }
      if (['saudi', 'uae', 'qatar', 'kuwait', 'oman', 'bahrain'].includes(currentCategory as string)) {
        return a.country === currentCategory;
      }

      // Tech & AI grouping
      if (currentCategory === 'tech') return a.category === 'tech' || a.category === 'ai';
      if (currentCategory === 'ai') return a.category === 'ai' || (a.category === 'tech' && a.tags?.some(t => t.includes('ذكاء')));

      // Cooking matches all recipes and cooking articles
      if (currentCategory === 'cooking') return a.category === 'cooking' || a.contentType === 'recipe';

      // Agency Guides (كيف أنشئ وكالة)
      if (currentCategory === 'agency') return a.category === 'agency' || a.tags?.some(t => t.includes('وكالة') || t.includes('وفاكاش'));

      // Standard match
      return a.category === currentCategory;
    });

    // Subfilter for cooking if active
    if (currentCategory === 'cooking' && recipeSubfilter !== 'all') {
      filtered = filtered.filter((a) => {
        if (!a.recipeData) return false;
        return a.recipeData.category.includes(recipeSubfilter) || a.title.includes(recipeSubfilter);
      });
    }
  }

  // Sort filtered articles
  if (sortOrder === 'popular') {
    filtered.sort((a, b) => (b.readsCount || 0) - (a.readsCount || 0));
  } else {
    filtered.sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }

  // Active country tab filter on homepage
  const countryArticles = (c: Country) =>
    articles.filter((a) => a.country === c);

  // Priority 1: Mansouri government formation story as the headline lead article
  const leadArticle = 
    articles.find((a) => a.id === 'mor-mansouri-gov-formation-2026') ||
    articles.find((a) => a.isLead) ||
    articles[0];

  const breakingNews = articles.filter((a) => a.isBreaking);
  const mostReadArticles = [...articles].sort((a, b) => b.readsCount - a.readsCount).slice(0, 5);
  
  // Exclude leadArticle from sidebar latest list to prevent duplication
  const remainingLatest = articles.filter((a) => a.id !== leadArticle?.id);
  const latestArticles = [...remainingLatest].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  // Department blocks
  const economyArticles = articles.filter((a) => a.category === 'economy');
  const agencyArticles = articles.filter((a) => a.category === 'agency' || a.tags?.some(t => t.includes('وكالة') || t.includes('وفاكاش')));
  const sportsArticles = articles.filter((a) => a.category === 'sports');
  const techArticles = articles.filter((a) => a.category === 'tech' || a.category === 'ai');
  const cookingArticles = articles.filter((a) => a.category === 'cooking' || a.contentType === 'recipe');
  const moroccoArticles = articles.filter((a) => a.country === 'morocco');

  const isBrowsingCategory = currentCategory !== 'all';
  const isSearching = searchQuery.trim().length > 0;
  const activeMeta = getCategoryMeta(currentCategory);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-['Tajawal']">
      {/* 1. Top Google AdSense Leaderboard Banner */}
      <AdSenseBanner slot="top-leaderboard" />

      {/* ========================================================================= */}
      {/* VIEW A: Search Results OR Category Filter Page                            */}
      {/* ========================================================================= */}
      {(isSearching || isBrowsingCategory) ? (
        <section className="my-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="مسار التصفح" className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-4">
            <button
              onClick={() => onSelectCategory('all')}
              className="hover:text-red-700 hover:underline font-medium transition"
            >
              الصفحة الرئيسية
            </button>
            <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
            <span className="font-bold text-stone-800 dark:text-stone-200">
              {isSearching ? `نتائج البحث عن: "${searchQuery}"` : activeMeta.title}
            </span>
          </nav>

          {/* Section Header Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 sm:p-6 mb-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  {activeMeta.flag && <span className="text-2xl">{activeMeta.flag}</span>}
                  {activeMeta.icon && <span className="text-2xl">{activeMeta.icon}</span>}
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-['Cairo'] tracking-tight">
                    {isSearching ? `نتائج البحث عن: "${searchQuery}"` : activeMeta.title}
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
                  {isSearching
                    ? `عرض جميع المقالات والتقارير والوصفات التي تحتوي على الكلمة المفتاحية.`
                    : activeMeta.description}
                </p>
                {activeMeta.badge && (
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    <span>📍</span>
                    <span>{activeMeta.badge}</span>
                  </div>
                )}
              </div>

              {/* Actions: Total Counter & Reset Button */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono text-xs font-bold border border-stone-200 dark:border-stone-700">
                  {filtered.length} {filtered.length === 1 ? 'مقال' : 'مقالات منشورة'}
                </span>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>الرئيسية</span>
                </button>
              </div>
            </div>

            {/* Sub-Filter Tabs for Cooking/Recipes */}
            {currentCategory === 'cooking' && (
              <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">تصفية الوصفات:</span>
                {[
                  { id: 'all', label: 'جميع الوصفات' },
                  { id: 'طواجن', label: 'طواجن مغربية' },
                  { id: 'رئيسية', label: 'أطباق رئيسية فاخرة' },
                  { id: 'شوربات', label: 'شوربات وحساء' },
                  { id: 'مقبلات', label: 'مقبلات وسلطات' },
                  { id: 'عالمية', label: 'أطباق عالمية وإيطالية' },
                  { id: 'حلويات', label: 'حلويات ومشروبات' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setRecipeSubfilter(tab.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition ${
                      recipeSubfilter === tab.id
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* If Category is Video, include the video preview player */}
          {currentCategory === 'video' && (
            <div className="mb-10">
              <VideoSection articles={articles} onOpenArticle={onOpenArticle} />
            </div>
          )}

          {/* Articles Grid */}
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-4">
              <FolderOpen className="w-12 h-12 text-stone-400 mx-auto stroke-[1.5]" />
              <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 font-['Cairo']">
                لا توجد مقالات متوفرة حالياً في هذا القسم
              </h3>
              <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm max-w-md mx-auto">
                يقوم فريق التحرير بإعداد ونشر المزيد من التقارير الحصرية في هذا القسم قريباً.
              </p>
              <button
                onClick={() => onSelectCategory('all')}
                className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5"
              >
                <span>العودة لكافة الأخبار في الرئيسية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
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

          {/* AdSense Placement */}
          <div className="mt-12">
            <AdSenseBanner slot="between-sections" />
          </div>
        </section>
      ) : (
        /* ========================================================================= */
        /* VIEW B: Rich Magazine Homepage (When currentCategory === 'all')          */
        /* ========================================================================= */
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
                    {latestArticles.slice(0, 4).map((item, idx) => (
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

                {/* Gulf News Sidebar Widget (دول الخليج العربي - أخبار رائجة) */}
                <GulfNewsSection 
                  articles={articles} 
                  onOpenArticle={onOpenArticle} 
                  variant="sidebar" 
                />

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

          {/* Section: أخبار دول الخليج العربي الرائجة (12 مقالاً رائجاً - 2 لكل دولة خليجية) */}
          <GulfNewsSection 
            articles={articles} 
            onOpenArticle={onOpenArticle} 
            variant="full" 
          />

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

          {/* 7. Department Blocks: اقتصاد وأعمال + رياضة + تكنولوجيا + طبخ */}
          <section className="my-14 space-y-12">
            {/* Morocco Block */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-6 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-red-700 rounded-xs"></span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-white font-['Cairo']">
                    أخبار المغرب 🇲🇦
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('morocco')}
                  className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <span>عرض المزيد ({moroccoArticles.length})</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(moroccoArticles.length > 0 ? moroccoArticles : articles.slice(0, 3)).slice(0, 3).map((item) => (
                  <ArticleCard
                    key={item.id}
                    article={item}
                    variant="standard"
                    onOpen={onOpenArticle}
                  />
                ))}
              </div>
            </div>

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
                  <span>عرض المزيد ({economyArticles.length})</span>
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

            {/* How to Start an Agency Section: كيف أنشئ وكالة */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-stone-50 to-white dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-950 border border-amber-200/80 dark:border-amber-900/40 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-amber-200/60 dark:border-amber-900/40">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-7 bg-amber-600 rounded-xs"></span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-stone-900 dark:text-white font-['Cairo'] flex items-center gap-2">
                        <span>كيف أنشئ وكالة 💼</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold">
                          دليل المشاريع 2026
                        </span>
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      أدلة شاملة لتأسيس وكالات تحويل الأموال والخدمات المالية والوكالات الرقمية: الشروط والتكاليف والأرباح
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onSelectCategory('agency')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>عرض جميع الأدلة ({agencyArticles.length})</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(agencyArticles.length > 0 ? agencyArticles : articles.slice(0, 3)).slice(0, 3).map((item) => (
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
                  <span>عرض المزيد ({sportsArticles.length})</span>
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
                    مطبخ ووصفات المغرب العربي والعالم 🍲
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('cooking')}
                  className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <span>عرض جميع الوصفات ({cookingArticles.length})</span>
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
                    الذكاء الاصطناعي والتكنولوجيا المتقدمة 🤖
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('ai')}
                  className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <span>عرض المزيد ({techArticles.length})</span>
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

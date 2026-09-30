import React, { useState } from 'react';
import { 
  Search, 
  Moon, 
  Sun, 
  Radio, 
  Menu, 
  X, 
  Sliders, 
  TrendingUp,
  Share2,
  Calendar,
  CloudSun,
  Shield,
  FileCode2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Lock,
  Download,
  Globe
} from 'lucide-react';
import { Category, Country, ViewMode, Article } from '../types';
import { CATEGORIES_CONFIG, MAGHREB_COUNTRIES } from '../data/initialArticles';

interface HeaderProps {
  currentCategory: Category;
  onSelectCategory: (cat: Category) => void;
  onSelectCountry: (country: Country) => void;
  onOpenArticle: (id: string) => void;
  onNavigate: (view: ViewMode) => void;
  breakingArticles: Article[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isAdmin?: boolean;
  onAdminLogout?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenDomainModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onSelectCountry,
  onOpenArticle,
  onNavigate,
  breakingArticles,
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode,
  isAdmin = false,
  onAdminLogout,
  onOpenAdminLogin,
  onOpenDomainModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [breakingIndex, setBreakingIndex] = useState(0);

  // Formatted Arabic dates
  const todayArabic = new Intl.DateTimeFormat('ar-MA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const currentBreaking = breakingArticles[breakingIndex] || breakingArticles[0];

  const handleNextBreaking = () => {
    if (breakingArticles.length > 0) {
      setBreakingIndex((prev) => (prev + 1) % breakingArticles.length);
    }
  };

  const handlePrevBreaking = () => {
    if (breakingArticles.length > 0) {
      setBreakingIndex((prev) => (prev - 1 + breakingArticles.length) % breakingArticles.length);
    }
  };

  return (
    <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 transition-colors sticky top-0 z-40">
      {/* 1. Top Bar: Date, Weather/Currencies, Social & Tools */}
      <div className="bg-stone-100 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Right side (RTL first): Date & Weather */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-stone-700 dark:text-stone-300">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>{todayArabic}</span>
            </span>
            <span className="hidden md:inline text-stone-300 dark:text-stone-700">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-stone-500">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>الرباط 23° · تونس 24° · الجزائر 22° · طرابلس 25° · نواكشوط 31°</span>
            </span>
          </div>

          {/* Left side (RTL end): Flags, Admin CMS, Tools */}
          <div className="flex items-center gap-3">
            {/* Quick Country Filters */}
            <div className="hidden lg:flex items-center gap-1 bg-white dark:bg-stone-900 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-800">
              <span className="text-[11px] text-stone-400 font-semibold ml-1">الدول:</span>
              {MAGHREB_COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCountry(c.id as Country)}
                  title={c.name}
                  className="px-1.5 py-0.5 text-xs hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition flex items-center gap-1"
                >
                  <span>{c.flag}</span>
                  <span className="text-stone-700 dark:text-stone-300">{c.name}</span>
                </button>
              ))}
            </div>

            {/* Admin Controls (Only visible when authenticated as Admin) */}
            {isAdmin && (
              <div className="flex items-center gap-1.5 bg-red-950/30 border border-red-800/40 px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="جلسة المشرف نشطة"></span>
                <span className="text-[11px] font-bold text-red-300 hidden md:inline">إدارة</span>
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-1 px-2 py-0.5 bg-red-700 hover:bg-red-800 text-white rounded font-medium text-xs transition shadow-sm"
                  title="لوحة تحرير الأخبار وجلب RSS"
                >
                  <Sliders className="w-3 h-3" />
                  <span>لوحة التحكم</span>
                </button>
                <button
                  onClick={() => onNavigate('seo-tools')}
                  className="flex items-center gap-1 px-1.5 py-0.5 border border-red-800/50 hover:bg-red-900/40 text-red-200 rounded text-xs transition"
                  title="أدوات SEO وملفات Sitemap و Robots"
                >
                  <FileCode2 className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">SEO</span>
                </button>
                <button
                  onClick={onAdminLogout}
                  className="flex items-center gap-1 px-1.5 py-0.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded text-xs transition"
                  title="تسجيل خروج المشرف"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Quick Domain / Download Button (Only visible for Admin) */}
            {isAdmin && onOpenDomainModal && (
              <button
                onClick={onOpenDomainModal}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded text-xs transition shadow-sm cursor-pointer"
                title="ربط الدومين almaghreb-alyoum.com أو تحميل الملفات"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ربط الدومين وتحميل الموقع</span>
                <span className="sm:hidden">ربط الدومين</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition"
              title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Editorial Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div 
          onClick={() => {
            onSelectCategory('all');
            onNavigate('home');
          }}
          className="cursor-pointer group select-none"
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-8 bg-red-700 inline-block rounded-xs transform group-hover:scale-y-110 transition-transform"></span>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-stone-900 dark:text-white font-['Cairo'] flex items-center gap-2">
                <span>المغرب العربي اليوم</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-normal hidden sm:inline-block">
                  إخباري مستقل
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium tracking-wide mt-0.5">
                أخبار المغرب العربي والعالم لحظة بلحظة
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن خبر، مقال، دولة أو كاتب..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white dark:focus:bg-stone-900 transition"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            title="بحث"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search input expander */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في أخبار المغرب العربي..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-600"
              autoFocus
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>
        </div>
      )}

      {/* 3. Category Navigation Bar (Single line, text with hover highlight) */}
      <nav className="border-t border-stone-200 dark:border-stone-800 bg-stone-900 text-stone-100 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar py-1">
          <ul className="flex items-center gap-1 lg:gap-2 whitespace-nowrap text-sm font-semibold">
            {CATEGORIES_CONFIG.map((cat) => {
              const isActive = currentCategory === cat.id;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id as Category);
                      onNavigate('home');
                    }}
                    className={`px-3 py-2 rounded-sm transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-red-700 text-white shadow-xs font-bold'
                        : 'text-stone-200 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    {cat.flag && <span>{cat.flag}</span>}
                    <span>{cat.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="hidden xl:flex items-center gap-3 pr-4 border-r border-stone-700 text-xs text-stone-300">
            <span className="flex items-center gap-1 text-red-400 font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              بث مباشر
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-3 max-h-[80vh] overflow-y-auto">
          <p className="text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">
            أقسام الموقع
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {CATEGORIES_CONFIG.map((cat) => {
              const isActive = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id as Category);
                    onNavigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-right rounded text-sm font-medium transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-red-700 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  {cat.flag && <span>{cat.flag}</span>}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {isAdmin && (
            <div className="border-t border-stone-200 dark:border-stone-800 pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-right py-2 px-3 text-sm font-bold bg-red-700 text-white rounded flex items-center justify-between"
              >
                <span>لوحة التحكم وإدارة الأخبار (مشرف)</span>
                <Sliders className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onAdminLogout?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-right py-1.5 px-3 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded flex items-center justify-between"
              >
                <span>تسجيل خروج المشرف</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {isAdmin && onOpenDomainModal && (
            <button
              onClick={() => {
                onOpenDomainModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-xl text-xs transition shadow-sm"
            >
              <Globe className="w-4 h-4" />
              <span>ربط الدومين almaghreb-alyoum.com وتحميل الملفات</span>
            </button>
          )}

          <div className="border-t border-stone-200 dark:border-stone-800 pt-3 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="text-right text-xs text-stone-600 dark:text-stone-400 py-1"
            >
              من نحن ورسالتنا التحريرية
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="text-right text-xs text-stone-600 dark:text-stone-400 py-1"
            >
              اتصل بنا ومكاتب التحرير
            </button>
          </div>
        </div>
      )}

      {/* 4. Breaking News Ticker (شريط الأخبار العاجلة) */}
      {breakingArticles.length > 0 && currentBreaking && (
        <div className="bg-red-700 text-white text-xs sm:text-sm py-2 px-4 sm:px-6 shadow-inner flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <div className="flex items-center gap-1.5 bg-red-900 text-white px-2.5 py-1 rounded font-bold shrink-0 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>عاجل</span>
            </div>

            <div 
              onClick={() => onOpenArticle(currentBreaking.id)}
              className="cursor-pointer hover:underline truncate font-semibold transition"
              title={currentBreaking.title}
            >
              {currentBreaking.title}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-white/90">
            <span className="text-[11px] font-mono opacity-80 hidden sm:inline">
              ({breakingIndex + 1}/{breakingArticles.length})
            </span>
            <button
              onClick={handlePrevBreaking}
              className="p-1 hover:bg-red-800 rounded transition"
              title="الخبر السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextBreaking}
              className="p-1 hover:bg-red-800 rounded transition"
              title="الخبر التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

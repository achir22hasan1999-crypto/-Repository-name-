import React, { useState, useEffect } from 'react';
import { Article, Category, Country, RssFeedItem, ViewMode, Comment } from './types';
import { 
  INITIAL_ARTICLES, 
  INITIAL_COMMENTS, 
  INITIAL_RSS_FEED 
} from './data/initialArticles';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ArticleDetail } from './components/ArticleDetail';
import { ReaderView } from './components/ReaderView';
import { AdminCMS } from './components/AdminCMS';
import { LegalPages } from './components/LegalPages';
import { SEOMonitorModal } from './components/SEOMonitorModal';
import { CookieBanner } from './components/CookieBanner';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { DomainExportModal } from './components/DomainExportModal';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { ArticleNotFound } from './components/ArticleNotFound';
import { 
  findArticleBySlugOrId, 
  getArticleUrl, 
  getFullArticleUrl, 
  generateArticleSlug,
  DOMAIN_NAME 
} from './utils/slugUtils';
import parliamentCoverImg from './assets/images/parliament_mansouri_cover_1790956433850.jpg';

const STORAGE_KEY = 'maghreb_news_articles_v2026_10_02_wafacash_thumb';

export default function App() {
  // 1. Persistent State
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      // Clear legacy storage keys that prevent users from seeing the fresh lead article
      localStorage.removeItem('maghreb_news_articles');
      localStorage.removeItem('maghreb_news_articles_v3');
      localStorage.removeItem('maghreb_news_articles_v4');

      const saved = localStorage.getItem(STORAGE_KEY);
      const targetLeadId = 'mor-mansouri-gov-formation-2026';
      const mansouriInitial = INITIAL_ARTICLES.find(a => a.id === targetLeadId) || INITIAL_ARTICLES[0];

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove any old instance of targetLeadId from parsed
          const otherArticles = parsed.filter((a: any) => a.id !== targetLeadId);
          const cachedIds = new Set(parsed.map((a: any) => a.id));
          const missingFromInitial = INITIAL_ARTICLES.filter(a => a.id !== targetLeadId && !cachedIds.has(a.id));

          // Combine: Mansouri first, then newly added articles from INITIAL_ARTICLES, then other cached articles
          const combined = [
            { 
              ...mansouriInitial, 
              title: 'موعد افتتاح البرلمان يزيد الضغط على مشاورات تشكيل "حكومة المنصوري"',
              leadImage: parliamentCoverImg,
              isLead: true, 
              isBreaking: true 
            },
            ...missingFromInitial,
            ...otherArticles
          ];

          return combined.map((art: any) => ({
            ...art,
            publishDate: art.publishDate || art.publishedAt || '2026-10-02T08:20:00Z',
            title: art.id === targetLeadId ? 'موعد افتتاح البرلمان يزيد الضغط على مشاورات تشكيل "حكومة المنصوري"' : art.title,
            leadImage: art.id === targetLeadId ? parliamentCoverImg : (art.leadImage || art.imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'),
            imageCaption: art.id === targetLeadId ? 'قاعة البرلمان المغربي بالرباط وترقب حاسم لمشاورات تشكيل حكومة المنصوري قبل الجلسة الافتتاحية الدستورية' : art.imageCaption,
            readsCount: typeof art.readsCount === 'number' ? art.readsCount : (art.views || 1200),
            likesCount: typeof art.likesCount === 'number' ? art.likesCount : (art.likes || 150),
            commentsCount: typeof art.commentsCount === 'number' ? art.commentsCount : (art.commentsCount || 10),
            isBreaking: art.id === targetLeadId ? true : Boolean(art.isBreaking),
            isLead: art.id === targetLeadId ? true : Boolean(art.isLead && art.id !== 'art-1'),
            author: art.author || {
              name: 'عمر الإدريسي',
              role: 'محلل الشؤون السياسية والمؤسساتية',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
            },
            source: art.source || 'المغرب العربي اليوم',
            tags: Array.isArray(art.tags) ? art.tags : ['المغرب', 'سياسة'],
            seo: art.seo || {
              metaTitle: art.title,
              metaDescription: art.summary || art.title,
              keywords: ['المغرب', 'أخبار']
            }
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ARTICLES;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem('maghreb_news_comments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMMENTS;
  });

  const [rssFeeds, setRssFeeds] = useState<RssFeedItem[]>(() => {
    try {
      const saved = localStorage.getItem('maghreb_news_rss');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RSS_FEED;
  });

  // 2. Navigation & UI State
  const [view, setView] = useState<ViewMode>('home');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [unknownSlug, setUnknownSlug] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<Category>('all');
  const [selectedCountry, setSelectedCountry] = useState<Country>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('maghreb_dark_mode') === 'true';
  });
  const [showSeoModal, setShowSeoModal] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);

  // Admin Authentication State (Dashboard hidden from ordinary visitors)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('maghreb_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Keyboard shortcut Ctrl+Shift+A for Admin Quick Login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAdminLoginModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Synchronize routing with browser URL (HTML5 History API) on mount & popstate
  useEffect(() => {
    const syncRouteFromUrl = () => {
      let rawSlug = '';
      const pathname = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const articleParam = searchParams.get('article') || searchParams.get('art') || searchParams.get('slug');
      const hash = window.location.hash;

      if (pathname.startsWith('/article/')) {
        rawSlug = pathname.replace(/^\/article\//, '').replace(/\/$/, '');
      } else if (articleParam) {
        rawSlug = articleParam.trim();
      } else if (hash.startsWith('#/article/')) {
        rawSlug = hash.replace(/^#\/article\//, '').replace(/\/$/, '');
      }

      if (rawSlug) {
        const matched = findArticleBySlugOrId(articles, rawSlug);
        if (matched) {
          setActiveArticleId(matched.id);
          setView('article');
          setIsReaderMode(false);
          const cleanUrl = getArticleUrl(matched);
          if (pathname !== cleanUrl) {
            window.history.replaceState({ articleId: matched.id, slug: matched.slug }, '', cleanUrl);
          }
        } else {
          setActiveArticleId(null);
          setUnknownSlug(rawSlug);
          setView('404');
          setIsReaderMode(false);
        }
      } else if (pathname === '/' || pathname === '') {
        setView('home');
        setActiveArticleId(null);
      } else if (pathname === '/admin') {
        if (isAdmin) {
          setView('admin');
        } else {
          setShowAdminLoginModal(true);
        }
      } else if (pathname.startsWith('/category/')) {
        const cat = pathname.replace(/^\/category\//, '').replace(/\/$/, '') as Category;
        setCurrentCategory(cat);
        setView('home');
        setActiveArticleId(null);
      } else {
        const staticViews = ['about', 'contact', 'privacy', 'cookies', 'terms', 'disclaimer', 'corrections', 'copyright', 'author', 'seo-tools'];
        const cleanPath = pathname.replace(/^\//, '').replace(/\/$/, '');
        if (staticViews.includes(cleanPath)) {
          setView(cleanPath as ViewMode);
          setActiveArticleId(null);
        }
      }
    };

    syncRouteFromUrl();

    const handlePopState = () => {
      syncRouteFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles, isAdmin]);

  // Sync articles to localStorage using fresh STORAGE_KEY
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error(e);
    }
  }, [articles]);

  // Sync comments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maghreb_news_comments', JSON.stringify(comments));
    } catch (e) {
      console.error(e);
    }
  }, [comments]);

  // Sync RSS to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maghreb_news_rss', JSON.stringify(rssFeeds));
    } catch (e) {
      console.error(e);
    }
  }, [rssFeeds]);

  // Handle Dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('maghreb_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('maghreb_dark_mode', 'false');
    }
  }, [darkMode]);

  // Dynamic SEO title, description & canonical link update
  useEffect(() => {
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }

    if (view === 'article' && activeArticleId) {
      const current = articles.find((a) => a.id === activeArticleId);
      if (current) {
        document.title = `${current.title} | المغرب العربي اليوم`;
        canonicalLink.setAttribute('href', getFullArticleUrl(current));
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', current.summary);
        }
      }
    } else if (view === '404') {
      document.title = 'مقال غير موجود (404) | المغرب العربي اليوم';
      canonicalLink.setAttribute('href', `${DOMAIN_NAME}/`);
    } else {
      document.title = 'المغرب العربي اليوم | أخبار المغرب العربي والعالم لحظة بلحظة';
      canonicalLink.setAttribute('href', `${DOMAIN_NAME}/`);
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'بوابة إخبارية شاملة ومستقلة تغطي مستجدات المغرب، الجزائر، تونس، ليبيا، موريتانيا والعالم لحظة بلحظة.'
        );
      }
    }
  }, [view, activeArticleId, articles]);

  // Actions
  const handleOpenArticle = (id: string, pushHistory: boolean = true) => {
    const target = articles.find((art) => art.id === id);
    if (!target) return;

    setActiveArticleId(target.id);
    setView('article');
    setIsReaderMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pushHistory) {
      const targetUrl = getArticleUrl(target);
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ articleId: target.id, slug: target.slug }, '', targetUrl);
      }
    }

    // Increment read count
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, readsCount: art.readsCount + 1 } : art))
    );
  };

  const handleBackToHome = () => {
    setView('home');
    setActiveArticleId(null);
    setIsReaderMode(false);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: Category) => {
    setIsReaderMode(false);
    setCurrentCategory(cat);
    setSearchQuery('');
    if (view !== 'home') setView('home');
    const catUrl = cat === 'all' ? '/' : `/category/${cat}`;
    if (window.location.pathname !== catUrl) {
      window.history.pushState({}, '', catUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCountry = (country: Country) => {
    setIsReaderMode(false);
    setSelectedCountry(country);
    setCurrentCategory(country as any);
    setSearchQuery('');
    if (view !== 'home') setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddArticle = (newArt: Article) => {
    const permanentSlug = newArt.slug ? generateArticleSlug(newArt.title, newArt.slug) : generateArticleSlug(newArt.title);
    const finalizedArticle: Article = {
      ...newArt,
      slug: permanentSlug
    };
    setArticles((prev) => [finalizedArticle, ...prev]);
  };

  const handleUpdateArticle = (updatedArt: Article) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== updatedArt.id) return a;
        // Keep existing slug to prevent breaking published links
        const slugToKeep = updatedArt.slug || a.slug || generateArticleSlug(updatedArt.title);
        return {
          ...updatedArt,
          slug: slugToKeep
        };
      })
    );
  };

  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  // Automated RSS curation publish
  const handlePublishRssItem = (item: RssFeedItem) => {
    const newArticle: Article = {
      id: `art-${Date.now()}`,
      title: item.title,
      slug: `rss-${Date.now()}`,
      summary: item.editorialSummary,
      content: `${item.editorialSummary}\n\nنقلت وكالة ${item.source} تفاصيل موسعة حول هذا التطور، مشيرة إلى انعكاساته الإيجابية على التعاون المغاربي والتنمية الإقليمية.\n\nوتواصل البوابة متابعة كافة المستجدات المتعلقة بهذا الملف من خلال شبكة مراسلينا في العواصم المغاربية.`,
      leadImage: '/src/assets/images/maghreb_summit_economic_1790614998175.jpg',
      imageCaption: `تقرير صادر عن ${item.source}`,
      country: item.country,
      category: item.category,
      isBreaking: false,
      publishDate: new Date().toISOString(),
      author: {
        name: 'وحدة الرصد التحريري المغاربي',
        role: 'محرر الشؤون الإخبارية',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      source: `${item.source} - صياغة تحريرية خاصة`,
      sourceUrl: item.originalUrl,
      tags: ['المغرب العربي', 'أخبار', item.category],
      readsCount: 1,
      likesCount: 0,
      commentsCount: 0,
      seo: {
        metaTitle: item.title,
        metaDescription: item.editorialSummary,
        keywords: ['المغرب العربي', item.category],
      },
    };

    setArticles((prev) => [newArticle, ...prev]);
    setRssFeeds((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: 'published' } : f))
    );
  };

  const handleDismissRssItem = (id: string) => {
    setRssFeeds((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'dismissed' } : f))
    );
  };

  const handleAddComment = (
    articleId: string,
    authorName: string,
    content: string,
    country: string
  ) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      articleId,
      authorName,
      country,
      date: 'الآن',
      content,
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
    setArticles((prev) =>
      prev.map((art) =>
        art.id === articleId ? { ...art, commentsCount: art.commentsCount + 1 } : art
      )
    );
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  const activeArticle = articles.find((a) => a.id === activeArticleId) || articles[0];
  const relatedArticles = activeArticle
    ? articles
        .filter(
          (a) =>
            a.id !== activeArticle.id &&
            (a.country === activeArticle.country || a.category === activeArticle.category)
        )
        .slice(0, 3)
    : [];

  const breakingArticles = articles.filter((a) => a.isBreaking);

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem('maghreb_admin_auth');
    } catch (e) {
      console.error(e);
    }
    setIsAdmin(false);
    if (view === 'admin') {
      setView('home');
    }
    setShowSeoModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setShowAdminLoginModal(false);
    setView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (newView: ViewMode) => {
    setIsReaderMode(false);
    if (newView === 'admin') {
      if (!isAdmin) {
        setShowAdminLoginModal(true);
        return;
      }
      setView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (newView === 'seo-tools') {
      if (!isAdmin) {
        setShowAdminLoginModal(true);
        return;
      }
      setShowSeoModal(true);
    } else {
      setView(newView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // If Reader Mode is enabled, render clean distraction-free view without sidebars, ads, headers, or footers
  if (isReaderMode && view === 'article' && activeArticle) {
    return (
      <ReaderView
        article={activeArticle}
        onClose={() => {
          setIsReaderMode(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-red-700 selection:text-white transition-colors duration-200">
      {/* 1. Global Newspaper Header with Masthead, Navigation and Breaking Ticker */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        onSelectCountry={handleSelectCountry}
        onOpenArticle={handleOpenArticle}
        onNavigate={handleNavigate}
        breakingArticles={breakingArticles}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isAdmin={isAdmin}
        onAdminLogout={handleAdminLogout}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
        onOpenDomainModal={() => setShowDomainModal(true)}
      />

      {/* 2. Main Content Router */}
      <div className="flex-1">
        {view === 'home' && (
          <HomePage
            articles={articles}
            currentCategory={currentCategory}
            selectedCountry={selectedCountry}
            searchQuery={searchQuery}
            onOpenArticle={handleOpenArticle}
            onSelectCategory={handleSelectCategory}
            onSelectCountry={handleSelectCountry}
          />
        )}

        {view === 'article' && activeArticle && (
          <ArticleDetail
            article={activeArticle}
            relatedArticles={relatedArticles}
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onOpenArticle={handleOpenArticle}
            onBack={handleBackToHome}
            onSelectCategory={handleSelectCategory}
            onNavigate={(newView) => {
              handleNavigate(newView);
            }}
            onEnterReaderMode={() => {
              setIsReaderMode(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {view === '404' && (
          <ArticleNotFound
            requestedSlug={unknownSlug}
            articles={articles}
            onOpenArticle={handleOpenArticle}
            onBackToHome={handleBackToHome}
            onSearch={(query) => {
              setSearchQuery(query);
              handleBackToHome();
            }}
          />
        )}

        {view === 'admin' && (
          isAdmin ? (
            <AdminCMS
              articles={articles}
              rssFeeds={rssFeeds}
              comments={comments}
              onAddArticle={handleAddArticle}
              onUpdateArticle={handleUpdateArticle}
              onDeleteArticle={handleDeleteArticle}
              onPublishRssItem={handlePublishRssItem}
              onDismissRssItem={handleDismissRssItem}
              onBackToPortal={() => setView('home')}
              onLogout={handleAdminLogout}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-center space-y-4 shadow-xl font-['Tajawal']">
              <h3 className="text-xl font-black font-['Cairo'] text-stone-900 dark:text-white">
                منطقة مخصصة للمشرفين فقط
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                لوحة التحكم ونظام إدارة الأخبار غير متاحين لزوار الموقع. يرجى إدخال رمز المرور الإداري للمتابعة.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setShowAdminLoginModal(true)}
                  className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition shadow"
                >
                  تسجيل دخول المشرف
                </button>
                <button
                  onClick={() => setView('home')}
                  className="px-4 py-2.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition"
                >
                  العودة للواجهة الرئيسية
                </button>
              </div>
            </div>
          )
        )}

        {['about', 'contact', 'privacy', 'cookies', 'terms', 'disclaimer', 'corrections', 'copyright', 'author'].includes(view) && (
          <LegalPages
            page={view as any}
            onNavigate={(newView) => {
              setView(newView);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>

      {/* 3. SEO & Sitemap Inspector Modal (Protected) */}
      {showSeoModal && isAdmin && (
        <SEOMonitorModal
          articles={articles}
          onClose={() => setShowSeoModal(false)}
        />
      )}

      {/* 4. Cookie Consent Banner */}
      <CookieBanner
        onNavigate={(newView) => {
          setView(newView);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 5. Broadsheet Newspaper Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onSelectCountry={handleSelectCountry}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
        onAdminLogout={handleAdminLogout}
        onOpenDomainModal={() => setShowDomainModal(true)}
      />

      {/* 6. Admin Authentication Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* 7. Domain & Site Files Modal */}
      <DomainExportModal
        isOpen={showDomainModal}
        onClose={() => setShowDomainModal(false)}
      />

      {/* Vercel Performance & Speed Analytics */}
      <SpeedInsights />
      <Analytics />
    </div>
  );
}

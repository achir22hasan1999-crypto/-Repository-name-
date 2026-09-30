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

export default function App() {
  // 1. Persistent State
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('maghreb_news_articles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_ARTICLES.length) {
          return parsed;
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

  // Sync articles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maghreb_news_articles', JSON.stringify(articles));
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

  // Dynamic SEO title & description update
  useEffect(() => {
    if (view === 'article' && activeArticleId) {
      const current = articles.find((a) => a.id === activeArticleId);
      if (current) {
        document.title = `${current.title} | المغرب العربي اليوم`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', current.summary);
        }
      }
    } else {
      document.title = 'المغرب العربي اليوم | أخبار المغرب العربي والعالم لحظة بلحظة';
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
  const handleOpenArticle = (id: string) => {
    setActiveArticleId(id);
    setView('article');
    setIsReaderMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Increment read count
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, readsCount: art.readsCount + 1 } : art))
    );
  };

  const handleSelectCategory = (cat: Category) => {
    setIsReaderMode(false);
    setCurrentCategory(cat);
    setSearchQuery('');
    if (view !== 'home') setView('home');
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
    setArticles((prev) => [newArt, ...prev]);
  };

  const handleUpdateArticle = (updatedArt: Article) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === updatedArt.id ? updatedArt : a))
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
            onBack={() => setView('home')}
            onSelectCategory={handleSelectCategory}
            onNavigate={(newView) => {
              setView(newView);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEnterReaderMode={() => {
              setIsReaderMode(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
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

      {/* 8. Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  );
}

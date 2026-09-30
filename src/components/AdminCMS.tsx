import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Flame, 
  Clock, 
  Rss, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Globe, 
  Calendar, 
  Tag, 
  Image as ImageIcon, 
  FileText, 
  Sliders, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Send,
  Eye,
  BarChart3,
  LogOut,
  Lock,
  KeyRound,
  DollarSign,
  Copy,
  Check,
  FileCheck,
  Layers,
  Download
} from 'lucide-react';
import { Article, Category, Country, RssFeedItem, Comment } from '../types';
import { CATEGORIES_CONFIG, MAGHREB_COUNTRIES } from '../data/initialArticles';
import { AdminAnalytics } from './AdminAnalytics';

interface AdminCMSProps {
  articles: Article[];
  rssFeeds: RssFeedItem[];
  comments?: Comment[];
  onAddArticle: (article: Article) => void;
  onUpdateArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onPublishRssItem: (item: RssFeedItem) => void;
  onDismissRssItem: (id: string) => void;
  onBackToPortal: () => void;
  onLogout?: () => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  articles,
  rssFeeds,
  comments = [],
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  onPublishRssItem,
  onDismissRssItem,
  onBackToPortal,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'create' | 'rss' | 'analytics' | 'security' | 'adsense'>('articles');
  const [searchFilter, setSearchFilter] = useState('');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [newPasscode, setNewPasscode] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);

  // AdSense Configuration State
  const [adsensePubId, setAdsensePubId] = useState(() => {
    try {
      return localStorage.getItem('maghreb_adsense_pub_id') || '';
    } catch {
      return '';
    }
  });
  const [topSlotId, setTopSlotId] = useState(() => {
    try {
      return localStorage.getItem('maghreb_adsense_slot_top-leaderboard') || '';
    } catch {
      return '';
    }
  });
  const [articleSlotId, setArticleSlotId] = useState(() => {
    try {
      return localStorage.getItem('maghreb_adsense_slot_in-article') || '';
    } catch {
      return '';
    }
  });
  const [sidebarSlotId, setSidebarSlotId] = useState(() => {
    try {
      return localStorage.getItem('maghreb_adsense_slot_sidebar') || '';
    } catch {
      return '';
    }
  });
  const [adsenseSaved, setAdsenseSaved] = useState(false);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      const res = await fetch('/almaghreb-alyoum-build.zip');
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'almaghreb-alyoum-build.zip';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      }, 100);
    } catch {
      window.open('/almaghreb-alyoum-build.zip', '_blank');
    } finally {
      setDownloadingZip(false);
    }
  };

  // Form state for creating / editing
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [leadImage, setLeadImage] = useState('/src/assets/images/maghreb_summit_economic_1790614998175.jpg');
  const [imageCaption, setImageCaption] = useState('');
  const [country, setCountry] = useState<Country>('morocco');
  const [category, setCategory] = useState<Category>('morocco');
  const [isBreaking, setIsBreaking] = useState(false);
  const [scheduledFor, setScheduledFor] = useState('');
  const [authorName, setAuthorName] = useState('فريق التحرير المغاربي');
  const [authorRole, setAuthorRole] = useState('محرر الأخبار العاجلة');
  const [source, setSource] = useState('المغرب العربي اليوم');
  const [tagsInput, setTagsInput] = useState('المغرب العربي, أخبار, أحداث');
  
  // SEO fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Auto-generate slug and meta title from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!metaTitle || metaTitle === title) {
      setMetaTitle(val);
    }
    const cleanSlug = val
      .trim()
      .toLowerCase()
      .replace(/[^\u0621-\u064A\w\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(cleanSlug.slice(0, 70));
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setSummary('');
    setContent('');
    setLeadImage('/src/assets/images/maghreb_summit_economic_1790614998175.jpg');
    setImageCaption('');
    setCountry('morocco');
    setCategory('morocco');
    setIsBreaking(false);
    setScheduledFor('');
    setTagsInput('المغرب العربي, تنمية, اقتصاد');
    setMetaTitle('');
    setMetaDescription('');
    setEditingArticle(null);
  };

  const handleEditClick = (art: Article) => {
    setEditingArticle(art);
    setTitle(art.title);
    setSlug(art.slug);
    setSummary(art.summary);
    setContent(art.content);
    setLeadImage(art.leadImage);
    setImageCaption(art.imageCaption || '');
    setCountry(art.country);
    setCategory(art.category);
    setIsBreaking(art.isBreaking);
    setScheduledFor(art.scheduledFor || '');
    setAuthorName(art.author.name);
    setAuthorRole(art.author.role);
    setSource(art.source);
    setTagsInput(art.tags.join(', '));
    setMetaTitle(art.seo?.metaTitle || art.title);
    setMetaDescription(art.seo?.metaDescription || art.summary);
    setActiveTab('create');
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
      alert('يرجى ملء جميع الحقول الإلزامية (العنوان، الملخص، نص المقال).');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const articleData: Article = {
      id: editingArticle ? editingArticle.id : `art-${Date.now()}`,
      title: title.trim(),
      slug: slug || `news-${Date.now()}`,
      summary: summary.trim(),
      content: content.trim(),
      leadImage: leadImage || '/src/assets/images/maghreb_summit_economic_1790614998175.jpg',
      imageCaption: imageCaption.trim() || undefined,
      country,
      category,
      isBreaking,
      publishDate: editingArticle ? editingArticle.publishDate : new Date().toISOString(),
      scheduledFor: scheduledFor ? scheduledFor : undefined,
      author: {
        name: authorName.trim() || 'هيئة التحرير',
        role: authorRole.trim() || 'محرر صحفي',
        avatar: editingArticle?.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      source: source.trim() || 'المغرب العربي اليوم',
      tags: tagsArray,
      readsCount: editingArticle ? editingArticle.readsCount : 1,
      likesCount: editingArticle ? editingArticle.likesCount : 0,
      commentsCount: editingArticle ? editingArticle.commentsCount : 0,
      seo: {
        metaTitle: metaTitle.trim() || title.trim(),
        metaDescription: metaDescription.trim() || summary.trim(),
        keywords: tagsArray,
      },
    };

    if (editingArticle) {
      onUpdateArticle(articleData);
      setSuccessToast('تم تحديث الخبر بنجاح!');
    } else {
      onAddArticle(articleData);
      setSuccessToast('تم نشر الخبر الجديد بنجاح في الموقع!');
    }

    resetForm();
    setTimeout(() => {
      setSuccessToast('');
      setActiveTab('articles');
    }, 1500);
  };

  // Filtered articles in management table
  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.country.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.author.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // SEO Score calculation (simple heuristic)
  const seoScore = [
    title.length >= 30 && title.length <= 65,
    summary.length >= 100 && summary.length <= 160,
    tagsInput.split(',').length >= 3,
    leadImage.length > 5,
    slug.length > 5,
  ].filter(Boolean).length * 20;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-['Tajawal']">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-red-700" />
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-['Cairo']">
              لوحة التحكم ونظام إدارة الأخبار
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            إدارة الأخبار، جدولة النشر، ضبط محركات البحث (SEO)، واستيراد وتلخيص خلاصات RSS
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onBackToPortal}
            className="flex items-center gap-2 px-3.5 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>معاينة الموقع للجمهور</span>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition shadow-sm"
              title="تسجيل خروج المشرف وقفل لوحة التحكم"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>تسجيل الخروج وقفل اللوحة</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        <div className="bg-white dark:bg-stone-900 p-4 rounded-lg border border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-500 mb-1">إجمالي المقالات</div>
          <div className="text-2xl font-black text-stone-900 dark:text-white font-mono">
            {articles.length}
          </div>
        </div>
        <div className="bg-white dark:bg-stone-900 p-4 rounded-lg border border-stone-200 dark:border-stone-800">
          <div className="text-xs text-red-600 mb-1 font-semibold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            <span>الأخبار العاجلة</span>
          </div>
          <div className="text-2xl font-black text-red-600 font-mono">
            {articles.filter((a) => a.isBreaking).length}
          </div>
        </div>
        <div className="bg-white dark:bg-stone-900 p-4 rounded-lg border border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-500 mb-1 flex items-center gap-1">
            <Rss className="w-3.5 h-3.5 text-amber-500" />
            <span>خلاصات RSS المعلقة</span>
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {rssFeeds.filter((f) => f.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white dark:bg-stone-900 p-4 rounded-lg border border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-500 mb-1">إجمالي القراءات</div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {articles.reduce((acc, curr) => acc + curr.readsCount, 0).toLocaleString('ar-MA')}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'articles'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          قائمة الأخبار الحالية ({articles.length})
        </button>
        <button
          onClick={() => {
            resetForm();
            setActiveTab('create');
          }}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'create'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{editingArticle ? 'تعديل الخبر الحالي' : 'إضافة خبر جديد'}</span>
        </button>
        <button
          onClick={() => setActiveTab('rss')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'rss'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Rss className="w-4 h-4 text-amber-500" />
          <span>الأخبار التلقائية والمصادر (RSS & APIs)</span>
          <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {rssFeeds.filter((r) => r.status === 'pending').length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          <span>إحصائيات وتحليلات الأداء</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4 text-stone-500" />
          <span>أمان الدخول والرمز السري</span>
        </button>
        <button
          onClick={() => setActiveTab('adsense')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'adsense'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>ربط Google AdSense والأرباح</span>
        </button>
      </div>

      {/* Success notification */}
      {successToast && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 rounded-lg flex items-center gap-2 text-sm font-bold animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ----------------- TAB 1: LIST ARTICLES ----------------- */}
      {activeTab === 'articles' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="تصفية الأخبار حسب العنوان أو الدولة أو الكاتب..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={() => {
                resetForm();
                setActiveTab('create');
              }}
              className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة خبر جديد</span>
            </button>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-800">
                  <tr>
                    <th className="p-3">العنوان</th>
                    <th className="p-3">الدولة</th>
                    <th className="p-3">القسم</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">تاريخ النشر</th>
                    <th className="p-3">المشاهدات</th>
                    <th className="p-3 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-stone-400">
                        لا توجد نتائج مطابقة لبحثك.
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition">
                        <td className="p-3 font-bold text-stone-900 dark:text-stone-100 max-w-xs sm:max-w-md truncate">
                          {art.title}
                        </td>
                        <td className="p-3 text-stone-600 dark:text-stone-300">
                          {MAGHREB_COUNTRIES.find((c) => c.id === art.country)?.name || art.country}
                        </td>
                        <td className="p-3 text-stone-500">
                          {CATEGORIES_CONFIG.find((cat) => cat.id === art.category)?.label || art.category}
                        </td>
                        <td className="p-3">
                          {art.isBreaking ? (
                            <span className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded font-bold text-[10px]">
                              عاجل 🔥
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-bold text-[10px]">
                              منشور
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-stone-400 font-mono">
                          {new Date(art.publishDate).toLocaleDateString('ar-MA')}
                        </td>
                        <td className="p-3 font-mono text-stone-600 dark:text-stone-400">
                          {art.readsCount.toLocaleString('ar-MA')}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(art)}
                              className="p-1.5 text-stone-600 hover:text-red-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition"
                              title="تعديل المقال"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف الخبر: "${art.title}"؟`)) {
                                  onDeleteArticle(art.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded transition"
                              title="حذف المقال"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: CREATE / EDIT ARTICLE ----------------- */}
      {activeTab === 'create' && (
        <form onSubmit={handleSaveArticle} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content Column (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white dark:bg-stone-900 p-5 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-2">
                  بيانات المقال الأساسية
                </h3>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    عنوان الخبر الرئيسي *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="اكتب عنواناً جذاباً ودقيقاً..."
                    className="w-full text-sm font-bold p-2.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    عدد الحروف: {title.length} (المثالي لمحركات البحث: 40-60 حرفاً)
                  </span>
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    الرابط الدائم النظيف (Clean URL Slug)
                  </label>
                  <div className="flex items-center text-xs text-stone-400 dir-ltr bg-stone-100 dark:bg-stone-800 px-3 py-2 rounded border border-stone-300 dark:border-stone-700 font-mono">
                    <span>https://almaghreb-alyoum.news/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="bg-transparent flex-1 focus:outline-none text-stone-800 dark:text-stone-200 font-mono"
                    />
                  </div>
                </div>

                {/* Summary / Deck */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    ملخص الخبر (المقدمة والـ Deck) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={summary}
                    onChange={(e) => {
                      setSummary(e.target.value);
                      if (!metaDescription) setMetaDescription(e.target.value);
                    }}
                    placeholder="ملخص مكثف من جملتين يشرح أهمية الخبر..."
                    className="w-full text-xs p-2.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  ></textarea>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    نص المقال الكامل (افصل بين الفقرات بسطر فارغ) *
                  </label>
                  <textarea
                    required
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="اكتب تفاصيل التقرير، تصريحات المسؤولين، سياق الحدث، والأرقام والإحصائيات ذات الصلة..."
                    className="w-full text-xs leading-relaxed p-3 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  ></textarea>
                </div>
              </div>

              {/* SEO Box */}
              <div className="bg-white dark:bg-stone-900 p-5 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      تحسين محركات البحث (SEO Engine)
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span>معدل جودة SEO:</span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono ${
                        seoScore >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : seoScore >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {seoScore}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    عنوان Meta Title (يظهر في نتائج محركات البحث)
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="العنوان المحسن لمحركات البحث..."
                    className="w-full text-xs p-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    وصف Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="وصف شيق بين 120 و 160 حرفاً..."
                    className="w-full text-xs p-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  ></textarea>
                </div>

                {/* Google SERP Preview */}
                <div className="p-3 bg-stone-50 dark:bg-stone-800/80 rounded border border-stone-200 dark:border-stone-700">
                  <div className="text-[11px] text-stone-400 font-bold mb-2">
                    معاينة الظهور في Google Search:
                  </div>
                  <div className="font-sans text-right">
                    <div className="text-[11px] text-stone-500 flex items-center gap-1">
                      <span>almaghreb-alyoum.news</span>
                      <span>› {category}</span>
                    </div>
                    <div className="text-sm font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">
                      {metaTitle || title || 'عنوان الخبر سيظهر هنا'} - المغرب العربي اليوم
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-2">
                      {metaDescription || summary || 'وصف الخبر لمحركات البحث يظهر هنا بدقة عالية.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Controls Column (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Publishing Options Box */}
              <div className="bg-white dark:bg-stone-900 p-5 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-2">
                  إعدادات النشر
                </h3>

                {/* Breaking news flag */}
                <label className="flex items-center gap-2 p-2.5 bg-red-50 dark:bg-red-950/40 rounded border border-red-200 dark:border-red-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-red-700 dark:text-red-300 block">
                      تحديد كـ "خبر عاجل" 🔥
                    </span>
                    <span className="text-stone-500 text-[10px]">
                      يظهر فوراً في الشريط العلوي باللون الأحمر
                    </span>
                  </div>
                </label>

                {/* Country selector */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    الدولة التابعة للخبر *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value as Country)}
                    className="w-full text-xs p-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    <option value="morocco">🇲🇦 المغرب</option>
                    <option value="algeria">🇩🇿 الجزائر</option>
                    <option value="tunisia">🇹🇳 تونس</option>
                    <option value="libya">🇱🇾 ليبيا</option>
                    <option value="mauritania">🇲🇷 موريتانيا</option>
                    <option value="arab">🌍 أخبار عربية</option>
                    <option value="world">🌐 أخبار عالمية</option>
                  </select>
                </div>

                {/* Category selector */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    القسم التحريري *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full text-xs p-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    {CATEGORIES_CONFIG.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scheduled Publishing */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>جدولة النشر (اختياري)</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    اتركه فارغاً للنشر الفوري
                  </span>
                </div>

                {/* Author & Source */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    اسم الكاتب أو المحرر
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    المصدر والاعتماد
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="مثال: وكالة الأنباء المغاربية ومراسلنا"
                    className="w-full text-xs p-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>

                {/* Keywords / Tags */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>الكلمات المفتاحية (مفصولة بفواصل)</span>
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="المغرب, طاقة, اقتصاد"
                    className="w-full text-xs p-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Lead Image Selector */}
              <div className="bg-white dark:bg-stone-900 p-5 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>صورة الخبر البارزة</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    رابط الصورة
                  </label>
                  <input
                    type="text"
                    value={leadImage}
                    onChange={(e) => setLeadImage(e.target.value)}
                    placeholder="https://... أو مسار الصورة"
                    className="w-full text-xs p-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>

                {/* Preset quick image selection */}
                <div>
                  <div className="text-[11px] text-stone-400 mb-1.5 font-bold">
                    أو اختر من المعرض التحريري المعتمد:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'قمة مغاربية', path: '/src/assets/images/maghreb_summit_economic_1790614998175.jpg' },
                      { name: 'طاقة المغرب', path: '/src/assets/images/morocco_solar_energy_1790615012294.jpg' },
                      { name: 'تكنولوجيا تونس', path: '/src/assets/images/tunisia_carthage_tech_1790615024218.jpg' },
                    ].map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setLeadImage(preset.path)}
                        className={`text-[10px] p-1.5 rounded border truncate transition ${
                          leadImage === preset.path
                            ? 'bg-red-50 text-red-700 border-red-400 font-bold'
                            : 'bg-stone-100 hover:bg-stone-200 border-stone-200'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview of selected image */}
                {leadImage && (
                  <div className="rounded overflow-hidden border border-stone-200 aspect-video bg-stone-100">
                    <img
                      src={leadImage}
                      alt="معاينة"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    تعليق الصورة والاعتماد (Caption)
                  </label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="مثال: جانب من أشغال المنتدى المغاربي"
                    className="w-full text-xs p-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-lg text-sm shadow transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{editingArticle ? 'حفظ التعديلات ونشر' : 'نشر الخبر في البوابة'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('articles');
                  }}
                  className="w-full bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold py-2 rounded text-xs transition"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ----------------- TAB 3: RSS & AUTOMATED FEEDS ----------------- */}
      {activeTab === 'rss' && (
        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-lg border border-amber-200 dark:border-amber-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>سياسة التحرير والأخبار التلقائية:</strong> يتم رصد وتلقي الأخبار من وكالات الأنباء الرسمية المعتمدة (MAP, APS, TAP, LANA, AMI).
              حرصاً على ميثاق الشرف وحقوق الملكية، <strong>لا يتم نسخ المقالات كاملة</strong> بل يقترح النظام ملخصاً تحريرياً أصلياً مع توثيق المصدر للتحقق والموافقة قبل نشره في الموقع بضغطة واحدة.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rssFeeds.map((feed) => {
              const isPublished = feed.status === 'published';
              const isDismissed = feed.status === 'dismissed';

              return (
                <div
                  key={feed.id}
                  className={`p-5 rounded-lg border transition ${
                    isPublished
                      ? 'bg-emerald-50/50 border-emerald-300 opacity-80'
                      : isDismissed
                      ? 'bg-stone-100 border-stone-200 opacity-50'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-red-700 dark:text-red-400">
                      {feed.source} ({feed.sourceAgency})
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">
                      {new Date(feed.date).toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-2 leading-snug">
                    {feed.title}
                  </h4>

                  <div className="mb-3 p-3 bg-stone-50 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 text-xs">
                    <span className="font-bold text-stone-500 block mb-1">
                      الملخص التحريري الأصلي المقترح:
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {feed.editorialSummary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                    <a
                      href={feed.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-500 hover:text-red-700 flex items-center gap-1 text-[11px]"
                    >
                      <span>المصدر الأصلي</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-2">
                      {!isPublished && !isDismissed && (
                        <>
                          <button
                            onClick={() => onDismissRssItem(feed.id)}
                            className="px-2.5 py-1 text-stone-400 hover:text-stone-600 text-xs rounded hover:bg-stone-100 transition"
                          >
                            تجاهل
                          </button>
                          <button
                            onClick={() => {
                              onPublishRssItem(feed);
                              setSuccessToast(`تمت مراجعة وصياغة ونشر خبر: "${feed.title}" بنجاح!`);
                              setTimeout(() => setSuccessToast(''), 3000);
                            }}
                            className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded flex items-center gap-1 shadow-sm transition"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>مراجعة ونشر</span>
                          </button>
                        </>
                      )}

                      {isPublished && (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>تم النشر في البوابة</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------- TAB 4: EDITORIAL ANALYTICS ----------------- */}
      {activeTab === 'analytics' && (
        <AdminAnalytics articles={articles} comments={comments} />
      )}

      {/* ----------------- TAB 5: SECURITY & PASSCODE MANAGEMENT ----------------- */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 max-w-3xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black font-['Cairo'] text-stone-900 dark:text-white">
                حماية لوحة التحكم والخصوصية التحريرية
              </h3>
              <p className="text-xs text-stone-500">
                إدارة أمان الوصول لمنظومة الأخبار، التحرير، خلاصات RSS، وأدوات محركات البحث
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <strong className="font-bold block mb-1">اللوحة مخفية ومحمية بالكامل عن زوار الموقع:</strong>
              تم حجب كافة روابط وأزرار لوحة التحكم، محرر الأخبار، خلاصات RSS، وأدوات الـ SEO عن الواجهة العامة للموقع. لا يمكن لأي زائر عادي رؤيتها أو الوصول إليها دون إدخال رمز المرور الإداري.
            </div>
          </div>

          {/* Change Passcode Box */}
          <div className="p-5 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-red-600" />
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                تغيير رمز المرور الإداري
              </h4>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={newPasscode}
                onChange={(e) => {
                  setNewPasscode(e.target.value);
                  setPasscodeSuccess(false);
                }}
                placeholder="أدخل رمز المرور الجديد..."
                className="flex-1 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-600"
              />
              <button
                type="button"
                onClick={() => {
                  if (newPasscode.trim().length >= 4) {
                    localStorage.setItem('maghreb_admin_password', newPasscode.trim());
                    setPasscodeSuccess(true);
                    setNewPasscode('');
                  } else {
                    alert('يرجى إدخال رمز مرور مكون من 4 أحرف أو أرقام على الأقل');
                  }
                }}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow"
              >
                حفظ الرمز الجديد
              </button>
            </div>

            {passcodeSuccess && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                <span>تم تحديث رمز المرور بنجاح وحفظه بأمان!</span>
              </div>
            )}

            <p className="text-[11px] text-stone-500">
              الرمز الافتراضي المبدئي هو: <code className="font-mono bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded text-red-600">admin2026</code>
            </p>
          </div>

          {/* Quick Access Info for Admin */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              كيفية وصول المشرف للوحة لاحقاً:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 rounded-xl">
                <div className="font-bold text-stone-800 dark:text-stone-200 mb-1 flex items-center gap-1.5">
                  <span>1. اختصار لوحة المفاتيح:</span>
                </div>
                <p className="text-stone-500">
                  اضغط على <kbd className="px-1.5 py-0.5 bg-stone-200 dark:bg-stone-700 rounded font-mono text-[10px]">Ctrl + Shift + A</kbd> في أي وقت وأنت تتصفح الموقع لفتح نافذة الدخول السريع.
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 rounded-xl">
                <div className="font-bold text-stone-800 dark:text-stone-200 mb-1 flex items-center gap-1.5">
                  <span>2. رابط أسفل الصفحة (Footer):</span>
                </div>
                <p className="text-stone-500">
                  انزل لأسفل الفوتر، ستجد كلمة خفية وهادئة بجانب حقوق النشر باسم <strong className="text-stone-700 dark:text-stone-300">"بوابة المحررين"</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Lock & Logout Button */}
          {onLogout && (
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>تسجيل الخروج الآن وقفل اللوحة عن أي مستخدم</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB 6: GOOGLE ADSENSE & MONETIZATION ----------------- */}
      {activeTab === 'adsense' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 max-w-4xl space-y-8 font-['Tajawal']">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700">
                <DollarSign className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  تحقيق الدخل والأرباح
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-['Cairo'] text-stone-900 dark:text-white mt-1">
                  ربط وتفعيل Google AdSense
                </h3>
                <p className="text-xs text-stone-500">
                  إدارة معرف الناشر، وتفعيل ملف ads.txt، وتخصيص الوحدات الإعلانية في أنحاء الجريدة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                adsensePubId 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${adsensePubId ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <span>{adsensePubId ? 'معرف AdSense مرتبط ونشط' : 'بانتظار إدخال معرف الناشر'}</span>
              </span>
            </div>
          </div>

          {/* Quick Notice about AdSense Ready Architecture */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-900 dark:text-blue-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
            <div>
              <strong className="font-bold block mb-1">الموقع مهيأ 100% لتلبية شروط Google AdSense الصارمة:</strong>
              يحتوي الموقع مسبقاً على كافة المتطلبات الإلزامية للقبول: (سياسة الخصوصية مع بند ملفات تعريف الارتباط DART وإعلانات جوجل، بنر موافقة الكوكيز المتوافق مع لوائح GDPR، صفحة من نحن، صفحة اتصل بنا مع قسم الإعلانات والشراكات، وتصميم صحفي معتمد سريع التحميل وخالٍ من الأخطاء).
            </div>
          </div>

          {/* Alert: Explaining 'Restricted Domain' Error in AdSense */}
          <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-2xl text-amber-950 dark:text-amber-100 text-xs sm:text-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300 text-sm sm:text-base font-['Cairo']">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>تنبيه هام حول خطأ: «يحتوي عنوان URL على نطاق مقيَّد»</span>
            </div>
            <p className="leading-relaxed">
              إذا ظهرت لك هذه الرسالة في AdSense عند محاولة إضافة الرابط، فهذا أمر طبيعي ومتوقع لسببين رئيسيين:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-900/40 rounded-xl">
                <span className="font-bold text-stone-900 dark:text-white block mb-1 text-xs">
                  1. روابط المنصات السحابية المؤقتة محظورة:
                </span>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-normal">
                  ترفض جوجل أدسنس قبول النطاقات الفرعية التابعة للمنصات السحابية والتطويرية (مثل <code className="text-red-600 bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">ai.studio</code> أو <code className="text-red-600 bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">run.app</code>)، وتشترط دائماً <strong>نطاقاً خاصاً (Custom Domain)</strong> مثل <code className="text-emerald-600 bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">yourname.com</code>.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-900/40 rounded-xl">
                <span className="font-bold text-stone-900 dark:text-white block mb-1 text-xs">
                  2. صيغة الرابط المطلوبة في أدسنس:
                </span>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-normal">
                  تطلب جوجل إدخال النطاق الرئيسي فقط بدون بروتوكول <code className="text-amber-600 bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">https://</code> وبدون خط مائل <code className="text-amber-600 bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">/</code> في النهاية.
                </p>
              </div>
            </div>
            <div className="bg-amber-100/70 dark:bg-amber-900/30 p-2.5 rounded-lg text-xs text-amber-900 dark:text-amber-200">
              💡 <strong>الحل:</strong> احجز نطاقاً خاصاً لموقعك (مثل <code className="font-bold">almaghreb-today.com</code> أو <code className="font-bold">.net</code> أو <code className="font-bold">.ma</code>) واربطه بالموقع، ثم اكتبه في أدسنس بصيغة: <strong className="font-mono bg-white dark:bg-stone-900 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-400">almaghreb-today.com</strong> وسيُقبل فوراً!
            </div>
          </div>

          {/* 1. Publisher ID Box */}
          <div className="p-6 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>1. معرف الناشر الخاص بك (Publisher ID)</span>
              </h4>
              <span className="text-[11px] text-stone-500">مثال: ca-pub-1234567890123456</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={adsensePubId}
                onChange={(e) => {
                  setAdsensePubId(e.target.value);
                  setAdsenseSaved(false);
                }}
                placeholder="أدخل معرف الناشر مثل ca-pub-xxxxxxxxxxxxxxxx..."
                className="flex-1 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-sm font-mono text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => {
                  const cleaned = adsensePubId.trim();
                  localStorage.setItem('maghreb_adsense_pub_id', cleaned);
                  setAdsenseSaved(true);
                  setTimeout(() => setAdsenseSaved(false), 4000);
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>حفظ وتفعيل الشيفرة</span>
              </button>
            </div>

            {adsenseSaved && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تم حفظ معرف الناشر بنجاح! سيتم حقن كود AdSense الرسمي في رأس الصفحة تلقائياً لجميع الزوار.</span>
              </div>
            )}
          </div>

          {/* 2. ads.txt File Generation */}
          <div className="p-6 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-600" />
                  <span>2. ملف التصريح الرسمي (ads.txt)</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  ملف إلزامي من جوجل يثبت ملكيتك للموقع ويمنع الاحتيال الإعلاني.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200">
                منشور على /ads.txt
              </span>
            </div>

            {/* Generated ads.txt line */}
            <div className="p-3 bg-stone-900 text-stone-100 rounded-xl font-mono text-xs flex items-center justify-between overflow-x-auto border border-stone-800">
              <code>
                google.com, {adsensePubId ? (adsensePubId.replace('ca-', '')) : 'pub-0000000000000000'}, DIRECT, f08c47fec0942fa0
              </code>
              <button
                type="button"
                onClick={() => {
                  const line = `google.com, ${adsensePubId ? (adsensePubId.replace('ca-', '')) : 'pub-0000000000000000'}, DIRECT, f08c47fec0942fa0`;
                  navigator.clipboard.writeText(line);
                  setCopiedAdsTxt(true);
                  setTimeout(() => setCopiedAdsTxt(false), 2500);
                }}
                className="shrink-0 mr-3 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[11px] flex items-center gap-1 transition"
              >
                {copiedAdsTxt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAdsTxt ? 'تم النسخ!' : 'نسخ السطر'}</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed">
              💡 <strong>معلومة تقنية:</strong> تم إنشاء ملف <code className="text-red-600 bg-stone-200 dark:bg-stone-700 px-1 rounded">public/ads.txt</code> في الموقع وهو متاح تلقائياً لأي زاحف أو روبوت من جوجل عبر الرابط: <code className="text-stone-700 dark:text-stone-300">https://your-domain/ads.txt</code>.
            </p>
          </div>

          {/* 3. Slot IDs Customization */}
          <div className="p-6 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>3. معرفات الوحدات الإعلانية (Ad Unit Slot IDs - اختياري)</span>
            </h4>
            <p className="text-xs text-stone-500">
              إذا كنت تفضل الإعلانات اليدوية بدلاً من الإعلانات التلقائية (Auto Ads)، يمكنك إدخال Slot ID لكل مساحة:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  أعلى الصفحة (Leaderboard)
                </label>
                <input
                  type="text"
                  value={topSlotId}
                  onChange={(e) => {
                    setTopSlotId(e.target.value);
                    localStorage.setItem('maghreb_adsense_slot_top-leaderboard', e.target.value.trim());
                  }}
                  placeholder="مثال: 1234567890"
                  className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 rounded border border-stone-300 dark:border-stone-600 font-mono"
                />
              </div>

              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  داخل المقال (In-Article)
                </label>
                <input
                  type="text"
                  value={articleSlotId}
                  onChange={(e) => {
                    setArticleSlotId(e.target.value);
                    localStorage.setItem('maghreb_adsense_slot_in-article', e.target.value.trim());
                  }}
                  placeholder="مثال: 2345678901"
                  className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 rounded border border-stone-300 dark:border-stone-600 font-mono"
                />
              </div>

              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  الشريط الجانبي (Sidebar)
                </label>
                <input
                  type="text"
                  value={sidebarSlotId}
                  onChange={(e) => {
                    setSidebarSlotId(e.target.value);
                    localStorage.setItem('maghreb_adsense_slot_sidebar', e.target.value.trim());
                  }}
                  placeholder="مثال: 3456789012"
                  className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 rounded border border-stone-300 dark:border-stone-600 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 4. Complete Checklist for Getting Approved by Google AdSense */}
          <div className="p-6 bg-stone-900 text-stone-100 rounded-2xl space-y-4">
            <h4 className="text-base font-bold font-['Cairo'] text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>دليل وخطوات ربط وقبول موقعك في Google AdSense خطوة بخطوة</span>
            </h4>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3 p-3 bg-stone-800/80 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-white block font-bold">ربط الموقع بدومين مخصص (Custom Domain):</strong>
                  <p className="text-stone-300 text-xs mt-0.5">
                    تتطلب شركة Google نطاقاً مخصصاً من المستوى الأول (مثل <code>almaghreb-alyoum.com</code> أو <code>.net</code> أو <code>.ma</code>) بدلاً من النطاقات المجانية المؤقتة لضمان القبول السريع.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-stone-800/80 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-white block font-bold">إنشاء حساب وإضافة الموقع إلى AdSense:</strong>
                  <p className="text-stone-300 text-xs mt-0.5">
                    توجه إلى <a href="https://adsense.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-bold">موقع Google AdSense</a>، وسجل الدخول بحساب جيميل الخاص بك، ثم اختر "المواقع" (Sites) واضغط على "إضافة موقع" (Add Site).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-stone-800/80 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-white block font-bold">نسخ معرف الناشر وحفظه هنا:</strong>
                  <p className="text-stone-300 text-xs mt-0.5">
                    انسخ معرف الناشر الخاص بك المبتدئ بـ <code>ca-pub-</code> وضعه في الحقل رقم (1) أعلاه واضغط على "حفظ وتفعيل الشيفرة". سيقوم النظام بربط موقعك فورياً.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-stone-800/80 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-white block font-bold">إرسال الموقع للمراجعة (Request Review):</strong>
                  <p className="text-stone-300 text-xs mt-0.5">
                    ارجع للوحة تحكم Google AdSense، وضع علامة "صح" على خيار "لقد وضعت الرمز في موقعي"، واضغط على زر **"طلب المراجعة" (Request Review)**. تستغرق المراجعة عادة بين 24 ساعة إلى بضعة أيام، وسيتم قبول الموقع وبدء ظهور الإعلانات والأرباح مباشرة!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Custom Domain & DNS Setup Guide */}
          <div className="p-6 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 rounded-2xl space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-200 dark:border-stone-700">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-700">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold font-['Cairo'] text-stone-900 dark:text-white">
                  دليل ربط النطاق الخاص (Custom Domain) وسجلات الـ DNS
                </h4>
                <p className="text-xs text-stone-500">
                  خطوات نقل الموقع ليعمل تحت نطاقك الرسمي (مثل almaghreb-alyoum.com) وقبوله في AdSense
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-red-700">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-[11px]">1</span>
                  <span>حجز النطاق</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  احجز اسم موقعك من شركات مثل Namecheap أو Cloudflare أو Hostinger أو GoDaddy (تكلفتها 5$ - 10$ سنوياً).
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-red-700">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-[11px]">2</span>
                  <span>الاستضافة أو النشر</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  ارفع كود الموقع على Vercel أو Cloudflare Pages (مجاناً) أو على استضافة cPanel / Hostinger عبر مجلد <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded">public_html</code>.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-red-700">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-[11px]">3</span>
                  <span>ضبط سجلات DNS</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  أضف سجلات A و CNAME في لوحة تحكم الدومين لربطه بخادمك، وسيتم تفعيل شهادة SSL الخضراء (HTTPS) تلقائياً.
                </p>
              </div>
            </div>

            {/* DNS Records Reference Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                جدول سجلات DNS القياسية الموصى بها في لوحة تحكم النطاق:
              </span>
              <div className="overflow-x-auto border border-stone-200 dark:border-stone-700 rounded-xl">
                <table className="w-full text-xs text-right">
                  <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold border-b border-stone-200 dark:border-stone-700">
                    <tr>
                      <th className="p-2.5">النوع (Type)</th>
                      <th className="p-2.5">الاسم / المضيف (Name / Host)</th>
                      <th className="p-2.5">القيمة / الهدف (Value / Target)</th>
                      <th className="p-2.5">المهلة (TTL)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-600 dark:text-stone-300 font-mono">
                    <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                      <td className="p-2.5 font-bold text-red-600">A</td>
                      <td className="p-2.5">@</td>
                      <td className="p-2.5 text-stone-800 dark:text-stone-100 font-semibold">عنوان IP الخاص باستضافتك أو منصة النشر</td>
                      <td className="p-2.5">تلقائي (Automatic)</td>
                    </tr>
                    <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                      <td className="p-2.5 font-bold text-emerald-600">CNAME</td>
                      <td className="p-2.5">www</td>
                      <td className="p-2.5 text-stone-800 dark:text-stone-100 font-semibold">yourdomain.com أو cname خادم الاستضافة</td>
                      <td className="p-2.5">تلقائي (Automatic)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hostinger Step-by-Step Card with Direct Download */}
            <div className="p-5 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-bold font-['Cairo'] text-sm sm:text-base">
                  <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">H</span>
                  <span>طريقة رفع وتشغيل الموقع على Hostinger في 3 دقائق:</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={downloadingZip}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className={`w-4 h-4 ${downloadingZip ? 'animate-bounce' : ''}`} />
                  <span>{downloadingZip ? 'جاري التحميل...' : 'تحميل ملفات الموقع الجاهزة للاستضافة (ZIP)'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-purple-200 dark:border-purple-900/50 space-y-1">
                  <span className="font-bold text-purple-700 dark:text-purple-300 block">1. افتح File Manager في Hostinger:</span>
                  <p className="text-stone-600 dark:text-stone-300">
                    من لوحة تحكم Hostinger (hPanel)، اذهب إلى <strong>Websites</strong> ثم اضغط <strong>Manage</strong> للدومين <code className="text-purple-600 font-bold">almaghreb-alyoum.com</code>، ثم افتح <strong>File Manager</strong>.
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-purple-200 dark:border-purple-900/50 space-y-1">
                  <span className="font-bold text-purple-700 dark:text-purple-300 block">2. ادخل إلى مجلد public_html:</span>
                  <p className="text-stone-600 dark:text-stone-300">
                    ادخل إلى مجلد <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-purple-700">public_html</code> واضغط على زر <strong>Upload</strong> لرفع ملف الـ ZIP الذي حملته من الزر بالأعلى.
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-purple-200 dark:border-purple-900/50 space-y-1">
                  <span className="font-bold text-purple-700 dark:text-purple-300 block">3. فك الضغط (Extract):</span>
                  <p className="text-stone-600 dark:text-stone-300">
                    اضغط بالزر الأيمن على الملف واختر <strong>Extract</strong> مباشرة داخل <code className="font-mono text-purple-700">public_html</code>. مبروك! موقعك الآن يعمل رسمياً على الهواء مباشرة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

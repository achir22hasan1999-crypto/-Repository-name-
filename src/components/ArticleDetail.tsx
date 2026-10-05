import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Eye, 
  Share2, 
  Printer, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageSquare, 
  Check, 
  Copy, 
  ChevronRight, 
  Send, 
  Bookmark,
  BookOpen,

  Utensils,
  ChefHat,
  ListChecks,
  Flame,
  Sparkles,
  MapPin,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Article, Comment, ViewMode, Category } from '../types';
import { AdSenseBanner } from './AdSenseBanner';
import { formatSafeArabicDateFull, formatSafeArabicDate } from '../utils/dateFormatter';
import { getFullArticleUrl, DOMAIN_NAME } from '../utils/slugUtils';
import { ArticleCard } from './ArticleCard';
import { CATEGORIES_CONFIG, MAGHREB_COUNTRIES, GULF_COUNTRIES } from '../data/initialArticles';

interface ArticleDetailProps {
  article: Article;
  relatedArticles: Article[];
  comments: Comment[];
  onAddComment: (articleId: string, authorName: string, content: string, country: string) => void;
  onLikeComment: (commentId: string) => void;
  onOpenArticle: (id: string) => void;
  onBack: () => void;
  onNavigate?: (view: ViewMode) => void;
  onEnterReaderMode?: () => void;
  onSelectCategory?: (cat: Category) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  relatedArticles,
  comments,
  onAddComment,
  onLikeComment,
  onOpenArticle,
  onBack,
  onNavigate,
  onEnterReaderMode,
  onSelectCategory,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likesCount);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  // Comment form state
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentCountry, setNewCommentCountry] = useState('المغرب');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Dynamic SEO, Canonical URL and Schema.org Injection
  useEffect(() => {
    // 1. Update Title
    const originalTitle = document.title;
    document.title = `${article.seo.metaTitle || article.title} | المغرب العربي اليوم`;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const originalDesc = metaDesc.getAttribute('content') || '';
    metaDesc.setAttribute('content', article.seo.metaDescription || article.summary);

    // 3. Update or create Canonical URL
    const canonicalUrl = getFullArticleUrl(article);
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    let createdCanonical = false;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
      createdCanonical = true;
    }
    const originalCanonical = canonicalLink.getAttribute('href') || `${DOMAIN_NAME}/`;
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Update OpenGraph Tags
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    // 5. Inject Schema.org JSON-LD (NewsArticle vs Article vs Recipe)
    const scriptId = 'dynamic-article-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    if (article.contentType === 'recipe' && article.recipeData) {
      const recipeSchema = {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: article.title,
        image: [article.leadImage],
        description: article.summary,
        keywords: article.tags.join(', '),
        author: {
          '@type': 'Person',
          name: article.author.name
        },
        publisher: {
          '@type': 'Organization',
          name: 'المغرب العربي اليوم',
          url: DOMAIN_NAME,
          logo: {
            '@type': 'ImageObject',
            url: `${DOMAIN_NAME}/logo.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        datePublished: article.publishDate,
        dateModified: article.updatedDate || article.publishDate,
        prepTime: article.recipeData.isoPrepTime || 'PT20M',
        cookTime: article.recipeData.isoCookTime || 'PT30M',
        totalTime: article.recipeData.isoTotalTime || 'PT50M',
        recipeYield: article.recipeData.servings,
        recipeCategory: article.recipeData.category,
        recipeIngredient: article.recipeData.ingredients,
        recipeInstructions: article.recipeData.instructions.map((step, idx) => ({
          '@type': 'HowToStep',
          name: `الخطوة ${idx + 1}`,
          text: step
        }))
      };
      scriptTag.textContent = JSON.stringify(recipeSchema, null, 2);
    } else {
      // NewsArticle for news, breaking, politics and regional events; Article for non-news (guides, analysis, lifestyle)
      const isNews = article.contentType === 'news' || 
                     article.isBreaking || 
                     article.category === 'morocco' || 
                     article.category === 'gulf' || 
                     article.category === 'world' || 
                     article.category === 'economy';
      
      const schemaType = isNews ? 'NewsArticle' : 'Article';

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        headline: article.title,
        image: [article.leadImage],
        description: article.summary,
        datePublished: article.publishDate,
        dateModified: article.updatedDate || article.publishDate,
        author: [{
          '@type': 'Person',
          name: article.author.name,
          jobTitle: article.author.role
        }],
        publisher: {
          '@type': isNews ? 'NewsMediaOrganization' : 'Organization',
          name: 'المغرب العربي اليوم',
          url: DOMAIN_NAME,
          logo: {
            '@type': 'ImageObject',
            url: `${DOMAIN_NAME}/logo.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        }
      };
      scriptTag.textContent = JSON.stringify(structuredData, null, 2);
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc) metaDesc.setAttribute('content', originalDesc);
      if (canonicalLink) {
        if (createdCanonical) {
          canonicalLink.parentNode?.removeChild(canonicalLink);
        } else {
          canonicalLink.setAttribute('href', originalCanonical);
        }
      }
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [article]);

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const getCountryName = (c: string) => {
    const maghrebMatch = MAGHREB_COUNTRIES.find((item) => item.id === c);
    if (maghrebMatch) return `${maghrebMatch.flag} ${maghrebMatch.name}`;
    const gulfMatch = GULF_COUNTRIES.find((item) => item.id === c);
    if (gulfMatch) return `${gulfMatch.flag} ${gulfMatch.name}`;
    return (c === 'world' ? '🌍 العالم' : '🌍 المغرب العربي');
  };

  const getCategoryLabel = (cat: string) => {
    const match = CATEGORIES_CONFIG.find((item) => item.id === cat);
    return match ? match.label : cat;
  };

  const formattedPublishDate = formatSafeArabicDateFull(article.publishDate);
  const formattedUpdateDate = article.updatedDate ? formatSafeArabicDateFull(article.updatedDate) : null;

  const directArticleUrl = getFullArticleUrl(article);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directArticleUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleToggleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    } else {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentContent.trim()) return;

    onAddComment(article.id, newCommentName.trim(), newCommentContent.trim(), newCommentCountry);
    setNewCommentName('');
    setNewCommentContent('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 4000);
  };

  const articleComments = comments.filter((c) => c.articleId === article.id);

  // Social share URLs
  const pageUrl = encodeURIComponent(directArticleUrl);
  const pageTitle = encodeURIComponent(article.title);

  const shareWhatsApp = `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`;
  const shareTwitter = `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;

  const paragraphs = article.content.split('\n\n').filter(Boolean);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 font-['Tajawal']" itemScope itemType={article.contentType === 'recipe' ? 'https://schema.org/Recipe' : 'https://schema.org/NewsArticle'}>
      {/* 1. Breadcrumbs */}
      <nav aria-label="مسار التصفح" className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-4 no-print flex-wrap">
        <button onClick={onBack} className="hover:text-red-700 hover:underline">
          الرئيسية
        </button>
        <ChevronRight className="w-3.5 h-3.5 rotate-180" />
        <button 
          onClick={() => {
            onSelectCategory?.(article.category as Category);
            onBack();
          }} 
          className="font-semibold text-stone-700 dark:text-stone-300 hover:text-red-700 hover:underline transition"
        >
          {getCategoryLabel(article.category)}
        </button>
        <ChevronRight className="w-3.5 h-3.5 rotate-180" />
        <span className="truncate max-w-[200px] sm:max-w-md text-stone-400">
          {article.title}
        </span>
      </nav>

      {/* 2. Country, City & Category Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-300 mb-3">
        <button
          onClick={() => {
            onSelectCategory?.(article.country as any);
            onBack();
          }}
          className="text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-1 hover:underline transition"
        >
          {getCountryName(article.country)}
        </button>
        {article.city && (
          <>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
              <MapPin className="w-3 h-3 text-red-600" />
              {article.city}
            </span>
          </>
        )}
        <span aria-hidden="true">·</span>
        <span className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded">
          {getCategoryLabel(article.category)}
        </span>
        {article.contentType === 'recipe' && (
          <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-bold flex items-center gap-1 text-[11px]">
            <Utensils className="w-3 h-3" />
            وصفة موثقة
          </span>
        )}
        {article.isBreaking && (
          <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[11px] font-bold animate-pulse">
            عاجل
          </span>
        )}
      </div>

      {/* Reader mode prompt banner */}
      {onEnterReaderMode && (
        <div className="mb-4 py-2 px-3 bg-amber-50/80 dark:bg-stone-900/90 border border-amber-200 dark:border-stone-800 rounded-lg flex items-center justify-between gap-3 text-xs no-print text-stone-700 dark:text-stone-300">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
            <span>تفضل قراءة هادئة بدون إعلانات أو مشتتات؟</span>
          </div>
          <button
            onClick={onEnterReaderMode}
            className="text-red-700 dark:text-red-400 font-bold hover:underline flex items-center gap-1 shrink-0"
          >
            <span>فتح في وضع القارئ</span>
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      )}

      {/* 3. Main Headline (H1) */}
      <h1 itemProp="headline" className="text-2xl sm:text-4xl lg:text-4.5xl font-black text-stone-950 dark:text-white leading-[1.3] font-['Cairo'] mb-4">
        {article.title}
      </h1>

      {/* 4. Deck / Subhead summary */}
      <p itemProp="description" className="text-base sm:text-xl text-stone-600 dark:text-stone-300 font-medium leading-relaxed mb-6 border-r-4 border-red-700 pr-4">
        {article.summary}
      </p>

      {/* 5. Author, Publication Date & Utility Bar */}
      <div className="border-y border-stone-200 dark:border-stone-800 py-3 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-11 h-11 rounded-full object-cover border border-stone-300 dark:border-stone-700 shadow-sm"
          />
          <div>
            <div className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <span itemProp="author">{article.author.name}</span>
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 flex flex-wrap items-center gap-2">
              <span>{article.author.role}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>نُشر: {formattedPublishDate}</span>
              </span>
              {formattedUpdateDate && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    <span>آخر تحديث: {formattedUpdateDate}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action controls (Reader View, Font Size, Audio, Print) */}
        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 no-print">
          {onEnterReaderMode && (
            <button
              onClick={onEnterReaderMode}
              className="px-3 py-1.5 rounded-lg border border-stone-800 dark:border-stone-200 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-red-700 dark:hover:bg-red-600 dark:hover:text-white transition flex items-center gap-1.5 text-xs font-bold shadow-xs hover:scale-[1.02] active:scale-[0.98]"
              title="تفعيل وضع القارئ"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
              <span>وضع القارئ</span>
            </button>
          )}

          {/* Audio reader simulation */}
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`p-2 rounded border transition flex items-center gap-1 text-xs ${
              isPlayingAudio
                ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950 dark:border-red-800'
                : 'border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title="استمع للمقال صوتياً"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-red-600 animate-pulse" />
                <span className="hidden sm:inline font-bold">إيقاف</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">استمع</span>
              </>
            )}
          </button>

          {/* Font Size Adjuster */}
          <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded overflow-hidden text-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1.5 ${fontSize === 'normal' ? 'bg-stone-200 dark:bg-stone-700 font-bold' : 'hover:bg-stone-100'}`}
              title="خط عادي"
            >
              أ
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1.5 ${fontSize === 'large' ? 'bg-stone-200 dark:bg-stone-700 font-bold text-sm' : 'hover:bg-stone-100'}`}
              title="خط كبير"
            >
              أ+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1.5 ${fontSize === 'xlarge' ? 'bg-stone-200 dark:bg-stone-700 font-bold text-base' : 'hover:bg-stone-100'}`}
              title="خط كبير جداً"
            >
              أ++
            </button>
          </div>

          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="p-2 border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            title="طباعة المقال"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6. Lead Featured Image */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
        <img
          itemProp="image"
          src={article.leadImage}
          alt={article.altText || article.title}
          className="w-full max-h-[500px] object-cover"
          loading="lazy"
        />
        {article.imageCaption && (
          <div className="p-3 text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 italic">
            📷 {article.imageCaption}
          </div>
        )}
      </div>

      {/* 7. Social Share floating bar */}
      <div className="mb-8 p-3 bg-stone-100 dark:bg-stone-800/80 rounded-lg flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300">
          <Share2 className="w-4 h-4 text-red-600" />
          <span>مشاركة عبر:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={shareWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <span>واتساب</span>
          </a>

          <a
            href={shareTwitter}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-black hover:bg-stone-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <span>X (تويتر)</span>
          </a>

          <a
            href={shareFacebook}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <span>فيسبوك</span>
          </a>

          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 border border-stone-300 dark:border-stone-600 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الرابط</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 8. Verified Facts Box (if available) */}
      {article.facts && article.facts.length > 0 && (
        <div className="mb-8 p-5 bg-stone-50 dark:bg-stone-900/90 rounded-xl border-r-4 border-emerald-600 border-stone-200 dark:border-stone-800 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>معطيات وحقائق أساسية موثقة:</span>
          </h2>
          <ul className="space-y-2 text-sm text-stone-700 dark:text-stone-300">
            {article.facts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 9. Interactive Recipe Card (if recipeData available) */}
      {article.recipeData && (
        <div className="mb-10 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-5 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-amber-200 dark:border-amber-900/60 mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-amber-700 dark:text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-bold font-['Cairo'] text-stone-900 dark:text-white">
                بطاقة المقادير وطريقة التحضير
              </h2>
            </div>
            <span className="text-xs bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-full font-bold">
              {article.recipeData.category}
            </span>
          </div>

          {/* Recipe Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/30 text-center">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-0.5">وقت التحضير</span>
              <span className="font-bold text-sm text-stone-800 dark:text-stone-200">{article.recipeData.prepTime}</span>
            </div>
            <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/30 text-center">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-0.5">وقت الطهي</span>
              <span className="font-bold text-sm text-stone-800 dark:text-stone-200">{article.recipeData.cookTime}</span>
            </div>
            <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/30 text-center">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-0.5">الكمية تكفي</span>
              <span className="font-bold text-sm text-stone-800 dark:text-stone-200">{article.recipeData.servings}</span>
            </div>
            <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/30 text-center">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-0.5">السعرات التقديرية</span>
              <span className="font-bold text-sm text-amber-700 dark:text-amber-400">{article.recipeData.calories || 'غير محددة'}</span>
            </div>
          </div>

          {/* Interactive Ingredients Checklist */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-4">
              <ListChecks className="w-5 h-5 text-amber-700" />
              <span>المكونات والمقادير (اضغط للتحديد أثناء التحضير):</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {article.recipeData.ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer select-none ${
                      isChecked
                        ? 'bg-amber-100/50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 line-through text-stone-400 dark:text-stone-500'
                        : 'bg-white dark:bg-stone-900 border-amber-100 dark:border-stone-800 hover:border-amber-300 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition ${
                      isChecked ? 'bg-amber-700 border-amber-700 text-white' : 'border-stone-300 dark:border-stone-700'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{ing}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step by Step Cooking Method */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-red-600" />
              <span>طريقة الإعداد والطهي خطوة بخطوة:</span>
            </h3>
            <ol className="space-y-4">
              {article.recipeData.instructions.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200/80 dark:border-stone-800"
                >
                  <span className="w-7 h-7 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Chef Tips Box */}
          {article.recipeData.chefTips && (
            <div className="p-4 bg-amber-100/70 dark:bg-amber-950/60 rounded-xl border border-amber-300 dark:border-amber-800 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">
                  نصيحة الشيف لنجاح الوصفة:
                </strong>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {article.recipeData.chefTips}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10. Article Prose Body */}
      <div
        className={`leading-relaxed space-y-6 text-stone-800 dark:text-stone-200 ${
          fontSize === 'large'
            ? 'text-lg sm:text-xl leading-loose'
            : fontSize === 'xlarge'
            ? 'text-xl sm:text-2xl leading-loose'
            : 'text-base sm:text-lg leading-relaxed'
        }`}
      >
        {paragraphs.map((p, idx) => {
          // If paragraph is a markdown heading
          if (p.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-black font-['Cairo'] text-stone-900 dark:text-white mt-8 mb-4 border-r-4 border-red-700 pr-3">
                {p.replace('## ', '')}
              </h2>
            );
          }
          if (p.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg sm:text-xl font-bold font-['Cairo'] text-stone-800 dark:text-stone-100 mt-6 mb-3">
                {p.replace('### ', '')}
              </h3>
            );
          }

          return (
            <React.Fragment key={idx}>
              <p
                className={
                  idx === 0
                    ? 'first-letter:text-4xl first-letter:font-bold first-letter:text-red-700 first-letter:float-right first-letter:ml-3 first-letter:leading-none'
                    : ''
                }
              >
                {p}
              </p>

              {/* In-article AdSense Banner naturally placed */}
              {idx === 2 && (
                <div className="no-print my-8">
                  <AdSenseBanner slot="in-article" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 12. Editorial Accountability & Correction Banner */}
      <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg flex items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>تلتزم صحيفتنا بأرقى معايير الدقة الصحفية والتحقق من الوقائع.</span>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('corrections')}
            className="text-red-700 dark:text-red-400 hover:underline font-bold shrink-0"
          >
            الإبلاغ عن خطأ أو طلب تصحيح
          </button>
        )}
      </div>

      {/* 13. Author Profile Card */}
      <div className="mt-8 p-5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 flex items-start gap-4">
        <img
          src={article.author.avatar}
          alt={article.author.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-stone-300 dark:border-stone-700 shrink-0"
        />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-stone-950 dark:text-white">
              {article.author.name}
            </h4>
            <span className="text-xs text-stone-500 dark:text-stone-400 bg-stone-200/60 dark:bg-stone-800 px-2 py-0.5 rounded">
              {article.author.role}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {article.author.bio || 'محرر صحفي ضمن الفريق التحريري لجريدة المغرب العربي اليوم، متخصص في التحقيقات والتقارير الميدانية الموثقة.'}
          </p>
        </div>
      </div>

      {/* 14. Tags / Keywords */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-stone-400">الكلمات المفتاحية:</span>
          {article.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2.5 py-1 rounded hover:bg-stone-300 transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 15. Article Interaction Bar (Likes & Comments counter) */}
      <div className="mt-8 py-4 border-y border-stone-200 dark:border-stone-800 flex items-center justify-between no-print">
        <button
          onClick={handleToggleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${
            liked
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current text-red-600' : ''}`} />
          <span>أعجبني ({likesCount})</span>
        </button>

        <div className="flex items-center gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{article.readsCount.toLocaleString('ar-MA')} قراءة</span>
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{articleComments.length} تعليق</span>
          </span>
        </div>
      </div>

      {/* 16. Comments Section */}
      <section className="mt-10 no-print">
        <h3 className="text-xl font-black text-stone-900 dark:text-white font-['Cairo'] mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-red-700" />
          <span>التعليقات وآراء القراء ({articleComments.length})</span>
        </h3>

        {/* Comment Submission Form */}
        <form
          onSubmit={handleCommentSubmit}
          className="mb-8 p-4 bg-stone-100 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800"
        >
          {commentSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 text-xs rounded border border-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>شكراً لك! تم نشر تعليقك بنجاح وسيظهر للقراء فوراً.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                الاسم أو اللقب *
              </label>
              <input
                type="text"
                required
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                placeholder="مثال: يوسف الدار البيضاء"
                className="w-full text-xs p-2.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                بلد الإقامة
              </label>
              <select
                value={newCommentCountry}
                onChange={(e) => setNewCommentCountry(e.target.value)}
                className="w-full text-xs p-2.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="المغرب">🇲🇦 المغرب</option>
                <option value="الجزائر">🇩🇿 الجزائر</option>
                <option value="تونس">🇹🇳 تونس</option>
                <option value="ليبيا">🇱🇾 ليبيا</option>
                <option value="موريتانيا">🇲🇷 موريتانيا</option>
                <option value="المهجر">🌍 المهجر / دول أخرى</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
              نص التعليق *
            </label>
            <textarea
              required
              rows={3}
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="اكتب وجهة نظرك باحترام وموضوعية..."
              className="w-full text-xs p-2.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-5 py-2.5 rounded transition flex items-center gap-1.5 shadow-sm"
          >
            <span>نشر التعليق</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Existing Comments List */}
        <div className="space-y-4">
          {articleComments.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-6">
              كن أول من يعلق على هذا الخبر ويبدي رأيه.
            </p>
          ) : (
            articleComments.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 dark:text-white">
                      {c.authorName}
                    </span>
                    {c.country && (
                      <span className="text-stone-500">({c.country})</span>
                    )}
                  </div>
                  <span className="text-stone-400">{c.date}</span>
                </div>
                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {c.content}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-stone-400">
                  <button
                    onClick={() => onLikeComment(c.id)}
                    className="hover:text-red-600 flex items-center gap-1"
                  >
                    <Heart className="w-3 h-3" />
                    <span>{c.likes} إعجاب</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 17. Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="mt-14 pt-8 border-t border-stone-200 dark:border-stone-800 no-print">
          <h3 className="text-xl font-black text-stone-900 dark:text-white font-['Cairo'] mb-6 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-red-700 rounded-xs inline-block"></span>
            <span>مقالات وأخبار ذات صلة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedArticles.slice(0, 3).map((item) => (
              <ArticleCard
                key={item.id}
                article={item}
                variant="standard"
                onOpen={onOpenArticle}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

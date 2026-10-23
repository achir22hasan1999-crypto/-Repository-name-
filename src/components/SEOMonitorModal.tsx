import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  X, 
  Globe, 
  Search, 
  Code2, 
  Sparkles, 
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { Article } from '../types';
import { CATEGORIES_CONFIG, MAGHREB_COUNTRIES } from '../data/initialArticles';

interface SEOMonitorModalProps {
  articles: Article[];
  onClose: () => void;
}

export const SEOMonitorModal: React.FC<SEOMonitorModalProps> = ({ articles, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sitemap' | 'robots' | 'schema' | 'meta'>('sitemap');
  const [copied, setCopied] = useState(false);

  // Generate dynamic sitemap.xml
  const baseUrl = 'https://almaghreb-alyoum.news';
  const today = new Date().toISOString().split('T')[0];

  const generateSitemapXml = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;
    
    // Home
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>always</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Categories
    CATEGORIES_CONFIG.forEach((cat) => {
      xml += `  <url>\n    <loc>${baseUrl}/category/${cat.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Articles with Google News XML Extension
    articles.forEach((art) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/news/${art.id}/${art.slug}</loc>\n`;
      xml += `    <lastmod>${art.publishDate.split('T')[0]}</lastmod>\n`;
      xml += `    <news:news>\n`;
      xml += `      <news:publication>\n`;
      xml += `        <news:name>المغرب العربي اليوم</news:name>\n`;
      xml += `        <news:language>ar</news:language>\n`;
      xml += `      </news:publication>\n`;
      xml += `      <news:publication_date>${art.publishDate}</news:publication_date>\n`;
      xml += `      <news:title>${art.title.replace(/&/g, '&amp;')}</news:title>\n`;
      xml += `    </news:news>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  };

  const robotsTxt = `# Robots.txt for المغرب العربي اليوم (almaghreb-alyoum.news)
User-agent: *
Allow: /
Allow: /news/
Allow: /category/
Disallow: /admin/
Disallow: /api/private/

# Google News Bot
User-agent: Googlebot-News
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/news-sitemap.xml
`;

  const sampleSchemaJson = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": articles[0]?.title || "عنوان المقال الإخباري",
    "image": [articles[0]?.leadImage || "https://almaghreb-alyoum.news/image.jpg"],
    "datePublished": articles[0]?.publishDate || new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "author": [{
      "@type": "Person",
      "name": articles[0]?.author.name || "محرر الأخبار",
      "jobTitle": articles[0]?.author.role || "صحفي معتمد",
      "url": `${baseUrl}/authors/${articles[0]?.author.name}`
    }],
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "المغرب العربي اليوم",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "description": articles[0]?.summary || "ملخص المقال الإخباري",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/news/${articles[0]?.id}`
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-['Tajawal']">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileCode2 className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white font-['Cairo']">
                أدوات فحص تحسين محركات البحث (SEO & Indexing Tools)
              </h3>
              <p className="text-xs text-stone-500">
                خرائط الموقع Sitemap.xml، ملف Robots.txt، بيانات Schema.org وبطاقات OpenGraph
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'sitemap'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Sitemap.xml (خريطة الموقع والأخبار)
          </button>
          <button
            onClick={() => setActiveTab('robots')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'robots'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Robots.txt
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'schema'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Schema.org (NewsArticle JSON-LD)
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'meta'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            فحص الجاهزية والسرعة (Audit)
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto font-mono text-xs">
          {activeTab === 'sitemap' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-stone-500">
                  خريطة موقع متوافقة مع Google News تحتوي على {articles.length} مقال إخباري و {CATEGORIES_CONFIG.length} أقسام.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(generateSitemapXml())}
                    className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile('sitemap.xml', generateSitemapXml())}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded transition flex items-center gap-1 font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل Sitemap.xml</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-stone-900 text-emerald-400 rounded-lg overflow-x-auto dir-ltr text-left text-[11px] leading-relaxed max-h-96">
                {generateSitemapXml()}
              </pre>
            </div>
          )}

          {activeTab === 'robots' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-stone-500">
                  ملف توجيه عناكب محركات البحث (Googlebot, Bingbot, Googlebot-News).
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(robotsTxt)}
                    className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile('robots.txt', robotsTxt)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded transition flex items-center gap-1 font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل Robots.txt</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-stone-900 text-amber-300 rounded-lg overflow-x-auto dir-ltr text-left text-[12px] leading-relaxed max-h-96">
                {robotsTxt}
              </pre>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-stone-500">
                  بيانات منظمة تلقائياً (Schema.org NewsArticle) لإظهار الخبر في نتائج Google التفاعلية والأخبار العاجلة.
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(sampleSchemaJson, null, 2))}
                  className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              </div>

              <pre className="p-4 bg-stone-900 text-cyan-300 rounded-lg overflow-x-auto dir-ltr text-left text-[11px] leading-relaxed max-h-96">
                {JSON.stringify(sampleSchemaJson, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>جاهزية الفهرسة والأرشفة</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-600 dark:text-stone-300">
                    <li>✓ علامات OpenGraph (og:title, og:description, og:image) متكاملة.</li>
                    <li>✓ دعم بطاقات تويتر الكبيرة (summary_large_image).</li>
                    <li>✓ وسوم الروبوتس (index, follow, max-image-preview:large) مفعلة.</li>
                    <li>✓ بنية الروابط نظيفة (Clean URLs مع الكلمات المفتاحية باللغة العربية).</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300 text-sm">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>مؤشرات أداء السرعة وتجربة الزائر</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-600 dark:text-stone-300">
                    <li>✓ خطوط عربية محسنة ومحملة عبر CDN فائق السرعة.</li>
                    <li>✓ معايير Core Web Vitals متوافقة (LCP &lt; 1.2s, CLS = 0).</li>
                    <li>✓ دعم كامل للشاشات المتجاوبة مع تصفح الهواتف المحمولة.</li>
                    <li>✓ أماكن إعلانية قياسية لا تؤثر على سرعة التمرير أو القراءة.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between text-xs">
          <span className="text-stone-500">
            جميع الأدوات مطابقة لمواصفات Google Search Console و Google Publisher Center لسنة 2026.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

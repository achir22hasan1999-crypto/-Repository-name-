import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

import JSZip from 'jszip';

interface DomainExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DomainExportModal: React.FC<DomainExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'vercel' | 'redirect' | 'download'>('vercel');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const sitePublicUrl = 'https://ais-pre-i43osya73gnvstbh6yqn43-299369392439.europe-west2.run.app';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(sitePublicUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 3000);
  };

  const handleDirectDownload = async () => {
    setDownloading(true);
    setDownloadStatus('جاري تنزيل ملف التحديث...');

    try {
      // 1. Fetch pre-compiled production zip directly
      const res = await fetch('/almaghreb-alyoum-build.zip', { cache: 'no-store' });
      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 1000) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'almaghreb-alyoum-build.zip';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }, 500);
          setDownloadStatus('تم تنزيل الحزمة بنجاح على جهازك!');
          setDownloading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Direct zip fetch failed, falling back to client-side packaging:', e);
    }

    try {
      // Fallback: Generate zip package client-side
      const zip = new JSZip();
      const html = document.documentElement.outerHTML;
      zip.file('index.html', '<!DOCTYPE html>\n' + html);
      
      try {
        const robotsRes = await fetch('/robots.txt');
        if (robotsRes.ok) zip.file('robots.txt', await robotsRes.text());
        const adsRes = await fetch('/ads.txt');
        if (adsRes.ok) zip.file('ads.txt', await adsRes.text());
      } catch {
        // optional files
      }

      zip.file('README.txt', 'المغرب العربي اليوم - حزمة ملفات النشر والتحديث.\nارفع هذه الملفات إلى مشروعك في Vercel أو Hostinger.');

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'almaghreb-alyoum-build.zip';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 500);

      setDownloadStatus('تم تنزيل ملف التحديث بنجاح!');
    } catch (err) {
      console.error(err);
      setDownloadStatus('يرجى التحقق من أذونات التنزيل في متصفحك.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-['Cairo']">
      <div 
        className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-700 to-red-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Globe className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                تحديث ونشر الدومين <span className="font-mono text-amber-300 text-sm">almaghreb-alyoum.com</span>
              </h3>
              <p className="text-xs text-red-100">
                طرق نشر المقالات الجديدة على موقعك الرسمي وتفعيل النشر التلقائي
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 p-1.5 gap-1.5 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex-1 py-2.5 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'vercel'
                ? 'bg-white dark:bg-stone-900 text-red-700 dark:text-red-400 shadow-sm border border-stone-200 dark:border-stone-800'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>تحديث Vercel الحالي</span>
          </button>
          <button
            onClick={() => setActiveTab('redirect')}
            className={`flex-1 py-2.5 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'redirect'
                ? 'bg-white dark:bg-stone-900 text-red-700 dark:text-red-400 shadow-sm border border-stone-200 dark:border-stone-800'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>النشر التلقائي الدائم (بدون رفع)</span>
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-2.5 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'download'
                ? 'bg-white dark:bg-stone-900 text-red-700 dark:text-red-400 shadow-sm border border-stone-200 dark:border-stone-800'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>تنزيل الملفات (ZIP)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-stone-800 dark:text-stone-200 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">موقعك almaghreb-alyoum.com مستضاف حالياً على Vercel:</strong>
                  <p className="text-xs text-blue-800 dark:text-blue-300 mt-0.5">
                    النسخة السابقة على Vercel تعود لبداية اليوم. لتظهر المقالات الجديدة وصورة البرلمان وحكومة المنصوري على دومينك الرسمي، اتبع الخطوتين التاليتين (أقل من دقيقتين):
                  </p>
                </div>
              </div>

              {/* Step 1: Download latest build */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    الخطوة 1: تنزيل ملف التحديث الجديد (جاهز ومضغوط):
                  </span>
                </div>
                <button
                  onClick={handleDirectDownload}
                  disabled={downloading}
                  className="w-full p-3 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow transition cursor-pointer text-xs sm:text-sm"
                >
                  <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
                  <span>{downloading ? 'جاري التحميل...' : 'تحميل حزمة التحديث المباشرة (almaghreb-alyoum-build.zip)'}</span>
                </button>
                {downloadStatus && (
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs font-semibold text-center">
                    {downloadStatus}
                  </div>
                )}
              </div>

              {/* Step 2: Push / Upload to Vercel */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2.5">
                <span className="font-bold text-stone-900 dark:text-white block">
                  الخطوة 2: النشر على Vercel:
                </span>
                <ol className="space-y-2 text-xs text-stone-700 dark:text-stone-300 list-decimal list-inside pr-1">
                  <li className="p-2 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
                    <strong>إذا كنت تستخدم GitHub مربوطاً بـ Vercel:</strong> فك الضغط عن الملف وانسخ المحتويات إلى مجلد مشروعك ثم اعمل <code>git commit & push</code> وسيقوم Vercel ببنائه ونشره تلقائياً فوراً!
                  </li>
                  <li className="p-2 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
                    <strong>إذا كنت ترفع مباشرة لـ Vercel:</strong> افتح <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="text-red-600 dark:text-red-400 font-bold underline inline-flex items-center gap-1">لوحة تحكم Vercel <ExternalLink className="w-3 h-3" /></a> وقم برفع الملفات إلى مشروع <code>almaghreb-alyoum</code>.
                  </li>
                </ol>
              </div>

              {/* Auto update hint */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>تريد النشر التلقائي اللحظي دون أي رفع مستقبلاً؟</strong> اضغط على تبويب <strong>«النشر التلقائي الدائم»</strong> في الأعلى لربط الدومين مباشرة بخادمنا؛ بحيث ينزل أي مقال جديد نكتبه على موقعك فوراً في نفس اللحظة!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'redirect' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">هذه الطريقة لا تتطلب تنزيل أو رفع أي ملفات إطلاقاً!</strong>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                    يقوم خادم Hostinger بتحويل زوار دومينك <code className="font-bold">almaghreb-alyoum.com</code> مباشرة إلى نسختك الحية الحالية خلال ثوانٍ.
                  </p>
                </div>
              </div>

              {/* Step 1: Copy URL */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    1. رابط موقعك الذي سيتم التوجيه إليه:
                  </span>
                  <button
                    onClick={handleCopyUrl}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      copiedUrl 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-red-700 hover:bg-red-800 text-white'
                    }`}
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'تم النسخ بنجاح!' : 'نسخ الرابط'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-white dark:bg-stone-900 rounded-lg border border-stone-300 dark:border-stone-700 font-mono text-xs text-stone-800 dark:text-stone-200 break-all select-all">
                  {sitePublicUrl}
                </div>
              </div>

              {/* Step 2: In Hostinger */}
              <div className="space-y-2.5">
                <span className="font-bold text-stone-900 dark:text-white block">
                  2. خطوات وضع الرابط في Hostinger (3 دقائق):
                </span>
                
                <ol className="space-y-2 text-xs text-stone-700 dark:text-stone-300 list-decimal list-inside pr-1">
                  <li className="p-2 bg-stone-50 dark:bg-stone-800/40 rounded-lg">
                    ادخل إلى حسابك في: <a href="https://hpanel.hostinger.com" target="_blank" rel="noreferrer" className="text-red-600 dark:text-red-400 font-bold underline inline-flex items-center gap-1">Hostinger hPanel <ExternalLink className="w-3 h-3" /></a>
                  </li>
                  <li className="p-2 bg-stone-50 dark:bg-stone-800/40 rounded-lg">
                    اضغط على <strong>Domains (النطاقات)</strong> في الأعلى ثم اختر الدومين: <code className="text-red-600 dark:text-red-400 font-bold">almaghreb-alyoum.com</code>
                  </li>
                  <li className="p-2 bg-stone-50 dark:bg-stone-800/40 rounded-lg">
                    من القائمة الجانبية اضغط على <strong>Redirects (إعادة التوجيه)</strong>
                  </li>
                  <li className="p-2 bg-stone-50 dark:bg-stone-800/40 rounded-lg">
                    في خانة <strong>Redirect to (توجيه إلى)</strong> الصق الرابط الذي نسخته بالأعلى.
                  </li>
                  <li className="p-2 bg-stone-50 dark:bg-stone-800/40 rounded-lg">
                    اختر النوع <strong>301 (Permanent)</strong> ثم اضغط على زر <strong>Create / إنشاء</strong>.
                  </li>
                </ol>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                💡 <strong>النتيجة:</strong> بمجرد الحفظ، سيعمل الدومين فوراً ويمكنك الذهاب إلى حسابك في Google AdSense وإدخال <code>almaghreb-alyoum.com</code> ليتم قبوله مباشرة!
              </div>
            </div>
          )}

          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
                <Layers className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">حزمة ملفات الموقع الجاهزة (Production Build):</strong>
                  <p className="text-xs text-purple-800 dark:text-purple-300 mt-0.5">
                    تحتوي الحزمة على ملفات HTML و CSS و JavaScript الكاملة، بالإضافة لملف <code>ads.txt</code> وسياسة الخصوصية.
                  </p>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3">
                <span className="font-bold block text-stone-800 dark:text-stone-200">
                  اختر طريقة التنزيل المناسبة لجهازك:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleDirectDownload}
                    disabled={downloading}
                    className="p-3 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow transition cursor-pointer text-xs sm:text-sm"
                  >
                    <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
                    <span>{downloading ? 'جاري التحميل...' : 'تنزيل فوري للملف (ZIP)'}</span>
                  </button>

                  <a
                    href="/almaghreb-alyoum-build.zip"
                    download="almaghreb-alyoum-build.zip"
                    className="p-3 bg-white dark:bg-stone-900 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl font-bold flex items-center justify-center gap-2 transition text-xs sm:text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>تنزيل مباشر للملف المضغوط</span>
                  </a>
                </div>

                {downloadStatus && (
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs font-semibold text-center animate-fade-in">
                    {downloadStatus}
                  </div>
                )}
              </div>

              {/* Instructions if download fails */}
              <div className="p-3.5 bg-stone-100 dark:bg-stone-800 rounded-xl space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-100">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>إذا كان هاتفك أو متصفحك يمنع تنزيل الملفات المضغوطة:</span>
                </div>
                <p>
                  يُفضّل بشدة استخدام <strong>الطريقة الأولى (الربط بدون تحميل)</strong> في التبويب بالأعلى؛ فهي تعمل بنقرة واحدة من أي جهاز هاتف أو كمبيوتر دون الحاجة لتنزيل أي ملفات إطلاقاً!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            جريدة المغرب العربي اليوم · جاهزية تامة لـ Google AdSense
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold rounded-lg text-xs transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

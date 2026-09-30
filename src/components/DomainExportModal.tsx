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

interface DomainExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DomainExportModal: React.FC<DomainExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'redirect' | 'download'>('redirect');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const sitePublicUrl = 'https://ais-pre-i43osya73gnvstbh6yqn43-299369392439.europe-west2.run.app';
  const zipDownloadUrl = `${sitePublicUrl}/almaghreb-alyoum-build.zip`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(sitePublicUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 3000);
  };

  const handleDirectDownload = async () => {
    setDownloading(true);
    setDownloadStatus('جاري تجهيز وبدء تنزيل الملف...');

    try {
      // Method 1: Fetch as blob
      const res = await fetch('/almaghreb-alyoum-build.zip');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'almaghreb-alyoum-build.zip';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 300);
        setDownloadStatus('تم بدء التنزيل بنجاح!');
        setDownloading(false);
        return;
      }
    } catch {
      // Fallback to direct navigation or window open
    }

    // Fallback: Open in external window
    window.open(zipDownloadUrl, '_blank');
    setDownloadStatus('تم فتح رابط التنزيل في نافذة جديدة!');
    setDownloading(false);
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
                ربط الدومين <span className="font-mono text-amber-300 text-sm">almaghreb-alyoum.com</span>
              </h3>
              <p className="text-xs text-red-100">
                طريقتان لتشغيل موقعك على دومينك والبدء في جني أرباح AdSense
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
            onClick={() => setActiveTab('redirect')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'redirect'
                ? 'bg-white dark:bg-stone-900 text-red-700 dark:text-red-400 shadow-sm border border-stone-200 dark:border-stone-800'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>الطريقة الأسهل: الربط بدون تحميل (توجيه Hostinger)</span>
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'download'
                ? 'bg-white dark:bg-stone-900 text-red-700 dark:text-red-400 shadow-sm border border-stone-200 dark:border-stone-800'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Download className="w-4 h-4 text-purple-600" />
            <span>تحميل ملفات الموقع (ZIP)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-stone-800 dark:text-stone-200 text-xs sm:text-sm leading-relaxed">
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
                    href={zipDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white dark:bg-stone-900 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl font-bold flex items-center justify-center gap-2 transition text-xs sm:text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>فتح رابط التنزيل في نافذة جديدة</span>
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

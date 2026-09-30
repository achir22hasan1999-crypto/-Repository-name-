import React, { useState } from 'react';
import { 
  Send, 
  Check, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  Heart, 
  ArrowUp,
  Share2,
  FileCode2,
  Lock,
  LogOut,
  Sliders
} from 'lucide-react';
import { Category, Country, ViewMode } from '../types';
import { CATEGORIES_CONFIG, MAGHREB_COUNTRIES } from '../data/initialArticles';

interface FooterProps {
  onSelectCategory: (cat: Category) => void;
  onSelectCountry: (c: Country) => void;
  onNavigate: (view: ViewMode) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onAdminLogout?: () => void;
  onOpenDomainModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectCountry,
  onNavigate,
  isAdmin = false,
  onOpenAdminLogin,
  onAdminLogout,
  onOpenDomainModal,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterSubscribed(false);
      setNewsletterEmail('');
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 font-['Tajawal'] border-t-4 border-red-700 mt-16 pt-12 pb-8 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Row 1: Brand, Slogan, Newsletter, App Teaser */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-stone-800">
          {/* Brand info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-8 bg-red-700 inline-block rounded-xs"></span>
              <div>
                <h3 className="text-2xl font-black text-white font-['Cairo'] tracking-tight">
                  المغرب العربي اليوم
                </h3>
                <p className="text-xs text-red-400 font-medium">
                  "أخبار المغرب العربي والعالم لحظة بلحظة"
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md">
              بوابة إخبارية رقمية رائدة تعنى بمتابعة الشأن السياسي، الاقتصادي، الاجتماعي، الرياضي والثقافي في بلدان المغرب العربي الخمسة (المغرب، الجزائر، تونس، ليبيا، موريتانيا) والعالم برؤية مهنية ومستقلة.
            </p>

            {/* Social channels */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-stone-400">تابعنا:</span>
              {[
                { name: 'فيسبوك', href: 'https://facebook.com', color: 'hover:text-[#1877F2]' },
                { name: 'منصة X', href: 'https://x.com', color: 'hover:text-white' },
                { name: 'يوتيوب', href: 'https://youtube.com', color: 'hover:text-[#FF0000]' },
                { name: 'تيليغرام', href: 'https://t.me', color: 'hover:text-[#229ED9]' },
                { name: 'واتساب', href: 'https://whatsapp.com', color: 'hover:text-[#25D366]' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs text-stone-400 ${s.color} transition`}
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Box (4 cols) */}
          <div className="lg:col-span-4 bg-stone-900/80 p-5 rounded-lg border border-stone-800 space-y-3">
            <h4 className="text-sm font-bold text-white font-['Cairo']">
              النشرة البريدية المغاربية الصباحية
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              احصل على ملخص تحريري لأبرز عناوين الصباح والتقارير الحصرية في بريدك الإلكتروني يومياً.
            </p>

            {newsletterSubscribed ? (
              <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>شكراً لاشتراكك! ستصلك النشرة المغاربية غداً صباحاً.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني..."
                  className="w-full text-xs p-2.5 rounded bg-stone-950 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2.5 rounded text-xs font-bold shrink-0 transition flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>اشتراك</span>
                </button>
              </form>
            )}
          </div>

          {/* Mobile Apps Teaser (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white font-['Cairo'] flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-red-500" />
              <span>تطبيقات الهواتف الذكية</span>
            </h4>
            <p className="text-xs text-stone-400">
              تابع التنبيهات العاجلة فور حدوثها عبر تطبيقنا للأندرويد و iOS (قريباً في المتاجر الرسمية):
            </p>

            <div className="space-y-2">
              <div className="p-2.5 bg-stone-900 border border-stone-800 rounded flex items-center gap-3">
                <span className="text-lg">🤖</span>
                <div className="text-[11px]">
                  <span className="font-bold text-stone-200 block">تطبيق Android</span>
                  <span className="text-stone-500">جاهز للتحميل والتثبيت (PWA/APK)</span>
                </div>
              </div>
              <div className="p-2.5 bg-stone-900 border border-stone-800 rounded flex items-center gap-3">
                <span className="text-lg">🍎</span>
                <div className="text-[11px]">
                  <span className="font-bold text-stone-200 block">تطبيق iOS / iPhone</span>
                  <span className="text-stone-500">متوافق مع App Store و Safari</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Navigation Links Grid (Countries, Categories, Legal) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-stone-800 text-xs">
          {/* Col 1: Maghreb Countries */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3 font-['Cairo']">
              دول المغرب العربي
            </h5>
            <ul className="space-y-2">
              {MAGHREB_COUNTRIES.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      onSelectCountry(c.id as Country);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-red-400 transition flex items-center gap-1.5"
                  >
                    <span>{c.flag}</span>
                    <span>أخبار {c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Main Categories */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3 font-['Cairo']">
              أقسام الأخبار
            </h5>
            <ul className="space-y-2">
              {CATEGORIES_CONFIG.slice(6, 12).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id as Category);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-red-400 transition"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Media & Variety */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3 font-['Cairo']">
              وسائط ومنوعات
            </h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('video');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-red-400 transition"
                >
                  فيديو المغرب العربي
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('variety');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-red-400 transition"
                >
                  ثقافة وفنون ومنوعات
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('arab');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-red-400 transition"
                >
                  أخبار العالم العربي
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('world');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-red-400 transition"
                >
                  تقارير وأخبار دولية
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal Pages */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3 font-['Cairo']">
              الصفحات القانونية والشفافية
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-red-400 transition">
                  من نحن وميثاق التحرير
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('author')} className="hover:text-red-400 transition">
                  هيئة التحرير والمؤلفون
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('corrections')} className="hover:text-red-400 text-amber-300 font-semibold transition">
                  سياسة تصحيح وتحديث الأخبار
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('copyright')} className="hover:text-red-400 transition">
                  حقوق النشر والملكية الفكرية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-red-400 transition">
                  اتصل بنا والمكاتب الإقليمية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-red-400 transition">
                  سياسة الخصوصية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cookies')} className="hover:text-red-400 transition">
                  سياسة ملفات تعريف الارتباط
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-red-400 transition">
                  شروط الاستخدام
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('disclaimer')} className="hover:text-red-400 transition">
                  إخلاء المسؤولية العامة
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Row 3: Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()} لموقع <strong>المغرب العربي اليوم</strong>.</span>
            <span className="text-stone-600">
              الموقع مجهز لـ Google AdSense ومتوافق مع المعايير الصحفية الدولية.
            </span>
            {/* Discreet Admin Gateway */}
            {isAdmin ? (
              <span className="inline-flex items-center gap-2 bg-stone-900 border border-red-900/50 text-red-300 px-2 py-0.5 rounded text-[11px] mr-2">
                <span>مشرف:</span>
                <button onClick={() => onNavigate('admin')} className="hover:underline flex items-center gap-1">
                  <Sliders className="w-2.5 h-2.5" />
                  <span>لوحة التحكم</span>
                </button>
                <button onClick={() => onNavigate('seo-tools')} className="hover:underline flex items-center gap-1">
                  <FileCode2 className="w-2.5 h-2.5 text-emerald-400" />
                  <span>SEO</span>
                </button>
                <button onClick={onAdminLogout} className="text-stone-400 hover:text-red-400" title="تسجيل الخروج">
                  <LogOut className="w-2.5 h-2.5" />
                </button>
              </span>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1 text-stone-700 hover:text-stone-400 transition text-[11px] mr-2"
                title="بوابة هيئة التحرير والمشرفين"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>بوابة المحررين</span>
              </button>
            )}

            {isAdmin && onOpenDomainModal && (
              <button
                onClick={onOpenDomainModal}
                className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-400 transition text-[11px] mr-2 font-bold cursor-pointer"
                title="ربط الدومين وتحميل ملفات الموقع"
              >
                <span>🌐 ربط الدومين وتحميل الموقع</span>
              </button>
            )}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white px-3 py-1.5 rounded bg-stone-900 border border-stone-800 transition"
          >
            <span>إلى الأعلى</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

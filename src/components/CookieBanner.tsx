import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check } from 'lucide-react';
import { ViewMode } from '../types';

interface CookieBannerProps {
  onNavigate: (view: ViewMode) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onNavigate }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('maghreb_cookie_consent');
    if (!consent) {
      // Delay slightly for polite user experience
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('maghreb_cookie_consent', 'accepted_all');
    setVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('maghreb_cookie_consent', 'essential_only');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 no-print pointer-events-none">
      <div className="max-w-4xl mx-auto bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 shadow-2xl rounded-xl p-4 sm:p-5 pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-['Tajawal']">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-lg shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white font-['Cairo']">
              ملفات تعريف الارتباط وتجربة التصفح (Cookies)
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك في قراءة أخبار المغرب العربي وتخصيص المحتوى والإعلانات المعتمدة وفق سياسات Google AdSense واللوائح القانونية.
              يمكنك الاطلاع على{' '}
              <button
                onClick={() => onNavigate('cookies')}
                className="text-red-700 dark:text-red-400 underline font-semibold"
              >
                سياسة ملفات تعريف الارتباط
              </button>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleAcceptEssential}
            className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg border border-stone-300 dark:border-stone-700 transition"
          >
            الضرورية فقط
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-red-700 hover:bg-red-800 text-white rounded-lg transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>قبول الكل</span>
          </button>
        </div>
      </div>
    </div>
  );
};

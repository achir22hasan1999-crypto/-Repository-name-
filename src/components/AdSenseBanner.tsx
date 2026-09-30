import React, { useEffect, useState } from 'react';
import { ExternalLink, ShieldCheck, Info, Sparkles } from 'lucide-react';

interface AdSenseBannerProps {
  slot: 'top-leaderboard' | 'in-article' | 'between-sections' | 'sidebar' | 'bottom-footer';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({ slot, className = '' }) => {
  const [pubId, setPubId] = useState<string>('');
  const [slotId, setSlotId] = useState<string>('');
  const [adLoaded, setAdLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedPub = localStorage.getItem('maghreb_adsense_pub_id') || '';
      const storedSlot = localStorage.getItem(`maghreb_adsense_slot_${slot}`) || '';
      setPubId(storedPub);
      setSlotId(storedSlot);

      if (storedPub && (window.adsbygoogle || (window as any).adsbygoogle)) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        } catch (e) {
          console.debug('AdSense push notice:', e);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [slot]);

  const getSlotDetails = () => {
    switch (slot) {
      case 'top-leaderboard':
        return {
          title: 'إعلان - مساحة قياسية معتمدة (Leaderboard 728×90 / 970×90)',
          dimensions: 'min-h-[90px] max-w-5xl',
          brand: 'استثمر في الطاقة المتجددة بشمال إفريقيا',
          tagline: 'منصة الاستثمار المغاربي الموحد - حلول طاقة نظيفة وتمويل أخضر',
          cta: 'اكتشف الفرص'
        };
      case 'in-article':
        return {
          title: 'إعلان داخل المقال (In-Article Responsive)',
          dimensions: 'min-h-[220px] max-w-xl mx-auto',
          brand: 'الماجستير المغاربي في ريادة الأعمال والذكاء الاصطناعي',
          tagline: 'منح دراسية مشتركة معتمدة لدول المغرب العربي لسنة 2026',
          cta: 'سجل اهتمامك'
        };
      case 'between-sections':
        return {
          title: 'إعلان ممول (Billboard 970×250 / Fluid)',
          dimensions: 'min-h-[140px] w-full',
          brand: 'تطبيق التجارة والخدمات اللوجستية المغاربية',
          tagline: 'شحن سريع وتخليص جمركي موحد عبر المغرب، تونس، الجزائر، ليبيا، موريتانيا',
          cta: 'حمل التطبيق'
        };
      case 'sidebar':
        return {
          title: 'إعلان الشريط الجانبي (Half Page 300×600)',
          dimensions: 'min-h-[350px] w-full',
          brand: 'المعرض الاقتصادي المغاربي السنوي',
          tagline: 'التقاء أكثر من 500 شركة مغاربية ودولية في قصر المؤتمرات',
          cta: 'احجز جناحك'
        };
      case 'bottom-footer':
      default:
        return {
          title: 'مساحة إعلانية أسفل الصفحة (Footer Banner)',
          dimensions: 'min-h-[90px] w-full',
          brand: 'مبادرة الشباب للابتكار الرقمي في المغرب العربي',
          tagline: 'تمويل أولي يصل إلى 50,000 دولار للشركات الناشئة الصاعدة',
          cta: 'انضم الآن'
        };
    }
  };

  const details = getSlotDetails();

  // If a real publisher ID is configured, render official Google AdSense ins container
  if (pubId && (pubId.startsWith('ca-pub-') || pubId.startsWith('pub-'))) {
    const formattedPubId = pubId.startsWith('ca-pub-') ? pubId : `ca-${pubId}`;
    return (
      <div className={`ad-banner my-6 text-center ${className}`}>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 mb-1.5 font-sans">
          <Info className="w-3 h-3 text-stone-400" />
          <span>إعلان معتمد • Google AdSense</span>
          <span className="text-stone-300">|</span>
          <span className="hover:underline cursor-pointer flex items-center gap-0.5">
            خيارات الإعلان <ShieldCheck className="w-2.5 h-2.5 inline" />
          </span>
        </div>

        <div className="overflow-hidden flex justify-center bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-2 min-h-[90px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center', width: '100%' }}
            data-ad-client={formattedPubId}
            data-ad-slot={slotId || '1234567890'}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    );
  }

  // Pre-approval fallback / demonstration unit
  return (
    <div className={`ad-banner my-6 text-center ${className}`}>
      {/* AdSense compliance label */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 mb-1.5 font-sans">
        <Info className="w-3 h-3 text-stone-400" />
        <span>إعلان معتمد • Google AdSense</span>
        <span className="text-stone-300">|</span>
        <span className="hover:underline cursor-pointer flex items-center gap-0.5">
          خيارات الإعلان <ShieldCheck className="w-2.5 h-2.5 inline" />
        </span>
      </div>

      <div
        className={`border border-dashed border-stone-300 dark:border-stone-700 bg-stone-100/80 dark:bg-stone-800/50 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:bg-stone-100 ${details.dimensions}`}
      >
        <div className="text-right flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
              إعلان
            </span>
            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
              {details.brand}
            </h4>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
            {details.tagline}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
          }}
          className="shrink-0 bg-stone-900 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span>{details.cta}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <p className="text-[10px] text-stone-400 mt-1 flex items-center justify-center gap-1">
        <Sparkles className="w-2.5 h-2.5 text-amber-500" />
        <span>المساحة مهيأة تلقائياً لشيفرة AdSense الرسمية (data-ad-client="ca-pub-xxxxxxxx")</span>
      </p>
    </div>
  );
};

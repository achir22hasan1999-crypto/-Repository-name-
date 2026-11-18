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

const DEFAULT_PUB_ID = 'ca-pub-1551440525608341';

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({ slot, className = '' }) => {
  const [pubId, setPubId] = useState<string>(DEFAULT_PUB_ID);
  const [slotId, setSlotId] = useState<string>('');
  const [adLoaded, setAdLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedPub = localStorage.getItem('maghreb_adsense_pub_id') || DEFAULT_PUB_ID;
      const storedSlot = localStorage.getItem(`maghreb_adsense_slot_${slot}`) || '';
      setPubId(storedPub);
      setSlotId(storedSlot);

      if (storedPub && (storedPub.startsWith('ca-pub-') || storedPub.startsWith('pub-'))) {
        // Ensure script is injected dynamically for the active publisher ID
        const scriptId = 'google-adsense-script';
        if (!document.getElementById(scriptId)) {
          const s = document.createElement('script');
          s.id = scriptId;
          s.async = true;
          s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${storedPub.startsWith('ca-pub-') ? storedPub : `ca-${storedPub}`}`;
          s.crossOrigin = 'anonymous';
          document.head.appendChild(s);
        }

        if (window.adsbygoogle || (window as any).adsbygoogle) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdLoaded(true);
          } catch (e) {
            console.debug('AdSense push notice:', e);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [slot]);

  // Only render explicit ad slot container when a real AdSense slot ID is configured;
  // otherwise Google Auto Ads (loaded in <head>) manages placements cleanly without fake placeholders.
  if (!pubId || !(pubId.startsWith('ca-pub-') || pubId.startsWith('pub-')) || !slotId || slotId === '1234567890') {
    return null;
  }

  const formattedPubId = pubId.startsWith('ca-pub-') ? pubId : `ca-${pubId}`;
  return (
    <div className={`ad-banner my-6 text-center ${className}`}>
      <div className="overflow-hidden flex justify-center bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-2 min-h-[90px]">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center', width: '100%' }}
          data-ad-client={formattedPubId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

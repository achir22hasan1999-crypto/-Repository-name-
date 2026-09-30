import React, { useState } from 'react';
import { Play, X, Eye, Clock, Share2 } from 'lucide-react';
import { Article } from '../types';

interface VideoSectionProps {
  articles: Article[];
  onOpenArticle: (id: string) => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ articles, onOpenArticle }) => {
  const [selectedVideo, setSelectedVideo] = useState<Article | null>(null);

  // Filter video articles or articles with video tags
  const videoArticles = articles.filter(
    (a) => a.category === 'video' || !!a.videoUrl || a.tags.includes('فيديو')
  );

  const displayList = videoArticles.length > 0 ? videoArticles : articles.slice(0, 4);
  const featured = displayList[0];
  const others = displayList.slice(1, 4);

  return (
    <section className="bg-stone-950 text-white rounded-xl p-6 my-10 border border-stone-800 shadow-xl">
      <div className="flex items-center justify-between mb-6 border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center shadow-md">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-['Cairo'] tracking-tight">
              فيديو المغرب العربي
            </h3>
            <p className="text-xs text-stone-400">
              وثائقيات حصرية، تقارير ميدانية وتغطيات مصورة لأهم أحداث المنطقة
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-red-500 bg-red-950/60 border border-red-900/50 px-2.5 py-1 rounded">
          4K HD
        </span>
      </div>

      {/* Grid: 1 Big Featured Player + 3 Playlist items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Featured Video */}
        {featured && (
          <div className="lg:col-span-8 group cursor-pointer" onClick={() => setSelectedVideo(featured)}>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-stone-900 border border-stone-800">
              <img
                src={featured.leadImage}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6">
                <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-red-600 transition-all shadow-xl">
                  <Play className="w-6 h-6 fill-white ml-1" />
                </div>
                <div className="flex items-center gap-2 text-xs text-red-400 font-bold mb-2">
                  <span>وثائقي حصري</span>
                  <span>·</span>
                  <span>{featured.videoDuration || '14:20 دقيقة'}</span>
                </div>
                <h4 className="text-lg sm:text-2xl font-black text-white font-['Cairo'] leading-snug line-clamp-2">
                  {featured.title}
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 mt-2 line-clamp-2">
                  {featured.summary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Side Playlist */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
            أحدث المقاطع والتغطيات
          </div>
          {others.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedVideo(item)}
              className="flex gap-3 p-2.5 rounded-lg bg-stone-900/60 hover:bg-stone-900 border border-stone-800/80 cursor-pointer transition-all group"
            >
              <div className="relative w-28 h-20 shrink-0 rounded overflow-hidden bg-stone-800">
                <img
                  src={item.leadImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                </div>
                {item.videoDuration && (
                  <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1 py-0.5 rounded font-mono">
                    {item.videoDuration}
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <h5 className="text-xs font-bold text-stone-200 group-hover:text-red-400 line-clamp-2 leading-relaxed">
                  {item.title}
                </h5>
                <div className="text-[10px] text-stone-500 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" />
                    {item.readsCount.toLocaleString('ar-MA')}
                  </span>
                  <span>·</span>
                  <span>{item.author.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Lightbox Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-stone-900 rounded-xl overflow-hidden border border-stone-700 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-stone-800">
              <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-xl font-['Cairo']">
                {selectedVideo.title}
              </h4>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 text-stone-400 hover:text-white rounded hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black">
              {selectedVideo.videoUrl ? (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                ></video>
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <img
                    src={selectedVideo.leadImage}
                    alt={selectedVideo.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                  <div className="relative z-10 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                    <p className="text-white font-bold text-lg font-['Cairo'] mb-2">
                      مقطع فيديو وثائقي تجريبي
                    </p>
                    <p className="text-xs text-stone-300">
                      مشغل الفيديو يدعم دفق HLS و MP4 و YouTube وفق معايير البث الصحفي السريع.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 flex items-center justify-between bg-stone-950 text-xs text-stone-400">
              <p className="line-clamp-1">{selectedVideo.summary}</p>
              <button
                onClick={() => {
                  setSelectedVideo(null);
                  onOpenArticle(selectedVideo.id);
                }}
                className="shrink-0 bg-red-700 hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded transition"
              >
                قراءة التقرير الكامل
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

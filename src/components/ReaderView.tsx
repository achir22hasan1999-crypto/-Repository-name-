import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Settings2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Printer, 
  Check, 
  Image as ImageIcon, 
  EyeOff, 
  Minus, 
  Plus, 
  BookOpen,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Article } from '../types';
import { CATEGORIES_CONFIG, MAGHREB_COUNTRIES } from '../data/initialArticles';
import { formatSafeArabicDateFull } from '../utils/dateFormatter';

interface ReaderViewProps {
  article: Article;
  onClose: () => void;
}

type ReaderTheme = 'light' | 'sepia' | 'charcoal' | 'dark';
type ReaderFont = 'amiri' | 'cairo' | 'tajawal';
type ReaderWidth = 'compact' | 'normal' | 'wide';
type ReaderLineHeight = 'normal' | 'loose' | 'spacious';

export const ReaderView: React.FC<ReaderViewProps> = ({ article, onClose }) => {
  // Appearance Preferences (persisted in localStorage)
  const [theme, setTheme] = useState<ReaderTheme>(() => {
    return (localStorage.getItem('reader_theme') as ReaderTheme) || 'sepia';
  });
  const [fontFamily, setFontFamily] = useState<ReaderFont>(() => {
    return (localStorage.getItem('reader_font') as ReaderFont) || 'amiri';
  });
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('reader_font_size');
    return saved ? parseInt(saved, 10) : 20;
  });
  const [lineHeight, setLineHeight] = useState<ReaderLineHeight>(() => {
    return (localStorage.getItem('reader_line_height') as ReaderLineHeight) || 'loose';
  });
  const [columnWidth, setColumnWidth] = useState<ReaderWidth>(() => {
    return (localStorage.getItem('reader_column_width') as ReaderWidth) || 'normal';
  });
  const [showImage, setShowImage] = useState<boolean>(() => {
    const saved = localStorage.getItem('reader_show_image');
    return saved !== null ? saved === 'true' : true;
  });

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Split paragraphs
  const paragraphs = article.content.split('\n\n').filter(Boolean);

  // Calculate estimated reading time (Arabic avg reading speed: ~160 words/min)
  const totalWords = (article.title + ' ' + article.summary + ' ' + article.content)
    .trim()
    .split(/\s+/)
    .length;
  const readingTimeMinutes = Math.max(1, Math.ceil(totalWords / 160));

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('reader_theme', theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem('reader_font', fontFamily);
  }, [fontFamily]);
  useEffect(() => {
    localStorage.setItem('reader_font_size', fontSize.toString());
  }, [fontSize]);
  useEffect(() => {
    localStorage.setItem('reader_line_height', lineHeight);
  }, [lineHeight]);
  useEffect(() => {
    localStorage.setItem('reader_column_width', columnWidth);
  }, [columnWidth]);
  useEffect(() => {
    localStorage.setItem('reader_show_image', showImage.toString());
  }, [showImage]);

  // Handle ESC key to exit Reader View
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopAudio();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Scroll Progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Text-To-Speech implementation
  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
    setCurrentParagraphIndex(-1);
  };

  const startAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('عذراً، متصفحك لا يدعم خاصية تحويل النص إلى صوت.');
      return;
    }

    window.speechSynthesis.cancel();

    // Prepare full text to speak: headline, summary, and paragraphs
    const fullText = `${article.title}. ${article.summary}. ${paragraphs.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(fullText);

    // Try to find Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar')) || null;
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }
    utterance.lang = 'ar-SA';
    utterance.rate = audioSpeed;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setIsAudioPaused(false);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
      setCurrentParagraphIndex(-1);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const togglePauseAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (isAudioPaused) {
      window.speechSynthesis.resume();
      setIsAudioPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
    }
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Helper metadata
  const getCountryName = (c: string) => {
    const match = MAGHREB_COUNTRIES.find((item) => item.id === c);
    return match ? `${match.flag} ${match.name}` : 'المغرب العربي';
  };

  const getCategoryLabel = (cat: string) => {
    const match = CATEGORIES_CONFIG.find((item) => item.id === cat);
    return match ? match.label : cat;
  };

  const formattedDate = formatSafeArabicDateFull(article.publishDate);

  // Theme Styling Classes
  const getThemeStyles = () => {
    switch (theme) {
      case 'sepia':
        return {
          pageBg: 'bg-[#f7f1e3]',
          textColor: 'text-[#3c2f25]',
          subtextColor: 'text-[#6b5849]',
          border: 'border-[#e4d8c2]',
          navBg: 'bg-[#f7f1e3]/95 border-[#e4d8c2]',
          cardBg: 'bg-[#ede3cf]',
          accent: 'text-[#8b4513]',
          accentBg: 'bg-[#8b4513]',
          barBg: 'bg-[#e4d8c2]',
        };
      case 'charcoal':
        return {
          pageBg: 'bg-[#1e293b]',
          textColor: 'text-[#f1f5f9]',
          subtextColor: 'text-[#94a3b8]',
          border: 'border-[#334155]',
          navBg: 'bg-[#1e293b]/95 border-[#334155]',
          cardBg: 'bg-[#0f172a]',
          accent: 'text-amber-400',
          accentBg: 'bg-amber-500',
          barBg: 'bg-[#334155]',
        };
      case 'dark':
        return {
          pageBg: 'bg-[#09090b]',
          textColor: 'text-[#f4f4f5]',
          subtextColor: 'text-[#a1a1aa]',
          border: 'border-[#27272a]',
          navBg: 'bg-[#09090b]/95 border-[#27272a]',
          cardBg: 'bg-[#18181b]',
          accent: 'text-red-500',
          accentBg: 'bg-red-600',
          barBg: 'bg-[#27272a]',
        };
      case 'light':
      default:
        return {
          pageBg: 'bg-[#ffffff]',
          textColor: 'text-[#1c1917]',
          subtextColor: 'text-[#78716c]',
          border: 'border-[#e7e5e4]',
          navBg: 'bg-[#ffffff]/95 border-[#e7e5e4]',
          cardBg: 'bg-[#f5f5f4]',
          accent: 'text-red-700',
          accentBg: 'bg-red-700',
          barBg: 'bg-[#e7e5e4]',
        };
    }
  };

  const themeStyle = getThemeStyles();

  // Font family inline style
  const getFontFamilyStyle = () => {
    switch (fontFamily) {
      case 'amiri':
        return { fontFamily: "'Amiri', serif" };
      case 'cairo':
        return { fontFamily: "'Cairo', sans-serif" };
      case 'tajawal':
      default:
        return { fontFamily: "'Tajawal', sans-serif" };
    }
  };

  // Line Height class
  const getLineHeightClass = () => {
    switch (lineHeight) {
      case 'spacious':
        return 'leading-[2.4]';
      case 'loose':
        return 'leading-[2.05]';
      case 'normal':
      default:
        return 'leading-[1.8]';
    }
  };

  // Column width class
  const getWidthClass = () => {
    switch (columnWidth) {
      case 'compact':
        return 'max-w-xl';
      case 'wide':
        return 'max-w-3xl';
      case 'normal':
      default:
        return 'max-w-2xl';
    }
  };

  return (
    <div
      className={`min-h-screen ${themeStyle.pageBg} ${themeStyle.textColor} transition-colors duration-200 selection:bg-amber-200 selection:text-stone-900 pb-24`}
      style={getFontFamilyStyle()}
      dir="rtl"
    >
      {/* 1. Top Reading Progress Bar */}
      <div className={`fixed top-0 left-0 right-0 h-1 z-50 ${themeStyle.barBg}`}>
        <div
          className={`h-full ${themeStyle.accentBg} transition-all duration-150 ease-out`}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Sticky Floating Reader Toolbar */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between transition-colors duration-200 ${themeStyle.navBg}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 transition hover:opacity-90 shadow-xs ${themeStyle.border} ${themeStyle.cardBg}`}
            title="الخروج من نمط القراءة والعودة للموقع الكامل (Esc)"
          >
            <ArrowRight className="w-4 h-4" />
            <span>خروج من وضع القارئ</span>
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded opacity-60 font-mono">
              ESC
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs opacity-75">
            <span className="font-semibold">{article.title.slice(0, 38)}...</span>
          </div>
        </div>

        {/* Action Controls & Settings */}
        <div className="flex items-center gap-2 text-xs">
          {/* Estimated reading time badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs opacity-80 ${themeStyle.cardBg}`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{readingTimeMinutes} دقيقة للقراءة</span>
          </div>

          {/* Audio narration button */}
          <div className="flex items-center">
            {!isPlayingAudio ? (
              <button
                onClick={startAudio}
                className={`p-2 rounded-lg border flex items-center gap-1.5 transition ${themeStyle.border} ${themeStyle.cardBg} hover:opacity-80`}
                title="استمع للمقال صوتياً بدون تشتيت"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden lg:inline">استماع</span>
              </button>
            ) : (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${themeStyle.border} ${themeStyle.cardBg}`}
              >
                <button
                  onClick={togglePauseAudio}
                  className="p-1 hover:opacity-75"
                  title={isAudioPaused ? 'استئناف القراءة' : 'إيقاف مؤقت'}
                >
                  {isAudioPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={stopAudio}
                  className="p-1 hover:text-red-500"
                  title="إنهاء القراءة الصوتية"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-bold px-1 animate-pulse text-amber-500">
                  {isAudioPaused ? 'مؤقت' : 'يقرأ...'}
                </span>
              </div>
            )}
          </div>

          {/* Quick Font Size Adjusters */}
          <div
            className={`flex items-center rounded-lg border overflow-hidden ${themeStyle.border} ${themeStyle.cardBg}`}
          >
            <button
              onClick={() => setFontSize((s) => Math.max(16, s - 2))}
              disabled={fontSize <= 16}
              className="p-2 hover:opacity-70 disabled:opacity-30"
              title="تصغير حجم الخط"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-bold select-none">{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(28, s + 2))}
              disabled={fontSize >= 28}
              className="p-2 hover:opacity-70 disabled:opacity-30"
              title="تكبير حجم الخط"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Settings Trigger Popover */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition ${themeStyle.border} ${
                showSettings ? themeStyle.accentBg + ' text-white' : themeStyle.cardBg
              }`}
              title="تخصيص الخط، الثيم والتباعد"
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">المظهر</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
            </button>

            {/* Appearance Popover Menu */}
            {showSettings && (
              <div
                className={`absolute left-0 sm:left-auto right-auto sm:right-0 mt-2 w-72 sm:w-80 rounded-xl shadow-2xl border p-4 z-50 ${themeStyle.cardBg} ${themeStyle.border} text-xs space-y-4`}
              >
                {/* 1. Theme Choice */}
                <div>
                  <label className="block font-bold mb-2 opacity-80">سمة القراءة (الثيم):</label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 bg-white text-stone-900 ${
                        theme === 'light' ? 'ring-2 ring-red-600 border-red-600 font-bold' : 'border-stone-200'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white border border-stone-300" />
                      <span className="text-[11px]">فاتح</span>
                    </button>

                    <button
                      onClick={() => setTheme('sepia')}
                      className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 bg-[#f7f1e3] text-[#3c2f25] ${
                        theme === 'sepia' ? 'ring-2 ring-amber-700 border-amber-700 font-bold' : 'border-[#e4d8c2]'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#ede3cf] border border-[#d6c4a8]" />
                      <span className="text-[11px]">سيبيا</span>
                    </button>

                    <button
                      onClick={() => setTheme('charcoal')}
                      className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 bg-[#1e293b] text-[#f1f5f9] ${
                        theme === 'charcoal' ? 'ring-2 ring-amber-400 border-amber-400 font-bold' : 'border-slate-700'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#0f172a] border border-slate-600" />
                      <span className="text-[11px]">رمادي</span>
                    </button>

                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 bg-[#09090b] text-[#f4f4f5] ${
                        theme === 'dark' ? 'ring-2 ring-red-500 border-red-500 font-bold' : 'border-zinc-800'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-black border border-zinc-700" />
                      <span className="text-[11px]">ليلي</span>
                    </button>
                  </div>
                </div>

                {/* 2. Font Family */}
                <div>
                  <label className="block font-bold mb-2 opacity-80">نوع الخط العربي:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setFontFamily('amiri')}
                      className={`py-2 px-2 rounded-lg border text-center transition text-xs ${
                        fontFamily === 'amiri'
                          ? 'border-red-600 font-bold ring-1 ring-red-600'
                          : themeStyle.border
                      }`}
                      style={{ fontFamily: "'Amiri', serif" }}
                    >
                      الأميري (نسخي)
                    </button>
                    <button
                      onClick={() => setFontFamily('cairo')}
                      className={`py-2 px-2 rounded-lg border text-center transition text-xs ${
                        fontFamily === 'cairo'
                          ? 'border-red-600 font-bold ring-1 ring-red-600'
                          : themeStyle.border
                      }`}
                      style={{ fontFamily: "'Cairo', sans-serif" }}
                    >
                      القاهرة (صحفي)
                    </button>
                    <button
                      onClick={() => setFontFamily('tajawal')}
                      className={`py-2 px-2 rounded-lg border text-center transition text-xs ${
                        fontFamily === 'tajawal'
                          ? 'border-red-600 font-bold ring-1 ring-red-600'
                          : themeStyle.border
                      }`}
                      style={{ fontFamily: "'Tajawal', sans-serif" }}
                    >
                      تجوال (عصري)
                    </button>
                  </div>
                </div>

                {/* 3. Line Spacing */}
                <div>
                  <label className="block font-bold mb-2 opacity-80">تباعد الأسطر:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setLineHeight('normal')}
                      className={`py-1.5 rounded-lg border text-center transition text-[11px] ${
                        lineHeight === 'normal'
                          ? 'border-red-600 font-bold ring-1 ring-red-600'
                          : themeStyle.border
                      }`}
                    >
                      عادي
                    </button>
                    <button
                      onClick={() => setLineHeight('loose')}
                      className={`py-1.5 rounded-lg border text-center transition text-[11px] ${
                        lineHeight === 'loose'
                          ? 'border-red-600 font-bold ring-1 ring-red-600'
                          : themeStyle.border
                      }`}
                    >
                      مريح (موصى به)
                    </button>
                    <button
                      onClick={() => setLineHeight('spacious')}
                      className={`py-1.5 rounded-lg border text-center transition text-[11px] ${
                        lineHeight === 'spacious'
                          ? 'border-red-600 font-bold ring-1 ring-red-600'
                          : themeStyle.border
                      }`}
                    >
                      واسع
                    </button>
                  </div>
                </div>

                {/* 4. Column Width */}
                <div>
                  <label className="block font-bold mb-2 opacity-80">عرض صفحة القراءة:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setColumnWidth('compact')}
                      className={`py-1.5 rounded-lg border text-center transition text-[11px] ${
                        columnWidth === 'compact'
                          ? 'border-red-600 font-bold ring-1 ring-red-600'
                          : themeStyle.border
                      }`}
                    >
                      مضغوط
                    </button>
                    <button
                      onClick={() => setColumnWidth('normal')}
                      className={`py-1.5 rounded-lg border text-center transition text-[11px] ${
                        columnWidth === 'normal'
                          ? 'border-red-600 font-bold ring-1 ring-red-600'
                          : themeStyle.border
                      }`}
                    >
                      مثالي
                    </button>
                    <button
                      onClick={() => setColumnWidth('wide')}
                      className={`py-1.5 rounded-lg border text-center transition text-[11px] ${
                        columnWidth === 'wide'
                          ? 'border-red-600 font-bold ring-1 ring-red-600'
                          : themeStyle.border
                      }`}
                    >
                      عريض
                    </button>
                  </div>
                </div>

                {/* 5. Toggle Lead Image */}
                <div className="pt-2 border-t flex items-center justify-between">
                  <span className="font-bold opacity-80">عرض الصورة الرئيسية:</span>
                  <button
                    onClick={() => setShowImage(!showImage)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 transition ${
                      showImage ? 'border-emerald-600 text-emerald-600' : 'opacity-60'
                    }`}
                  >
                    {showImage ? (
                      <>
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>مفعلة</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>مخفية (نص فقط)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Clean Print */}
          <button
            onClick={() => window.print()}
            className={`p-2 rounded-lg border transition hover:opacity-80 ${themeStyle.border} ${themeStyle.cardBg}`}
            title="طباعة نصية نظيفة"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. Main Reading Content Container */}
      <main className={`mx-auto px-5 sm:px-8 pt-8 sm:pt-14 ${getWidthClass()}`}>
        {/* Subtle Breadcrumb & Meta */}
        <div className={`flex items-center gap-2 text-xs mb-4 ${themeStyle.subtextColor}`}>
          <span className="font-bold text-red-600">{getCountryName(article.country)}</span>
          <span aria-hidden="true">·</span>
          <span>{getCategoryLabel(article.category)}</span>
          <span aria-hidden="true">·</span>
          <span>{formattedDate}</span>
        </div>

        {/* Headline */}
        <h1
          className="font-black leading-tight sm:leading-snug mb-6 tracking-normal"
          style={{
            fontSize: `${Math.round(fontSize * 1.8)}px`,
            textWrap: 'balance',
            fontFamily: fontFamily === 'amiri' ? "'Amiri', serif" : "'Cairo', sans-serif",
          }}
        >
          {article.title}
        </h1>

        {/* Deck / Summary */}
        <div
          className={`pr-4 border-r-4 ${themeStyle.accent} ${themeStyle.subtextColor} font-medium mb-8`}
          style={{
            fontSize: `${Math.round(fontSize * 1.15)}px`,
            lineHeight: 1.8,
            borderColor: theme === 'sepia' ? '#8b4513' : theme === 'charcoal' ? '#fbbf24' : '#b91c1c',
          }}
        >
          {article.summary}
        </div>

        {/* Clean Author Byline */}
        <div
          className={`py-3.5 border-y my-6 flex items-center justify-between text-xs ${themeStyle.border} ${themeStyle.subtextColor}`}
        >
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-sm">{article.author.name}</span>
            <span aria-hidden="true">·</span>
            <span>{article.author.role}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>{totalWords} كلمة</span>
            <span aria-hidden="true">·</span>
            <span>~{readingTimeMinutes} دقيقة للقراءة</span>
          </div>
        </div>

        {/* Lead Feature Image (Toggable) */}
        {showImage && article.leadImage && (
          <figure className="my-8">
            <img
              src={article.leadImage}
              alt={article.title}
              className="w-full rounded-xl object-cover max-h-[460px] shadow-sm"
              loading="lazy"
            />
            {article.imageCaption && (
              <figcaption className={`mt-2 text-xs text-center italic ${themeStyle.subtextColor}`}>
                📷 {article.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Article Prose Body (Completely distraction-free, zero ads, zero sidebars) */}
        <article
          className={`space-y-6 ${getLineHeightClass()}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {paragraphs.map((p, idx) => (
            <p
              key={idx}
              className={
                idx === 0
                  ? 'first-letter:text-4xl first-letter:font-bold first-letter:float-right first-letter:ml-3 first-letter:leading-none'
                  : ''
              }
            >
              {p}
            </p>
          ))}
        </article>

        {/* Source & Editorial Attribution */}
        <div
          className={`mt-12 p-4 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${themeStyle.cardBg} ${themeStyle.border} ${themeStyle.subtextColor}`}
        >
          <div>
            <strong>المصدر الصحفي:</strong> {article.source}
          </div>
          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>التحقق من المصدر الأصلي</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Exit & Return to Full Portal Banner */}
        <div className={`mt-14 pt-8 border-t text-center ${themeStyle.border}`}>
          <p className={`text-xs mb-4 ${themeStyle.subtextColor}`}>
            انتهيت من قراءة المقال في وضع القارئ الهادئ
          </p>
          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className={`px-6 py-3 rounded-xl border font-bold text-sm inline-flex items-center gap-2 transition shadow-sm hover:scale-[1.02] ${themeStyle.accentBg} text-white`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى المقال الكامل والتعليقات</span>
          </button>
        </div>
      </main>
    </div>
  );
};

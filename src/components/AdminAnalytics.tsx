import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Users,
  Award,
  Globe2,
  Calendar,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { Article, Comment } from '../types';
import { MAGHREB_COUNTRIES, CATEGORIES_CONFIG } from '../data/initialArticles';

interface AdminAnalyticsProps {
  articles: Article[];
  comments: Comment[];
}

const COUNTRY_COLORS: Record<string, string> = {
  morocco: '#dc2626',   // Morocco Red
  algeria: '#16a34a',   // Algeria Green
  tunisia: '#e11d48',   // Tunisia Crimson
  libya: '#059669',     // Libya Emerald
  mauritania: '#ca8a04', // Mauritania Gold
  world: '#2563eb',     // Blue
  arab: '#7c3aed',      // Purple
};

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ articles, comments }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'reads' | 'engagement'>('all');

  // 1. High-level aggregates
  const totalReads = useMemo(
    () => articles.reduce((acc, a) => acc + a.readsCount, 0),
    [articles]
  );
  const totalLikes = useMemo(
    () => articles.reduce((acc, a) => acc + a.likesCount, 0),
    [articles]
  );
  const totalComments = useMemo(
    () => comments.length + articles.reduce((acc, a) => acc + a.commentsCount, 0),
    [articles, comments]
  );
  const totalInteractions = totalLikes + totalComments;
  const avgReadsPerArticle = articles.length > 0 ? Math.round(totalReads / articles.length) : 0;
  const engagementRate = totalReads > 0 ? ((totalInteractions / totalReads) * 100).toFixed(2) : '0.00';

  // 2. Trend Data over Time for AreaChart
  const timeSeriesData = useMemo(() => {
    // Generate dates based on published articles or synthetic realistic series based on real articles
    const days = [
      { date: '22 سبتمبر', dayKey: '2026-09-22', reads: 8400, likes: 310, comments: 22 },
      { date: '23 سبتمبر', dayKey: '2026-09-23', reads: 11200, likes: 450, comments: 34 },
      { date: '24 سبتمبر', dayKey: '2026-09-24', reads: 13900, likes: 580, comments: 41 },
      { date: '25 سبتمبر', dayKey: '2026-09-25', reads: 17800, likes: 720, comments: 56 },
      { date: '26 سبتمبر', dayKey: '2026-09-26', reads: 15400, likes: 610, comments: 48 },
      { date: '27 سبتمبر', dayKey: '2026-09-27', reads: 22100, likes: 920, comments: 75 },
      { date: '28 سبتمبر (اليوم)', dayKey: '2026-09-28', reads: Math.max(26500, totalReads), likes: Math.max(1150, totalLikes), comments: Math.max(89, totalComments) },
    ];

    if (timeRange === '7d') return days;
    return days;
  }, [timeRange, totalReads, totalLikes, totalComments]);

  // 3. Country Performance breakdown for BarChart
  const countryBreakdown = useMemo(() => {
    const map: Record<string, { country: string; name: string; reads: number; likes: number; comments: number; count: number }> = {};

    MAGHREB_COUNTRIES.forEach((c) => {
      map[c.id] = {
        country: c.id,
        name: `${c.flag} ${c.name}`,
        reads: 0,
        likes: 0,
        comments: 0,
        count: 0,
      };
    });

    articles.forEach((a) => {
      if (map[a.country]) {
        map[a.country].reads += a.readsCount;
        map[a.country].likes += a.likesCount;
        map[a.country].comments += a.commentsCount;
        map[a.country].count += 1;
      }
    });

    return Object.values(map);
  }, [articles]);

  // 4. Category breakdown for PieChart
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { name: string; value: number }> = {};

    articles.forEach((a) => {
      const catConfig = CATEGORIES_CONFIG.find((c) => c.id === a.category);
      const label = catConfig ? catConfig.label : a.category;
      if (!map[label]) {
        map[label] = { name: label, value: 0 };
      }
      map[label].value += a.readsCount;
    });

    return Object.values(map);
  }, [articles]);

  // 5. Top 5 Ranked Articles
  const topArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => b.readsCount - a.readsCount)
      .slice(0, 5);
  }, [articles]);

  const PIE_COLORS = ['#b91c1c', '#047857', '#d97706', '#2563eb', '#7c3aed', '#db2777', '#4b5563'];

  return (
    <div className="space-y-8 font-['Tajawal']" dir="rtl">
      {/* Title & Filter ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-['Cairo'] flex items-center gap-2">
            <Activity className="w-6 h-6 text-red-600" />
            <span>لوحة المؤشرات والتحليلات البيانية (Analytics)</span>
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            تحليل معدلات قراءة المقالات وتفاعل الجمهور المغاربي عبر الزمن لدعم التخطيط التحريري
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-lg border border-stone-300 dark:border-stone-700 flex items-center gap-1 text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-md font-bold transition ${
                timeRange === '7d'
                  ? 'bg-white dark:bg-stone-900 text-red-700 dark:text-red-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              آخر 7 أيام
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-md font-bold transition ${
                timeRange === '30d'
                  ? 'bg-white dark:bg-stone-900 text-red-700 dark:text-red-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              آخر 30 يوماً
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 block mb-1">إجمالي القراءات</span>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-mono tabular-nums">
              {totalReads.toLocaleString('ar-MA')}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% عن الأسبوع الماضي</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Total Likes */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 block mb-1">إعجابات الجمهور</span>
            <div className="text-2xl sm:text-3xl font-black text-red-600 font-mono tabular-nums">
              {totalLikes.toLocaleString('ar-MA')}
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">
              تفاعل مباشر على الأخبار
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <Heart className="w-6 h-6 fill-current" />
          </div>
        </div>

        {/* Comments Count */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 block mb-1">نقاشات وتعليقات القراء</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 font-mono tabular-nums">
              {totalComments.toLocaleString('ar-MA')}
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">
              تخضع لميثاق الشرف
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 block mb-1">معدل التفاعل الإجمالي</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tabular-nums">
              {engagementRate}%
            </div>
            <span className="text-[11px] text-emerald-600 font-bold block mt-1">
              مؤشر ثقة واهتمام القراء
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Chart: Time Series (القراءات والتفاعل عبر الزمن) */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            <h4 className="text-base font-bold text-stone-900 dark:text-white font-['Cairo']">
              منحنى نمو القراءات والتفاعل التراكمي عبر الزمن
            </h4>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setSelectedMetric('all')}
              className={`px-2.5 py-1 rounded transition ${
                selectedMetric === 'all'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold'
                  : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setSelectedMetric('reads')}
              className={`px-2.5 py-1 rounded transition ${
                selectedMetric === 'reads'
                  ? 'bg-red-700 text-white font-bold'
                  : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              القراءات فقط
            </button>
            <button
              onClick={() => setSelectedMetric('engagement')}
              className={`px-2.5 py-1 rounded transition ${
                selectedMetric === 'engagement'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              التفاعل (إعجابات + تعليقات)
            </button>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  color: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #44403c',
                  fontSize: '12px',
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

              {(selectedMetric === 'all' || selectedMetric === 'reads') && (
                <Area
                  type="monotone"
                  dataKey="reads"
                  name="عدد القراءات"
                  stroke="#b91c1c"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorReads)"
                />
              )}

              {(selectedMetric === 'all' || selectedMetric === 'engagement') && (
                <Area
                  type="monotone"
                  dataKey="likes"
                  name="الإعجابات"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLikes)"
                />
              )}

              {(selectedMetric === 'all' || selectedMetric === 'engagement') && (
                <Area
                  type="monotone"
                  dataKey="comments"
                  name="التعليقات"
                  stroke="#059669"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorComments)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Country Comparison & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Country Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-stone-900 dark:text-white font-['Cairo'] flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-600" />
              <span>توزيع القراءات والتفاعل حسب دول المغرب العربي</span>
            </h4>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryBreakdown} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                    direction: 'rtl',
                    textAlign: 'right',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="reads" name="القراءات" fill="#b91c1c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="likes" name="الإعجابات" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-stone-900 dark:text-white font-['Cairo'] flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber-500" />
              <span>نسبة الاهتمام حسب الأقسام التحريرية</span>
            </h4>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(((percent ?? 0)) * 100).toFixed(0)}%`}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                    direction: 'rtl',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 5 Articles Leaderboard */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <h4 className="text-base font-bold text-stone-900 dark:text-white font-['Cairo'] flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>ترتيب المقالات الأكثر جذباً للقراء والتفاعل (Top 5)</span>
          </h4>
          <span className="text-xs text-stone-400">محدث لحظياً</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="text-stone-500 border-b border-stone-100 dark:border-stone-800 font-bold">
              <tr>
                <th className="py-2 px-3">الترتيب</th>
                <th className="py-2 px-3">عنوان المقال</th>
                <th className="py-2 px-3">الدولة</th>
                <th className="py-2 px-3">القراءات</th>
                <th className="py-2 px-3">الإعجابات</th>
                <th className="py-2 px-3">التعليقات</th>
                <th className="py-2 px-3">معدل التفاعل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {topArticles.map((art, idx) => {
                const articleInteractions = art.likesCount + art.commentsCount;
                const rate = art.readsCount > 0 ? ((articleInteractions / art.readsCount) * 100).toFixed(1) : '0';
                return (
                  <tr key={art.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition">
                    <td className="py-3 px-3 font-mono font-black text-stone-400">
                      #{idx + 1}
                    </td>
                    <td className="py-3 px-3 font-bold text-stone-900 dark:text-white max-w-md truncate">
                      {art.title}
                    </td>
                    <td className="py-3 px-3 text-stone-600 dark:text-stone-300">
                      {MAGHREB_COUNTRIES.find((c) => c.id === art.country)?.name || art.country}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-stone-800 dark:text-stone-200">
                      {art.readsCount.toLocaleString('ar-MA')}
                    </td>
                    <td className="py-3 px-3 font-mono text-red-600">
                      {art.likesCount.toLocaleString('ar-MA')}
                    </td>
                    <td className="py-3 px-3 font-mono text-blue-600">
                      {art.commentsCount.toLocaleString('ar-MA')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(100, Number(rate) * 15)}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-emerald-600 font-bold">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

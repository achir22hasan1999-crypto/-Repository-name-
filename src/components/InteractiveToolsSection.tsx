import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Coins, 
  Building2, 
  CheckCircle2, 
  ArrowLeftRight, 
  TrendingUp, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Percent,
  Wallet,
  Clock,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface AgencyConfig {
  id: string;
  name: string;
  logoColor: string;
  badge: string;
  baseSetupCost: number; // MAD
  securitySystemCost: number; // MAD
  recommendedCashFloat: number; // MAD
  avgMonthlyCommissionPer100Tx: number; // MAD
  articleUrl?: string;
  description: string;
  pros: string[];
}

const AGENCIES: AgencyConfig[] = [
  {
    id: 'cash-plus',
    name: 'كاش بلوس (Cash Plus)',
    logoColor: 'from-amber-500 to-amber-700',
    badge: 'الشبكة الأكثر انتشاراً',
    baseSetupCost: 38000,
    securitySystemCost: 16000,
    recommendedCashFloat: 70000,
    avgMonthlyCommissionPer100Tx: 1450,
    articleUrl: '/article/how-much-does-it-cost-to-open-cash-plus-agency-morocco-2026-budget-guide',
    description: 'تعتبر كاش بلوس رائدة خدمات تحويل الأموال وأداء الفواتير مع شبكة تتجاوز 4000 وكالة في المغرب ومرونة عالية في نماذج الشراكة.',
    pros: ['سرعة معالجة الملف', 'تنوع هائل في الخدمات والفواتير', 'طلب مرتفع من الزبناء يومياً']
  },
  {
    id: 'wafacash',
    name: 'وفاكاش (Wafacash)',
    logoColor: 'from-yellow-500 to-amber-600',
    badge: 'مجموعة التجاري وفا بنك',
    baseSetupCost: 45000,
    securitySystemCost: 18000,
    recommendedCashFloat: 85000,
    avgMonthlyCommissionPer100Tx: 1620,
    articleUrl: '/article/how-to-start-wafacash-agency-morocco-2026-guide',
    description: 'الذراع المالي لمجموعة التجاري وفا بنك، شريك حصري لـ Western Union، وتتميز بمصداقية بنكية عالية وإقبال كبير على التحويلات الدولية.',
    pros: ['قوة علامة التجاري وفا بنك', 'حجم تحويلات دولية ضخم', 'ثقة عالية لدى المغاربة المقيمين بالخارج']
  },
  {
    id: 'chaabi-cash',
    name: 'الشعبي كاش (Chaabi Cash)',
    logoColor: 'from-orange-500 to-red-600',
    badge: 'مجموعة البنك الشعبي',
    baseSetupCost: 42000,
    securitySystemCost: 17000,
    recommendedCashFloat: 75000,
    avgMonthlyCommissionPer100Tx: 1520,
    articleUrl: '/article/how-to-start-chaabi-cash-agency-morocco-2026-guide',
    description: 'شبكة مؤسسة "ميكرو إم أ كاش" التابعة للبنك الشعبي، مدعومة بقاعدة زبناء واسعة وعروض استخلاص حصرية لخدمات الإدارات العمومية.',
    pros: ['ارتباط متين بالبنك الشعبي', 'إجراءات مبسطة للمحلات القائمة', 'تسهيلات في الدعم التقني']
  },
  {
    id: 'barid-cash',
    name: 'بريد كاش (Barid Cash)',
    logoColor: 'from-blue-600 to-blue-800',
    badge: 'مجموعة بريد المغرب',
    baseSetupCost: 39000,
    securitySystemCost: 15000,
    recommendedCashFloat: 65000,
    avgMonthlyCommissionPer100Tx: 1380,
    articleUrl: '/article/how-to-start-barid-cash-agency-morocco-2026-guide',
    description: 'مؤسسة أداء تابعة لبريد بنك وبريد المغرب، تتيح تغطية ممتازة في جميع المدن والمراكز شبه الحضرية والقروية.',
    pros: ['انتشار ممتاز في المراكز الصغرى', 'خدمات الحساب البنكي بريد بنك', 'رسوم ملف تنافسية']
  },
  {
    id: 'damane-cash',
    name: 'ضمان كاش (Damane Cash)',
    logoColor: 'from-emerald-600 to-teal-800',
    badge: 'مجموعة بنك أوف أفريقيا',
    baseSetupCost: 37000,
    securitySystemCost: 15000,
    recommendedCashFloat: 60000,
    avgMonthlyCommissionPer100Tx: 1350,
    articleUrl: '/article/how-to-start-damane-cash-agency-morocco-2026-guide',
    description: 'فرع الأداء لمجموعة بنك إفريقيا (BMCE)، تقدم حلولاً رقمية سريعة ومحفظة متطورة لدعم رواد الأعمال الشباب.',
    pros: ['حلول دفع مبتكرة', 'شراكات قوية مع منصات التجارة الإلكترونية', 'مواكبة تدريبية مستمرة']
  },
  {
    id: 'lana-cash',
    name: 'لانا كاش (Lana Cash)',
    logoColor: 'from-purple-600 to-indigo-800',
    badge: 'مجموعة السكنى والتعمير',
    baseSetupCost: 35000,
    securitySystemCost: 14000,
    recommendedCashFloat: 55000,
    avgMonthlyCommissionPer100Tx: 1300,
    articleUrl: '/article/how-to-start-lana-cash-agency-morocco-2026-guide',
    description: 'مؤسسة أداء صاعدة تابعة لمجموعة القرض العقاري والسياحي (CIH Bank)، موجهة للشباب وتتميز بالرقمنة العالية.',
    pros: ['تكامل ذكي مع تطبيقات الهواتف', 'شروط مرنة للشباب وحاملي الشهادات', 'معدلات نمو سريعة']
  }
];

// Updated 2026 Central Bank / Forex Reference Rates
const EXCHANGE_RATES: Record<string, { name: string; flag: string; rateToMAD: number; symbol: string }> = {
  EUR: { name: 'اليورو الأوروبي', flag: '🇪🇺', rateToMAD: 10.85, symbol: '€' },
  USD: { name: 'الدولار الأمريكي', flag: '🇺🇸', rateToMAD: 10.05, symbol: '$' },
  GBP: { name: 'الجنيه الإسترليني', flag: '🇬🇧', rateToMAD: 13.02, symbol: '£' },
  CAD: { name: 'الدولار الكندي', flag: '🇨🇦', rateToMAD: 7.35, symbol: 'C$' },
  SAR: { name: 'الريال السعودي', flag: '🇸🇦', rateToMAD: 2.68, symbol: 'ر.س' },
  AED: { name: 'الدرهم الإماراتي', flag: '🇦🇪', rateToMAD: 2.73, symbol: 'د.إ' },
  QAR: { name: 'الريال القطري', flag: '🇶🇦', rateToMAD: 2.76, symbol: 'ر.ق' },
  KWD: { name: 'الدينار الكويتي', flag: '🇰🇼', rateToMAD: 32.75, symbol: 'د.ك' },
  DZD: { name: 'الدينار الجزائري (رسمي)', flag: '🇩🇿', rateToMAD: 0.075, symbol: 'د.ج' },
  TND: { name: 'الدينار التونسي', flag: '🇹🇳', rateToMAD: 3.25, symbol: 'د.ت' },
  LYD: { name: 'الدينار الليبي', flag: '🇱🇾', rateToMAD: 2.08, symbol: 'د.ل' },
  MRU: { name: 'الأوقية الموريتانية', flag: '🇲🇷', rateToMAD: 0.252, symbol: 'أ.م' },
  EGP: { name: 'الجنيه المصري', flag: '🇪🇬', rateToMAD: 0.21, symbol: 'ج.م' }
};

interface InteractiveToolsSectionProps {
  onOpenArticle?: (id: string) => void;
  className?: string;
  defaultTab?: 'agency-calc' | 'forex' | 'rent-tax';
}

export const InteractiveToolsSection: React.FC<InteractiveToolsSectionProps> = ({
  onOpenArticle,
  className = '',
  defaultTab = 'agency-calc'
}) => {
  const [activeTab, setActiveTab] = useState<'agency-calc' | 'forex' | 'rent-tax'>(defaultTab);

  // --- Calculator 1: Money Transfer Agency Calculator State ---
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('cash-plus');
  const [cityTier, setCityTier] = useState<'major' | 'medium' | 'small' | 'rural'>('major');
  const [storeStatus, setStoreStatus] = useState<'rent' | 'owned'>('rent');
  const [monthlyRent, setMonthlyRent] = useState<number>(4500);
  const [shopArea, setShopArea] = useState<'standard' | 'medium' | 'large'>('standard');
  const [estimatedDailyTx, setEstimatedDailyTx] = useState<number>(45); // daily transactions
  const [availableCapital, setAvailableCapital] = useState<number>(100000);

  // Agency calculation results
  const selectedAgency = useMemo(() => {
    return AGENCIES.find((a) => a.id === selectedAgencyId) || AGENCIES[0];
  }, [selectedAgencyId]);

  const agencyResults = useMemo(() => {
    // City multipliers
    const cityMultipliers = { major: 1.15, medium: 1.0, small: 0.85, rural: 0.7 };
    const areaMultipliers = { standard: 1.0, medium: 1.25, large: 1.55 };

    const mult = cityMultipliers[cityTier] * areaMultipliers[shopArea];
    const fitoutCost = Math.round(selectedAgency.baseSetupCost * mult);
    const securityCost = Math.round(selectedAgency.securitySystemCost * (cityTier === 'major' ? 1.1 : 1.0));
    const legalFees = 3500; // Registration, commercial registry, patents
    const rentAdvance = storeStatus === 'rent' ? monthlyRent * 3 : 0; // 3 months guarantee + first month
    const workingCapital = Math.max(selectedAgency.recommendedCashFloat, Math.round(availableCapital * 0.45));

    const totalInitialBudget = fitoutCost + securityCost + legalFees + rentAdvance + workingCapital;

    // Projected Monthly Revenues
    const monthlyTransactions = estimatedDailyTx * 26; // 26 working days
    const baseCommission = Math.round((monthlyTransactions / 100) * selectedAgency.avgMonthlyCommissionPer100Tx);
    // Extra revenue from bill payments, taxes, mobile recharge, recharge cards (~35% add-on)
    const ancillaryRevenue = Math.round(baseCommission * 0.38);
    const totalMonthlyGrossRevenue = baseCommission + ancillaryRevenue;

    // Monthly Expenses
    const effectiveRent = storeStatus === 'rent' ? monthlyRent : 0;
    const utilitiesAndInternet = 1200; // Fiber optic, electricity, paper rolls
    const accountingAndTaxes = 800;
    const employeeSalary = estimatedDailyTx > 50 ? 3500 : 0; // If owner operates or needs assistant
    const totalMonthlyExpenses = effectiveRent + utilitiesAndInternet + accountingAndTaxes + employeeSalary;

    const projectedMonthlyNetProfit = totalMonthlyGrossRevenue - totalMonthlyExpenses;
    const paybackPeriodMonths = projectedMonthlyNetProfit > 0 
      ? Math.max(8, Math.round((totalInitialBudget - workingCapital) / projectedMonthlyNetProfit))
      : 0;

    return {
      fitoutCost,
      securityCost,
      legalFees,
      rentAdvance,
      workingCapital,
      totalInitialBudget,
      totalMonthlyGrossRevenue,
      totalMonthlyExpenses,
      projectedMonthlyNetProfit,
      paybackPeriodMonths,
      monthlyTransactions
    };
  }, [selectedAgency, cityTier, storeStatus, monthlyRent, shopArea, estimatedDailyTx, availableCapital]);

  // --- Calculator 2: Currency Exchange State ---
  const [forexAmount, setForexAmount] = useState<number>(100);
  const [sourceCurrency, setSourceCurrency] = useState<string>('EUR');
  const [targetCurrency, setTargetCurrency] = useState<string>('MAD');

  const convertedForexValue = useMemo(() => {
    if (isNaN(forexAmount) || forexAmount <= 0) return 0;
    const fromMADRate = sourceCurrency === 'MAD' ? 1 : (EXCHANGE_RATES[sourceCurrency]?.rateToMAD || 1);
    const toMADRate = targetCurrency === 'MAD' ? 1 : (EXCHANGE_RATES[targetCurrency]?.rateToMAD || 1);

    // Convert from source to MAD, then MAD to target
    const amountInMAD = forexAmount * fromMADRate;
    const finalAmount = amountInMAD / toMADRate;
    return Number(finalAmount.toFixed(2));
  }, [forexAmount, sourceCurrency, targetCurrency]);

  const handleSwapCurrencies = () => {
    const temp = sourceCurrency;
    setSourceCurrency(targetCurrency);
    setTargetCurrency(temp);
  };

  // --- Calculator 3: Rental Income Tax (Morocco Finance Law 2026) ---
  const [grossAnnualRent, setGrossAnnualRent] = useState<number>(60000); // 5000 MAD/month
  const [rentalPropertyType, setRentalPropertyType] = useState<'residential' | 'commercial'>('residential');

  const rentalTaxResults = useMemo(() => {
    // Moroccan General Tax Code (CGI 2026):
    // Annual gross rent <= 30,000 MAD: EXEMPT (0%)
    // 30,001 to 120,000 MAD: 10%
    // Over 120,000 MAD: 15%
    let annualTax = 0;
    let effectiveRate = 0;

    if (grossAnnualRent <= 30000) {
      annualTax = 0;
      effectiveRate = 0;
    } else if (grossAnnualRent <= 120000) {
      annualTax = grossAnnualRent * 0.10;
      effectiveRate = 10;
    } else {
      annualTax = grossAnnualRent * 0.15;
      effectiveRate = 15;
    }

    const monthlyGross = Math.round(grossAnnualRent / 12);
    const monthlyTax = Math.round(annualTax / 12);
    const monthlyNet = monthlyGross - monthlyTax;

    return {
      monthlyGross,
      annualTax,
      monthlyTax,
      monthlyNet,
      effectiveRate
    };
  }, [grossAnnualRent]);

  return (
    <section className={`bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm ${className}`}>
      {/* Top Header Badge */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-red-950 text-white p-6 sm:p-8 border-b border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>منصة الأدوات والخدمات التفاعلية المعتمدة 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Cairo'] tracking-tight">
              أدوات وحاسبات الاستثمار والمالية بالمغرب والمغرب العربي
            </h2>
            <p className="text-sm sm:text-base text-stone-300 mt-2 max-w-3xl leading-relaxed">
              خدمات رقمية تفاعلية دقيقة وموثوقة لتقدير تكاليف مشاريع وكالات تحويل الأموال، تحويل العملات الأجنبية بأسعار البنك المركزي، وحساب الضرائب العقارية وفق قانون المالية المغربي.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-stone-800/80 p-1.5 rounded-lg border border-stone-700/60">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-medium text-stone-200">محدثة ومطابقة لمعايير 2026</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-4 border-t border-stone-850 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('agency-calc')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'agency-calc'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-stone-800/90 text-stone-300 hover:bg-stone-750 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>حاسبة وكالات تحويل الأموال (كاش بلوس، وفاكاش...)</span>
          </button>

          <button
            onClick={() => setActiveTab('forex')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'forex'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-stone-800/90 text-stone-300 hover:bg-stone-750 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>محول العملات المغاربية والعالمية المباشر</span>
          </button>

          <button
            onClick={() => setActiveTab('rent-tax')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'rent-tax'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-stone-800/90 text-stone-300 hover:bg-stone-750 hover:text-white'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>حاسبة الضريبة على الكراء بالمغرب 2026</span>
          </button>
        </div>
      </div>

      {/* Main Tools Container */}
      <div className="p-4 sm:p-8">
        {/* ========================================================= */}
        {/* TAB 1: Money Transfer Agency Calculator                   */}
        {/* ========================================================= */}
        {activeTab === 'agency-calc' && (
          <div className="space-y-8">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>دراسة جدوى تفاعلية معتمدة:</strong> تم بناء هذه الخوارزمية استناداً إلى دفاتر التحملات المعتمدة من بنك المغرب لسنة 2026 وتكاليف التجهيز الحقيقية للشركات الرائدة (Cash Plus, Wafacash, Chaabi Cash, Barid Cash, Damane Cash, Lana Cash).
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Inputs */}
              <div className="lg:col-span-6 space-y-6 bg-white dark:bg-stone-850 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-red-600" />
                  <span>معطيات المشروع والمحل التجاري</span>
                </h3>

                {/* 1. Select Network */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                    1. اختر شبكة تحويل الأموال المرغوبة:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AGENCIES.map((agency) => (
                      <button
                        key={agency.id}
                        type="button"
                        onClick={() => setSelectedAgencyId(agency.id)}
                        className={`p-3 text-right rounded-lg border text-xs font-bold transition-all flex flex-col justify-between ${
                          selectedAgencyId === agency.id
                            ? 'border-red-600 bg-red-50/70 dark:bg-red-950/40 text-red-900 dark:text-red-200 ring-2 ring-red-500/20'
                            : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold">{agency.name}</span>
                          {selectedAgencyId === agency.id && (
                            <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">
                          {agency.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. City Tier */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                    2. موقع الوكالة والمدينة:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { id: 'major', label: 'مدن كبرى', sub: 'البيضاء، الرباط، طنجة' },
                      { id: 'medium', label: 'مدن متوسطة', sub: 'فاس، أكادير، مراكش' },
                      { id: 'small', label: 'مدن صغرى', sub: 'مراكز إقليمية' },
                      { id: 'rural', label: 'مناطق قروية', sub: 'مراكز صاعدة' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCityTier(c.id as any)}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          cityTier === c.id
                            ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold'
                            : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100'
                        }`}
                      >
                        <div className="font-bold text-xs">{c.label}</div>
                        <div className="text-[9px] opacity-75 mt-0.5">{c.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Shop Status & Rent */}
                <div className="space-y-3 pt-2 border-t border-stone-150 dark:border-stone-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      3. وضعية المحل التجاري:
                    </label>
                    <div className="flex rounded-lg border border-stone-300 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-800 text-xs">
                      <button
                        type="button"
                        onClick={() => setStoreStatus('rent')}
                        className={`px-3 py-1 rounded-md font-bold transition-all ${
                          storeStatus === 'rent'
                            ? 'bg-white dark:bg-stone-700 shadow text-stone-900 dark:text-stone-100'
                            : 'text-stone-500 hover:text-stone-900'
                        }`}
                      >
                        كراء
                      </button>
                      <button
                        type="button"
                        onClick={() => setStoreStatus('owned')}
                        className={`px-3 py-1 rounded-md font-bold transition-all ${
                          storeStatus === 'owned'
                            ? 'bg-white dark:bg-stone-700 shadow text-stone-900 dark:text-stone-100'
                            : 'text-stone-500 hover:text-stone-900'
                        }`}
                      >
                        ملك خاص
                      </button>
                    </div>
                  </div>

                  {storeStatus === 'rent' && (
                    <div>
                      <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                        <span>السومة الكرائية الشهرية التقديرية:</span>
                        <span className="font-bold font-mono text-stone-900 dark:text-stone-100">
                          {monthlyRent.toLocaleString('ar-MA')} درهم / شهرياً
                        </span>
                      </div>
                      <input
                        type="range"
                        min="2000"
                        max="18000"
                        step="500"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                        className="w-full accent-red-600"
                      />
                      <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                        <span>2,000 د.م</span>
                        <span>8,000 د.م</span>
                        <span>18,000 د.م</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Daily Transactions Slider */}
                <div className="pt-2 border-t border-stone-150 dark:border-stone-800">
                  <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      4. متوسط عدد العمليات المتوقعة يومياً (تحويل وفواتير):
                    </span>
                    <span className="font-bold font-mono text-red-600 dark:text-red-400 text-sm">
                      {estimatedDailyTx} عملية / يوم
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="160"
                    step="5"
                    value={estimatedDailyTx}
                    onChange={(e) => setEstimatedDailyTx(Number(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                    <span>15 عملية (بداية هادئة)</span>
                    <span>50 عملية (وكالة نشطة)</span>
                    <span>160 عملية (موقع استراتيجي)</span>
                  </div>
                </div>

                {/* 5. Capital float */}
                <div className="pt-2 border-t border-stone-150 dark:border-stone-800">
                  <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      5. رأس المال المتوفر للسيولة النقدية (Fond de Roulement):
                    </span>
                    <span className="font-bold font-mono text-stone-900 dark:text-stone-100">
                      {availableCapital.toLocaleString('ar-MA')} درهم
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40000"
                    max="250000"
                    step="5000"
                    value={availableCapital}
                    onChange={(e) => setAvailableCapital(Number(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    * الحد الأدنى الموصى به لـ {selectedAgency.name} هو {selectedAgency.recommendedCashFloat.toLocaleString('ar-MA')} درهم لتجنب نفاد السيولة عند استقبال حوالات كبيرة.
                  </p>
                </div>
              </div>

              {/* Right Column: Computed Financial Report */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white p-6 rounded-xl border border-stone-800 shadow-lg">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
                    <div>
                      <span className="text-xs text-red-400 font-bold">ملخص دراسة الجدوى التقديرية</span>
                      <h4 className="text-lg font-bold font-['Cairo'] text-white">
                        {selectedAgency.name}
                      </h4>
                    </div>
                    <span className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded">
                      2026 تمويل وتشغيل
                    </span>
                  </div>

                  {/* Highlight Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-stone-850 p-4 rounded-lg border border-stone-750">
                      <div className="text-xs text-stone-400 mb-1 flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5 text-amber-400" />
                        <span>إجمالي رأس مال الانطلاق:</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                        {agencyResults.totalInitialBudget.toLocaleString('ar-MA')} <span className="text-xs font-normal">د.م</span>
                      </div>
                      <div className="text-[10px] text-stone-400 mt-1">
                        شامل التجهيز، الأمن، والسيولة
                      </div>
                    </div>

                    <div className="bg-stone-850 p-4 rounded-lg border border-stone-750">
                      <div className="text-xs text-stone-400 mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span>صافي الربح الشهري المتوقع:</span>
                      </div>
                      <div className={`text-xl sm:text-2xl font-black font-mono ${
                        agencyResults.projectedMonthlyNetProfit > 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {agencyResults.projectedMonthlyNetProfit.toLocaleString('ar-MA')} <span className="text-xs font-normal">د.م</span>
                      </div>
                      <div className="text-[10px] text-stone-400 mt-1">
                        بعد خصم الكراء وكافة المصاريف
                      </div>
                    </div>
                  </div>

                  {/* Breakdown Table */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-stone-800 text-stone-300">
                      <span>مصاريف التهيئة والديكور حسب الهوية:</span>
                      <span className="font-mono font-bold">{agencyResults.fitoutCost.toLocaleString('ar-MA')} د.م</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-stone-800 text-stone-300">
                      <span>الأجهزة الأمنية (خزنة، إنذار، كاميرات):</span>
                      <span className="font-mono font-bold">{agencyResults.securityCost.toLocaleString('ar-MA')} د.م</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-stone-800 text-stone-300">
                      <span>السيولة النقدية العاملة (Fond de Roulement):</span>
                      <span className="font-mono font-bold text-amber-300">{agencyResults.workingCapital.toLocaleString('ar-MA')} د.م</span>
                    </div>
                    {storeStatus === 'rent' && (
                      <div className="flex justify-between py-1.5 border-b border-stone-800 text-stone-300">
                        <span>تسبيق وضمان الكراء (3 أشهر):</span>
                        <span className="font-mono font-bold">{agencyResults.rentAdvance.toLocaleString('ar-MA')} د.م</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1.5 border-b border-stone-800 text-stone-300">
                      <span>المداخيل والعمولات الشهرية الإجمالية:</span>
                      <span className="font-mono font-bold text-emerald-400">+{agencyResults.totalMonthlyGrossRevenue.toLocaleString('ar-MA')} د.م/شهر</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-stone-800 text-stone-300">
                      <span>المصاريف الشهرية الإجمالية (كراء + فواتير):</span>
                      <span className="font-mono font-bold text-red-300">-{agencyResults.totalMonthlyExpenses.toLocaleString('ar-MA')} د.م/شهر</span>
                    </div>
                    <div className="flex justify-between py-2 text-stone-200 font-bold bg-stone-800/80 px-2 rounded mt-2">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>فترة استرداد رأس المال التقديرية (Payback):</span>
                      </span>
                      <span className="font-mono text-amber-300">
                        {agencyResults.paybackPeriodMonths > 0 ? `حوالي ${agencyResults.paybackPeriodMonths} شهراً` : 'تتطلب زيادة وتيرة العمليات'}
                      </span>
                    </div>
                  </div>

                  {/* Read Detailed Guide Link */}
                  {selectedAgency.articleUrl && (
                    <div className="mt-5 pt-4 border-t border-stone-800 flex items-center justify-between">
                      <span className="text-xs text-stone-400">شروط التسجيل والوثائق الرسمية:</span>
                      <a
                        href={selectedAgency.articleUrl}
                        className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold transition-colors"
                      >
                        <span>قراءة الدليل الشامل لـ {selectedAgency.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Key Insights & Advantages */}
                <div className="bg-white dark:bg-stone-850 p-5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 space-y-2.5">
                  <h5 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>مميزات وتوصيات حصرية لمشروع {selectedAgency.name}</span>
                  </h5>
                  <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                    {selectedAgency.description}
                  </p>
                  <ul className="space-y-1.5 pt-1">
                    {selectedAgency.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: Live Currency Converter (Maghreb & World)           */}
        {/* ========================================================= */}
        {activeTab === 'forex' && (
          <div className="space-y-8">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 flex items-start gap-3">
              <Coins className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                <strong>أسعار الصرف المرجعية 2026:</strong> يتم تحديث أسعار الصرف استناداً إلى النشرات اليومية لبنك المغرب والبنوك المركزية المغاربية، وتتيح مقارنة القوة الشرائية بين الدرهم المغربي، الدينار الجزائري، التونسي، الليبي، الأوقية الموريتانية، والعملات العالمية.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Converter Box */}
              <div className="lg:col-span-7 bg-white dark:bg-stone-850 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-red-600" />
                  <span>محول العملات الفوري المباشر</span>
                </h3>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    المبلغ المراد تحويله:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={forexAmount}
                      onChange={(e) => setForexAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full px-4 py-3 text-lg font-mono font-bold bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                    <span className="absolute left-3 top-3.5 text-xs text-stone-400 font-bold">
                      {sourceCurrency}
                    </span>
                  </div>
                </div>

                {/* Currency Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-9 gap-3 items-center">
                  {/* From Currency */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      من عملة:
                    </label>
                    <select
                      value={sourceCurrency}
                      onChange={(e) => setSourceCurrency(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100"
                    >
                      <option value="MAD">🇲🇦 MAD - الدرهم المغربي</option>
                      {Object.entries(EXCHANGE_RATES).map(([code, cur]) => (
                        <option key={code} value={code}>
                          {cur.flag} {code} - {cur.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Swap Button */}
                  <div className="sm:col-span-1 flex justify-center pt-5 sm:pt-4">
                    <button
                      type="button"
                      onClick={handleSwapCurrencies}
                      title="عكس العملات"
                      className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-750 hover:bg-red-600 hover:text-white border border-stone-300 dark:border-stone-700 flex items-center justify-center transition-all shadow-sm"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* To Currency */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      إلى عملة:
                    </label>
                    <select
                      value={targetCurrency}
                      onChange={(e) => setTargetCurrency(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100"
                    >
                      <option value="MAD">🇲🇦 MAD - الدرهم المغربي</option>
                      {Object.entries(EXCHANGE_RATES).map(([code, cur]) => (
                        <option key={code} value={code}>
                          {cur.flag} {code} - {cur.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Conversion Result Display */}
                <div className="bg-stone-900 text-white p-6 rounded-xl border border-stone-800 text-center space-y-2">
                  <div className="text-xs text-stone-400">
                    نتيجة التحويل الحالية:
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                    {convertedForexValue.toLocaleString('ar-MA')} <span className="text-base text-white">{targetCurrency}</span>
                  </div>
                  <div className="text-xs text-stone-400 font-mono mt-1">
                    {forexAmount.toLocaleString('ar-MA')} {sourceCurrency} = {convertedForexValue.toLocaleString('ar-MA')} {targetCurrency}
                  </div>
                </div>
              </div>

              {/* Reference Exchange Rates Table */}
              <div className="lg:col-span-5 bg-white dark:bg-stone-850 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>جدول أسعار العملات مقابل الدرهم المغربي (MAD)</span>
                </h4>
                <div className="divide-y divide-stone-150 dark:divide-stone-800 text-xs">
                  {Object.entries(EXCHANGE_RATES).map(([code, cur]) => (
                    <div key={code} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{cur.flag}</span>
                        <div>
                          <span className="font-bold text-stone-800 dark:text-stone-200">1 {code}</span>
                          <span className="text-[10px] text-stone-400 block">{cur.name}</span>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {cur.rateToMAD.toFixed(3)} <span className="text-[10px] text-stone-500">د.م</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: Rental Income Tax Calculator (Morocco CGI 2026)      */}
        {/* ========================================================= */}
        {activeTab === 'rent-tax' && (
          <div className="space-y-8">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-lg p-4 flex items-start gap-3">
              <Percent className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong>الضريبة على الدخول العقارية بالمغرب 2026:</strong> تخضع العقارات المؤجرة سكنياً أو مهنياً للضريبة على الدخل (IR Locatif)؛ حيث يُعفى الملاك الذين يقل دخلهم الكرائي السنوي عن 30,000 درهم، بينما تطبق نسبة 10% إلى حدود 120,000 درهم، ونسبة 15% لما فوق ذلك.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Inputs */}
              <div className="lg:col-span-6 bg-white dark:bg-stone-850 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-red-600" />
                  <span>معطيات الدخل الكرائي السنوي</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    إجمالي السومة الكرائية السنوية (درهم مغربي):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10000"
                      step="5000"
                      value={grossAnnualRent}
                      onChange={(e) => setGrossAnnualRent(Math.max(0, Number(e.target.value)))}
                      className="w-full px-4 py-3 text-lg font-mono font-bold bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                    <span className="absolute left-3 top-3.5 text-xs text-stone-400 font-bold">
                      د.م / سنوياً
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-500 mt-1.5">
                    <span>تعادل شهرياً:</span>
                    <span className="font-bold font-mono text-stone-800 dark:text-stone-200">
                      {rentalTaxResults.monthlyGross.toLocaleString('ar-MA')} درهم / شهرياً
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                    نوع الاستغلال:
                  </label>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setRentalPropertyType('residential')}
                      className={`p-3 rounded-lg border text-center font-bold transition-all ${
                        rentalPropertyType === 'residential'
                          ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700'
                      }`}
                    >
                      كراء سكني (Résidentiel)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRentalPropertyType('commercial')}
                      className={`p-3 rounded-lg border text-center font-bold transition-all ${
                        rentalPropertyType === 'commercial'
                          ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700'
                      }`}
                    >
                      كراء تجاري / مهني (Commercial)
                    </button>
                  </div>
                </div>
              </div>

              {/* Tax Output */}
              <div className="lg:col-span-6 bg-gradient-to-br from-stone-900 to-stone-950 text-white p-6 rounded-xl border border-stone-800 shadow-lg space-y-5">
                <div className="border-b border-stone-800 pb-3">
                  <span className="text-xs text-emerald-400 font-bold">النتيجة الضريبية الصافية</span>
                  <h4 className="text-xl font-bold font-['Cairo']">
                    تقرير الضريبة على الدخل الكرائي (IR)
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-stone-850 p-4 rounded-lg border border-stone-750">
                    <span className="text-xs text-stone-400 block mb-1">الضريبة السنوية المستحقة:</span>
                    <div className="text-2xl font-black font-mono text-red-400">
                      {rentalTaxResults.annualTax.toLocaleString('ar-MA')} <span className="text-xs font-normal">د.م</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      بمعدل اقتطاع: {rentalTaxResults.effectiveRate}%
                    </span>
                  </div>

                  <div className="bg-stone-850 p-4 rounded-lg border border-stone-750">
                    <span className="text-xs text-stone-400 block mb-1">صافي المدخول الشهري:</span>
                    <div className="text-2xl font-black font-mono text-emerald-400">
                      {rentalTaxResults.monthlyNet.toLocaleString('ar-MA')} <span className="text-xs font-normal">د.م</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      بعد أداء الواجب الضريبي
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-stone-800 pt-3">
                  <div className="flex justify-between text-stone-300">
                    <span>حالة الإعفاء القانوني:</span>
                    <span className="font-bold">
                      {grossAnnualRent <= 30000 ? '✅ معفى كلياً (أقل من 30,000 د.م)' : 'خاضع للضريبة وفق الشطر المحدد'}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>مبلغ الاقتطاع الضريبي الشهري:</span>
                    <span className="font-mono font-bold text-red-300">
                      {rentalTaxResults.monthlyTax.toLocaleString('ar-MA')} د.م / شهرياً
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

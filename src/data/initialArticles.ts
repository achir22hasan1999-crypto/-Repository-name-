import { Article, RssFeedItem } from '../types';
import { ARTICLES_ORIGINAL } from './articlesOriginal';
import { ARTICLES_MOROCCO } from './articlesMorocco';
import { ARTICLES_WORLD } from './articlesWorld';
import { ARTICLES_COOKING } from './articlesCooking';
import { ARTICLES_GULF } from './articlesGulf';
import { ARTICLES_ARAB_WORLD } from './articlesArabWorld';
import { AGENCY_ARTICLES } from './articlesAgency';

// Extract Mansouri latest story to guarantee it is always position #1
const mansouriStory = ARTICLES_MOROCCO.find(a => a.id === 'mor-mansouri-latest-updates-5-october-2026') || ARTICLES_MOROCCO[0];
const otherMoroccoStories = ARTICLES_MOROCCO.filter(a => a.id !== mansouriStory.id);
const adjustedOriginals = ARTICLES_ORIGINAL.map(a => a.id === 'art-1' ? { ...a, isLead: false } : a);

export const INITIAL_ARTICLES: Article[] = [
  { ...mansouriStory, isLead: true, isBreaking: true },
  ...ARTICLES_ARAB_WORLD,
  ...otherMoroccoStories,
  ...adjustedOriginals,
  ...AGENCY_ARTICLES,
  ...ARTICLES_GULF,
  ...ARTICLES_WORLD,
  ...ARTICLES_COOKING
];

export const INITIAL_COMMENTS = [
  {
    id: 'comm-1',
    articleId: 'mor-1',
    authorName: 'سفيان الفاسي',
    country: 'المغرب',
    date: '2026-09-29T11:20:00Z',
    content: 'خطوة استراتيجية عملاقة تضع المغرب في مقدمة دول العالم في تصدير الطاقة النظيفة. الأقاليم الجنوبية تملك إمكانيات طبيعية هائلة للمشاريع الخضراء.',
    likes: 18
  },
  {
    id: 'comm-2',
    articleId: 'mor-2',
    authorName: 'مريم أكادير',
    country: 'المغرب',
    date: '2026-09-29T09:40:00Z',
    content: 'وصول قطار البراق إلى مراكش وأكادير حلم كبير لكل سكان سوس-ماسة. سيربط شمال وجنوب المملكة في وقت قياسي ويعطي دفعة سياحية واقتصادية كبرى.',
    likes: 24
  },
  {
    id: 'comm-3',
    articleId: 'cook-1',
    authorName: 'فاطمة الزهراء الرباطي',
    country: 'المغرب',
    date: '2026-09-29T10:15:00Z',
    content: 'تبارك الله عليك وصفة متكاملة وشارحة لأدق تفاصيل التفوير الثلاثي والسمن الحار. قصرية الكسكس نهار الجمعة تجمع العائلة وتفرح الصغار والكبار.',
    likes: 31
  },
  {
    id: 'comm-4',
    articleId: 'wld-1',
    authorName: 'د. خالد بنسعيد',
    country: 'المغرب',
    date: '2026-09-29T12:00:00Z',
    content: 'مقال دقيق وتحليلي رفيع المستوى حول نماذج الاستدلال في الذكاء الاصطناعي. فعلاً التحول الحقيقي هو الانتقال من الحفظ إلى التفكير المنطقي والبحث العلمي.',
    likes: 15
  }
];

export const INITIAL_RSS_FEED: RssFeedItem[] = [
  {
    id: 'rss-1',
    title: 'اتفاقية أكاديمية مغاربية لدعم أبحاث الزراعة الذكية والتكيف المناخي',
    source: 'وكالة تونس إفريقيا للأنباء (وات)',
    sourceAgency: 'TAP',
    country: 'tunisia',
    category: 'society',
    originalSummary: 'أعلنت جامعة القيروان بتونس عن إبرام اتفاق ثلاثي مع جامعتي محمد الخامس بالرباط ومصطفى بن بولعيد بباتنة لتعزيز البحوث المشتركة في الزراعة المستدامة والبيوتكنولوجيا.',
    editorialSummary: 'في إطار تعزيز الدبلوماسية الأكاديمية المغاربية، وقعت جامعات من تونس والمغرب والجزائر اتفاقية لتبادل الأساتذة والطلبة الباحثين في مجالات التغير المناخي والأمن الغذائي، مع إنشاء منصة بحثية مشتركة.',
    date: '2026-09-29T09:00:00Z',
    originalUrl: 'https://tap.info.tn/academic-cooperation',
    status: 'pending'
  },
  {
    id: 'rss-2',
    title: 'المكتب الوطني للصيد بموريتانيا يعلن ارتفاع صادرات الأسماك الطازجة بنسبة 18%',
    source: 'الوكالة الموريتانية للأنباء (وما)',
    sourceAgency: 'AMI',
    country: 'mauritania',
    category: 'economy',
    originalSummary: 'أفادت معطيات رسمية صادرة عن ميناء نواذيبو المستقل بتسجيل ارتفاع قياسي في كميات الأسماك المصدرة إلى الأسواق الإفريقية والأوروبية مع افتتاح أرصفة تفريغ حديثة.',
    editorialSummary: 'سجلت الصادرات السمكية الموريتانية قفزة نوعية بلغت 18% بفضل الاستثمارات الحديثة في أسطول التبريد والموانئ الساحلية، مما عزز مكانة موريتانيا كمورد رئيسي للبروتين البحري النظيف إقليمياً.',
    date: '2026-09-29T08:30:00Z',
    originalUrl: 'https://ami.mr/fisheries-growth',
    status: 'pending'
  },
  {
    id: 'rss-3',
    title: 'افتتاح معرض الجزائر الدولي للمنتجات الحرفية والنسيج التقليدي بمشاركة مغاربية',
    source: 'وكالة الأنباء الجزائرية (واج)',
    sourceAgency: 'APS',
    country: 'algeria',
    category: 'culture',
    originalSummary: 'شهد قصر المعارض بالصنوبر البحري في الجزائر العاصمة انطلاق الصالون الدولي للصناعة التقليدية والحرف بحضور أكثر من 400 حرفي من مختلف ولايات الوطن ووفود شقيقة.',
    editorialSummary: 'تحتفي الجزائر بثراء الموروث الحرفي بمشاركة نخبة من صناع الفخار والزربية التقليدية من دول المغرب العربي، في تظاهرة تهدف إلى حماية الملكية الفكرية للحرف التراثية ودعم الاقتصاد المنزلي.',
    date: '2026-09-29T08:00:00Z',
    originalUrl: 'https://aps.dz/artisan-expo-algiers',
    status: 'pending'
  },
  {
    id: 'rss-4',
    title: 'تأهيل مطار بنينا الدولي في بنغازي ومطار معيتيقة بطرابلس بأحدث أجهزة الملاحة',
    source: 'وكالة الأنباء الليبية (وال)',
    sourceAgency: 'LANA',
    country: 'libya',
    category: 'libya',
    originalSummary: 'أعلنت مصلحة الطيران المدني الليبية اكتمال تركيب منظومات الرادار وأجهزة الهبوط الآلي في مطاري بنينا ومعيتيقة، مما يمهد لعودة الرحلات المباشرة مع عواصم أوروبية وإفريقية.',
    editorialSummary: 'خطوة نوعية تعيد ربط الأجواء الليبية بالعالم، مع اكتمال تحديث البنية التحتية الملاحية في مطاري بنغازي وطرابلس وفق أعلى معايير منظمة الطيران المدني الدولي (إيكاو).',
    date: '2026-09-29T07:20:00Z',
    originalUrl: 'https://lana.gov.ly/aviation-modernization',
    status: 'pending'
  },
  {
    id: 'rss-5',
    title: 'المغرب يطلق القمر الاصطناعي البيئي لرصد الموارد المائية والتصحر في حوض المتوسط',
    source: 'وكالة المغرب العربي للأنباء (ومع)',
    sourceAgency: 'MAP',
    country: 'morocco',
    category: 'tech',
    originalSummary: 'أعلن المركز الملكي للاستشعار البعدي الفضائي نجاح إطلاق القمر الاصطناعي البيئي المخصص لمراقبة رطوبة التربة والغابات وحركة السحب والأمطار على مدار الساعة.',
    editorialSummary: 'في إنجاز علمي عربي وإفريقي، يضع المغرب بيانات فضائية دقيقة رهن إشارة مراكز الرصد والبحث العلمي المغاربية لمتابعة تداعيات الجفاف وتدبير الموارد المائية بكفاءة عالية.',
    date: '2026-09-29T06:50:00Z',
    originalUrl: 'https://mapnews.ma/space-environmental-satellite',
    status: 'pending'
  }
];

export const CATEGORIES_CONFIG = [
  { id: 'all', label: 'الرئيسية', icon: 'Home' },
  { id: 'morocco', label: 'أخبار المغرب', flag: '🇲🇦', icon: 'Globe' },
  { id: 'gulf', label: 'دول الخليج العربي', flag: '🌴', icon: 'Globe' },
  { id: 'world', label: 'أخبار العالم', icon: 'Compass' },
  { id: 'economy', label: 'اقتصاد وأعمال', icon: 'TrendingUp' },
  { id: 'agency', label: 'كيف أنشئ وكالة', flag: '💼', icon: 'Briefcase' },
  { id: 'cooking', label: 'طبخ ووصفات', icon: 'UtensilsCrossed' },
  { id: 'ai', label: 'الذكاء الاصطناعي', icon: 'Bot' },
  { id: 'tech', label: 'تكنولوجيا', icon: 'Cpu' },
  { id: 'sports', label: 'رياضة', icon: 'Trophy' },
  { id: 'society', label: 'مجتمع', icon: 'Users' },
  { id: 'culture', label: 'ثقافة', icon: 'BookOpen' },
  { id: 'video', label: 'فيديو', icon: 'PlayCircle' },
  { id: 'variety', label: 'منوعات', icon: 'Sparkles' }
];

export const MAGHREB_COUNTRIES = [
  { id: 'morocco', name: 'المغرب', shortName: 'المغرب', flag: '🇲🇦', capital: 'الرباط', currency: 'درهم مغربي (MAD)' },
  { id: 'algeria', name: 'الجزائر', shortName: 'الجزائر', flag: '🇩🇿', capital: 'الجزائر', currency: 'دينار جزائري (DZD)' },
  { id: 'tunisia', name: 'تونس', shortName: 'تونس', flag: '🇹🇳', capital: 'تونس', currency: 'دينار تونسي (TND)' },
  { id: 'libya', name: 'ليبيا', shortName: 'ليبيا', flag: '🇱🇾', capital: 'طرابلس', currency: 'دينار ليبي (LYD)' },
  { id: 'mauritania', name: 'موريتانيا', shortName: 'موريتانيا', flag: '🇲🇷', capital: 'نواكشوط', currency: 'أوقية موريتانية (MRU)' }
];

export const GULF_COUNTRIES = [
  { id: 'saudi', name: 'المملكة العربية السعودية', shortName: 'السعودية', flag: '🇸🇦', capital: 'الرياض', currency: 'ريال سعودي (SAR)' },
  { id: 'uae', name: 'الإمارات العربية المتحدة', shortName: 'الإمارات', flag: '🇦🇪', capital: 'أبوظبي', currency: 'درهم إماراتي (AED)' },
  { id: 'qatar', name: 'دولة قطر', shortName: 'قطر', flag: '🇶🇦', capital: 'الدوحة', currency: 'ريال قطري (QAR)' },
  { id: 'kuwait', name: 'دولة الكويت', shortName: 'الكويت', flag: '🇰🇼', capital: 'مدينة الكويت', currency: 'دينار كويتي (KWD)' },
  { id: 'oman', name: 'سلطنة عمان', shortName: 'عمان', flag: '🇴🇲', capital: 'مسقط', currency: 'ريال عماني (OMR)' },
  { id: 'bahrain', name: 'مملكة البحرين', shortName: 'البحرين', flag: '🇧🇭', capital: 'المنامة', currency: 'دينار بحريني (BHD)' }
];

export const ARAB_COUNTRIES = [
  ...MAGHREB_COUNTRIES,
  ...GULF_COUNTRIES,
  { id: 'arab', name: 'جمهورية مصر العربية', shortName: 'مصر', flag: '🇪🇬', capital: 'القاهرة', currency: 'جنيه مصري (EGP)' }
];


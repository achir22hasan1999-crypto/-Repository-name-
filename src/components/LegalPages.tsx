import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  FileText, 
  Lock, 
  Cookie, 
  Scale, 
  AlertTriangle,
  CheckCircle2,
  Building,
  RefreshCw,
  FileCheck,
  AlertCircle,
  Users,
  Award,
  BookOpen
} from 'lucide-react';
import { ViewMode } from '../types';

interface LegalPagesProps {
  page: 'about' | 'contact' | 'privacy' | 'cookies' | 'terms' | 'disclaimer' | 'corrections' | 'copyright' | 'author';
  onNavigate: (view: ViewMode) => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({ page, onNavigate }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    department: 'تحرير الأخبار',
    message: '',
  });
  const [sentSuccess, setSentSuccess] = useState(false);

  // Correction form state
  const [correctionForm, setCorrectionForm] = useState({
    name: '',
    email: '',
    articleUrl: '',
    errorType: 'بيانات أو أرقام غير دقيقة',
    details: '',
    sourceProof: ''
  });
  const [correctionSuccess, setCorrectionSuccess] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        department: 'تحرير الأخبار',
        message: '',
      });
    }, 4000);
  };

  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    setCorrectionSuccess(true);
    setTimeout(() => {
      setCorrectionSuccess(false);
      setCorrectionForm({
        name: '',
        email: '',
        articleUrl: '',
        errorType: 'بيانات أو أرقام غير دقيقة',
        details: '',
        sourceProof: ''
      });
    }, 4000);
  };

  const authorsList = [
    {
      name: 'طارق الهاشمي',
      role: 'كبير محرري الشؤون الاقتصادية والتنموية',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'صحفي متخصص في السياسات الطاقية، أسواق المال والمشاريع الكبرى في المغرب وشمال إفريقيا منذ أكثر من 12 عاماً. حاصل على ماجستير في الإعلام الاقتصادي.',
      specialties: ['الاقتصاد المغربي', 'الطاقة المتجددة', 'البنية التحتية', 'التمويل الإقليمي']
    },
    {
      name: 'هشام العلوي',
      role: 'محرر التكنولوجيا والذكاء الاصطناعي والعلوم',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      bio: 'باحث وصحفي تقني يتابع أحدث ابتكارات الذكاء الاصطناعي التوليدي، أشباه الموصلات، والحوسبة الكمومية. حاصل على شهادة في هندسة النظم الرقمية.',
      specialties: ['الذكاء الاصطناعي', 'الأمن السيبراني', 'علوم الفضاء', 'العتاد والرقائق']
    },
    {
      name: 'أمينة التازي',
      role: 'محررة الشؤون الحضرية والتنمية الاجتماعية',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      bio: 'صحفية استقصائية تغطي قضايا المجتمع، الصحة والتعليم، الحماية الاجتماعية والمدن الذكية بالمغرب. ناشطة في توثيق التنمية المجالية.',
      specialties: ['الحماية الاجتماعية', 'التعليم والصحة', 'المدن المستدامة', 'المرأة والتنمية']
    },
    {
      name: 'ياسين بنجلون',
      role: 'محلل الملاحة والتجارة الدولية',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'خبير في اللوجستيات والموانئ وسلاسل التوريد عبر البحر الأبيض المتوسط. شغل سابقاً منصب مستشار في التجارة الخارجية وإدارة الموانئ.',
      specialties: ['الموانئ واللوجستيك', 'صناعة السيارات', 'التجارة الدولية', 'الملاحة البحرية']
    },
    {
      name: 'الشيف فاطمة الزهراء',
      role: 'خبيرة فنون الطهي والتراث المغربي والعربي',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      bio: 'باحثة في تاريخ المائدة المغربية والمتوسطية، ومقدمة برامج طهي تلفزيونية، ومؤلفة كتب توثيق الوصفات التراثية والصحية بالقياسات الدقيقة.',
      specialties: ['المطبخ المغربي الفاسي', 'المخبوزات والحلويات', 'المقبلات المتوسطية', 'الأكل الصحي']
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-['Tajawal']">
      {/* 1. Page: من نحن (About Us) */}
      {page === 'about' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">من نحن</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1">
              المغرب العربي اليوم · رسالتنا ورؤيتنا التحريرية
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 leading-relaxed space-y-4 text-base">
            <p className="text-lg font-medium leading-loose text-stone-900 dark:text-stone-100 border-r-4 border-red-700 pr-4">
              <strong>"المغرب العربي اليوم"</strong> هي منصة إخبارية ومجلة ثقافية إلكترونية مستقلة، متخصصة في تقديم صحافة رصينة، موثقة، ومتعمقة تسلط الضوء على واقع وتطلعات شعوب المغرب العربي (المغرب، الجزائر، تونس، ليبيا، موريتانيا) إلى جانب أهم المستجدات العالمية في الاقتصاد، التكنولوجيا والذكاء الاصطناعي، والعلوم وفنون الطهي والتراث.
            </p>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-['Cairo'] pt-4">
              ثوابتنا وميثاق الشرف التحريري
            </h3>
            <ul className="list-disc list-inside space-y-2 pr-2">
              <li><strong>التحقق الصارم من المصادر:</strong> لا ننشر أي خبر أو إحصائية أو تصريح دون الاستناد إلى مصادر رسمية معلنة أو وكالات أنباء موثوقة ومحاضر معتمدة.</li>
              <li><strong>الاستقلالية والموضوعية:</strong> صحيفتنا لا تتبع لأي حزب سياسي أو تيار أيديولوجي؛ غايتنا إعلام القارئ بالوقائع المجردة والتحليلات المتزنة.</li>
              <li><strong>المحتوى الأصلي الخالي من النسخ:</strong> نكتب جميع تقاريرنا ومقالاتنا ووصفاتنا بصياغة عربية أصلية تلتزم بأرقى معايير الكتابة واللغة العربية السليمة.</li>
              <li><strong>الشفافية وسرعة التصحيح:</strong> في حال ورود أي خطأ غير مقصود، نبادر فوراً إلى تصحيحه بوضوح وإشعار القراء بذلك.</li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <ShieldCheck className="w-6 h-6 text-red-700 mb-2" />
                <h4 className="font-bold text-stone-900 dark:text-white text-sm">صحافة موثقة</h4>
                <p className="text-xs text-stone-500 mt-1">فريق تحريري يتحقق من كل رقم ومصدر لضمان الثقة المطلقة.</p>
              </div>
              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <Building className="w-6 h-6 text-red-700 mb-2" />
                <h4 className="font-bold text-stone-900 dark:text-white text-sm">حضور مغاربي شامل</h4>
                <p className="text-xs text-stone-500 mt-1">تغطية لكافة جهات وأقاليم المغرب والبلدان المغاربية والعالم.</p>
              </div>
              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <BookOpen className="w-6 h-6 text-red-700 mb-2" />
                <h4 className="font-bold text-stone-900 dark:text-white text-sm">تنوع ثري ومفيد</h4>
                <p className="text-xs text-stone-500 mt-1">من الأخبار الاقتصادية والسياسية إلى التكنولوجيا والطبخ الصحي الأصيل.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Page: هيئة التحرير والمؤلفون (Authors) */}
      {page === 'author' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">فريق العمل</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1">
              هيئة التحرير والمحررون المعتمدون
            </h1>
          </div>

          <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            يضم فريق "المغرب العربي اليوم" نخبة من الصحفيين، والباحثين المتخصصين، وكتاب الرأي وفناني الطهي، الذين يلتزمون بأعلى معايير الدقة الصحفية والنزاهة المهنية في كل مادة يتم إعدادها ونشرها.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {authorsList.map((author, idx) => (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-red-700 shadow-xs shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-stone-900 dark:text-white">
                        {author.name}
                      </h3>
                      <p className="text-xs text-red-700 dark:text-red-400 font-semibold">
                        {author.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                    {author.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[11px] font-bold text-stone-400 block mb-1.5">مجالات التغطية:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {author.specialties.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Page: سياسة تصحيح وتحديث الأخبار (Corrections & Updates Policy) */}
      {page === 'corrections' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">الشفافية التحريرية</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1 flex items-center gap-2">
              <RefreshCw className="w-8 h-8 text-red-700" />
              <span>سياسة تصحيح وتحديث الأخبار</span>
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 leading-relaxed space-y-4 text-base">
            <p className="text-lg font-medium leading-loose text-stone-900 dark:text-stone-100 border-r-4 border-red-700 pr-4">
              تلتزم جريدة <strong>"المغرب العربي اليوم"</strong> بأعلى درجات الدقة والنزاهة والموضوعية في كل ما تنشره. وعندما يحدث خطأ في الوقائع أو الأرقام أو الأسماء أو التواريخ، فإننا نعتبر الاعتراف به وتصحيحه فوراً وبشكل علني التزاماً أخلاقياً وواجباً مهنياً لا تهاون فيه.
            </p>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-['Cairo'] pt-2">
              1. معايير وإجراءات التصحيح
            </h3>
            <ul className="list-disc list-inside space-y-2 pr-2">
              <li><strong>التصحيحات الجوهرية:</strong> إذا تضمن المقال خطأً في واقعة أساسية أو رقم مضلل أو معلومة غير صحيحة، يُعدل النص فوراً، ويُضاف تنبيه واضح في نهاية المقال يحمل وسم <em>"تنويه وتصحيح"</em> مع تحديد المعلومة المصححة وتاريخ وساعة التعديل.</li>
              <li><strong>التحديثات المستمرة (Updates):</strong> بالنسبة للأخبار العاجلة أو الأحداث المتطورة، نضيف المعلومات الجديدة بوضوح مع وضع وسم <em>"تحديث"</em> وتاريخ الساعة، دون مسح السياق التاريخي للمقال.</li>
              <li><strong>تصحيح الأخطاء اللغوية والإملائية:</strong> يتم إصلاح الأخطاء المطبعية الطفيفة فور اكتشافها دون الحاجة لإشعار تصحيح رسمي، ما لم يغير الخطأ المعنى الجوهري للخبر.</li>
            </ul>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-['Cairo'] pt-2">
              2. التزامنا بالتحقيق السريع خلال 24 ساعة
            </h3>
            <p>
              يراجع فريق التدقيق والتحرير كل بلاغ يرد من القراء أو الجهات المعنية في موعد أقصاه 24 ساعة من استلامه. وإذا ثبت وقوع الخطأ، يتم التصحيح وتحديث بيانات المقال والمصادر فوراً.
            </p>

            {/* Error Reporting Form */}
            <div className="mt-8 p-6 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white font-['Cairo'] mb-2 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span>استمارة الإبلاغ عن خطأ صحفي أو طلب تصحيح</span>
              </h3>
              <p className="text-xs text-stone-500 mb-6">
                هل لاحظت خطأ في أحد مقالاتنا أو ترغب في تزويدنا بمعلومة موثقة جديدة؟ يرجى ملء النموذج أدناه:
              </p>

              {correctionSuccess && (
                <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>شكراً لحرصك على الدقة والمصداقية! تم استلام بلاغك وسيقوم قسم التحرير بمراجعته والتحقق منه فوراً.</span>
                </div>
              )}

              <form onSubmit={handleSubmitCorrection} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      اسمك الكامل *
                    </label>
                    <input
                      type="text"
                      required
                      value={correctionForm.name}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, name: e.target.value })}
                      placeholder="محمد العلمي"
                      className="w-full text-xs p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      البريد الإلكتروني للتواصل *
                    </label>
                    <input
                      type="email"
                      required
                      value={correctionForm.email}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, email: e.target.value })}
                      placeholder="yourname@example.com"
                      className="w-full text-xs p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      رابط أو عنوان المقال المعني *
                    </label>
                    <input
                      type="text"
                      required
                      value={correctionForm.articleUrl}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, articleUrl: e.target.value })}
                      placeholder="رابط المقال أو عنوانه الرئيسي"
                      className="w-full text-xs p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      طبيعة الخطأ المراد تصحيحه
                    </label>
                    <select
                      value={correctionForm.errorType}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, errorType: e.target.value })}
                      className="w-full text-xs p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="بيانات أو أرقام غير دقيقة">بيانات أو أرقام أو إحصاءات غير دقيقة</option>
                      <option value="خطأ في اسم شخص أو مسؤول أو مؤسسة">خطأ في اسم شخص أو مسؤول أو مؤسسة</option>
                      <option value="تاريخ أو مكان غير صحيح">تاريخ أو مكان أو حدث غير صحيح</option>
                      <option value="رابط أو مصدر غير صحيح">رابط مصدر غير دقيق أو غير متاح</option>
                      <option value="خطأ في المقادير أو الوصفة">خطأ في مقادير أو خطوات وصفة طهي</option>
                      <option value="أخرى">أخرى (يرجى التوضيح)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    توضيح الخطأ والتصحيح المقترح بالتفصيل *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={correctionForm.details}
                    onChange={(e) => setCorrectionForm({ ...correctionForm, details: e.target.value })}
                    placeholder="يرجى ذكر الفقرة التي تحتوي على الخطأ والتصحيح الدقيق مع ذكر الدليل أو المصدر المعتمد إن توفر..."
                    className="w-full text-xs p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-6 py-3 rounded-lg transition flex items-center gap-2 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال طلب التصحيح لهيئة التحرير</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* 4. Page: سياسة حقوق النشر والملكية الفكرية (Copyright Policy) */}
      {page === 'copyright' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">الملكية الفكرية</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1 flex items-center gap-2">
              <Scale className="w-8 h-8 text-red-700" />
              <span>سياسة حقوق النشر والملكية الفكرية</span>
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 leading-relaxed space-y-4 text-base">
            <p className="text-lg font-medium leading-loose text-stone-900 dark:text-stone-100 border-r-4 border-red-700 pr-4">
              جميع المقالات الصحفية، والتحقيقات، والتقارير، والمواد البصرية، ووصفات الطهي المنشورة على موقع <strong>"المغرب العربي اليوم" (almaghreb-alyoum.com)</strong> محمية بموجب القوانين الوطنية المغربية والاتفاقيات الدولية للملكية الفكرية وحقوق المؤلف والحقوق المجاورة.
            </p>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-['Cairo'] pt-2">
              1. قواعد الاقتباس وإعادة النشر (الاستخدام العادل)
            </h3>
            <ul className="list-disc list-inside space-y-2 pr-2">
              <li><strong>الاقتباس المشروع:</strong> يُسمح للمواقع والمنصات الإخبارية باقتباس فقرات قصيرة لا تتجاوز 25% من النص الأصلي، بشرط وضع إحالة واضحة ورابط إلكتروني مباشر ونشط (Dofollow Hyperlink) يؤدي إلى المقال الأصلي على موقعنا.</li>
              <li><strong>حظر النسخ الكامل الآلي:</strong> يُحظر تماماً النقل أو النسخ الكامل للمقالات أو التقارير أو استخدام أدوات السحب الآلي للبيانات (Web Scraping / RSS Scraping) دون موافقة خطية مسبقة من إدارة التحرير.</li>
              <li><strong>الصور والمواد البصرية:</strong> الصور المستخدمة إما ملتقطة لصالح الموقع، أو مرخصة رسمياً من وكالات معتمدة، أو مأخوذة من مصادر مفتوحة بموجب رخص المشاع الإبداعي مع عزو أصحابها؛ ولا يجوز إعادة استخدامها تجارياً دون ترخيص.</li>
            </ul>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-['Cairo'] pt-2">
              2. التبليغ عن انتهاك حقوق الملكية (إشعار DMCA)
            </h3>
            <p>
              إذا كنت تعتقد بحسن نية أن أي محتوى منشور على موقعنا يمس بحقوق الملكية الفكرية العائدة لك أو لمؤسستك، يرجى مراسلتنا فوراً عبر البريد الإلكتروني المخصص: 
              <span className="font-bold text-red-700 dark:text-red-400 mr-1">copyright@almaghreb-alyoum.com</span> وسيقوم مستشارنا القانوني بالتحقق واتخاذ الإجراء اللازم فوراً.
            </p>
          </div>
        </section>
      )}

      {/* 5. Page: سياسة الخصوصية (Privacy Policy) */}
      {page === 'privacy' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">الشفافية والأمان</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1">
              سياسة الخصوصية وحماية البيانات الشخصية
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 leading-relaxed space-y-4 text-base">
            <p className="text-lg font-medium leading-loose text-stone-900 dark:text-stone-100 border-r-4 border-red-700 pr-4">
              نحن في <strong>"المغرب العربي اليوم"</strong> نولي سرية وخصوصية بيانات زوارنا وقرائنا أهمية قصوى. تهدف هذه الوثيقة إلى بيان طبيعة البيانات التي نجمعها، وكيفية استخدامها، والضمانات التي نتخذها لحمايتها بما يتوافق مع القانون المغربي رقم 09-08 واللائحة العامة لحماية البيانات (GDPR).
            </p>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-['Cairo'] pt-2">
              1. البيانات التي قد نجمعها
            </h3>
            <ul className="list-disc list-inside space-y-2 pr-2">
              <li><strong>بيانات التعليقات والمراسلات:</strong> عندما يشارك الزائر في التعليقات أو يرسل استفساراً، نقوم بجمع الاسم والبريد الإلكتروني ومحتوى التعليق بغرض النشر والتحقق التحريري.</li>
              <li><strong>بيانات التصفح التقنية:</strong> يتم تسجيل معلومات فنية عامة كعنوان بروتوكول الإنترنت (IP)، ونوع المتصفح، والصفحات الأكثر زيارة عبر خدمات التحليل لتحسين جودة التصفح وسرعة الموقع.</li>
            </ul>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-['Cairo'] pt-2">
              2. الإعلانات وملفات تعريف الارتباط لشركة Google
            </h3>
            <p>
              يستخدم موقعنا خدمات إعلانية تقدمها شركة Google (مثل Google AdSense). تستخدم Google ملفات تعريف ارتباط (مثل ملف تعريف الارتباط DoubleClick DART) لعرض إعلانات للمستخدمين استناداً إلى زياراتهم لموقعنا ومواقع أخرى على الإنترنت.
            </p>
            <p>
              يمكن للمستخدمين إلغاء استخدام ملف تعريف الارتباط DART لتقديم الإعلانات القائمة على الاهتمامات عبر زيارة:
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-red-700 hover:underline mr-1 font-bold">
                سياسة الخصوصية الخاصة بإعلانات Google وشبكة المحتوى
              </a>.
            </p>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-['Cairo'] pt-2">
              3. عدم مشاركة البيانات مع جهات تجارية ثالثة
            </h3>
            <p>
              نؤكد بشكل قاطع أننا لا نبيع، ولا نؤجر، ولا نتاجر بأي بيانات شخصية لقرائنا إلى أي جهات تسويقية خارجية.
            </p>
          </div>
        </section>
      )}

      {/* 6. Page: ملفات تعريف الارتباط (Cookie Policy) */}
      {page === 'cookies' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">ملفات الارتباط</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1">
              سياسة ملفات تعريف الارتباط (Cookies Policy)
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 leading-relaxed space-y-4 text-base">
            <p className="text-lg font-medium leading-loose text-stone-900 dark:text-stone-100 border-r-4 border-red-700 pr-4">
              ملفات تعريف الارتباط هي ملفات نصية صغيرة تُخزن على جهازك عند زيارة الموقع لتذكر تفضيلاتك وتوفير تجربة قراءة سريعة ومخصصة.
            </p>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-['Cairo'] pt-2">
              أنواع ملفات تعريف الارتباط المستخدمة
            </h3>
            <ul className="list-disc list-inside space-y-2 pr-2">
              <li><strong>ملفات أساسية:</strong> ضرورية لتشغيل الموقع وحفظ تفضيلات الوضع الليلي وتكبير الخط أثناء القراءة.</li>
              <li><strong>ملفات الأداء والتحليلات:</strong> لقياس أعداد القراء والمقالات الأكثر شعبية وتطوير المحتوى.</li>
              <li><strong>ملفات الإعلانات التخصيصية:</strong> تستخدمها Google AdSense لعرض إعلانات ملائمة لاهتمامات الزائر دون التعرف على هويته الشخصية.</li>
            </ul>

            <p className="pt-2">
              يمكنك في أي وقت تعطيل أو حذف ملفات تعريف الارتباط من خلال إعدادات متصفحك، مع العلم أن ذلك قد يؤثر على تذكر تفضيلاتك كحجم الخط أو الوضع الليلي.
            </p>
          </div>
        </section>
      )}

      {/* 7. Page: شروط الاستخدام (Terms of Use) */}
      {page === 'terms' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">الشروط والأحكام</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1">
              شروط الاستخدام وأخلاقيات التعليق
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 leading-relaxed space-y-4 text-base">
            <p className="text-lg font-medium leading-loose text-stone-900 dark:text-stone-100 border-r-4 border-red-700 pr-4">
              باستخدامك لموقع <strong>"المغرب العربي اليوم"</strong>، فإنك توافق على الالتزام بشروط الاستخدام المعمول بها وأخلاقيات الحوار البناء.
            </p>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-['Cairo'] pt-2">
              ضوابط التعليقات والمشاركات التفاعلية
            </h3>
            <p>
              نرحب بآراء وتفاعلات جميع القراء باختلاف وجهات نظرهم، مع الالتزام التام بالقواعد التالية:
            </p>
            <ul className="list-disc list-inside space-y-2 pr-2">
              <li>حظر خطاب الكراهية، أو التمييز على أساس العرق، الدين، الجنس أو الانتماء الجغرافي.</li>
              <li>الابتعاد التام عن السب والقذف أو التشهير بالأشخاص والمؤسسات.</li>
              <li>منع نشر الروابط الإعلانية الترويجية المضللة أو البريد المزعج (Spam).</li>
              <li>يحق لإدارة الموقع حجب أو حذف أي تعليق يخالف هذه المعايير دون إشعار مسبق.</li>
            </ul>
          </div>
        </section>
      )}

      {/* 8. Page: إخلاء المسؤولية (Disclaimer) */}
      {page === 'disclaimer' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">تنويه قانوني</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1">
              إخلاء المسؤولية العامة والطبية والمالية
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 leading-relaxed space-y-4 text-base">
            <p className="text-lg font-medium leading-loose text-stone-900 dark:text-stone-100 border-r-4 border-red-700 pr-4">
              المعلومات والتقارير المنشورة على "المغرب العربي اليوم" مقدمة لأغراض إخبارية، تثقيفية وعامة فقط.
            </p>
            <ul className="list-disc list-inside space-y-3 pr-2">
              <li><strong>المعلومات المالية والاقتصادية:</strong> التحليلات وأسعار السلع والأسواق لا تعد نصائح استثمارية أو دعوة للشراء أو البيع، ويتحمل المستثمر مسؤوليته الكاملة عن قراراته المالية.</li>
              <li><strong>المعلومات الصحية والغذائية:</strong> المعلومات الواردة في مقالات التغذية والوصفات لا تغني عن استشارة الطبيب المختص أو أخصائي التغذية المعتمد، ولا سيما للمصابين بحساسية معينة أو أمراض مزمنة.</li>
              <li><strong>الروابط الخارجية:</strong> موقعنا قد يتضمن روابط لمصادر خارجية، ونحن غير مسؤولين عن محتوى أو سياسات خصوصية المواقع الأخرى.</li>
            </ul>
          </div>
        </section>
      )}

      {/* 9. Page: اتصل بنا (Contact Us) */}
      {page === 'contact' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">تواصل معنا</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1">
              اتصل بهيئة التحرير وإدارة الموقع
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-6">
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
                يسعدنا دائماً تلقي اقتراحاتكم، مساهماتكم الصحفية، واستفساراتكم حول التغطيات الإخبارية والشراكات الإعلامية.
              </p>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <Mail className="w-5 h-5 text-red-700 shrink-0" />
                  <div>
                    <strong className="block text-stone-900 dark:text-white">البريد الإلكتروني للتحرير:</strong>
                    <span>contact@almaghreb-alyoum.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <MapPin className="w-5 h-5 text-red-700 shrink-0" />
                  <div>
                    <strong className="block text-stone-900 dark:text-white">المقر الرئيسي للتحرير:</strong>
                    <span>شارع محمد الخامس، أكدال، الرباط - المملكة المغربية</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <RefreshCw className="w-5 h-5 text-red-700 shrink-0" />
                  <div>
                    <strong className="block text-stone-900 dark:text-white">الإبلاغ عن أخطاء الأخبار:</strong>
                    <button onClick={() => onNavigate('corrections')} className="text-red-700 dark:text-red-400 font-bold hover:underline">
                      زيارة صفحة سياسة تصحيح الأخبار
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Submission Form */}
            <form onSubmit={handleSubmitContact} className="p-6 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
              <h3 className="font-bold text-base text-stone-900 dark:text-white font-['Cairo'] mb-2">
                أرسل رسالة مباشرة
              </h3>

              {sentSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 rounded-lg text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم استلام رسالتك بنجاح! سنرد عليك في أقرب وقت.</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="محمد المغربي"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  القسم المعني
                </label>
                <select
                  value={contactForm.department}
                  onChange={(e) => setContactForm({ ...contactForm, department: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="تحرير الأخبار">تحرير الأخبار والمقالات</option>
                  <option value="القسم الاقتصادي">القسم الاقتصادي والاستثمار</option>
                  <option value="القسم التقني والذكاء الاصطناعي">القسم التقني والذكاء الاصطناعي</option>
                  <option value="قسم الطبخ والوصفات">قسم الطبخ والوصفات الصحية</option>
                  <option value="الإعلانات والشراكات">الإعلانات والشراكات التجارية</option>
                  <option value="الإدارة القانونية">الإدارة القانونية وحقوق النشر</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  نص الرسالة *
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="اكتب رسالتك أو اقتراحك هنا..."
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال الرسالة</span>
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
};

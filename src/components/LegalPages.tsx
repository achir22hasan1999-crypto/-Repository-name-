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
  Building
} from 'lucide-react';
import { ViewMode } from '../types';

interface LegalPagesProps {
  page: 'about' | 'contact' | 'privacy' | 'cookies' | 'terms' | 'disclaimer';
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
              <strong>"المغرب العربي اليوم"</strong> هي مؤسسة إعلامية رقمية مستقلة وشاملة، انطلقت بهدف تقديم تغطية إخبارية مهنية، عميقة وموضوعية تواكب أحداث وتطلعات شعوب المغرب العربي (المغرب، الجزائر، تونس، ليبيا، موريتانيا) والعالم لحظة بلحظة.
            </p>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-['Cairo'] pt-4">
              ثوابتنا وميثاق الشرف المهني
            </h3>
            <ul className="list-disc list-inside space-y-2 pr-2">
              <li><strong>الاستقلالية والمصداقية:</strong> نلتزم بأعلى معايير النزاهة الصحفية والتحري الدقيق للمعلومات قبل نشرها، بعيداً عن الإثارة والتضليل.</li>
              <li><strong>البعد المغاربي الموحد:</strong> إبراز المشترك الثقافي والفرص الاقتصادية والتنموية المشتركة بين دول المنطقة الخمس.</li>
              <li><strong>الاحترام والشمولية:</strong> تغطية متوازنة تعكس تنوع المجتمع المغاربي وتمنح صوتاً لكافة الفئات والمناطق من المدن الكبرى إلى الواحات والقرى.</li>
              <li><strong>مكافحة الأخبار الزائفة:</strong> وحدة تدقيق مخصصة للتحقق من الصور والفيديوهات والبيانات الرقمية المتداولة.</li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-lg text-center">
                <span className="text-2xl font-bold font-mono text-red-700 block">5 دول</span>
                <span className="text-xs text-stone-500">تغطية ميدانية مركزة</span>
              </div>
              <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-lg text-center">
                <span className="text-2xl font-bold font-mono text-stone-900 dark:text-white block">24/7</span>
                <span className="text-xs text-stone-500">تحديثات إخبارية متواصلة</span>
              </div>
              <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-lg text-center">
                <span className="text-2xl font-bold font-mono text-emerald-600 block">100%</span>
                <span className="text-xs text-stone-500">التزام بالميثاق الصحفي الأخلاقي</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Page: اتصل بنا (Contact Us) */}
      {page === 'contact' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">تواصل معنا</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1">
              اتصل بهيئة التحرير والمكاتب الإقليمية
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7 bg-white dark:bg-stone-900 p-6 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
              <h3 className="text-base font-bold text-stone-900 dark:text-white mb-4">
                أرسل رسالة أو مقترح أو تصحيح خبر
              </h3>

              {sentSuccess && (
                <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-emerald-800 dark:text-emerald-200 rounded-md text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>تم استلام رسالتك بنجاح! سيتواصل معك أحد أعضاء هيئة التحرير في أقرب وقت.</span>
                </div>
              )}

              <form onSubmit={handleSubmitContact} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="الاسم الثلاثي أو المؤسسة"
                    className="w-full p-2.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="example@domain.com"
                    className="w-full p-2.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">القسم المعني</label>
                  <select
                    value={contactForm.department}
                    onChange={(e) => setContactForm({ ...contactForm, department: e.target.value })}
                    className="w-full p-2.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    <option value="تحرير الأخبار">رئاسة التحرير والأخبار</option>
                    <option value="تدقيق المعلومات">وحدة تدقيق المعلومات والتصحيحات</option>
                    <option value="الإعلانات والشراكات">قسم الإعلانات والشراكات (Google AdSense)</option>
                    <option value="الدعم التقني">الإدارة التقنية والموقع</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">نص الرسالة *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="اكتب تفاصيل رسالتك أو استفسارك هنا..."
                    className="w-full p-2.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 px-6 rounded transition flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال الرسالة</span>
                </button>
              </form>
            </div>

            <div className="md:col-span-5 space-y-4 text-xs">
              <div className="bg-stone-100 dark:bg-stone-800/80 p-5 rounded-lg border border-stone-200 dark:border-stone-700 space-y-3">
                <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5 text-sm">
                  <Building className="w-4 h-4 text-red-700" />
                  <span>مكاتب التحرير المركزية</span>
                </h4>
                <div className="space-y-2 text-stone-600 dark:text-stone-300">
                  <p>🇲🇦 <strong>الرباط:</strong> شارع محمد الخامس، قطب الإعلام والنشر.</p>
                  <p>🇩🇿 <strong>الجزائر:</strong> ساحة أول ماي، المجمع الصحفي.</p>
                  <p>🇹🇳 <strong>تونس:</strong> شارع الحبيب بورقيبة، المركز الإعلامي.</p>
                  <p>🇱🇾 <strong>طرابلس:</strong> طريق الشط، برج طرابلس التجاري.</p>
                  <p>🇲🇷 <strong>نواكشوط:</strong> شارع المختار ولد داداه، تفرغ زينة.</p>
                </div>
              </div>

              <div className="bg-stone-100 dark:bg-stone-800/80 p-5 rounded-lg border border-stone-200 dark:border-stone-700 space-y-2 text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-stone-500" />
                  <span>contact@almaghreb-alyoum.news</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-stone-500" />
                  <span className="font-mono dir-ltr">+212 537 00 00 00</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Page: سياسة الخصوصية (Privacy Policy) */}
      {page === 'privacy' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">الخصوصية والأمان</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1">
              سياسة الخصوصية وحماية البيانات
            </h1>
            <p className="text-xs text-stone-400 mt-1">آخر تحديث: سبتمبر 2026 · متوافقة مع لوائح GDPR و Google AdSense</p>
          </div>

          <div className="text-stone-700 dark:text-stone-300 space-y-4 text-sm leading-relaxed">
            <p>
              نحن في موقع <strong>"المغرب العربي اليوم"</strong> نولي خصوصية زوارنا أهمية قصوى. توضح هذه الوثيقة أنواع المعلومات الشخصية التي نقوم بجمعها وكيفية استخدامها وحمايتها عند تصفحكم للموقع.
            </p>

            <h3 className="text-base font-bold text-stone-900 dark:text-white font-['Cairo']">
              1. جمع المعلومات
            </h3>
            <p>
              لا نلزم القراء بالتسجيل لقراءة الأخبار. نقوم بجمع معلومات غير شخصية تلقائياً مثل عنوان بروتوكول الإنترنت (IP)، نوع المتصفح، نظام التشغيل، والصفحات التي تمت زيارتها لتحسين أداء وتجربة الموقع وسرعة تحميله.
            </p>

            <h3 className="text-base font-bold text-stone-900 dark:text-white font-['Cairo']">
              2. إعلانات Google AdSense وشركاء الإعلانات
            </h3>
            <p>
              يستخدم الموقع خدمات Google AdSense لعرض الإعلانات. قد تستخدم شركة Google وشركاؤها ملفات تعريف الارتباط (مثل ملف DART) لتقديم إعلانات موجهة للمستخدمين بناءً على زيارتهم لهذا الموقع أو مواقع أخرى على الإنترنت. يمكن للزوار إلغاء الاشتراك في استخدام ملف تعريف الارتباط DART بزيارة سياسة خصوصية شبكة الإعلانات والمحتوى الخاصة بشركة Google.
            </p>

            <h3 className="text-base font-bold text-stone-900 dark:text-white font-['Cairo']">
              3. أمن البيانات وحمايتها
            </h3>
            <p>
              نطبق تدابير تقنية وإدارية متقدمة لتأمين وحماية البيانات ضد الوصول غير المصرح به أو التغيير أو الإفشاء، مع استخدام تشفير HTTPS عبر كافة صفحات الموقع.
            </p>
          </div>
        </section>
      )}

      {/* 4. Page: سياسة ملفات تعريف الارتباط (Cookie Policy) */}
      {page === 'cookies' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">الكوكيز</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1">
              سياسة ملفات تعريف الارتباط (Cookies Policy)
            </h1>
          </div>

          <div className="text-stone-700 dark:text-stone-300 space-y-4 text-sm leading-relaxed">
            <p>
              يستخدم موقع <strong>"المغرب العربي اليوم"</strong> ملفات تعريف الارتباط لضمان حصولك على أفضل تجربة قراءة ولتخصيص المحتوى والإعلانات وتحليل حركة المرور لدينا.
            </p>

            <div className="space-y-3">
              <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-lg">
                <h4 className="font-bold text-stone-900 dark:text-white mb-1">1. ملفات تعريف الارتباط الضرورية</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  تعتبر هذه الملفات أساسية لتمكينك من التنقل في الموقع واستخدام ميزاته، مثل تفضيلات الوضع الليلي وتخزين إعدادات القراءة وحفظ خيارات التعليقات.
                </p>
              </div>

              <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-lg">
                <h4 className="font-bold text-stone-900 dark:text-white mb-1">2. ملفات تعريف الارتباط التحليلية والإحصائية</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  تساعدنا على فهم كيفية تفاعل القراء مع الموقع، مثل عدد قراءات المقالات الأكثر تداولاً وتحديد المقالات الرائجة. يتم جمع هذه البيانات بشكل مجهول الهوية.
                </p>
              </div>

              <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-lg">
                <h4 className="font-bold text-stone-900 dark:text-white mb-1">3. ملفات تعريف الارتباط الإعلانية (Google AdSense)</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  تُستخدم لتقديم إعلانات ذات صلة بالقارئ وتحديد عدد مرات ظهور الإعلان، وقياس كفاءة الحملات الإعلانية دون جمع بيانات تعريف شخصية حساسة.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-500 pt-2">
              يمكنك إدارة تفضيلات ملفات تعريف الارتباط أو تعطيلها في أي وقت من خلال إعدادات متصفحك أو من خلال شريط الخصوصية أسفل الصفحة.
            </p>
          </div>
        </section>
      )}

      {/* 5. Page: شروط الاستخدام (Terms of Use) */}
      {page === 'terms' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">الشروط والأحكام</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1">
              شروط الاستخدام وحقوق الملكية الفكرية
            </h1>
          </div>

          <div className="text-stone-700 dark:text-stone-300 space-y-4 text-sm leading-relaxed">
            <p>
              باستخدامك لموقع <strong>"المغرب العربي اليوم"</strong>، فإنك توافق على الالتزام بشروط الاستخدام الموضحة أدناه:
            </p>

            <h3 className="text-base font-bold text-stone-900 dark:text-white font-['Cairo']">
              1. حقوق الملكية الفكرية والنشر
            </h3>
            <p>
              جميع المواد المنشورة على هذا الموقع، بما في ذلك المقالات، التحليلات، الصور الأصلية، الفيديوهات والشعارات، هي ملك لـ "المغرب العربي اليوم" أو مرخصة له وفق القوانين الدولية لحماية حقوق المؤلف. يُسمح بنقل مقتطفات قصيرة أو مشاركة الروابط بشرط الإشارة الصريحة للمصدر ووضع رابط تشعبي مباشر نحو المقال الأصلي. يُحظر النسخ الكامل الآلي دون إذن مسبق.
            </p>

            <h3 className="text-base font-bold text-stone-900 dark:text-white font-['Cairo']">
              2. قواعد مشاركة القراء والتعليقات
            </h3>
            <p>
              يرحب الموقع بآراء القراء البناءة. تحتفظ إدارة الموقع بالحق في حذف أو حجب أي تعليق يحتوي على: خطاب كراهية، سب أو قذف، تشهير، إعلانات تجارية مضللة (Spam)، أو تحريض على العنف والتمييز.
            </p>
          </div>
        </section>
      )}

      {/* 6. Page: إخلاء المسؤولية (Disclaimer) */}
      {page === 'disclaimer' && (
        <section className="space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-red-700 tracking-wider">إخلاء المسؤولية</span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-['Cairo'] mt-1">
              إخلاء المسؤولية وسياسة التصحيحات التحريرية
            </h1>
          </div>

          <div className="text-stone-700 dark:text-stone-300 space-y-4 text-sm leading-relaxed">
            <p>
              المعلومات المنشورة على موقع <strong>"المغرب العربي اليوم"</strong> هي لأغراض إخبارية وتثقيفية عامة فقط. تبذل هيئة التحرير قصارى جهدها لضمان دقة وصحة الأخبار والبيانات في وقت نشرها.
            </p>

            <h3 className="text-base font-bold text-stone-900 dark:text-white font-['Cairo']">
              1. الآراء والمقالات الموقعة
            </h3>
            <p>
              المقالات المنشورة في زوايا الرأي والتحليلات الموقعة بأسماء كتابها تعبر عن وجهة نظر أصحابها ولا تعكس بالضرورة التوجه الرسمي أو السياسي لموقع "المغرب العربي اليوم".
            </p>

            <h3 className="text-base font-bold text-stone-900 dark:text-white font-['Cairo']">
              2. الروابط الخارجية ومصادر الطرف الثالث
            </h3>
            <p>
              قد يتضمن الموقع روابط لمواقع إلكترونية خارجية أو وكالات أنباء دولية من باب التوثيق والتوسع. لا يتحمل الموقع أي مسؤولية عن محتوى أو سياسات تلك المواقع الخارجية.
            </p>

            <h3 className="text-base font-bold text-stone-900 dark:text-white font-['Cairo']">
              3. سياسة التصحيح الفوري
            </h3>
            <p>
              إذا تبيّن وجود أي خطأ موضوعي أو غير مقصود في أي مادة صحفية، تلتزم هيئة التحرير بتصحيحه فوراً مع وضع إشعار شفاف يوضح طبيعة التصحيح وتاريخه حرصاً على الأمانة الصحفية.
            </p>
          </div>
        </section>
      )}

      {/* Back button */}
      <div className="pt-8 border-t border-stone-200 dark:border-stone-800">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1.5"
        >
          <span>← العودة إلى الصفحة الرئيسية للأخبار</span>
        </button>
      </div>
    </div>
  );
};

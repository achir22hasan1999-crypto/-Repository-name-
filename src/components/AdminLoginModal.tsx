import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound, AlertCircle, X, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Fetch stored password or default
    const storedPassword = localStorage.getItem('maghreb_admin_password') || 'admin2026';

    if (password.trim() === storedPassword) {
      localStorage.setItem('maghreb_admin_auth', 'true');
      setPassword('');
      setError('');
      onSuccess();
    } else {
      setError('كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-['Tajawal']">
      <div 
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-red-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-700/80 flex items-center justify-center shadow-lg border border-red-500/30">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                منطقة محمية خاصة
              </span>
              <h3 className="text-xl font-black font-['Cairo'] text-white mt-1">
                بوابة هيئة التحرير والمشرفين
              </h3>
            </div>
          </div>
          <p className="text-xs text-stone-300 mt-2 leading-relaxed">
            لوحة التحكم ونظام إدارة الأخبار مخصصة حصراً لفريق الإدارة والتحرير. لا تظهر للزوار العاديين لحماية سلامة المحتوى والسياسة التحريرية.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-red-600" />
              <span>رمز المرور الإداري (Admin Passcode)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="أدخل رمز المرور للمتابعة..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800/70 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-stone-900 dark:text-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                title={showPassword ? 'إخفاء' : 'إظهار'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="hover:text-red-600 dark:hover:text-red-400 underline decoration-dotted transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{showHint ? 'إخفاء التلميح' : 'تلميح الرمز الافتراضي'}</span>
            </button>
            <span className="text-[11px] text-stone-400">حماية بتشفير الجلسة</span>
          </div>

          {showHint && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded-xl text-xs leading-relaxed">
              رمز الدخول الافتراضي للمالك هو: <strong className="font-mono bg-white dark:bg-stone-900 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700 text-red-600">admin2026</strong> (يمكنك تغييره لاحقاً من داخل اللوحة).
            </div>
          )}

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl transition shadow-md shadow-red-700/20 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>دخول إلى لوحة التحكم</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium text-sm rounded-xl transition"
            >
              إلغاء
            </button>
          </div>
        </form>

        <div className="bg-stone-50 dark:bg-stone-800/40 px-6 py-3 border-t border-stone-200 dark:border-stone-800 text-center">
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            اختصار لوحة المفاتيح السريع للمشرفين: <kbd className="px-1.5 py-0.5 bg-stone-200 dark:bg-stone-700 rounded font-mono text-[10px]">Ctrl + Shift + A</kbd>
          </p>
        </div>
      </div>
    </div>
  );
};

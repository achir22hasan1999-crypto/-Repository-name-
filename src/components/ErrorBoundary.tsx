import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Ignore browser extension / wallet injected errors
    if (
      error?.message?.includes('MetaMask') ||
      error?.message?.includes('ethereum') ||
      error?.message?.includes('wallet')
    ) {
      return { hasError: false };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (
      error?.message?.includes('MetaMask') ||
      error?.message?.includes('ethereum')
    ) {
      return;
    }
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-100 dark:bg-stone-900 flex items-center justify-center p-4 font-['Tajawal']" dir="rtl">
          <div className="max-w-md w-full bg-white dark:bg-stone-800 p-6 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white font-['Cairo']">
              حدث خطأ غير متوقع أثناء عرض الصفحة
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              يرجى إعادة تحميل الصفحة لمتابعة تصفح أخبار المغرب العربي اليوم.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

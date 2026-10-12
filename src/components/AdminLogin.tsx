import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Loader2,
  KeyRound,
} from 'lucide-react';
import { signInAdminWithGoogle } from '../services/firebase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToPublic: () => void;
  unauthorizedNotice?: string | null;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToPublic,
  unauthorizedNotice,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(unauthorizedNotice || null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await signInAdminWithGoogle();

      if (result.success && result.user) {
        onLoginSuccess();
      } else {
        setErrorMessage(
          result.error ||
            'Unable to verify administrator permissions. Please check your credentials.'
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during Firebase authentication.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 rounded-xl border border-slate-800 transition-all cursor-pointer backdrop-blur-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Moneytize X</span>
        </button>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header shield icon */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center">
              <Lock className="w-3 h-3 text-emerald-400" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold tracking-wide uppercase mb-2">
            <Sparkles className="w-3 h-3" />
            Firebase Verified Portal
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Administrator Sign In
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
            Secure administrative console for financial platforms, directory taxonomy, and moderation.
          </p>
        </div>

        {/* Access limitation badge - without revealing admin email */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <p className="font-semibold text-white mb-0.5">Restricted Access</p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Access to this portal is restricted to authorized administrator credentials only. Unauthorized access requests will be rejected.
              </p>
            </div>
          </div>
        </div>

        {/* Error message if unauthorized or login failed */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 text-xs text-red-300 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-red-200">Access Denied</p>
                <p className="text-red-300/90 text-[11px] leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sign In Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full relative flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm shadow-xl shadow-white/5 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 text-slate-900 animate-spin" />
                <span>Connecting to Firebase...</span>
              </>
            ) : (
              <>
                {/* Official Google 'G' icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Sign in with Google (Admin)</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-500 pt-2">
            Protected by Firebase Authentication & Firestore Security Rules
          </p>
        </div>

        {/* Security guidelines note */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Security Policy:</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Authentication is strictly limited to the designated administrator. Any unrecognized account attempts will be automatically terminated.
          </p>
        </div>
      </div>
    </div>
  );
};

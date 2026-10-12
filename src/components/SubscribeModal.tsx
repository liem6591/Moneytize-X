import React, { useState } from 'react';
import { X, Mail, Check, Sparkles, ShieldCheck } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      onClose();
      setEmail('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 text-center space-y-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <Mail className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Weekly Financial Intelligence
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              Join 120,000+ investors receiving unbiased broker fee audits, 5%+ cash APY updates, and verified promotion bonuses every Friday.
            </p>
          </div>

          {subscribed ? (
            <div className="py-4 text-emerald-600 font-semibold text-sm flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              <span>You're subscribed! Check your inbox for confirmation.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Get Free Weekly Dispatch
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% spam-free. Unsubscribe with 1 click anytime.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

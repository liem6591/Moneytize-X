import React, { useState, useEffect } from 'react';
import { FinancialPlatform } from '../types';
import {
  X,
  Star,
  ShieldCheck,
  Check,
  User,
  Sparkles,
  Award,
} from 'lucide-react';

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: FinancialPlatform | null;
  currentUserRating?: number;
  onSubmitRating: (
    platformId: string,
    rating: number,
    reviewData?: {
      author: string;
      title: string;
      content: string;
      experience?: string;
    }
  ) => void;
}

const EXPERIENCE_OPTIONS = [
  'Active Trader',
  'Long-Term Investor',
  'Retirement Saver',
  'Crypto / Web3 User',
  'High-Yield Cash Saver',
  'Beginner Investor',
];

const RATING_DESCRIPTIONS: Record<number, { label: string; desc: string }> = {
  1: { label: '1 Star — Poor', desc: 'Unexpected hidden fees, platform execution lags, or poor support' },
  2: { label: '2 Stars — Below Average', desc: 'Noticeable friction or better alternatives exist in this category' },
  3: { label: '3 Stars — Average / Fair', desc: 'Standard performance; fulfills core banking/brokerage needs' },
  4: { label: '4 Stars — Very Good', desc: 'Competitive fee schedule, smooth execution, and solid features' },
  5: { label: '5 Stars — Exceptional', desc: 'Industry benchmark; outstanding value, safety, and customer experience' },
};

export const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({
  isOpen,
  onClose,
  platform,
  currentUserRating,
  onSubmitRating,
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(currentUserRating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState('');
  const [experience, setExperience] = useState('Active Trader');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [hasUsedPlatform, setHasUsedPlatform] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (currentUserRating) {
      setSelectedRating(currentUserRating);
    }
  }, [currentUserRating, platform]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !platform) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRating < 1 || selectedRating > 5) return;

    onSubmitRating(platform.id, selectedRating, {
      author: authorName.trim() || 'Verified Investor',
      title: reviewTitle.trim() || `${selectedRating}-Star Rating for ${platform.name}`,
      content:
        reviewContent.trim() ||
        `Verified community feedback for ${platform.name}. Rated ${selectedRating} out of 5 stars.`,
      experience,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs"
              style={{
                backgroundColor: platform.logo.bg || '#10B981',
                color: platform.logo.color || '#FFFFFF',
              }}
            >
              {platform.logo.text || platform.name.substring(0, 2)}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Rate &amp; Review {platform.name}</span>
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Current audit: <strong className="text-slate-800 dark:text-slate-200">{platform.rating.toFixed(1)} ★</strong> ({platform.reviewCount.toLocaleString()} reviews)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">Review Successfully Published</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your {selectedRating}-star rating has been registered. The overall average score for {platform.name} has been updated in real-time.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {/* Interactive 1-5 Star Picker */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-center">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Select Your Rating (1–5 Stars)
              </div>

              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1.5 rounded-lg hover:scale-115 active:scale-95 transition-all cursor-pointer focus:outline-hidden"
                    aria-label={`${star} Star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        (hoverRating || selectedRating) >= star
                          ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="mt-2.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {RATING_DESCRIPTIONS[hoverRating || selectedRating]?.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {RATING_DESCRIPTIONS[hoverRating || selectedRating]?.desc}
                </div>
              </div>
            </div>

            {/* Reviewer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Your Name or Alias
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Jordan K."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Your Investor Profile
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden cursor-pointer"
                >
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Headline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                required
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder={`e.g. Transparent fees and fast order fills on ${platform.name}`}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
              />
            </div>

            {/* Experience Comments */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Detailed Feedback (Optional)
              </label>
              <textarea
                rows={3}
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Share your experience regarding customer service, transaction execution, fee schedule clarity, and mobile app quality..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden resize-none"
              />
            </div>

            {/* Platform Usage Certification */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="modalAffirmUsage"
                checked={hasUsedPlatform}
                onChange={(e) => setHasUsedPlatform(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="modalAffirmUsage" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                I certify I have used {platform.name} and this rating reflects my real experience.
              </label>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hasUsedPlatform}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Submit Rating ({selectedRating} ★)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

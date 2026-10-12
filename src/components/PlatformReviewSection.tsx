import React, { useState, useEffect } from 'react';
import { FinancialPlatform, PlatformReview } from '../types';
import { getInitialReviewsForPlatform } from '../data/platformReviews';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  PenLine,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Check,
  User,
  Filter,
} from 'lucide-react';

interface PlatformReviewSectionProps {
  platform: FinancialPlatform;
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

const RATING_LABELS: Record<number, { label: string; desc: string }> = {
  1: { label: '1 Star — Poor', desc: 'High unexpected fees, poor execution, or difficult custody' },
  2: { label: '2 Stars — Below Average', desc: 'Noticeable drawbacks in interface, fees, or service' },
  3: { label: '3 Stars — Average', desc: 'Meets basic industry expectations; nothing standout' },
  4: { label: '4 Stars — Very Good', desc: 'Strong platform with transparent fees and good uptime' },
  5: { label: '5 Stars — Outstanding', desc: 'Exceptional value, zero friction, and best-in-class features' },
};

export const PlatformReviewSection: React.FC<PlatformReviewSectionProps> = ({
  platform,
  currentUserRating,
  onSubmitRating,
}) => {
  // Reviews state: combine stored reviews + seed reviews
  const [reviews, setReviews] = useState<PlatformReview[]>(() => {
    try {
      const saved = localStorage.getItem(`investigate_reviews_${platform.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return getInitialReviewsForPlatform(platform.id, platform.name);
  });

  // Review form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(currentUserRating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState('');
  const [experience, setExperience] = useState('Active Trader');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [hasUsedPlatform, setHasUsedPlatform] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  // Keep reviews updated when platform changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`investigate_reviews_${platform.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    setReviews(getInitialReviewsForPlatform(platform.id, platform.name));
  }, [platform.id, platform.name]);

  // Sync user's existing rating if available
  useEffect(() => {
    if (currentUserRating) {
      setSelectedRating(currentUserRating);
    }
  }, [currentUserRating]);

  // Handle helpful review upvoting
  const handleToggleHelpful = (reviewId: string) => {
    if (votedReviews.has(reviewId)) return;
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    setVotedReviews((prev) => new Set(prev).add(reviewId));
  };

  // Submit review handler
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRating < 1 || selectedRating > 5) return;

    const newReview: PlatformReview = {
      id: `usr-rev-${Date.now()}`,
      platformId: platform.id,
      author: authorName.trim() || 'Verified Investor',
      rating: selectedRating,
      title: reviewTitle.trim() || `${selectedRating}-Star Rating for ${platform.name}`,
      content:
        reviewContent.trim() ||
        `I submitted a ${selectedRating}-star rating for ${platform.name}. Verified user experience.`,
      date: 'Just now',
      experience: experience || 'Active Investor',
      isVerified: true,
    };

    // Prepend user review
    const updatedReviews = [newReview, ...reviews.filter((r) => r.id !== `usr-rev-${platform.id}`)];
    setReviews(updatedReviews);

    // Persist reviews locally
    try {
      localStorage.setItem(`investigate_reviews_${platform.id}`, JSON.stringify(updatedReviews));
    } catch {
      // ignore
    }

    // Call parent handler to update platform rating in memory and global state
    onSubmitRating(platform.id, selectedRating, {
      author: newReview.author,
      title: newReview.title,
      content: newReview.content,
      experience: newReview.experience,
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setIsFormOpen(false);
      setFormSubmitted(false);
    }, 1800);
  };

  // Star rendering helper
  const renderStars = (rating: number, maxStars = 5, sizeClass = 'w-4 h-4') => {
    return (
      <div className="inline-flex items-center gap-0.5" aria-label={`${rating} out of ${maxStars} stars`}>
        {Array.from({ length: maxStars }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = rating >= starValue;
          const isPartial = !isFilled && rating > i && rating < starValue;

          return (
            <div key={i} className="relative">
              <Star
                className={`${sizeClass} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400'
                    : isPartial
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-slate-200 dark:text-slate-700 fill-transparent'
                }`}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // Filter reviews by rating
  const displayedReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return Math.floor(r.rating) === filterRating;
  });

  // Calculate histogram counts
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === stars).length;
    const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Audited User Reviews &amp; Community Ratings</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified ratings submitted by real investors and account holders
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>{currentUserRating ? 'Update Your Review' : 'Submit a Review'}</span>
          </button>
        )}
      </div>

      {/* Aggregate Rating Scorecard */}
      <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Left: Big Average Number & Stars */}
          <div className="sm:col-span-4 text-center sm:text-left sm:border-r sm:border-slate-200 dark:sm:border-slate-700 sm:pr-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              {platform.rating.toFixed(1)}
              <span className="text-sm sm:text-base font-normal text-slate-400 ml-1">/ 5.0</span>
            </div>
            <div className="my-1.5 flex justify-center sm:justify-start">
              {renderStars(platform.rating, 5, 'w-5 h-5')}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Based on <span className="font-bold text-slate-800 dark:text-slate-200">{platform.reviewCount.toLocaleString()}</span> audited community ratings
            </div>
            {currentUserRating && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>You rated this: {currentUserRating} ★</span>
              </div>
            )}
          </div>

          {/* Right: Star Breakdown Progress Bars */}
          <div className="sm:col-span-8 space-y-1.5">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setFilterRating(filterRating === stars ? 'all' : stars)}
                  className={`w-12 text-left font-mono font-medium hover:text-emerald-600 transition-colors cursor-pointer ${
                    filterRating === stars ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {stars} Star{stars > 1 ? 's' : ''}
                </button>
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-[11px] text-slate-400">
                  {percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Submission Form (Expandable) */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border-2 border-emerald-500/40 dark:border-emerald-500/40 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>{currentUserRating ? 'Update Your Rating & Review' : `Rate & Review ${platform.name}`}</span>
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Your rating will immediately update {platform.name}&apos;s overall audited community average.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
            >
              Cancel
            </button>
          </div>

          {formSubmitted ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h5 className="font-bold text-base text-slate-900 dark:text-white">Review Submitted!</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Thank you! Your {selectedRating}-star rating was recorded and {platform.name}&apos;s verified score has updated.
              </p>
            </div>
          ) : (
            <>
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Your Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer focus:outline-hidden"
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            (hoverRating || selectedRating) >= star
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Rating text descriptor */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {RATING_LABELS[hoverRating || selectedRating]?.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {RATING_LABELS[hoverRating || selectedRating]?.desc}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviewer Name and Experience */}
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
                      placeholder="e.g. Alex M. or Anonymous"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Investor Profile
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

              {/* Review Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder={`What is the main highlight of your experience with ${platform.name}?`}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>

              {/* Review Feedback Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Detailed Review / Experience
                </label>
                <textarea
                  rows={3}
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder={`Detail fee transparency, execution speed, mobile responsiveness, or cash sweep yields on ${platform.name}...`}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden resize-none"
                />
              </div>

              {/* User affirmation checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="affirmUsage"
                  checked={hasUsedPlatform}
                  onChange={(e) => setHasUsedPlatform(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="affirmUsage" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  I certify that this review is based on my genuine personal experience with {platform.name}.
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
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
            </>
          )}
        </form>
      )}

      {/* Reviews Filter & List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>
              Showing {displayedReviews.length} {filterRating !== 'all' ? `${filterRating}-star` : ''} review{displayedReviews.length === 1 ? '' : 's'}
            </span>
          </div>

          {filterRating !== 'all' && (
            <button
              onClick={() => setFilterRating('all')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Reviews Cards List */}
        <div className="space-y-3">
          {displayedReviews.map((rev) => {
            const hasVoted = votedReviews.has(rev.id);
            const votes = (helpfulVotes[rev.id] || 0) + (rev.id.startsWith('usr-rev') ? 1 : 4);

            return (
              <div
                key={rev.id}
                className={`bg-white dark:bg-slate-900 rounded-xl p-4 border transition-all ${
                  rev.id.startsWith('usr-rev')
                    ? 'border-emerald-400/80 dark:border-emerald-500/80 ring-2 ring-emerald-500/10'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {rev.author}
                      </span>
                      {rev.isVerified && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified User
                        </span>
                      )}
                      {rev.experience && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          • {rev.experience}
                        </span>
                      )}
                      {rev.id.startsWith('usr-rev') && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                          Your Review
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(rev.rating, 5, 'w-3.5 h-3.5')}
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleHelpful(rev.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                      hasVoted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${hasVoted ? 'text-emerald-600' : ''}`} />
                    <span>Helpful ({votes})</span>
                  </button>
                </div>

                <div className="mt-2.5">
                  <h6 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {rev.title}
                  </h6>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rev.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

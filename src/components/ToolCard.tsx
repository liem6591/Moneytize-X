import React from 'react';
import { FinancialPlatform } from '../types';
import { ChevronUp, ExternalLink, ShieldCheck, Sparkles, Scale, Check, Star } from 'lucide-react';

interface ToolCardProps {
  platform: FinancialPlatform;
  hasUpvoted: boolean;
  onUpvote: (e: React.MouseEvent, platformId: string) => void;
  onSelect: (platform: FinancialPlatform) => void;
  isCompared?: boolean;
  onToggleCompare?: (e: React.MouseEvent, platformId: string) => void;
  currentUserRating?: number;
  onOpenReview?: (e: React.MouseEvent, platform: FinancialPlatform) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  platform,
  hasUpvoted,
  onUpvote,
  onSelect,
  isCompared = false,
  onToggleCompare,
  currentUserRating,
  onOpenReview,
}) => {
  // Fee tier badge color styles
  const getFeeBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'Zero Fee':
      case 'Commission Free':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80';
      case 'Low Fee':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/80';
      case 'Freemium':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/80';
      case 'Subscription':
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div
      onClick={() => onSelect(platform)}
      className={`group relative bg-white dark:bg-slate-900 rounded-xl border p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer ${
        isCompared
          ? 'border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/30 dark:ring-emerald-400/30 shadow-emerald-500/5'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top section: Logo + Title + Description */}
      <div>
        <div className="flex items-start gap-3.5">
          {/* Platform Logo Avatar */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-base shadow-xs select-none overflow-hidden transition-transform group-hover:scale-105"
            style={{
              backgroundColor: platform.logo.bg || '#F1F5F9',
              color: platform.logo.color || '#0F172A',
              border: platform.logo.border ? `1px solid ${platform.logo.border}` : '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <span>{platform.logo.text || platform.name.substring(0, 2)}</span>
          </div>

          {/* Name & Short Description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                {platform.name}
              </h3>
              {platform.isEditorPick && (
                <span title="Auditor's Verified Top Pick" className="shrink-0 inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  Top Pick
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {platform.description}
            </p>

            {/* Platform Rating & User Reviews info */}
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <div className="inline-flex items-center gap-1 font-bold text-amber-500 dark:text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{platform.rating.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">
                ({platform.reviewCount >= 1000 ? `${(platform.reviewCount / 1000).toFixed(1)}k` : platform.reviewCount} reviews)
              </span>
              {currentUserRating && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  <span>You: {currentUserRating}★</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section: Badges + Upvote button */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {/* Badges container */}
        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
          {/* Fee Tier Badge */}
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getFeeBadgeStyle(
              platform.feeTier
            )}`}
          >
            {platform.feeTier}
          </span>

          {/* Category Badge */}
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 truncate max-w-[130px]">
            {platform.category}
          </span>

          {/* APY / Fee Pill if available */}
          {platform.yieldAPY ? (
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {platform.yieldAPY}
            </span>
          ) : platform.feeHighlight ? (
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
              {platform.feeHighlight}
            </span>
          ) : null}
        </div>

        {/* Actions: Compare toggle + Rate + Upvote Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Rate button */}
          {onOpenReview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenReview(e, platform);
              }}
              aria-label={`Submit review for ${platform.name}`}
              title={currentUserRating ? `You rated this ${currentUserRating} stars - click to edit` : "Rate this platform (1-5 stars)"}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                currentUserRating
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'border-slate-200/90 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${currentUserRating ? 'fill-amber-400 text-amber-500' : 'text-amber-500'}`} />
              <span className="text-[11px]">{currentUserRating ? `${currentUserRating}★` : 'Rate'}</span>
            </button>
          )}

          {onToggleCompare && (
            <button
              onClick={(e) => onToggleCompare(e, platform.id)}
              aria-label={isCompared ? `Remove ${platform.name} from comparison` : `Compare ${platform.name}`}
              title={isCompared ? "Remove from comparison" : "Add to side-by-side comparison (up to 3)"}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                isCompared
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs scale-102'
                  : 'border-slate-200/90 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              {isCompared ? (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <Scale className="w-3.5 h-3.5" />
              )}
              <span className="text-[11px]">{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>
          )}

          {/* Upvote Button (chevron up + count) */}
          <button
            onClick={(e) => onUpvote(e, platform.id)}
            aria-label={`Upvote ${platform.name}`}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer ${
              hasUpvoted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 scale-105 shadow-xs'
                : 'border-slate-200/90 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
            }`}
          >
            <ChevronUp
              className={`w-3.5 h-3.5 transition-transform ${hasUpvoted ? 'text-emerald-600 dark:text-emerald-400 stroke-[2.5]' : ''}`}
            />
            <span>{platform.upvotes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

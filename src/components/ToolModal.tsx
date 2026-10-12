import React, { useEffect, useState, useMemo } from 'react';
import { FinancialPlatform } from '../types';
import { PlatformReviewSection } from './PlatformReviewSection';
import {
  getSemanticSimilarPlatforms,
  SemanticSimilarResult,
  SemanticMatch,
} from '../services/semanticSimilarityService';
import {
  X,
  ExternalLink,
  ChevronUp,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Percent,
  DollarSign,
  Gift,
  Building2,
  Check,
  Scale,
  Star,
  Sparkles,
  RefreshCw,
  Zap,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ToolModalProps {
  platform: FinancialPlatform;
  onClose: () => void;
  hasUpvoted: boolean;
  onUpvote: (e: React.MouseEvent, platformId: string) => void;
  relatedPlatforms: FinancialPlatform[];
  onSelectRelated: (platform: FinancialPlatform) => void;
  allPlatforms?: FinancialPlatform[];
  isCompared?: boolean;
  onToggleCompare?: (e: React.MouseEvent, platformId: string) => void;
  onOpenCompare?: () => void;
  currentUserRating?: number;
  onSubmitRating?: (
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

export const ToolModal: React.FC<ToolModalProps> = ({
  platform,
  onClose,
  hasUpvoted,
  onUpvote,
  relatedPlatforms,
  onSelectRelated,
  allPlatforms,
  isCompared = false,
  onToggleCompare,
  onOpenCompare,
  currentUserRating,
  onSubmitRating,
}) => {
  const [copied, setCopied] = useState(false);
  const [similarityMode, setSimilarityMode] = useState<'semantic' | 'category'>('semantic');
  const [semanticResult, setSemanticResult] = useState<SemanticSimilarResult | null>(null);
  const [isLoadingSemantic, setIsLoadingSemantic] = useState<boolean>(false);
  const [semanticError, setSemanticError] = useState<string | null>(null);

  // Fetch Gemini semantic similarity whenever the inspected platform changes
  const fetchSemanticMatches = async (forceRefresh = false) => {
    const candidates = allPlatforms || relatedPlatforms;
    if (!candidates || candidates.length === 0) return;

    setIsLoadingSemantic(true);
    setSemanticError(null);
    try {
      const result = await getSemanticSimilarPlatforms(platform, candidates, 4, forceRefresh);
      setSemanticResult(result);
    } catch (err) {
      console.error('Error fetching semantic matches:', err);
      setSemanticError('Unable to generate AI semantic analysis right now.');
    } finally {
      setIsLoadingSemantic(false);
    }
  };

  useEffect(() => {
    fetchSemanticMatches(false);
  }, [platform.id, allPlatforms]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            {/* Logo */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold text-lg shadow-xs select-none"
              style={{
                backgroundColor: platform.logo.bg || '#F1F5F9',
                color: platform.logo.color || '#0F172A',
                border: platform.logo.border ? `1px solid ${platform.logo.border}` : '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <span>{platform.logo.text || platform.name.substring(0, 2)}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {platform.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {platform.feeTier}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{platform.category}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-800/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{platform.rating.toFixed(1)}</span>
                  <span className="font-normal text-[11px] text-slate-500 dark:text-slate-400">
                    ({platform.reviewCount.toLocaleString()} reviews)
                  </span>
                </span>
                <span>•</span>
                <span>Audited on {platform.dateAdded}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare Toggle Button */}
            {onToggleCompare && (
              <button
                onClick={(e) => onToggleCompare(e, platform.id)}
                title={isCompared ? "Remove from comparison" : "Add to comparison (up to 3 platforms)"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isCompared
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{isCompared ? 'Comparing' : 'Compare'}</span>
              </button>
            )}

            <button
              onClick={(e) => onUpvote(e, platform.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                hasUpvoted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <ChevronUp className="w-4 h-4" />
              <span>{platform.upvotes}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Promotion / Welcome Bonus Banner if available */}
          {platform.currentOffer && (
            <div className="bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-950/30 dark:to-emerald-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Exclusive Verified Promotion
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {platform.currentOffer}
                </div>
              </div>
            </div>
          )}

          {/* Key Financial Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Fee Highlight</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {platform.feeHighlight}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Cash APY / Yield</div>
              <div className="text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                {platform.yieldAPY || 'Market standard'}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Min Deposit</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {platform.minDeposit}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Regulation</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate" title={platform.regulatoryStatus}>
                {platform.regulatoryStatus.split(',')[0]}
              </div>
            </div>
          </div>

          {/* Deposit Insurance / Safeguarding */}
          {platform.depositInsurance && (
            <div className="flex items-center gap-2 text-xs bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 p-2.5 rounded-lg border border-emerald-200/70 dark:border-emerald-800/70">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Asset Protection:</strong> {platform.depositInsurance}
              </span>
            </div>
          )}

          {/* Full Description / Editorial Dossier */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Audit Overview
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
              {platform.fullDescription || platform.description}
            </p>
          </div>

          {/* Key Perks */}
          {platform.keyPerks && platform.keyPerks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
                Key Platform Capabilities
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {platform.keyPerks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transparent Fee Ledger */}
          {platform.feeBreakdown && platform.feeBreakdown.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
                Transparent Fee Breakdown
              </h4>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Service / Trade Type</th>
                      <th className="py-2 px-3">Standard Cost</th>
                      <th className="py-2 px-3">Audit Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {platform.feeBreakdown.map((fee, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{fee.label}</td>
                        <td className="py-2 px-3 font-bold text-emerald-600 dark:text-emerald-400">{fee.value}</td>
                        <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{fee.notes || 'Standard'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3.5">
              <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Strengths
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {platform.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-3.5">
              <h5 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Considerations & Drawbacks
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {platform.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tags */}
          {platform.tags && platform.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {platform.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Audited User Reviews & Community Ratings */}
          {onSubmitRating && (
            <PlatformReviewSection
              platform={platform}
              currentUserRating={currentUserRating}
              onSubmitRating={onSubmitRating}
            />
          )}

          {/* More Like This: AI Semantic Similarity & Category Peers */}
          <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    More Like {platform.name}
                  </h4>
                  {similarityMode === 'semantic' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Gemini AI Semantic Analysis</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {similarityMode === 'semantic'
                    ? 'Evaluated by Gemini AI based on description semantics, business mechanics, and product capabilities.'
                    : `Filtered strictly by shared primary category: ${platform.category}.`}
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                {/* Mode Selector */}
                <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setSimilarityMode('semantic')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      similarityMode === 'semantic'
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>AI Semantic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimilarityMode('category')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      similarityMode === 'category'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Category Peers</span>
                  </button>
                </div>

                {similarityMode === 'semantic' && (
                  <button
                    type="button"
                    onClick={() => fetchSemanticMatches(true)}
                    disabled={isLoadingSemantic}
                    title="Re-run Gemini semantic similarity analysis"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSemantic ? 'animate-spin text-emerald-600' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Semantic Mode View */}
            {similarityMode === 'semantic' ? (
              <div>
                {isLoadingSemantic ? (
                  <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <Sparkles className="w-4 h-4 animate-spin text-emerald-500" />
                      <span>Analyzing {platform.name}'s description, fee structure, and feature synergy with Gemini...</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-28 rounded-xl bg-slate-200/60 dark:bg-slate-700/40 animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                ) : semanticResult && semanticResult.matches && semanticResult.matches.length > 0 ? (
                  <div className="space-y-3">
                    {/* Gemini Executive Summary */}
                    {semanticResult.analysisOverview && (
                      <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl p-3 text-xs flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="font-bold text-emerald-900 dark:text-emerald-200">
                            Gemini Semantic Take:{' '}
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">
                            {semanticResult.analysisOverview}
                          </span>
                          <span className="ml-2 inline-block text-[10px] font-medium text-emerald-700/80 dark:text-emerald-400/80 uppercase tracking-wider">
                            ({semanticResult.isAiGenerated ? 'Gemini 3.8 Flash' : 'Semantic Heuristic'})
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Semantic Match Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {semanticResult.matches.map((matchItem) => {
                        const pool = allPlatforms || relatedPlatforms;
                        const matchedPlatform = pool.find((p) => p.id === matchItem.platformId);
                        if (!matchedPlatform) return null;

                        const isDifferentCategory = matchedPlatform.category !== platform.category;

                        return (
                          <div
                            key={matchItem.platformId}
                            onClick={() => onSelectRelated(matchedPlatform)}
                            className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/80 dark:hover:border-emerald-500/80 bg-white dark:bg-slate-800/70 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                          >
                            <div>
                              {/* Card Header: Logo, Name & Similarity Score */}
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                                    style={{
                                      backgroundColor: matchedPlatform.logo.bg,
                                      color: matchedPlatform.logo.color || '#fff',
                                    }}
                                  >
                                    {matchedPlatform.logo.text || matchedPlatform.name.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate flex items-center gap-1.5">
                                      <span>{matchedPlatform.name}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                      {matchedPlatform.category}
                                    </div>
                                  </div>
                                </div>

                                <div className="shrink-0 flex flex-col items-end">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                                    <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                                    <span>{matchItem.similarityScore}% Match</span>
                                  </span>
                                </div>
                              </div>

                              {/* Cross-Category Synergy Pill if applicable */}
                              {isDifferentCategory && (
                                <div className="mb-2">
                                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50">
                                    Cross-Category Synergy ({matchedPlatform.category})
                                  </span>
                                </div>
                              )}

                              {/* AI Semantic Rationale */}
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-2">
                                "{matchItem.matchReason}"
                              </p>
                            </div>

                            {/* Shared Themes & Action */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                              <div className="flex flex-wrap gap-1">
                                {matchItem.sharedThemes?.slice(0, 2).map((theme, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                                  >
                                    #{theme}
                                  </span>
                                ))}
                              </div>
                              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0">
                                <span>Inspect</span>
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                    <p>{semanticError || 'No semantic matches found for this platform.'}</p>
                    <button
                      type="button"
                      onClick={() => fetchSemanticMatches(true)}
                      className="mt-2 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                    >
                      Try re-analyzing with Gemini
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Category Peers Mode View */
              <div>
                {relatedPlatforms.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {relatedPlatforms.map((rel) => (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => onSelectRelated(rel)}
                        className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/40 text-left transition-all group cursor-pointer"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mb-1.5 shadow-2xs"
                          style={{
                            backgroundColor: rel.logo.bg,
                            color: rel.logo.color || '#fff',
                          }}
                        >
                          {rel.logo.text || rel.name.charAt(0)}
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                          {rel.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{rel.feeTier}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                    No other platforms found in {platform.category}.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Fixed CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleShare}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          <a
            href={platform.affiliateUrl || platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open {platform.name} & Claim Offer</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

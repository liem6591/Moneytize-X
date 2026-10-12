import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FinancialPlatform } from '../types';
import { ToolCard } from './ToolCard';
import {
  ChevronDown,
  FilterX,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
} from 'lucide-react';

export type SortOption = 'newest' | 'rating' | 'upvotes' | 'picks' | 'alphabetical' | 'yield';

interface ToolGridProps {
  platforms: FinancialPlatform[];
  totalDatabaseCount: number;
  upvotedIds: Set<string>;
  onUpvote: (e: React.MouseEvent, platformId: string) => void;
  onSelectPlatform: (platform: FinancialPlatform) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  comparedIds?: Set<string>;
  onToggleCompare?: (e: React.MouseEvent, platformId: string) => void;
  userRatings?: Record<string, number>;
  onOpenReview?: (e: React.MouseEvent, platform: FinancialPlatform) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  platforms,
  totalDatabaseCount,
  upvotedIds,
  onUpvote,
  onSelectPlatform,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
  comparedIds = new Set(),
  onToggleCompare,
  userRatings = {},
  onOpenReview,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10); // 10 platforms per page by default
  const sortRef = useRef<HTMLDivElement>(null);
  const gridTopRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset to first page when filtered platforms list changes or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [platforms.length, sortBy]);

  // Pagination calculations
  const totalItems = platforms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedPlatforms = useMemo(() => {
    return platforms.slice(startIndex, endIndex);
  }, [platforms, startIndex, endIndex]);

  const handlePageChange = (page: number) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate page pill list with smart ellipses
  const pageNumbers = useMemo(() => {
    const delta = 1;
    const range: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= safePage - delta && i <= safePage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  }, [totalPages, safePage]);

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest',
    rating: 'Highest Rated ★',
    upvotes: 'Most Upvoted',
    picks: "Editor's Picks",
    yield: 'Highest APY / Yield',
    alphabetical: 'Name (A–Z)',
  };

  return (
    <div ref={gridTopRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20">
      {/* Subheader: Showing count + Page stats + Sort dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-slate-200/60 dark:border-slate-800/80 mb-6">
        {/* Count display matching screenshot */}
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing{' '}
          <span className="font-bold text-slate-900 dark:text-white">
            {totalItems > 0 ? startIndex + 1 : 0}–{endIndex}
          </span>{' '}
          of <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span> verified platforms
          {totalPages > 1 && (
            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Page {safePage} of {totalPages}
            </span>
          )}
        </div>

        {/* Sort dropdown and Filter Reset */}
        <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FilterX className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}

          {/* Items per page selector (10, 20, 50) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="hidden md:inline font-medium">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Platforms per page"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
            >
              <span>{sortLabels[sortBy]}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-30 text-xs animate-in fade-in slide-in-from-top-1">
                {(['newest', 'upvotes', 'picks', 'yield', 'alphabetical'] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onSortChange(option);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer ${
                      sortBy === option
                        ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{sortLabels[option]}</span>
                    {sortBy === option && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Platform Cards */}
      {paginatedPlatforms.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedPlatforms.map((platform) => (
              <ToolCard
                key={platform.id}
                platform={platform}
                hasUpvoted={upvotedIds.has(platform.id)}
                onUpvote={onUpvote}
                onSelect={onSelectPlatform}
                isCompared={comparedIds.has(platform.id)}
                onToggleCompare={onToggleCompare}
                currentUserRating={userRatings[platform.id]}
                onOpenReview={onOpenReview}
              />
            ))}
          </div>

          {/* Pagination Controls Section */}
          {totalItems > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left info */}
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>
                  Showing <strong className="text-slate-800 dark:text-slate-200">{startIndex + 1}</strong> to{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{endIndex}</strong> of{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{totalItems}</strong> platforms
                </span>
              </div>

              {/* Center pagination bar */}
              <nav aria-label="Platforms catalog pagination" className="flex items-center gap-1.5 flex-wrap justify-center">
                {/* First page button */}
                {totalPages > 4 && (
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={safePage === 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                    title="First page"
                    aria-label="First page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                )}

                {/* Previous page button */}
                <button
                  onClick={() => handlePageChange(safePage - 1)}
                  disabled={safePage === 1}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Number Pills */}
                <div className="flex items-center gap-1">
                  {pageNumbers.map((page, index) => {
                    if (page === '...') {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 py-1 text-slate-400 dark:text-slate-600 text-xs font-bold select-none"
                        >
                          …
                        </span>
                      );
                    }

                    const pageNum = Number(page);
                    const isActive = pageNum === safePage;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        aria-current={isActive ? 'page' : undefined}
                        aria-label={`Page ${pageNum}`}
                        className={`min-w-9 h-9 px-2 flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                            : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next page button */}
                <button
                  onClick={() => handlePageChange(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last page button */}
                {totalPages > 4 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={safePage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                    title="Last page"
                    aria-label="Last page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                )}
              </nav>

              {/* Right selector */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium">Per page:</span>
                <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-0.5">
                  {[10, 20, 50].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setPageSize(size);
                        setCurrentPage(1);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                        pageSize === size
                          ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-4">
            <FilterX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No platforms found</h3>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            No financial platforms matched your selected criteria. Try removing filters or searching a different asset class.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

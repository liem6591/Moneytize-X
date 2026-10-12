import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, Sparkles, Check } from 'lucide-react';
import { FINANCIAL_CATEGORIES } from '../data/financialPlatforms';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFeeTier: string;
  onSelectFeeTier: (tier: string) => void;
  isEditorPickOnly: boolean;
  onToggleEditorPick: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categoryCounts?: Record<string, number>;
  categories?: string[];
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedFeeTier,
  onSelectFeeTier,
  isEditorPickOnly,
  onToggleEditorPick,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
  categories,
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);

  const activeCategories = categories && categories.length > 0 ? categories : (FINANCIAL_CATEGORIES as unknown as string[]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(e.target as Node)) {
        setShowAllCategories(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Visible categories in the top bar (defaults + any custom selected)
  const visibleCategories = activeCategories.slice(0, 11);

  const feeTiers = ['Zero Fee', 'Commission Free', 'Low Fee', 'Freemium', 'Subscription'];

  return (
    <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 bg-gradient-to-b from-emerald-50/50 via-sky-50/25 to-[#F8FAFC] dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          The <span className="text-emerald-600 dark:text-emerald-400">Finance</span> <span className="text-cyan-500 dark:text-cyan-400">Platforms</span> Database
        </h1>

        {/* Subtitle */}
        <p className="mt-3.5 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-normal">
          Search 4,500+ verified stock brokers, high-yield savings, e-wallets, crypto exchanges, and lending apps.
        </p>

        {/* Main Search & Filters Card (Elevated white rounded card) */}
        <div className="mt-8 max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-3.5 sm:p-4.5 text-left space-y-3.5">
          {/* Top Line: Search Bar + Fee Tier Filter Pills */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Search Input Box */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search 4,500+ financial platforms — try a broker, zero fee, APY, or asset class..."
                className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Fee Tiers & Editor's Picks on the right */}
            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              {feeTiers.map((tier) => {
                const isActive = selectedFeeTier === tier;
                return (
                  <button
                    key={tier}
                    onClick={() => onSelectFeeTier(tier)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {tier}
                  </button>
                );
              })}

              {/* Editor's Picks Pill */}
              <button
                onClick={onToggleEditorPick}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  isEditorPickOnly
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isEditorPickOnly ? 'text-amber-300' : 'text-emerald-500'}`} />
                Editor's Picks
              </button>
            </div>
          </div>

          {/* Bottom Line: CATEGORIES + Category Pills + All 18 Dropdown */}
          <div className="relative pt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Label */}
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase shrink-0 mr-1">
              CATEGORIES
            </span>

            {/* Scrollable / wrapped category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 flex-1">
              {/* "All" category option */}
              <button
                onClick={() => onSelectCategory('All')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                All
              </button>

              {visibleCategories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium shrink-0 transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* All Categories Dropdown Button */}
            <div className="relative shrink-0" ref={categoriesDropdownRef}>
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className={`px-3 py-1 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                  showAllCategories || (selectedCategory !== 'All' && !visibleCategories.includes(selectedCategory))
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {selectedCategory !== 'All' && !visibleCategories.includes(selectedCategory)
                  ? selectedCategory
                  : `All ${activeCategories.length}`}
                <ChevronDown className={`w-3 h-3 transition-transform ${showAllCategories ? 'rotate-180' : ''}`} />
              </button>

              {/* Popover showing all financial categories */}
              {showAllCategories && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 mb-1">
                    All Financial Categories ({activeCategories.length})
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    <button
                      onClick={() => {
                        onSelectCategory('All');
                        setShowAllCategories(false);
                      }}
                      className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                        selectedCategory === 'All'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>All Categories</span>
                      {selectedCategory === 'All' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                    {activeCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          onSelectCategory(cat);
                          setShowAllCategories(false);
                        }}
                        className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{cat}</span>
                        <div className="flex items-center gap-2">
                          {categoryCounts[cat] !== undefined && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                              {categoryCounts[cat]}
                            </span>
                          )}
                          {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useMemo } from 'react';
import { FinancialPlatform } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface RecommendedSectionProps {
  platforms: FinancialPlatform[];
  onSelectPlatform: (platform: FinancialPlatform) => void;
  onSeeTop20?: () => void;
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  platforms,
  onSelectPlatform,
  onSeeTop20,
}) => {
  // Select top 6 recommended platforms (editor picks + highest rated)
  const recommendedPlatforms = useMemo(() => {
    const sorted = [...platforms].sort((a, b) => {
      if (a.isEditorPick !== b.isEditorPick) return a.isEditorPick ? -1 : 1;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.upvotes - a.upvotes;
    });
    return sorted.slice(0, 6);
  }, [platforms]);

  if (recommendedPlatforms.length === 0) return null;

  return (
    <section
      id="recommended"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3 scroll-mt-20"
    >
      {/* Header Row: Title on Left, "See the Top 20 ->" on Right */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold text-xs sm:text-sm tracking-wider uppercase">
          <Sparkles className="w-4 h-4 fill-violet-600/20 text-violet-600 dark:text-violet-400" />
          <span>RECOMMENDED RIGHT NOW</span>
        </div>

        <button
          onClick={onSeeTop20}
          className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>See the Top 20</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Clean Single Row of Compact Cards matching screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {recommendedPlatforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onSelectPlatform(platform)}
            className="w-full text-left bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl px-3.5 py-3 flex items-center gap-3 transition-all hover:shadow-xs cursor-pointer group"
          >
            {/* Logo box */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs transition-transform group-hover:scale-105"
              style={{
                backgroundColor: platform.logo.bg || '#F1F5F9',
                color: platform.logo.color || '#0F172A',
                border: platform.logo.border
                  ? `1px solid ${platform.logo.border}`
                  : '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <span>{platform.logo.text || platform.name.substring(0, 2)}</span>
            </div>

            {/* Platform Name */}
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {platform.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

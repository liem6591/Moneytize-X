import React from 'react';
import { FinancialPlatform } from '../types';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

interface CompareBarProps {
  comparedPlatforms: FinancialPlatform[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onOpenCompareModal: () => void;
}

export const CompareBar: React.FC<CompareBarProps> = ({
  comparedPlatforms,
  onRemoveFromCompare,
  onClearCompare,
  onOpenCompareModal,
}) => {
  if (comparedPlatforms.length === 0) return null;

  return (
    <aside
      aria-label="Platform comparison dock"
      className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-auto max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-2.5 sm:px-4 sm:py-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        {/* Left info badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                Compare
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                {comparedPlatforms.length}/3
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {comparedPlatforms.length < 3
                ? `Pick up to ${3 - comparedPlatforms.length} more`
                : 'Maximum 3 selected'}
            </p>
          </div>
        </div>

        {/* Center: Selected Platform Chips */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
          {comparedPlatforms.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs"
            >
              <span
                className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: p.logo.bg || '#10B981',
                  color: p.logo.color || '#FFFFFF',
                }}
              >
                {p.logo.text || p.name.substring(0, 2)}
              </span>
              <span className="truncate max-w-[90px]">{p.name}</span>
              <button
                onClick={() => onRemoveFromCompare(p.id)}
                className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 ml-0.5 cursor-pointer"
                title={`Remove ${p.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Empty slot preview if fewer than 3 */}
          {Array.from({ length: 3 - comparedPlatforms.length }).map((_, idx) => (
            <div
              key={idx}
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs font-bold select-none"
              title="Empty compare slot"
            >
              +
            </div>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClearCompare}
            className="p-1.5 text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title="Clear all selected"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCompareModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

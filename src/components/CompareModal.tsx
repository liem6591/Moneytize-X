import React, { useState } from 'react';
import { FinancialPlatform } from '../types';
import {
  X,
  Scale,
  Trash2,
  ShieldCheck,
  Check,
  AlertTriangle,
  ExternalLink,
  Plus,
  Sparkles,
  Percent,
  DollarSign,
  Gift,
  Building2,
  Search,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedPlatforms: FinancialPlatform[];
  allPlatforms: FinancialPlatform[];
  onRemoveFromCompare: (id: string) => void;
  onAddToCompare: (id: string) => void;
  onClearCompare: () => void;
  onSelectPlatform: (platform: FinancialPlatform) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedPlatforms,
  allPlatforms,
  onRemoveFromCompare,
  onAddToCompare,
  onClearCompare,
  onSelectPlatform,
}) => {
  const [searchAddQuery, setSearchAddQuery] = useState('');
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const availableToAdd = allPlatforms.filter(
    (p) => !comparedPlatforms.some((cp) => cp.id === p.id)
  );

  const filteredAvailable = availableToAdd.filter(
    (p) =>
      p.name.toLowerCase().includes(searchAddQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchAddQuery.toLowerCase())
  );

  const getFeeBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'Zero Fee':
      case 'Commission Free':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Low Fee':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'Freemium':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Side-by-Side Platform Comparison
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {comparedPlatforms.length}/3 selected
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct comparative audit of trading fees, cash yields, deposit insurance, and regulatory standing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {comparedPlatforms.length > 0 && (
              <button
                onClick={onClearCompare}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close comparison modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {comparedPlatforms.length === 0 ? (
            /* Empty state */
            <div className="py-16 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Scale className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Platforms Selected for Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Click the <strong>Compare</strong> button or checkbox on any platform card in the directory to compare up to 3 financial institutions side-by-side.
              </p>
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Or quickly add popular platforms:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {allPlatforms.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onAddToCompare(p.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3 h-3 text-emerald-500" />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quick Add Bar if fewer than 3 selected */}
              {comparedPlatforms.length < 3 && (
                <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl p-3 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      You can add <strong>{3 - comparedPlatforms.length} more platform{3 - comparedPlatforms.length > 1 ? 's' : ''}</strong> to this comparison view.
                    </span>
                  </div>

                  {/* Add Platform Dropdown */}
                  <div className="relative w-full sm:w-auto">
                    <button
                      onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Platform to Compare</span>
                    </button>

                    {isAddDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-30 text-xs animate-in fade-in">
                        <div className="relative mb-2">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            value={searchAddQuery}
                            onChange={(e) => setSearchAddQuery(e.target.value)}
                            placeholder="Search platform by name..."
                            className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {filteredAvailable.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                onAddToCompare(p.id);
                                setIsAddDropdownOpen(false);
                                setSearchAddQuery('');
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span
                                  className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0"
                                  style={{
                                    backgroundColor: p.logo.bg || '#10B981',
                                    color: p.logo.color || '#FFFFFF',
                                  }}
                                >
                                  {p.logo.text || p.name.substring(0, 2)}
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 truncate">
                                  {p.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                                {p.category}
                              </span>
                            </button>
                          ))}
                          {filteredAvailable.length === 0 && (
                            <div className="p-2 text-center text-slate-400 text-xs">
                              No matching platforms
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Responsive Grid for Columns */}
              <div
                className={`grid gap-4 sm:gap-6 ${
                  comparedPlatforms.length === 1
                    ? 'grid-cols-1 md:grid-cols-2'
                    : comparedPlatforms.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-3'
                }`}
              >
                {comparedPlatforms.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between relative shadow-xs"
                  >
                    {/* Top: Remove button & Logo & Title */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-base shadow-xs select-none"
                            style={{
                              backgroundColor: p.logo.bg || '#F1F5F9',
                              color: p.logo.color || '#0F172A',
                              border: p.logo.border
                                ? `1px solid ${p.logo.border}`
                                : '1px solid rgba(0,0,0,0.06)',
                            }}
                          >
                            <span>{p.logo.text || p.name.substring(0, 2)}</span>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {p.name}
                              {p.isEditorPick && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                  Top Pick
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {p.category}
                              </span>
                              <span className="text-xs text-amber-500 font-bold">
                                ★ {p.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Remove from comparison */}
                        <button
                          onClick={() => onRemoveFromCompare(p.id)}
                          title="Remove from comparison"
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Primary Action Button */}
                      <a
                        href={p.affiliateUrl || p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <span>Visit & Open Account</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => onSelectPlatform(p)}
                        className="w-full mt-1.5 py-1.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-500" />
                        <span>View Full Audit Dossier</span>
                      </button>

                      {/* Comparison Metrics Ledger */}
                      <div className="mt-5 space-y-4 text-xs">
                        {/* 1. Fee Tier & Highlight */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Pricing & Fees
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                              {p.feeHighlight}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getFeeBadgeStyle(
                                p.feeTier
                              )}`}
                            >
                              {p.feeTier}
                            </span>
                          </div>
                          {p.feeBreakdown && p.feeBreakdown.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                              {p.feeBreakdown.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span>{item.label}:</span>
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {item.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 2. Cash APY Yield & Min Deposit */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                              Cash APY
                            </span>
                            <span
                              className={`inline-block font-extrabold text-xs px-2 py-0.5 rounded ${
                                p.yieldAPY
                                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {p.yieldAPY || '0.00%'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                              Min Deposit
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                              {p.minDeposit || '$0'}
                            </span>
                          </div>
                        </div>

                        {/* 3. Safety, Regulation & Insurance */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                            Safety & Regulation
                          </span>
                          <div className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{p.regulatoryStatus}</span>
                          </div>
                          {p.depositInsurance && (
                            <div className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                              <span>{p.depositInsurance}</span>
                            </div>
                          )}
                        </div>

                        {/* 4. Active Offer / Bonus */}
                        {p.currentOffer && (
                          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-2 text-xs">
                            <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-amber-900 dark:text-amber-300 block text-[11px]">
                                Active Promotion
                              </span>
                              <span className="text-amber-800 dark:text-amber-200 font-medium text-[11px]">
                                {p.currentOffer}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* 5. Key Pros */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 space-y-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                            Audited Strengths (Pros)
                          </span>
                          {p.pros.slice(0, 3).map((pro, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{pro}</span>
                            </div>
                          ))}
                        </div>

                        {/* 6. Key Cons */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 space-y-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                            Considerations (Cons)
                          </span>
                          {p.cons.slice(0, 2).map((con, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span>{con}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty Slot Card if only 1 or 2 platforms */}
                {comparedPlatforms.length < 3 && (
                  <div
                    onClick={() => setIsAddDropdownOpen(true)}
                    className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-slate-400 hover:text-emerald-600 hover:border-emerald-400 dark:hover:border-emerald-700 transition-all cursor-pointer min-h-[420px] group bg-white/50 dark:bg-slate-900/40"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 group-hover:text-emerald-600 flex items-center justify-center mb-3 transition-colors">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-emerald-600">
                      Add Platform {comparedPlatforms.length + 1}
                    </span>
                    <span className="text-xs text-slate-400 mt-1 max-w-[180px]">
                      Select another platform from the directory to compare head-to-head
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Comparing verified financial institutions & brokers
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

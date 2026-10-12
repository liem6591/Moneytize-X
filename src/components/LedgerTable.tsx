import React, { useState, useMemo } from 'react';
import { Platform } from '../types';
import { AffiliateButton } from './AffiliateButton';
import { ArrowUpDown, ArrowUp, ArrowDown, ShieldCheck, FileText, CheckSquare, Square, Info } from 'lucide-react';

interface LedgerTableProps {
  platforms: Platform[];
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onViewDossier: (platform: Platform) => void;
  selectedCategory: string;
}

type SortField = 'rating' | 'fee' | 'minDeposit' | 'name';
type SortOrder = 'asc' | 'desc';

export const LedgerTable: React.FC<LedgerTableProps> = ({
  platforms,
  compareIds,
  onToggleCompare,
  onViewDossier,
  selectedCategory,
}) => {
  const [sortField, setSortField] = useState<SortField>('rating');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'fee' || field === 'minDeposit' ? 'asc' : 'desc');
    }
  };

  const sortedPlatforms = useMemo(() => {
    return [...platforms].sort((a, b) => {
      let multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortField === 'rating') {
        return (a.rating - b.rating) * multiplier;
      }
      if (sortField === 'fee') {
        return (a.numericFeeSort - b.numericFeeSort) * multiplier;
      }
      if (sortField === 'minDeposit') {
        return (a.numericMinDepositSort - b.numericMinDepositSort) * multiplier;
      }
      if (sortField === 'name') {
        return a.name.localeCompare(b.name) * multiplier;
      }
      return 0;
    });
  }, [platforms, sortField, sortOrder]);

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#A8A29E] inline-block ml-1 opacity-70" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#101826] inline-block ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#101826] inline-block ml-1" />
    );
  };

  return (
    <section id="ledger-table" className="py-12 bg-[#F1EEE4] border-b border-[#D8D2C0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Table Header & Last Updated Stamp */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 gap-4 border-b border-[#D8D2C0]">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#57534E]">
              <span className="w-1.5 h-1.5 bg-[#B8923F] rounded-full inline-block" />
              <span>Financial Platform Comparison Ledger</span>
              {selectedCategory !== 'All' && (
                <span className="bg-[#FAF8F3] px-2 py-0.5 border border-[#D8D2C0] text-[#101826]">
                  Category: {selectedCategory}
                </span>
              )}
            </div>
            <h2 className="font-serif-headline text-2xl sm:text-3xl font-semibold text-[#101826] mt-1.5">
              Quick-Comparison Ledger Table
            </h2>
          </div>

          <div className="flex flex-col sm:items-end text-xs font-mono text-[#57534E]">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#101826]">Ledger Audit:</span>
              <span>September 14, 2026</span>
            </div>
            <div className="text-[11px] text-[#57534E]">
              Verified against SEC, FINRA &amp; FDIC public filings
            </div>
          </div>
        </div>

        {/* Informative Micro-Note */}
        <div className="py-3 flex flex-wrap items-center justify-between text-xs text-[#57534E] font-sans">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#3F6B5D]" />
            <span>Select up to 3 platforms using the checkbox to launch side-by-side comparison.</span>
          </div>
          <div className="font-mono text-[11px]">
            Showing {sortedPlatforms.length} audited platforms
          </div>
        </div>

        {/* Ledger Table Container */}
        <div className="bg-white border border-[#D8D2C0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-[#D8D2C0] text-xs font-mono text-[#101826] uppercase tracking-wider">
                  <th scope="col" className="py-3 px-3 w-12 text-center">
                    <span className="sr-only">Compare</span>
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold">
                    <button
                      onClick={() => handleSort('name')}
                      className="inline-flex items-center hover:text-[#B8923F] cursor-pointer"
                    >
                      Platform {renderSortIndicator('name')}
                    </button>
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold text-center w-28">
                    <button
                      onClick={() => handleSort('rating')}
                      className="inline-flex items-center hover:text-[#B8923F] cursor-pointer"
                    >
                      Rating {renderSortIndicator('rating')}
                    </button>
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold">
                    <button
                      onClick={() => handleSort('fee')}
                      className="inline-flex items-center hover:text-[#B8923F] cursor-pointer"
                    >
                      Transaction Fee {renderSortIndicator('fee')}
                    </button>
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold">
                    <button
                      onClick={() => handleSort('minDeposit')}
                      className="inline-flex items-center hover:text-[#B8923F] cursor-pointer"
                    >
                      Min. Deposit {renderSortIndicator('minDeposit')}
                    </button>
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold min-w-[220px]">
                    Current Offer
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold text-right w-44">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#D8D2C0] text-sm">
                {sortedPlatforms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#57534E] font-sans">
                      No financial platforms match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  sortedPlatforms.map((platform) => {
                    const isCompared = compareIds.includes(platform.id);
                    return (
                      <tr
                        key={platform.id}
                        className={`hover:bg-[#FAF8F3] transition-colors ${
                          platform.isTopPick ? 'bg-[#FAF8F3]/60' : ''
                        }`}
                      >
                        {/* Compare Selection Checkbox */}
                        <td className="py-3.5 px-3 text-center align-middle">
                          <button
                            onClick={() => onToggleCompare(platform.id)}
                            className="text-[#101826] hover:text-[#B8923F] cursor-pointer p-1"
                            title={isCompared ? 'Remove from compare' : 'Add to compare'}
                            aria-label={`Compare ${platform.name}`}
                          >
                            {isCompared ? (
                              <CheckSquare className="w-4 h-4 text-[#B8923F]" />
                            ) : (
                              <Square className="w-4 h-4 text-[#A8A29E]" />
                            )}
                          </button>
                        </td>

                        {/* Platform Details */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 border border-[#D8D2C0] bg-[#FAF8F3] flex items-center justify-center font-mono font-bold text-xs text-[#101826] shrink-0">
                              {platform.logoText}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => onViewDossier(platform)}
                                  className="font-serif-headline font-bold text-base text-[#101826] hover:text-[#B8923F] text-left cursor-pointer transition-colors"
                                >
                                  {platform.name}
                                </button>
                                {platform.isTopPick && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 border border-[#3F6B5D] bg-[#3F6B5D]/10 text-[#3F6B5D] font-semibold uppercase">
                                    Top Pick
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-[#57534E] flex items-center gap-1.5 mt-0.5">
                                <span className="font-sans">{platform.category}</span>
                                <span className="text-[#D8D2C0]">•</span>
                                <span className="font-mono text-[11px] text-[#57534E]">
                                  {platform.regulators.join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Rating */}
                        <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-mono font-bold text-sm text-[#3F6B5D] bg-[#3F6B5D]/10 px-2 py-0.5 border border-[#3F6B5D]/30">
                              {platform.rating.toFixed(1)} / 5.0
                            </span>
                            <span className="text-[10px] font-mono text-[#57534E] mt-0.5">
                              {platform.reviewCount.toLocaleString()} reviews
                            </span>
                          </div>
                        </td>

                        {/* Transaction Fee (Monospace) */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="font-data-mono font-semibold text-[#101826] text-xs sm:text-sm">
                            {platform.transactionFee}
                          </div>
                          <div className="text-[11px] text-[#57534E] font-sans">
                            {platform.featureTags[0]}
                          </div>
                        </td>

                        {/* Minimum Deposit (Monospace) */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="font-data-mono font-medium text-[#101826] text-xs sm:text-sm">
                            {platform.minDeposit}
                          </div>
                          <div className="text-[11px] text-[#57534E] font-sans">
                            Standard account
                          </div>
                        </td>

                        {/* Current Offer */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="text-xs font-medium text-[#101826] leading-snug line-clamp-2">
                            {platform.currentOffer}
                          </div>
                          {platform.offerExpiry && (
                            <div className="text-[10px] font-mono text-[#B8923F] mt-0.5">
                              Exp: {platform.offerExpiry}
                            </div>
                          )}
                        </td>

                        {/* CTA Actions */}
                        <td className="py-3.5 px-4 text-right align-middle whitespace-nowrap">
                          <div className="flex flex-col items-end space-y-1.5">
                            <AffiliateButton
                              slug={platform.affiliateSlug}
                              label="See current offer"
                              variant="table"
                            />
                            <button
                              onClick={() => onViewDossier(platform)}
                              className="text-xs font-mono text-[#57534E] hover:text-[#101826] underline underline-offset-2 cursor-pointer inline-flex items-center gap-0.5"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Read dossier</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Disclaimer */}
          <div className="bg-[#FAF8F3] border-t border-[#D8D2C0] px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-[#57534E] font-sans gap-2">
            <div>
              <span className="font-semibold text-[#101826]">Editorial Transparency:</span> Rankings are determined by verified audits and regulatory standing. We receive affiliate compensation from partnered institutions when readers open funded accounts.
            </div>
            <div className="font-mono whitespace-nowrap text-[#57534E]">
              SEC Rule 206(4)-1 Compliant
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

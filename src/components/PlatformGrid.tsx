import React, { useState, useEffect, useMemo } from 'react';
import { Platform } from '../types';
import { PlatformCard } from './PlatformCard';
import { Layers, ChevronLeft, ChevronRight } from 'lucide-react';

interface PlatformGridProps {
  platforms: Platform[];
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onViewDossier: (platform: Platform) => void;
  selectedCategory: string;
}

export const PlatformGrid: React.FC<PlatformGridProps> = ({
  platforms,
  compareIds,
  onToggleCompare,
  onViewDossier,
  selectedCategory,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [platforms.length, selectedCategory]);

  const totalItems = platforms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedPlatforms = useMemo(() => {
    return platforms.slice(startIndex, endIndex);
  }, [platforms, startIndex, endIndex]);

  return (
    <section id="dossier-grid" className="py-12 bg-[#F1EEE4] border-b border-[#D8D2C0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-[#D8D2C0] gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#57534E]">
              <Layers className="w-3.5 h-3.5 text-[#B8923F]" />
              <span>Platform Investigation Dossiers</span>
            </div>
            <h2 className="font-serif-headline text-2xl sm:text-3xl font-semibold text-[#101826] mt-1.5">
              Audited Platform Catalog
            </h2>
          </div>

          <div className="text-xs font-mono text-[#57534E]">
            Displaying {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} audited institutions
          </div>
        </div>

        {/* Cards Grid */}
        {totalItems === 0 ? (
          <div className="p-12 text-center bg-white border border-[#D8D2C0]">
            <p className="text-[#57534E] font-sans">
              No platform dossiers found matching your current filter. Try resetting your search or category filter.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPlatforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  isCompared={compareIds.includes(platform.id)}
                  onToggleCompare={onToggleCompare}
                  onViewDossier={onViewDossier}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalItems > 0 && (
              <div className="mt-8 pt-6 border-t border-[#D8D2C0] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono text-[#57534E]">
                  Showing {startIndex + 1}–{endIndex} of {totalItems} • Page {safePage} of {totalPages}
                </div>

                <div className="flex items-center gap-4">
                  {/* Page Size Selector */}
                  <div className="flex items-center gap-1.5 text-xs text-[#57534E] font-mono">
                    <span>Show:</span>
                    <div className="inline-flex rounded border border-[#D8D2C0] bg-white p-0.5">
                      {[10, 20, 50].map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setPageSize(size);
                            setCurrentPage(1);
                          }}
                          className={`px-2 py-0.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                            pageSize === size
                              ? 'bg-[#101826] text-white font-bold'
                              : 'text-[#57534E] hover:text-[#101826]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Page Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                      className="px-3 py-1.5 rounded border border-[#D8D2C0] bg-white text-xs font-medium text-[#101826] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage === totalPages}
                      className="px-3 py-1.5 rounded border border-[#D8D2C0] bg-white text-xs font-medium text-[#101826] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
};

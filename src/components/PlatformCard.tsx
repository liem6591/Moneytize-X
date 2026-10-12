import React from 'react';
import { Platform } from '../types';
import { AffiliateButton } from './AffiliateButton';
import { ShieldCheck, ArrowRight, CheckSquare, Square, ExternalLink } from 'lucide-react';

interface PlatformCardProps {
  platform: Platform;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  onViewDossier: (platform: Platform) => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  isCompared,
  onToggleCompare,
  onViewDossier,
}) => {
  return (
    <div className="bg-white border border-[#D8D2C0] flex flex-col justify-between hover:border-[#101826] transition-all relative">
      
      {/* Top Banner / Dossier ID / Rating */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[11px] text-[#57534E] uppercase tracking-wider">
              #{platform.dossierId}
            </span>
            <span className="text-[#D8D2C0]">•</span>
            <span className="text-[11px] font-sans px-2 py-0.5 bg-[#FAF8F3] border border-[#D8D2C0] text-[#101826]">
              {platform.category}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-xs text-[#3F6B5D] bg-[#3F6B5D]/10 px-2 py-0.5 border border-[#3F6B5D]/20">
              {platform.rating.toFixed(1)} ★
            </span>
            <button
              onClick={() => onToggleCompare(platform.id)}
              className="p-1 text-[#57534E] hover:text-[#101826] cursor-pointer"
              title={isCompared ? 'Remove from compare' : 'Add to compare'}
              aria-label={`Compare ${platform.name}`}
            >
              {isCompared ? (
                <CheckSquare className="w-4 h-4 text-[#B8923F]" />
              ) : (
                <Square className="w-4 h-4 text-[#A8A29E]" />
              )}
            </button>
          </div>
        </div>

        {/* Logo Monogram & Name */}
        <div className="flex items-start space-x-3 mt-1">
          <div className="w-11 h-11 border border-[#D8D2C0] bg-[#FAF8F3] flex items-center justify-center font-mono font-bold text-sm text-[#101826] shrink-0">
            {platform.logoText}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif-headline text-lg font-bold text-[#101826] leading-tight">
                {platform.name}
              </h3>
              {platform.isTopPick && (
                <span className="text-[10px] font-mono uppercase bg-[#3F6B5D] text-white px-1.5 py-0.2">
                  Verified Top
                </span>
              )}
            </div>
            <p className="text-xs text-[#57534E] mt-1 line-clamp-2 leading-relaxed">
              {platform.tagline}
            </p>
          </div>
        </div>

        {/* 2 Feature Tags (As specifically requested in prompt: '2 feature tags') */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          <span className="text-[11px] font-sans px-2.5 py-1 bg-[#FAF8F3] border border-[#D8D2C0] text-[#101826]">
            {platform.featureTags[0]}
          </span>
          <span className="text-[11px] font-sans px-2.5 py-1 bg-[#FAF8F3] border border-[#D8D2C0] text-[#101826]">
            {platform.featureTags[1]}
          </span>
        </div>

        {/* Financial Data Ledger Summary (Monospace) */}
        <div className="mt-4 pt-3 border-t border-[#D8D2C0] grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] font-mono text-[#57534E] uppercase block">Base Fee</span>
            <span className="font-data-mono font-semibold text-[#101826]">
              {platform.transactionFee}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#57534E] uppercase block">Min Deposit</span>
            <span className="font-data-mono font-semibold text-[#101826]">
              {platform.minDeposit}
            </span>
          </div>
        </div>

        {/* Current Audited Offer */}
        <div className="mt-3 p-2.5 bg-[#FAF8F3] border-l-2 border-[#B8923F] text-xs">
          <div className="text-[10px] font-mono uppercase font-semibold text-[#B8923F]">
            Current Verified Offer:
          </div>
          <div className="text-[#101826] font-medium mt-0.5 line-clamp-2">
            {platform.currentOffer}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 bg-[#FAF8F3] border-t border-[#D8D2C0] flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDossier(platform)}
          className="text-xs font-mono text-[#101826] hover:text-[#B8923F] font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
        >
          <span>Full review</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        <AffiliateButton
          slug={platform.affiliateSlug}
          label="See offer"
          variant="table"
        />
      </div>

    </div>
  );
};

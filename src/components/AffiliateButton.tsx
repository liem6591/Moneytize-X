import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { getAffiliateUrl, getAffiliateDisclosure } from '../data/affiliates';

interface AffiliateButtonProps {
  slug: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'compact' | 'table';
  className?: string;
  showDisclosureHint?: boolean;
}

export const AffiliateButton: React.FC<AffiliateButtonProps> = ({
  slug,
  label = 'See current offer',
  variant = 'primary',
  className = '',
  showDisclosureHint = false,
}) => {
  const url = getAffiliateUrl(slug);
  const disclosure = getAffiliateDisclosure(slug);

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8923F] cursor-pointer';

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles = 'bg-[#B8923F] hover:bg-[#9E7B31] text-[#101826] px-5 py-2.5 text-sm rounded-none border border-[#8C6B24] font-semibold tracking-tight shadow-sm';
  } else if (variant === 'secondary') {
    variantStyles = 'bg-[#FAF8F3] hover:bg-[#EAE4D4] text-[#101826] px-4 py-2 text-sm border border-[#D8D2C0] font-medium';
  } else if (variant === 'table') {
    variantStyles = 'bg-[#B8923F] hover:bg-[#9E7B31] text-[#101826] px-3.5 py-1.5 text-xs font-semibold rounded-none border border-[#8C6B24] whitespace-nowrap';
  } else {
    variantStyles = 'bg-[#B8923F] hover:bg-[#9E7B31] text-[#101826] px-3 py-1.5 text-xs font-medium border border-[#8C6B24]';
  }

  return (
    <div className="inline-flex flex-col items-start group relative">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`${baseStyles} ${variantStyles} ${className}`}
        title={`Visit partner link: ${url}`}
        aria-label={`${label} (opens partner site in new tab)`}
      >
        <span>{label}</span>
        <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-80" />
      </a>
      {showDisclosureHint && (
        <span className="text-[11px] text-[#57534E] mt-1 flex items-center gap-1 font-mono">
          <ShieldCheck className="w-3 h-3 text-[#3F6B5D]" />
          <span>Affiliate link: {disclosure}</span>
        </span>
      )}
    </div>
  );
};

import React from 'react';
import { Platform } from '../types';
import { AffiliateButton } from './AffiliateButton';
import { 
  X, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  FileText, 
  Clock, 
  Lock, 
  ExternalLink,
  ArrowRight,
  ChevronRight,
  Info
} from 'lucide-react';

interface ReviewModalProps {
  platform: Platform | null;
  allPlatforms: Platform[];
  isOpen: boolean;
  onClose: () => void;
  onSelectAlternative: (alt: Platform) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  platform,
  allPlatforms,
  isOpen,
  onClose,
  onSelectAlternative,
}) => {
  if (!isOpen || !platform) return null;

  const alternatives = allPlatforms.filter((p) =>
    platform.alternatives.includes(p.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101826]/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-[#FAF8F3] border-2 border-[#101826] w-full max-w-5xl shadow-2xl relative max-h-[94vh] flex flex-col">
        
        {/* Dossier Header Bar */}
        <div className="p-4 sm:p-6 border-b border-[#D8D2C0] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 border border-[#D8D2C0] bg-[#FAF8F3] flex items-center justify-center font-mono font-bold text-sm text-[#101826]">
              {platform.logoText}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#57534E]">
                  DOSSIER #{platform.dossierId}
                </span>
                <span className="text-[#D8D2C0]">•</span>
                <span className="text-xs font-mono text-[#3F6B5D] font-bold">
                  AUDITED {platform.lastAuditDate}
                </span>
              </div>
              <h2 className="font-serif-headline text-xl sm:text-2xl font-bold text-[#101826]">
                {platform.name} — Full Platform Review &amp; Safety Audit
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-[#D8D2C0] bg-[#FAF8F3] hover:bg-[#EAE4D4] text-[#101826] cursor-pointer"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="p-4 sm:p-8 overflow-y-auto grow space-y-8 text-[#101826]">
          
          {/* Executive Summary & Rating Card */}
          <div className="bg-white border border-[#D8D2C0] p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase bg-[#FAF8F3] border border-[#D8D2C0] px-2.5 py-1 text-[#57534E]">
                  <span>Category: {platform.category}</span>
                  <span className="text-[#D8D2C0]">|</span>
                  <span>Target: {platform.idealFor}</span>
                </div>
                <h3 className="font-serif-headline text-xl font-bold text-[#101826]">
                  {platform.tagline}
                </h3>
                <p className="text-sm text-[#3A3835] leading-relaxed">
                  {platform.overview}
                </p>
              </div>

              <div className="md:col-span-4 bg-[#FAF8F3] border border-[#D8D2C0] p-4 text-center">
                <div className="text-xs font-mono uppercase text-[#57534E]">Overall Audit Score</div>
                <div className="font-serif-headline text-3xl font-extrabold text-[#3F6B5D] my-1">
                  {platform.scores.overall}<span className="text-lg font-normal text-[#57534E]">/100</span>
                </div>
                <div className="text-xs font-mono text-[#57534E] mb-3">
                  Verified rating: {platform.rating.toFixed(1)} / 5.0 ({platform.reviewCount.toLocaleString()} user audits)
                </div>

                <div className="space-y-1 text-left text-xs border-t border-[#D8D2C0] pt-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#57534E]">Regulatory Safety:</span>
                    <span className="font-bold text-[#101826]">{platform.scores.safety}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#57534E]">Fee Transparency:</span>
                    <span className="font-bold text-[#101826]">{platform.scores.feeTransparency}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#57534E]">Usability &amp; API:</span>
                    <span className="font-bold text-[#101826]">{platform.scores.usability}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Verified Offer Panel */}
          <div className="bg-[#FAF8F3] border-2 border-[#B8923F] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-[#B8923F] text-[#101826] font-mono text-[10px] font-bold uppercase px-2 py-0.5">
                  EXCLUSIVE AUDITED OFFER
                </span>
                {platform.offerExpiry && (
                  <span className="text-xs font-mono text-[#57534E]">Valid through {platform.offerExpiry}</span>
                )}
              </div>
              <div className="font-serif-headline text-lg font-bold text-[#101826]">
                {platform.currentOffer}
              </div>
              <div className="text-xs text-[#57534E] font-sans">
                Terms and minimum requirements apply. Compensation disclosure applies upon verified signup.
              </div>
            </div>

            <AffiliateButton
              slug={platform.affiliateSlug}
              label="Claim this offer"
              variant="primary"
              className="shrink-0"
            />
          </div>

          {/* Pros and Cons Matrix */}
          <div>
            <h4 className="font-serif-headline text-lg font-bold text-[#101826] mb-3">
              Independent Audit Findings: Pros &amp; Cons
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pros */}
              <div className="bg-white border border-[#D8D2C0] p-4">
                <div className="font-mono text-xs uppercase font-bold text-[#3F6B5D] mb-3 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#3F6B5D]" />
                  <span>Audited Advantages ({platform.pros.length})</span>
                </div>
                <ul className="space-y-2 text-sm text-[#3A3835]">
                  {platform.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#3F6B5D] font-bold text-xs mt-1">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="bg-white border border-[#D8D2C0] p-4">
                <div className="font-mono text-xs uppercase font-bold text-[#B8923F] mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#B8923F]" />
                  <span>Documented Tradeoffs ({platform.cons.length})</span>
                </div>
                <ul className="space-y-2 text-sm text-[#57534E]">
                  {platform.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#B8923F] font-bold text-xs mt-1">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Itemized Fee Breakdown Ledger */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif-headline text-lg font-bold text-[#101826]">
                Itemized Fee Breakdown Ledger
              </h4>
              <span className="font-mono text-xs text-[#57534E]">
                Base Fee: <span className="font-data-mono font-bold text-[#101826]">{platform.transactionFee}</span>
              </span>
            </div>

            <div className="bg-white border border-[#D8D2C0] overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F3] border-b border-[#D8D2C0] text-xs font-mono text-[#101826] uppercase">
                    <th className="p-3 font-semibold">Service / Action</th>
                    <th className="p-3 font-semibold">Audited Cost</th>
                    <th className="p-3 font-semibold">Audit Notes &amp; Conditions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D2C0]">
                  {platform.feeBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8F3]/50">
                      <td className="p-3 font-medium text-[#101826]">{item.label}</td>
                      <td className="p-3 font-data-mono font-bold text-[#101826] whitespace-nowrap">{item.value}</td>
                      <td className="p-3 text-xs text-[#57534E] font-sans">{item.notes || 'Standard schedule'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2.5 bg-[#FAF8F3] border-t border-[#D8D2C0] text-[11px] font-mono text-[#57534E] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#3F6B5D]" />
                <span>Fees verified against active broker schedule as of {platform.lastAuditDate}.</span>
              </div>
            </div>
          </div>

          {/* Safety & Licensing Information Box */}
          <div className="bg-white border border-[#D8D2C0] p-5">
            <h4 className="font-serif-headline text-lg font-bold text-[#101826] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#3F6B5D]" />
              <span>Safety, Regulatory Licensing &amp; Custody</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 p-3 bg-[#FAF8F3] border border-[#D8D2C0]">
                <div className="font-mono uppercase font-bold text-[#57534E]">Regulatory Bodies</div>
                <div className="font-sans font-medium text-[#101826] text-sm">
                  {platform.safetyInfo.regulatoryBody}
                </div>
              </div>

              <div className="space-y-1.5 p-3 bg-[#FAF8F3] border border-[#D8D2C0]">
                <div className="font-mono uppercase font-bold text-[#57534E]">Deposit Insurance / Guarantee</div>
                <div className="font-sans font-medium text-[#101826] text-sm leading-relaxed">
                  {platform.safetyInfo.depositInsurance}
                </div>
              </div>

              <div className="space-y-1.5 p-3 bg-[#FAF8F3] border border-[#D8D2C0]">
                <div className="font-mono uppercase font-bold text-[#57534E]">Independent Audit Status</div>
                <div className="font-sans text-[#3A3835]">
                  {platform.safetyInfo.auditStatus}
                </div>
              </div>

              <div className="space-y-1.5 p-3 bg-[#FAF8F3] border border-[#D8D2C0]">
                <div className="font-mono uppercase font-bold text-[#57534E]">Cryptographic &amp; Network Security</div>
                <div className="font-sans text-[#3A3835]">
                  {platform.safetyInfo.dataEncryption}
                </div>
              </div>
            </div>
          </div>

          {/* Platform Screenshot & Dossier Evidence Placeholder */}
          <div>
            <h4 className="font-serif-headline text-lg font-bold text-[#101826] mb-3">
              Platform Interface &amp; Terminal Verification
            </h4>
            <div className="bg-white border border-[#D8D2C0] p-6 text-center space-y-3">
              <div className="w-full h-44 bg-[#FAF8F3] border border-dashed border-[#D8D2C0] flex flex-col items-center justify-center p-4">
                <FileText className="w-8 h-8 text-[#A8A29E] mb-2" />
                <span className="font-mono text-xs text-[#57534E] uppercase font-semibold">
                  AUDITED INTERFACE TELEMETRY CAPTURE #{platform.dossierId}-UI
                </span>
                <span className="text-xs text-[#57534E] max-w-sm mt-1">
                  Verified desktop dashboard and mobile application responsiveness tested on iOS 18, Android 15, and Chromium desktop.
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#57534E]">
                <span>Supported Assets: {platform.supportedAssets.join(', ')}</span>
                <span>•</span>
                <span>Minimum Deposit: {platform.minDeposit}</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Signup Guide */}
          <div>
            <h4 className="font-serif-headline text-lg font-bold text-[#101826] mb-3">
              Step-by-Step Account Opening Guide
            </h4>
            <div className="space-y-3">
              {platform.signupSteps.map((step) => (
                <div key={step.step} className="bg-white border border-[#D8D2C0] p-4 flex items-start space-x-3">
                  <div className="w-7 h-7 bg-[#101826] text-[#F1EEE4] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    0{step.step}
                  </div>
                  <div className="grow">
                    <div className="flex items-center justify-between">
                      <h5 className="font-serif-headline font-bold text-base text-[#101826]">
                        {step.title}
                      </h5>
                      <span className="font-mono text-[11px] text-[#57534E] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#B8923F]" />
                        {step.estimatedTime}
                      </span>
                    </div>
                    <p className="text-xs text-[#3A3835] mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison with Alternatives Block */}
          {alternatives.length > 0 && (
            <div>
              <h4 className="font-serif-headline text-lg font-bold text-[#101826] mb-3">
                Comparison with Top Alternatives
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alternatives.map((alt) => (
                  <div key={alt.id} className="bg-white border border-[#D8D2C0] p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-serif-headline font-bold text-sm text-[#101826]">{alt.name}</span>
                        <span className="font-mono text-xs text-[#3F6B5D]">{alt.rating.toFixed(1)} ★</span>
                      </div>
                      <div className="text-xs text-[#57534E] mt-0.5">
                        Fee: <span className="font-mono text-[#101826]">{alt.transactionFee}</span> • Min: <span className="font-mono text-[#101826]">{alt.minDeposit}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectAlternative(alt)}
                      className="text-xs font-mono text-[#B8923F] hover:text-[#9E7B31] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Compare</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mandatory Risk Disclaimer */}
          <div className="p-4 bg-[#FAF8F3] border border-[#D8D2C0] text-xs text-[#57534E] leading-relaxed font-sans">
            <span className="font-semibold text-[#101826]">Risk Disclaimer:</span> Financial transactions involve capital risk. Past performance does not guarantee future results. Brokerage promotional offers and APY rates are subject to change by issuing institutions at any time without notice. Moneytize X provides editorial reviews for informational purposes and does not provide bespoke financial, legal, or tax advice.
          </div>

        </div>

        {/* Sticky Modal Bottom CTA Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#D8D2C0] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            <div className="font-serif-headline text-base font-bold text-[#101826]">
              Ready to explore {platform.name}?
            </div>
            <div className="text-xs text-[#57534E] font-sans">
              Current promo: <span className="text-[#101826] font-medium">{platform.currentOffer}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#D8D2C0] text-xs font-mono font-medium hover:bg-[#FAF8F3] cursor-pointer"
            >
              Back to Catalog
            </button>
            <AffiliateButton
              slug={platform.affiliateSlug}
              label="See current offer"
              variant="primary"
              className="grow sm:grow-0"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

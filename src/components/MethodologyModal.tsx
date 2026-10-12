import React from 'react';
import { X, BookOpen, ShieldCheck, Scale, FileText, CheckCircle2, Lock, Users } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'methodology' | 'about';
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'methodology',
}) => {
  const [activeTab, setActiveTab] = React.useState<'methodology' | 'about'>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101826]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FAF8F3] border-2 border-[#101826] w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#D8D2C0] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#FAF8F3] border border-[#D8D2C0] flex items-center justify-center text-[#B8923F]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-headline text-xl sm:text-2xl font-bold text-[#101826]">
                Editorial Integrity &amp; Audit Standards
              </h2>
              <p className="text-xs font-mono text-[#57534E]">
                Moneytize X Dossier Methodology &amp; Disclosures
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-[#D8D2C0] bg-[#FAF8F3] hover:bg-[#EAE4D4] text-[#101826] cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#D8D2C0] bg-[#FAF8F3] px-4 sm:px-6 shrink-0">
          <button
            onClick={() => setActiveTab('methodology')}
            className={`py-3 px-4 text-xs font-mono font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'methodology'
                ? 'border-[#101826] text-[#101826] bg-white -mb-px'
                : 'border-transparent text-[#57534E] hover:text-[#101826]'
            }`}
          >
            01. Scoring Rubric &amp; Methodology
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 px-4 text-xs font-mono font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'about'
                ? 'border-[#101826] text-[#101826] bg-white -mb-px'
                : 'border-transparent text-[#57534E] hover:text-[#101826]'
            }`}
          >
            02. About Moneytize X &amp; Mission
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-8 overflow-y-auto grow space-y-6 text-[#101826]">
          
          {activeTab === 'methodology' ? (
            <div className="space-y-6">
              
              <div className="border-b border-[#D8D2C0] pb-4">
                <div className="font-mono text-xs uppercase tracking-wider text-[#57534E]">
                  Audit Framework
                </div>
                <h3 className="font-serif-headline text-2xl font-bold text-[#101826] mt-1">
                  The 100-Point Dossier Evaluation Matrix
                </h3>
                <p className="text-sm text-[#3A3835] mt-2 leading-relaxed">
                  Unlike marketing review portals that sort by highest commission payout, Moneytize X scores financial institutions using a quantitative 5-pillar rubric. A platform cannot buy a higher numerical score or obtain our &quot;Verified Dossier&quot; stamp through commercial arrangements.
                </p>
              </div>

              {/* 5 Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Pillar 1 */}
                <div className="bg-white border border-[#D8D2C0] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#B8923F]">PILLAR 01</span>
                    <span className="font-mono text-xs font-bold text-[#101826]">Weight: 30%</span>
                  </div>
                  <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                    Regulatory Licensing &amp; Custody
                  </h4>
                  <p className="text-xs text-[#3A3835] leading-relaxed">
                    Verification of primary regulatory filings (SEC, FINRA, OCC, CFTC, FCA, FinCEN). We inspect statutory deposit insurance (SIPC, FDIC pass-through), ring-fenced client fund accounts, and third-party annual SOC 2 compliance reports.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="bg-white border border-[#D8D2C0] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#B8923F]">PILLAR 02</span>
                    <span className="font-mono text-xs font-bold text-[#101826]">Weight: 25%</span>
                  </div>
                  <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                    True Fee Transparency
                  </h4>
                  <p className="text-xs text-[#3A3835] leading-relaxed">
                    Uncovering obscure costs: payment for order flow (PFOF) spreads, inactivity surcharges, wire withdrawal fees, margin borrowing markups, and currency conversion spreads.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="bg-white border border-[#D8D2C0] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#B8923F]">PILLAR 03</span>
                    <span className="font-mono text-xs font-bold text-[#101826]">Weight: 20%</span>
                  </div>
                  <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                    Execution Reliability &amp; Infrastructure
                  </h4>
                  <p className="text-xs text-[#3A3835] leading-relaxed">
                    Platform uptime during market volatility, price improvement percentages on equity orders, cryptographic proof-of-reserves (for crypto custody), and multi-factor hardware security (FIDO2/YubiKey).
                  </p>
                </div>

                {/* Pillar 4 */}
                <div className="bg-white border border-[#D8D2C0] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#B8923F]">PILLAR 04</span>
                    <span className="font-mono text-xs font-bold text-[#101826]">Weight: 15%</span>
                  </div>
                  <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                    Product Usability &amp; Workflow
                  </h4>
                  <p className="text-xs text-[#3A3835] leading-relaxed">
                    Account opening friction, KYC turnaround speed, mobile vs. desktop responsive execution, automated direct deposit tools, and research terminal functionality.
                  </p>
                </div>

                {/* Pillar 5 */}
                <div className="bg-white border border-[#D8D2C0] p-4 space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#B8923F]">PILLAR 05</span>
                    <span className="font-mono text-xs font-bold text-[#101826]">Weight: 10%</span>
                  </div>
                  <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                    Customer Recourse &amp; Dispute Resolution
                  </h4>
                  <p className="text-xs text-[#3A3835] leading-relaxed">
                    Availability of live human broker support, average ticket response latency, resolution rates with regulatory ombudsman channels (FINRA BrokerCheck, CFPB Consumer Complaint Database), and account closure ease.
                  </p>
                </div>

              </div>

              {/* Verified Stamp Criteria */}
              <div className="bg-white border-2 border-[#3F6B5D] p-5">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#3F6B5D] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The &quot;Verified Dossier&quot; Standard</span>
                </div>
                <p className="text-xs text-[#3A3835] mt-2 leading-relaxed">
                  Only platforms scoring <strong>95/100 or above</strong> with zero active CFPB or SEC regulatory enforcement actions in the trailing 24 months qualify for our Verified Dossier status. This badge represents an independent seal of operational integrity.
                </p>
              </div>

            </div>
          ) : (
            /* About Section */
            <div className="space-y-6">
              
              <div className="border-b border-[#D8D2C0] pb-4">
                <div className="font-mono text-xs uppercase tracking-wider text-[#57534E]">
                  About The Publication
                </div>
                <h3 className="font-serif-headline text-2xl font-bold text-[#101826] mt-1">
                  Investigate Before You Invest.
                </h3>
                <p className="text-sm text-[#3A3835] mt-2 leading-relaxed">
                  Moneytize X was established to combat the prevalence of opaque affiliate referral sites that push predatory loans, hidden-fee trading apps, and unaudited crypto platforms simply because they pay the highest referral bounty.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white border border-[#D8D2C0] p-5 space-y-3">
                  <h4 className="font-serif-headline text-base font-bold text-[#101826] flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#B8923F]" />
                    <span>How We Make Money</span>
                  </h4>
                  <p className="text-xs text-[#3A3835] leading-relaxed">
                    Moneytize X participates in affiliate marketing programs. When you click through our partner links and open a funded account, we may receive compensation from the issuing company. This supports our independent testing lab at no extra expense to you.
                  </p>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    However, commercial relationships have zero bearing on our editorial scores. If a platform raises its fees or compromises on safety, its score is immediately downgraded regardless of partnership status.
                  </p>
                </div>

                <div className="bg-white border border-[#D8D2C0] p-5 space-y-3">
                  <h4 className="font-serif-headline text-base font-bold text-[#101826] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#3F6B5D]" />
                    <span>Our Editorial Guarantee</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-[#3A3835]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3F6B5D] shrink-0 mt-0.5" />
                      <span>No paid rankings: Placements cannot be bought or bid on.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3F6B5D] shrink-0 mt-0.5" />
                      <span>Direct link fee transparency: All affiliate links are clearly labeled.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3F6B5D] shrink-0 mt-0.5" />
                      <span>Weekly ledger audits against active fee schedules.</span>
                    </li>
                  </ul>
                </div>

              </div>

              <div className="bg-white border border-[#D8D2C0] p-5 text-xs text-[#57534E] font-mono leading-relaxed">
                <div className="font-bold text-[#101826] mb-1 uppercase">Regulatory Contact &amp; Audit Requests</div>
                Moneytize X Editorial Board • Quantitative Financial Research Group • Contact: audit@moneytizex.example • Published under FTC 16 CFR § 255 compliant disclosure framework.
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F3] border-t border-[#D8D2C0] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#101826] text-[#F1EEE4] text-xs font-mono font-medium hover:bg-[#202B3F] cursor-pointer"
          >
            Close Dossier Briefing
          </button>
        </div>

      </div>
    </div>
  );
};

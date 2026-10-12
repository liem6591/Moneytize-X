import React, { useState, useEffect } from 'react';
import { X, Shield, FileText, Scale } from 'lucide-react';

export type LegalTab = 'affiliate' | 'privacy' | 'terms';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'affiliate',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101826]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FAF8F3] border-2 border-[#101826] w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#D8D2C0] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#FAF8F3] border border-[#D8D2C0] flex items-center justify-center text-[#B8923F]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-headline text-xl sm:text-2xl font-bold text-[#101826]">
                Legal Documentation &amp; Disclosures
              </h2>
              <p className="text-xs font-mono text-[#57534E]">
                Moneytize X Compliance Repository • Updated September 2026
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
        <div className="flex border-b border-[#D8D2C0] bg-[#FAF8F3] px-4 sm:px-6 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('affiliate')}
            className={`py-3 px-4 text-xs font-mono font-semibold border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'affiliate'
                ? 'border-[#101826] text-[#101826] bg-white -mb-px'
                : 'border-transparent text-[#57534E] hover:text-[#101826]'
            }`}
          >
            01. Standalone Affiliate Disclosure (FTC)
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 text-xs font-mono font-semibold border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'privacy'
                ? 'border-[#101826] text-[#101826] bg-white -mb-px'
                : 'border-transparent text-[#57534E] hover:text-[#101826]'
            }`}
          >
            02. Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 text-xs font-mono font-semibold border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'terms'
                ? 'border-[#101826] text-[#101826] bg-white -mb-px'
                : 'border-transparent text-[#57534E] hover:text-[#101826]'
            }`}
          >
            03. Terms of Use &amp; Risk Notice
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-8 overflow-y-auto grow space-y-6 text-[#101826] text-sm leading-relaxed">
          
          {/* TAB 1: STANDALONE AFFILIATE DISCLOSURE */}
          {activeTab === 'affiliate' && (
            <div className="space-y-4">
              <div className="border-b border-[#D8D2C0] pb-3">
                <span className="font-mono text-xs uppercase text-[#B8923F] font-bold">
                  Federal Trade Commission (FTC) Compliance Statement
                </span>
                <h3 className="font-serif-headline text-2xl font-bold text-[#101826] mt-1">
                  Comprehensive Affiliate Marketing Disclosure
                </h3>
                <p className="text-xs text-[#57534E] font-mono mt-1">
                  In accordance with 16 CFR Part 255: Guides Concerning the Use of Endorsements and Testimonials in Advertising.
                </p>
              </div>

              <div className="bg-white border border-[#D8D2C0] p-5 space-y-3">
                <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                  1. Nature of Affiliate Links
                </h4>
                <p className="text-xs text-[#3A3835]">
                  Moneytize X includes links to third-party financial institutions and brokerage platforms. Some of these links are affiliate links. This means that if you click on an affiliate link and subsequently open, register, or fund an account, Moneytize X may receive a financial referral fee or commission from the institution.
                </p>
              </div>

              <div className="bg-white border border-[#D8D2C0] p-5 space-y-3">
                <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                  2. Cost Impact to the Consumer
                </h4>
                <p className="text-xs text-[#3A3835]">
                  <strong>You will never pay higher fees or costs by using our affiliate links.</strong> In many instances, our partnership arrangements allow us to negotiate introductory promotions, sign-up bonus credits, or reduced fees that are identical to or more advantageous than opening an account directly.
                </p>
              </div>

              <div className="bg-white border border-[#D8D2C0] p-5 space-y-3">
                <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                  3. Editorial Independence Firewall
                </h4>
                <p className="text-xs text-[#3A3835]">
                  Our editorial research staff evaluates platforms according to our published 5-pillar quantitative rubric. Affiliate partnerships do not influence our assessment of platform safety, fees, or regulatory standing. Advertisers and affiliate networks cannot purchase positive reviews, higher scores, or inclusion in our Top Pick designations.
                </p>
              </div>

              <div className="bg-white border border-[#D8D2C0] p-5 space-y-3">
                <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                  4. Identification of Affiliate Controls
                </h4>
                <p className="text-xs text-[#3A3835]">
                  Throughout this website, action buttons providing outbound partner routing are designated with &quot;See current offer,&quot; &quot;Claim offer,&quot; or a clear external redirect indicator. Each instance includes contextual disclosures reminding readers of our affiliate commercial relationship.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="border-b border-[#D8D2C0] pb-3">
                <span className="font-mono text-xs uppercase text-[#57534E] font-bold">
                  Data Governance
                </span>
                <h3 className="font-serif-headline text-2xl font-bold text-[#101826] mt-1">
                  Privacy Policy
                </h3>
                <p className="text-xs text-[#57534E] font-mono mt-1">
                  Effective Date: September 2026 • Minimalist Data Collection Model
                </p>
              </div>

              <div className="bg-white border border-[#D8D2C0] p-5 space-y-3">
                <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                  1. Information We Do Not Collect
                </h4>
                <p className="text-xs text-[#3A3835]">
                  Moneytize X does not collect or store your Social Security Number, bank account credentials, credit card numbers, or biometric data. All diagnostic quizzes and financial comparison selections run client-side in your local browser session and are never transmitted to our remote servers.
                </p>
              </div>

              <div className="bg-white border border-[#D8D2C0] p-5 space-y-3">
                <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                  2. Referral Tracking Cookies
                </h4>
                <p className="text-xs text-[#3A3835]">
                  When you click an affiliate referral link to visit a reviewed institution, the partner network may place a temporary tracking cookie on your device to attribute your registration back to Moneytize X for commission reporting. These cookies are governed by the respective institution&apos;s privacy policy.
                </p>
              </div>

              <div className="bg-white border border-[#D8D2C0] p-5 space-y-3">
                <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                  3. Newsletter Subscription
                </h4>
                <p className="text-xs text-[#3A3835]">
                  If you voluntarily subscribe to the Weekly Platform Audit Dispatch, we collect only your email address for dispatching publication updates. We never sell, rent, or trade our mailing lists to third-party brokers.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TERMS OF USE & RISK NOTICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="border-b border-[#D8D2C0] pb-3">
                <span className="font-mono text-xs uppercase text-[#57534E] font-bold">
                  User Agreement
                </span>
                <h3 className="font-serif-headline text-2xl font-bold text-[#101826] mt-1">
                  Terms of Use &amp; Capital Risk Disclaimers
                </h3>
              </div>

              <div className="bg-white border border-[#D8D2C0] p-5 space-y-3">
                <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                  1. Informational &amp; Educational Purpose Only
                </h4>
                <p className="text-xs text-[#3A3835]">
                  The content, comparison tables, financial calculators, and platform dossiers published by Moneytize X are provided for general educational and informational purposes only. Nothing on this site constitutes individual investment advice, legal counsel, tax recommendations, or broker solicitation.
                </p>
              </div>

              <div className="bg-white border border-[#D8D2C0] p-5 space-y-3">
                <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                  2. Capital Risk &amp; Market Volatility Warning
                </h4>
                <p className="text-xs text-[#3A3835]">
                  Investing in equities, derivatives, credit instruments, and cryptocurrency involves inherent risk of loss. The value of your investment may fluctuate, and you may lose some or all of your deposited principal. Past historical performance is never an indicator or guarantee of future return.
                </p>
              </div>

              <div className="bg-white border border-[#D8D2C0] p-5 space-y-3">
                <h4 className="font-serif-headline text-base font-bold text-[#101826]">
                  3. Rate and Offer Accuracy
                </h4>
                <p className="text-xs text-[#3A3835]">
                  While our editorial team audits rates, fees, and regulatory statuses regularly, financial institutions frequently alter terms, deposit minimums, and promotional offerings without prior notice. Always inspect the issuing institution&apos;s official schedule of fees before opening an account.
                </p>
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
            Acknowledge &amp; Close
          </button>
        </div>

      </div>
    </div>
  );
};

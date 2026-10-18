import React from 'react';
import { FutureToolsLogo } from './FutureToolsLogo';
import { Sparkles, Mail, ShieldAlert, ShieldCheck, Moon, Sun, Lock } from 'lucide-react';
import { FINANCIAL_CATEGORIES } from '../data/financialPlatforms';

interface FooterProps {
  categories?: string[];
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onSelectCategory: (category: string) => void;
  onOpenSubscribe: () => void;
  onOpenSubmitPlatform?: () => void;
  onNavigateAdmin?: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  darkMode,
  onToggleDarkMode,
  onSelectCategory,
  onOpenSubscribe,
  onOpenSubmitPlatform,
  onNavigateAdmin,
  onOpenAdminLogin,
}) => {
  const activeCategories =
    categories && categories.length > 0
      ? categories
      : (FINANCIAL_CATEGORIES as unknown as string[]);

  const popularSectors = activeCategories.slice(0, 6);
  const alternativeSectors = activeCategories.slice(6, 12);
  const extraSectors = activeCategories.length > 12 ? activeCategories.slice(12) : [];
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200 mt-16">
      {/* Top Banner / Newsletter CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-100 dark:border-slate-800/80">
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-transparent rounded-2xl p-6 sm:p-8 border border-emerald-100 dark:border-emerald-900/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              The Financial Intelligence Dispatch
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Get weekly broker fee audits & 5%+ cash APY alerts
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Independent audit dossiers. Read by over 120,000 retail and private investors.
            </p>
          </div>

          <button
            onClick={onOpenSubscribe}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            Join Free Intelligence Dispatch
          </button>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <FutureToolsLogo size="md" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Moneytize X audits and compares the world's leading stock brokers, high-yield cash accounts, crypto exchanges, and lending apps with transparent fee disclosures.
            </p>
          </div>

          {/* Col 2: Popular Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Popular Financial Sectors
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {popularSectors.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: More Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Alternative &amp; Emerging
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {alternativeSectors.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
              {extraSectors.length > 0 && (
                <li>
                  <button
                    onClick={() => {
                      onSelectCategory('all');
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    + {extraSectors.length} more sectors...
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Editorial & Disclaimers */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Compliance & Editorial
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="#methodology" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Audit Methodology & Scoring
                </a>
              </li>
              <li>
                <a href="#affiliate" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Affiliate Disclosure & Transparency
                </a>
              </li>
              <li>
                <a href="#regulatory" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  SEC, FINRA & FDIC Verification
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Privacy Policy & Data Security
                </a>
              </li>
              {onNavigateAdmin && (
                <li>
                  <button
                    onClick={onNavigateAdmin}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold text-emerald-700 dark:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 mt-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Portal (/admin)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Regulatory & Risk Disclaimers */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 space-y-2 leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-slate-500 dark:text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Editorial Disclosure & Financial Disclaimer</span>
          </div>
          <p>
            Moneytize X is an independent comparison and review directory supported by affiliate partnerships. When you click through our verified links to open accounts, we may receive compensation from partner institutions at no additional cost to you. Our editorial ratings, scores, and fee ledgers remain strictly objective and independent of commercial considerations.
          </p>
          <p>
            Investments in equities, derivatives, foreign currencies, and digital crypto assets carry inherent market risk and may lose value. Nothing on this website constitutes personalized financial, investment, legal, or tax advice. Consult a certified financial planner before making significant financial commitments.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Moneytize X. All rights reserved.</span>
            {onOpenAdminLogin && (
              <button
                onClick={onOpenAdminLogin}
                className="text-slate-300 dark:text-slate-700 hover:text-emerald-500 dark:hover:text-emerald-400 p-0.5 rounded transition-colors cursor-pointer"
                title="Administrator Portal (/admin)"
                aria-label="Admin Portal"
              >
                <Lock className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>Verified Financial Platforms Database</span>
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Giao diện Sáng</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-600" />
                    <span>Giao diện Tối</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

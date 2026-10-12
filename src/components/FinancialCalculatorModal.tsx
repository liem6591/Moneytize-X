import React, { useState, useMemo } from 'react';
import { X, Calculator, DollarSign, TrendingUp, Sparkles, Check } from 'lucide-react';

interface FinancialCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinancialCalculatorModal: React.FC<FinancialCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'apy' | 'feeSavings'>('apy');

  // APY state
  const [initialDeposit, setInitialDeposit] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [years, setYears] = useState<number>(5);
  const [platformApy, setPlatformApy] = useState<number>(5.0); // e.g. High-Yield
  const traditionalApy = 0.01; // typical traditional checking/savings

  // Fee savings state
  const [monthlyTrades, setMonthlyTrades] = useState<number>(15);
  const [legacyTradeFee, setLegacyTradeFee] = useState<number>(6.95);
  const [portfolioSize, setPortfolioSize] = useState<number>(50000);
  const [advisorFeePercent, setAdvisorFeePercent] = useState<number>(1.0); // 1% traditional AUM vs 0.25% robo or 0% self-directed

  // Compound interest calculation
  const apyResults = useMemo(() => {
    const months = years * 12;
    const rPlatform = platformApy / 100 / 12;
    const rTrad = traditionalApy / 100 / 12;

    let balancePlatform = initialDeposit;
    let balanceTrad = initialDeposit;
    let totalDeposited = initialDeposit;

    for (let i = 0; i < months; i++) {
      balancePlatform = (balancePlatform + monthlyContribution) * (1 + rPlatform);
      balanceTrad = (balanceTrad + monthlyContribution) * (1 + rTrad);
      totalDeposited += monthlyContribution;
    }

    const platformInterest = balancePlatform - totalDeposited;
    const tradInterest = balanceTrad - totalDeposited;
    const extraEarnings = platformInterest - tradInterest;

    return {
      totalDeposited,
      balancePlatform: Math.round(balancePlatform),
      platformInterest: Math.round(platformInterest),
      balanceTrad: Math.round(balanceTrad),
      tradInterest: Math.round(tradInterest),
      extraEarnings: Math.round(extraEarnings),
    };
  }, [initialDeposit, monthlyContribution, years, platformApy]);

  // Fee savings calculation
  const feeResults = useMemo(() => {
    const annualTradingSavings = monthlyTrades * legacyTradeFee * 12;
    const roboAdvisoryFee = portfolioSize * 0.0025; // 0.25%
    const traditionalAdvisorFee = portfolioSize * (advisorFeePercent / 100);
    const annualAdvisorySavings = Math.max(0, traditionalAdvisorFee - roboAdvisoryFee);
    const totalAnnualSavings = annualTradingSavings + annualAdvisorySavings;
    const tenYearCompoundSavings = totalAnnualSavings * 10 * 1.35; // with modest compounding

    return {
      annualTradingSavings: Math.round(annualTradingSavings),
      annualAdvisorySavings: Math.round(annualAdvisorySavings),
      totalAnnualSavings: Math.round(totalAnnualSavings),
      tenYearCompoundSavings: Math.round(tenYearCompoundSavings),
    };
  }, [monthlyTrades, legacyTradeFee, portfolioSize, advisorFeePercent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Financial Impact Calculators
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculate real wealth growth & savings by switching to modern FinTech platforms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4 flex gap-2 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('apy')}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === 'apy'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            High-Yield APY vs Traditional Bank
          </button>
          <button
            onClick={() => setActiveTab('feeSavings')}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === 'feeSavings'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Zero-Fee Commission & Advisory Savings
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {activeTab === 'apy' ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Initial Deposit ($)
                  </label>
                  <input
                    type="number"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(Math.max(0, Number(e.target.value)))}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Monthly Contribution ($)
                  </label>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    High-Yield Platform APY (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={platformApy}
                    onChange={(e) => setPlatformApy(Math.max(0.1, Number(e.target.value)))}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Time Horizon (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={years}
                    onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* APY Results Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Additional Earnings with 5.0% FinTech Cash
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                    +${apyResults.extraEarnings.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs">
                  <div>
                    <div className="text-slate-500 dark:text-slate-400">Total Balance (5.0% APY):</div>
                    <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                      ${apyResults.balancePlatform.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      (${apyResults.platformInterest.toLocaleString()} interest earned)
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500 dark:text-slate-400">Traditional Bank (0.01%):</div>
                    <div className="text-lg font-extrabold text-slate-500 dark:text-slate-400 line-through">
                      ${apyResults.balanceTrad.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      (Only ${apyResults.tradInterest.toLocaleString()} interest)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Trades per Month
                  </label>
                  <input
                    type="number"
                    value={monthlyTrades}
                    onChange={(e) => setMonthlyTrades(Math.max(0, Number(e.target.value)))}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Legacy Broker Ticket Charge ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={legacyTradeFee}
                    onChange={(e) => setLegacyTradeFee(Math.max(0, Number(e.target.value)))}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Total Investment Portfolio ($)
                  </label>
                  <input
                    type="number"
                    value={portfolioSize}
                    onChange={(e) => setPortfolioSize(Math.max(0, Number(e.target.value)))}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Traditional Wealth Advisor Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={advisorFeePercent}
                    onChange={(e) => setAdvisorFeePercent(Math.max(0, Number(e.target.value)))}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Fee Results Card */}
              <div className="bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-sky-950/40 dark:to-emerald-950/30 border border-sky-200/80 dark:border-sky-800/60 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                    Total Estimated Annual Fee Savings
                  </span>
                  <span className="text-sm px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                    ${feeResults.totalAnnualSavings.toLocaleString()} / year
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-sky-200/60 dark:border-sky-800/60 text-xs">
                  <div>
                    <div className="text-slate-500 dark:text-slate-400">Zero Commission Savings:</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      ${feeResults.annualTradingSavings.toLocaleString()} / yr
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 dark:text-slate-400">Robo Advisory Fee Savings:</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      ${feeResults.annualAdvisorySavings.toLocaleString()} / yr
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-sky-200/60 dark:border-sky-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    Projected 10-year compounded savings kept in your portfolio: <strong>${feeResults.tenYearCompoundSavings.toLocaleString()}</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};

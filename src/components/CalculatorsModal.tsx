import React, { useState, useMemo } from 'react';
import { X, Calculator, TrendingUp, PiggyBank, DollarSign, Percent, AlertCircle } from 'lucide-react';

interface CalculatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorsModal: React.FC<CalculatorsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'compound' | 'feeSavings'>('compound');

  // Compound Interest State
  const [initialPrincipal, setInitialPrincipal] = useState<number>(5000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(300);
  const [annualRate, setAnnualRate] = useState<number>(7.0);
  const [timeYears, setTimeYears] = useState<number>(10);

  // Fee Savings Calculator State
  const [portfolioSize, setPortfolioSize] = useState<number>(25000);
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(7.0);
  const [highFeePercent, setHighFeePercent] = useState<number>(1.25); // e.g., legacy broker / advisor
  const [lowFeePercent, setLowFeePercent] = useState<number>(0.08); // e.g., low-cost index platform
  const [feeHorizonYears, setFeeHorizonYears] = useState<number>(10);

  if (!isOpen) return null;

  // Compound Interest Calculation
  const compoundResults = useMemo(() => {
    const r = annualRate / 100;
    const n = 12; // monthly
    const t = timeYears;

    // Year-by-year data
    const yearlyBreakdown: { year: number; balance: number; contributions: number; interest: number }[] = [];
    let currentBalance = initialPrincipal;
    let totalDeposited = initialPrincipal;

    for (let y = 1; y <= t; y++) {
      for (let m = 1; m <= 12; m++) {
        currentBalance = (currentBalance + monthlyContribution) * (1 + r / n);
        totalDeposited += monthlyContribution;
      }
      yearlyBreakdown.push({
        year: y,
        balance: Math.round(currentBalance),
        contributions: Math.round(totalDeposited),
        interest: Math.round(currentBalance - totalDeposited),
      });
    }

    const finalBalance = Math.round(currentBalance);
    const finalContributions = Math.round(totalDeposited);
    const finalInterest = Math.round(finalBalance - finalContributions);

    return {
      finalBalance,
      finalContributions,
      finalInterest,
      yearlyBreakdown,
    };
  }, [initialPrincipal, monthlyContribution, annualRate, timeYears]);

  // Fee Savings Calculation
  const feeSavingsResults = useMemo(() => {
    const years = [1, 3, 5, 10, 15, 20];
    const grossRate = annualReturnRate / 100;
    const highDrag = highFeePercent / 100;
    const lowDrag = lowFeePercent / 100;

    const netHighRate = Math.max(0, grossRate - highDrag);
    const netLowRate = Math.max(0, grossRate - lowDrag);

    const horizonData = years.map((y) => {
      // Future value of lump sum
      const highBalance = portfolioSize * Math.pow(1 + netHighRate, y);
      const lowBalance = portfolioSize * Math.pow(1 + netLowRate, y);
      const feeDifference = lowBalance - highBalance;

      return {
        year: y,
        highBalance: Math.round(highBalance),
        lowBalance: Math.round(lowBalance),
        feeDifference: Math.round(feeDifference),
      };
    });

    const selectedHorizonRow =
      horizonData.find((d) => d.year === feeHorizonYears) ||
      horizonData[horizonData.length - 1];

    return {
      horizonData,
      selectedHorizonRow,
    };
  }, [portfolioSize, annualReturnRate, highFeePercent, lowFeePercent, feeHorizonYears]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101826]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FAF8F3] border-2 border-[#101826] w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#D8D2C0] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#FAF8F3] border border-[#D8D2C0] flex items-center justify-center text-[#B8923F]">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-headline text-xl sm:text-2xl font-bold text-[#101826]">
                Financial Calculation Engines
              </h2>
              <p className="text-xs font-mono text-[#57534E]">
                Independent Math Tools • Zero Promotional Distortion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-[#D8D2C0] bg-[#FAF8F3] hover:bg-[#EAE4D4] text-[#101826] cursor-pointer"
            aria-label="Close calculators"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#D8D2C0] bg-[#FAF8F3] px-4 sm:px-6 shrink-0">
          <button
            onClick={() => setActiveTab('compound')}
            className={`py-3 px-4 text-xs font-mono font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'compound'
                ? 'border-[#101826] text-[#101826] bg-white -mb-px'
                : 'border-transparent text-[#57534E] hover:text-[#101826]'
            }`}
          >
            01. Compound Growth Engine
          </button>
          <button
            onClick={() => setActiveTab('feeSavings')}
            className={`py-3 px-4 text-xs font-mono font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'feeSavings'
                ? 'border-[#101826] text-[#101826] bg-white -mb-px'
                : 'border-transparent text-[#57534E] hover:text-[#101826]'
            }`}
          >
            02. Platform Fee Drag &amp; Savings
          </button>
        </div>

        {/* Calculator Body */}
        <div className="p-4 sm:p-6 overflow-y-auto grow space-y-6">
          
          {/* TAB 1: COMPOUND INTEREST */}
          {activeTab === 'compound' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Inputs Column */}
                <div className="md:col-span-5 bg-white border border-[#D8D2C0] p-4 sm:p-5 space-y-4">
                  <div className="text-xs font-mono uppercase text-[#57534E] border-b border-[#D8D2C0] pb-2 font-semibold">
                    Parameters &amp; Assumptions
                  </div>

                  {/* Initial Principal */}
                  <div>
                    <label className="block text-xs font-mono text-[#101826] mb-1">
                      Initial Capital ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-mono text-[#57534E]">$</span>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={initialPrincipal}
                        onChange={(e) => setInitialPrincipal(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-7 pr-3 py-1.5 text-xs font-data-mono bg-[#FAF8F3] border border-[#D8D2C0] focus:outline-none focus:border-[#B8923F]"
                      />
                    </div>
                  </div>

                  {/* Monthly Contribution */}
                  <div>
                    <label className="block text-xs font-mono text-[#101826] mb-1">
                      Monthly Deposit ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-mono text-[#57534E]">$</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-7 pr-3 py-1.5 text-xs font-data-mono bg-[#FAF8F3] border border-[#D8D2C0] focus:outline-none focus:border-[#B8923F]"
                      />
                    </div>
                  </div>

                  {/* Annual Return Rate */}
                  <div>
                    <div className="flex justify-between text-xs font-mono text-[#101826] mb-1">
                      <span>Assumed Annual Return:</span>
                      <span className="font-bold">{annualRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="0.5"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(Number(e.target.value))}
                      className="w-full accent-[#B8923F] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#57534E] mt-0.5">
                      <span>1% (Cash/Bonds)</span>
                      <span>7% (Hist. Equity)</span>
                      <span>15%</span>
                    </div>
                  </div>

                  {/* Time Horizon */}
                  <div>
                    <div className="flex justify-between text-xs font-mono text-[#101826] mb-1">
                      <span>Time Horizon:</span>
                      <span className="font-bold">{timeYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={timeYears}
                      onChange={(e) => setTimeYears(Number(e.target.value))}
                      className="w-full accent-[#101826] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#57534E] mt-0.5">
                      <span>1 yr</span>
                      <span>15 yrs</span>
                      <span>30 yrs</span>
                    </div>
                  </div>
                </div>

                {/* Results Column */}
                <div className="md:col-span-7 space-y-4">
                  
                  {/* Summary Outcome Box */}
                  <div className="bg-white border-2 border-[#101826] p-5">
                    <div className="text-xs font-mono uppercase text-[#57534E]">
                      Projected Portfolio Value After {timeYears} Years
                    </div>
                    <div className="font-data-mono text-3xl sm:text-4xl font-extrabold text-[#101826] mt-1">
                      ${compoundResults.finalBalance.toLocaleString()}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#D8D2C0] text-xs">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#57534E] block">Total Principal Deposited</span>
                        <span className="font-data-mono font-bold text-[#101826]">
                          ${compoundResults.finalContributions.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#57534E] block">Compound Interest Yield</span>
                        <span className="font-data-mono font-bold text-[#3F6B5D]">
                          +${compoundResults.finalInterest.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress visual bar */}
                    <div className="mt-4 space-y-1">
                      <div className="w-full bg-[#FAF8F3] h-3 border border-[#D8D2C0] flex overflow-hidden">
                        <div
                          className="bg-[#101826] h-full"
                          style={{
                            width: `${(compoundResults.finalContributions / compoundResults.finalBalance) * 100}%`,
                          }}
                          title="Contributions"
                        />
                        <div
                          className="bg-[#3F6B5D] h-full"
                          style={{
                            width: `${(compoundResults.finalInterest / compoundResults.finalBalance) * 100}%`,
                          }}
                          title="Compound Interest"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-[#57534E]">
                        <span>■ Principal ({Math.round((compoundResults.finalContributions / compoundResults.finalBalance) * 100)}%)</span>
                        <span className="text-[#3F6B5D]">■ Compounded Growth ({Math.round((compoundResults.finalInterest / compoundResults.finalBalance) * 100)}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Year by Year Sample Ledger */}
                  <div className="bg-white border border-[#D8D2C0] p-4">
                    <div className="text-xs font-mono uppercase text-[#57534E] mb-2 font-semibold">
                      Milestone Projection Ledger (Sample Years)
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse font-data-mono">
                        <thead>
                          <tr className="border-b border-[#D8D2C0] bg-[#FAF8F3] text-[#57534E]">
                            <th className="py-1.5 px-2">Year</th>
                            <th className="py-1.5 px-2">Total Deposited</th>
                            <th className="py-1.5 px-2">Total Interest</th>
                            <th className="py-1.5 px-2 font-bold text-[#101826]">Ending Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D8D2C0]">
                          {compoundResults.yearlyBreakdown
                            .filter((_, i) => i === 0 || (i + 1) % 3 === 0 || i === timeYears - 1)
                            .map((row) => (
                              <tr key={row.year} className="hover:bg-[#FAF8F3]">
                                <td className="py-1 px-2 font-mono">Year {row.year}</td>
                                <td className="py-1 px-2">${row.contributions.toLocaleString()}</td>
                                <td className="py-1 px-2 text-[#3F6B5D]">+${row.interest.toLocaleString()}</td>
                                <td className="py-1 px-2 font-bold text-[#101826]">${row.balance.toLocaleString()}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: FEE SAVINGS CALCULATOR */}
          {activeTab === 'feeSavings' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Inputs Column */}
                <div className="md:col-span-5 bg-white border border-[#D8D2C0] p-4 sm:p-5 space-y-4">
                  <div className="text-xs font-mono uppercase text-[#57534E] border-b border-[#D8D2C0] pb-2 font-semibold">
                    Fee Comparison Assumptions
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#101826] mb-1">
                      Portfolio Capital ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-mono text-[#57534E]">$</span>
                      <input
                        type="number"
                        min="1000"
                        step="5000"
                        value={portfolioSize}
                        onChange={(e) => setPortfolioSize(Math.max(100, Number(e.target.value)))}
                        className="w-full pl-7 pr-3 py-1.5 text-xs font-data-mono bg-[#FAF8F3] border border-[#D8D2C0] focus:outline-none focus:border-[#B8923F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#101826] mb-1">
                      Benchmark Return (Pre-Fee %)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={annualReturnRate}
                      onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs font-data-mono bg-[#FAF8F3] border border-[#D8D2C0] focus:outline-none focus:border-[#B8923F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#101826] mb-1">
                      High-Fee Platform (e.g. Traditional Broker AUM)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.05"
                        value={highFeePercent}
                        onChange={(e) => setHighFeePercent(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs font-data-mono bg-[#FAF8F3] border border-[#D8D2C0] focus:outline-none focus:border-[#B8923F]"
                      />
                      <span className="text-xs font-mono">%</span>
                    </div>
                    <span className="text-[10px] text-[#57534E] mt-0.5 block">Includes 1% advisor fee + mutual fund drag</span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#101826] mb-1">
                      Low-Cost Platform (e.g. Direct Indexing / $0)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.01"
                        value={lowFeePercent}
                        onChange={(e) => setLowFeePercent(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs font-data-mono bg-[#FAF8F3] border border-[#D8D2C0] focus:outline-none focus:border-[#B8923F]"
                      />
                      <span className="text-xs font-mono">%</span>
                    </div>
                    <span className="text-[10px] text-[#57534E] mt-0.5 block">Ultra-low ETF expense ratio (0.08% avg)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#101826] mb-1">
                      Horizon: {feeHorizonYears} Years
                    </label>
                    <div className="flex gap-1.5">
                      {[3, 5, 10, 15, 20].map((yr) => (
                        <button
                          key={yr}
                          onClick={() => setFeeHorizonYears(yr)}
                          className={`px-2.5 py-1 text-xs font-mono border cursor-pointer ${
                            feeHorizonYears === yr
                              ? 'bg-[#101826] text-white border-[#101826]'
                              : 'bg-[#FAF8F3] text-[#101826] border-[#D8D2C0] hover:border-[#101826]'
                          }`}
                        >
                          {yr}y
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Results Column */}
                <div className="md:col-span-7 space-y-4">
                  
                  {/* Total Savings Hero Card */}
                  <div className="bg-white border-2 border-[#3F6B5D] p-5">
                    <div className="text-xs font-mono uppercase text-[#3F6B5D] font-bold">
                      Calculated Fee Savings Kept in Your Account
                    </div>
                    <div className="font-data-mono text-3xl sm:text-4xl font-extrabold text-[#3F6B5D] mt-1">
                      +${feeSavingsResults.selectedHorizonRow.feeDifference.toLocaleString()}
                    </div>
                    <p className="text-xs text-[#57534E] mt-1">
                      Over {feeHorizonYears} years, moving from a {highFeePercent}% fee platform to a {lowFeePercent}% low-cost platform preserves this exact capital from fee compounding drag.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#D8D2C0] text-xs font-data-mono">
                      <div className="p-3 bg-[#FAF8F3] border border-[#D8D2C0]">
                        <span className="text-[10px] font-mono text-[#57534E] uppercase block">Low-Fee Platform Balance</span>
                        <span className="text-base font-bold text-[#101826]">
                          ${feeSavingsResults.selectedHorizonRow.lowBalance.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-3 bg-[#FAF8F3] border border-[#D8D2C0]">
                        <span className="text-[10px] font-mono text-[#57534E] uppercase block">High-Fee Platform Balance</span>
                        <span className="text-base font-bold text-[#A8A29E]">
                          ${feeSavingsResults.selectedHorizonRow.highBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Year Fee Drag Horizon Table */}
                  <div className="bg-white border border-[#D8D2C0] p-4">
                    <div className="text-xs font-mono uppercase text-[#57534E] mb-2 font-semibold">
                      Multi-Year Fee Erosion Projection
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse font-data-mono">
                        <thead>
                          <tr className="border-b border-[#D8D2C0] bg-[#FAF8F3] text-[#57534E]">
                            <th className="py-1.5 px-2">Horizon</th>
                            <th className="py-1.5 px-2">High-Fee ({highFeePercent}%)</th>
                            <th className="py-1.5 px-2">Low-Fee ({lowFeePercent}%)</th>
                            <th className="py-1.5 px-2 font-bold text-[#3F6B5D]">Money Saved</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D8D2C0]">
                          {feeSavingsResults.horizonData.map((row) => (
                            <tr key={row.year} className="hover:bg-[#FAF8F3]">
                              <td className="py-1.5 px-2 font-mono">{row.year} Years</td>
                              <td className="py-1.5 px-2 text-[#57534E]">${row.highBalance.toLocaleString()}</td>
                              <td className="py-1.5 px-2 text-[#101826] font-medium">${row.lowBalance.toLocaleString()}</td>
                              <td className="py-1.5 px-2 font-bold text-[#3F6B5D]">
                                +${row.feeDifference.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Mandatory Risk and Model Disclaimer */}
          <div className="p-3 bg-[#FAF8F3] border border-[#D8D2C0] flex items-start space-x-2 text-[11px] text-[#57534E] leading-relaxed">
            <AlertCircle className="w-4 h-4 text-[#B8923F] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#101826]">Calculation Disclaimer:</span> Projections are mathematical approximations based strictly on steady compounded returns. Actual market returns fluctuate and may be negative. Taxes, trading bid-ask spreads, and inflation adjustments are not reflected. This tool does not constitute investment advice or a guarantee of asset accumulation.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

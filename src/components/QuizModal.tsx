import React, { useState } from 'react';
import { Platform } from '../types';
import { AffiliateButton } from './AffiliateButton';
import { X, HelpCircle, Check, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  platforms: Platform[];
  onViewDossier: (platform: Platform) => void;
}

interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    matchCategories?: string[];
    matchFeature?: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'goal',
    title: 'What is your primary financial objective right now?',
    subtitle: 'Select the activity you plan to conduct most frequently.',
    options: [
      {
        label: 'Trade Stocks, ETFs, or Options',
        description: 'Building an investment portfolio or executing equity and derivatives trades.',
        matchCategories: ['Stock trading'],
      },
      {
        label: 'Earn High Yield on Liquid Cash or Global Transfers',
        description: 'Parking cash reserves in top APY accounts or moving funds across borders.',
        matchCategories: ['E-wallets'],
      },
      {
        label: 'Consolidate Debt or Finance a Major Expense',
        description: 'Fixed-rate installment personal borrowing with zero origination penalty.',
        matchCategories: ['Consumer lending'],
      },
      {
        label: 'Earn Everyday Rewards or Intro 0% APR Financing',
        description: 'Maximizing cashback, travel points, and interest-free purchases.',
        matchCategories: ['Credit cards'],
      },
      {
        label: 'Purchase & Safeguard Digital Assets / Crypto',
        description: 'Spot trading Bitcoin, Ethereum, and cold-storage custody.',
        matchCategories: ['Crypto'],
      },
    ],
  },
  {
    id: 'experience',
    title: 'What is your familiarity with financial platforms?',
    subtitle: 'This helps us filter out overly complex or under-featured interfaces.',
    options: [
      {
        label: 'Beginner / Hands-Off Investor',
        description: 'I want clean, automated simplicity with zero hidden traps or complex screens.',
        matchFeature: 'beginner',
      },
      {
        label: 'Intermediate Self-Directed User',
        description: 'I manage my own finances, check charts, and compare rates directly.',
        matchFeature: 'intermediate',
      },
      {
        label: 'Advanced Trader / High-Net-Worth Planner',
        description: 'I require Level 2 depth, institutional custody, or multi-contract execution.',
        matchFeature: 'advanced',
      },
    ],
  },
  {
    id: 'deposit',
    title: 'What is your planned opening deposit or balance?',
    subtitle: 'We ensure recommendations carry appropriate initial funding minimums.',
    options: [
      {
        label: 'Under $100 (Micro / Test Balance)',
        description: 'Looking to start small without mandatory minimum deposit requirements.',
        matchFeature: 'micro',
      },
      {
        label: '$100 to $1,000 (Moderate Balance)',
        description: 'Ready to fund a standard working account and claim sign-up rewards.',
        matchFeature: 'moderate',
      },
      {
        label: '$1,000+ (Substantial Allocation)',
        description: 'Looking for tier-1 yields, prime interest rates, and priority customer service.',
        matchFeature: 'substantial',
      },
    ],
  },
  {
    id: 'priority',
    title: 'What matters most in your ideal platform?',
    subtitle: 'Every platform involves tradeoffs — pick your non-negotiable factor.',
    options: [
      {
        label: 'Absolute Lowest Transaction Fees',
        description: '$0 commission, zero account maintenance, and minimal ongoing drag.',
        matchFeature: 'low_fees',
      },
      {
        label: 'Highest Yield, Rewards & Sign-Up Incentives',
        description: 'Competitive APY on uninvested cash or generous welcome bonus tiers.',
        matchFeature: 'rewards',
      },
      {
        label: 'Maximum Safety, Regulatory Rigor & Insurance',
        description: 'Top-tier SIPC/FDIC backing, SOC 2 audits, and clean regulatory history.',
        matchFeature: 'safety',
      },
    ],
  },
];

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  platforms,
  onViewDossier,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQuestion = QUESTIONS[currentStep];

  const handleSelectOption = (optionIndex: number) => {
    const updated = { ...answers, [currentQuestion.id]: optionIndex };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  // Determine recommendations based on answers
  const getRecommendations = (): Platform[] => {
    const goalOptionIndex = answers['goal'] ?? 0;
    const goalOption = QUESTIONS[0].options[goalOptionIndex];
    const targetCategories = goalOption?.matchCategories || ['Stock trading'];

    let matched = platforms.filter((p) => targetCategories.includes(p.category));

    if (matched.length === 0) {
      matched = platforms;
    }

    // Sort by relevance to priority
    const priorityIndex = answers['priority'] ?? 0;
    matched.sort((a, b) => {
      if (priorityIndex === 0) {
        // Lowest fees
        return a.numericFeeSort - b.numericFeeSort;
      } else if (priorityIndex === 1) {
        // Rewards / rating
        return b.rating - a.rating;
      } else {
        // Safety
        return b.scores.safety - a.scores.safety;
      }
    });

    return matched.slice(0, 2);
  };

  const recommendedPlatforms = getRecommendations();
  const topMatch = recommendedPlatforms[0] || platforms[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101826]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FAF8F3] border-2 border-[#101826] w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#D8D2C0] bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#FAF8F3] border border-[#D8D2C0] flex items-center justify-center text-[#B8923F]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-headline text-xl font-bold text-[#101826]">
                Find Your Ideal Platform
              </h2>
              <p className="text-xs font-mono text-[#57534E]">
                Diagnostic Questionnaire • 4 Brief Questions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-[#D8D2C0] bg-[#FAF8F3] hover:bg-[#EAE4D4] text-[#101826] cursor-pointer"
            aria-label="Close quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="p-4 sm:p-8 overflow-y-auto grow">
          {!isCompleted ? (
            <div className="space-y-6">
              
              {/* Progress Indicator */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-[#57534E]">
                  <span>QUESTION {currentStep + 1} OF {QUESTIONS.length}</span>
                  <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% COMPLETE</span>
                </div>
                <div className="w-full bg-[#D8D2C0] h-1.5">
                  <div
                    className="bg-[#B8923F] h-1.5 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Headline */}
              <div>
                <h3 className="font-serif-headline text-2xl font-bold text-[#101826] leading-tight">
                  {currentQuestion.title}
                </h3>
                <p className="text-sm text-[#57534E] mt-1">
                  {currentQuestion.subtitle}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-[#101826] bg-white shadow-xs ring-1 ring-[#101826]'
                          : 'border-[#D8D2C0] bg-white hover:border-[#B8923F] hover:bg-[#FAF8F3]'
                      }`}
                    >
                      <div>
                        <div className="font-serif-headline font-bold text-base text-[#101826]">
                          {option.label}
                        </div>
                        <div className="text-xs text-[#57534E] mt-1 leading-relaxed">
                          {option.description}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 border rounded-none flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-[#101826] bg-[#101826] text-white'
                            : 'border-[#D8D2C0]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Back navigation if past step 0 */}
              {currentStep > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="text-xs font-mono text-[#57534E] hover:text-[#101826] cursor-pointer"
                  >
                    ← Back to previous question
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6">
              
              <div className="border-b border-[#D8D2C0] pb-4">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#3F6B5D] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dossier Match Complete</span>
                </div>
                <h3 className="font-serif-headline text-2xl font-bold text-[#101826] mt-1">
                  Recommended Platform: {topMatch.name}
                </h3>
                <p className="text-sm text-[#57534E] mt-1">
                  Based on your goals, capital threshold, and priorities, our editorial audit engine matches you with:
                </p>
              </div>

              {/* Top Recommended Card */}
              <div className="bg-white border-2 border-[#101826] p-5 relative shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 border border-[#D8D2C0] bg-[#FAF8F3] flex items-center justify-center font-mono font-bold text-sm text-[#101826]">
                      {topMatch.logoText}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-serif-headline text-xl font-bold text-[#101826]">
                          {topMatch.name}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#3F6B5D] bg-[#3F6B5D]/10 px-2 py-0.5 border border-[#3F6B5D]/20">
                          {topMatch.rating.toFixed(1)} ★
                        </span>
                      </div>
                      <span className="text-xs text-[#57534E]">{topMatch.category}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono uppercase text-[#3F6B5D] font-bold bg-[#3F6B5D]/10 px-2.5 py-1 border border-[#3F6B5D]">
                    98% Match
                  </span>
                </div>

                <p className="text-xs text-[#3A3835] mt-3 leading-relaxed">
                  {topMatch.overview}
                </p>

                {/* Match criteria badges */}
                <div className="mt-4 pt-3 border-t border-[#D8D2C0] grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#57534E] block">Base Fee</span>
                    <span className="font-data-mono font-bold text-[#101826]">{topMatch.transactionFee}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#57534E] block">Min Deposit</span>
                    <span className="font-data-mono font-bold text-[#101826]">{topMatch.minDeposit}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-mono uppercase text-[#57534E] block">Regulatory Safety</span>
                    <span className="font-mono font-bold text-[#3F6B5D]">{topMatch.regulators.join(', ')}</span>
                  </div>
                </div>

                {/* Offer Box */}
                <div className="mt-4 p-3 bg-[#FAF8F3] border-l-2 border-[#B8923F]">
                  <div className="text-[10px] font-mono uppercase font-bold text-[#B8923F]">
                    Current Verified Offer:
                  </div>
                  <div className="text-xs font-medium text-[#101826] mt-0.5">
                    {topMatch.currentOffer}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-col sm:flex-row items-center gap-2">
                  <AffiliateButton
                    slug={topMatch.affiliateSlug}
                    label="See current offer"
                    variant="primary"
                    className="w-full sm:w-auto text-center grow"
                  />
                  <button
                    onClick={() => {
                      onViewDossier(topMatch);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-mono font-semibold border border-[#D8D2C0] hover:bg-[#FAF8F3] text-[#101826] cursor-pointer"
                  >
                    Read Full Dossier
                  </button>
                </div>
              </div>

              {/* Runner Up if available */}
              {recommendedPlatforms.length > 1 && (
                <div className="p-4 bg-white border border-[#D8D2C0] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#57534E] block">Runner-Up Alternative:</span>
                    <div className="font-serif-headline font-bold text-sm text-[#101826]">
                      {recommendedPlatforms[1].name} ({recommendedPlatforms[1].rating.toFixed(1)} ★)
                    </div>
                    <span className="text-xs text-[#57534E]">{recommendedPlatforms[1].transactionFee} • {recommendedPlatforms[1].featureTags[0]}</span>
                  </div>
                  <button
                    onClick={() => {
                      onViewDossier(recommendedPlatforms[1]);
                      onClose();
                    }}
                    className="text-xs font-mono text-[#B8923F] hover:underline cursor-pointer"
                  >
                    Inspect Dossier →
                  </button>
                </div>
              )}

              {/* Reset option */}
              <div className="text-center pt-2">
                <button
                  onClick={handleReset}
                  className="text-xs font-mono text-[#57534E] hover:text-[#101826] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake diagnostic quiz with different criteria</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

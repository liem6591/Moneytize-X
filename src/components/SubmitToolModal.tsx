import React, { useState } from 'react';
import { X, Building2, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { FinancialPlatform, FinancialFeeTier } from '../types';
import { FINANCIAL_CATEGORIES } from '../data/financialPlatforms';

interface SubmitPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (platform: Partial<FinancialPlatform>) => void;
  categories?: string[];
}

export const SubmitToolModal: React.FC<SubmitPlatformModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
}) => {
  const activeCategories = categories && categories.length > 0 ? categories : (FINANCIAL_CATEGORIES as unknown as string[]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<string>(activeCategories[0]);
  const [feeTier, setFeeTier] = useState<FinancialFeeTier>('Zero Fee');
  const [feeHighlight, setFeeHighlight] = useState('');
  const [yieldAPY, setYieldAPY] = useState('');
  const [regulatoryStatus, setRegulatoryStatus] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    onSubmit({
      name,
      url,
      category,
      feeTier,
      feeHighlight: feeHighlight || (feeTier === 'Zero Fee' ? '$0 / trade' : 'Low Fee'),
      yieldAPY: yieldAPY || undefined,
      regulatoryStatus: regulatoryStatus || 'Under Review',
      description,
      fullDescription: description,
      dateAdded: new Date().toISOString().split('T')[0],
      logo: {
        type: 'text',
        text: name.substring(0, 2).toUpperCase(),
        bg: '#10B981',
        color: '#FFFFFF',
      },
      tags: [category, feeTier],
      pros: ['Fast onboarding and transparent fee disclosures', 'Modern web & mobile interface'],
      cons: ['New platform under ongoing editorial review'],
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setName('');
      setUrl('');
      setDescription('');
      setFeeHighlight('');
      setYieldAPY('');
      setRegulatoryStatus('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit a Financial Platform
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Get your FinTech app, broker, or crypto protocol audited and listed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Platform Submitted!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your platform has been added to the directory and queued for verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Platform Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Trading, VaultCash, Mercury"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Website URL *
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourfinanceplatform.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                >
                  {activeCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Fee Tier
                </label>
                <select
                  value={feeTier}
                  onChange={(e) => setFeeTier(e.target.value as FinancialFeeTier)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                >
                  <option value="Zero Fee">Zero Fee</option>
                  <option value="Commission Free">Commission Free</option>
                  <option value="Low Fee">Low Fee</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Subscription">Subscription</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Fee Highlight
                </label>
                <input
                  type="text"
                  value={feeHighlight}
                  onChange={(e) => setFeeHighlight(e.target.value)}
                  placeholder="e.g. $0 / trade or 0.25% AUM"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cash APY / Yield (Optional)
                </label>
                <input
                  type="text"
                  value={yieldAPY}
                  onChange={(e) => setYieldAPY(e.target.value)}
                  placeholder="e.g. 5.10% APY"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Regulation & Insurance
              </label>
              <input
                type="text"
                value={regulatoryStatus}
                onChange={(e) => setRegulatoryStatus(e.target.value)}
                placeholder="e.g. SEC & FINRA, FDIC Insured via partner bank"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Short Description *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the platform's primary value proposition, target user base, and unique features..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                Submit Platform
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

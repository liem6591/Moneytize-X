import React, { useState, useEffect, useRef } from 'react';
import { FutureToolsLogo } from './FutureToolsLogo';
import { Moon, Sun, ChevronDown, Plus, Sparkles, Newspaper, BookOpen, Calculator, ShieldCheck, Menu, X, Scale, Flame } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSubscribe: () => void;
  onOpenSubmitPlatform: () => void;
  onOpenCalculators?: () => void;
  onSelectCategory?: (category: string) => void;
  onSelectFilter?: (filter: string) => void;
  comparedCount?: number;
  onOpenCompare?: () => void;
  onNavigateAdmin?: () => void;
  adminEmail?: string | null;
  adminPhotoUrl?: string | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSubscribe,
  onOpenSubmitPlatform,
  onOpenCalculators,
  onSelectCategory,
  onSelectFilter,
  comparedCount = 0,
  onOpenCompare,
  onNavigateAdmin,
  adminEmail,
  adminPhotoUrl,
  onSignOut,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center group">
            <FutureToolsLogo size="md" />
          </a>
        </div>

        {/* Center: Desktop Navigation */}
        <nav ref={navRef} className="hidden md:flex items-center gap-1 lg:gap-2">
          {/* Recommended right now anchor */}
          <button
            onClick={() => {
              const el = document.getElementById('recommended');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-3.5 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Recommended</span>
          </button>

          {/* Market News Link */}
          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory('Market Analysis');
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
            className="px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            Market News
          </button>

          {/* Platforms Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('platforms')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                activeDropdown === 'platforms'
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Platforms
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'platforms' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'platforms' && (
              <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl py-2 z-50 text-sm animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={() => {
                    if (onSelectFilter) onSelectFilter('all');
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  All Platforms (4,500+)
                </button>
                <button
                  onClick={() => {
                    if (onSelectFilter) onSelectFilter("Editor's Picks");
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-1 mr-1" />
                  Editor's Verified Picks
                </button>
                <button
                  onClick={() => {
                    if (onSelectFilter) onSelectFilter('Commission Free');
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-1 mr-1" />
                  Zero-Commission Brokers
                </button>
                <button
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory('High-Yield Savings');
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block ml-1 mr-1" />
                  High-Yield Cash (4.5%+ APY)
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <button
                  onClick={() => {
                    onOpenSubmitPlatform();
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-medium cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Submit a Financial Platform
                </button>
              </div>
            )}
          </div>

          {/* Editorial Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('editorial')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                activeDropdown === 'editorial'
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Editorial
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'editorial' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'editorial' && (
              <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl py-2 z-50 text-sm animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={() => {
                    onOpenSubscribe();
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <Newspaper className="w-4 h-4 text-emerald-500" />
                  Weekly Financial Intelligence
                </button>
                <a
                  href="#methodology"
                  onClick={() => setActiveDropdown(null)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer block"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                  Audit Methodology & Safety
                </a>
                <a
                  href="#best-apps"
                  onClick={() => setActiveDropdown(null)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer block"
                >
                  <BookOpen className="w-4 h-4 text-sky-500" />
                  Best Financial Apps 2026
                </a>
              </div>
            )}
          </div>

          {/* Calculators Button */}
          {onOpenCalculators && (
            <button
              onClick={onOpenCalculators}
              className="px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-emerald-500" />
              Calculators
            </button>
          )}

          {/* Compare Button */}
          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                comparedCount > 0
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 font-bold border border-emerald-200 dark:border-emerald-800'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Scale className="w-4 h-4 text-emerald-500" />
              <span>Compare</span>
              {comparedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                  {comparedCount}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Portal Button (Active only when authenticated) */}
          {onNavigateAdmin && (
            <button
              onClick={onNavigateAdmin}
              title="Access Admin Portal (/admin)"
              className="px-2.5 py-1.5 rounded-xl text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px]">Admin Mode</span>
            </button>
          )}

          {/* Dark Mode Moon/Sun Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? "Chuyển sang giao diện sáng (Light mode)" : "Chuyển sang giao diện tối (Dark mode)"}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-medium"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
                <span className="hidden lg:inline text-[11px] text-slate-300">Dark</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
                <span className="hidden lg:inline text-[11px] text-slate-600">Light</span>
              </>
            )}
          </button>

          {/* Subscribe Button (Vibrant Emerald/Green button) */}
          <button
            onClick={onOpenSubscribe}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-semibold px-4 sm:px-5 py-2 rounded-lg shadow-xs transition-all duration-150 cursor-pointer flex items-center gap-1.5"
          >
            Subscribe
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2 text-sm shadow-xl">
          {/* Mobile Dark Mode Toggle */}
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              {darkMode ? 'Giao diện Tối (Dark Mode)' : 'Giao diện Sáng (Light Mode)'}
            </span>
            <button
              onClick={onToggleDarkMode}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              {darkMode ? 'Chuyển Sáng' : 'Chuyển Tối'}
            </button>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('recommended');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-semibold flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Recommended right now</span>
          </button>

          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory('Stock Trading');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
          >
            Stock Trading
          </button>
          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory('High-Yield Savings');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
          >
            High-Yield Savings (APY)
          </button>
          <button
            onClick={() => {
              if (onSelectFilter) onSelectFilter("Editor's Picks");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
          >
            Editor's Picks
          </button>
          {onOpenCalculators && (
            <button
              onClick={() => {
                onOpenCalculators();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-emerald-500" />
              Financial Calculators
            </button>
          )}
          {onOpenCompare && (
            <button
              onClick={() => {
                onOpenCompare();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-500" />
                <span>Compare Platforms</span>
              </div>
              {comparedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                  {comparedCount} selected
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => {
              onOpenSubmitPlatform();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-emerald-600 dark:text-emerald-400 font-medium"
          >
            + Submit a Platform
          </button>
          {onNavigateAdmin && (
            <button
              onClick={() => {
                onNavigateAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Admin Management Portal (/admin)</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

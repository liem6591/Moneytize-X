import React, { useState, useEffect, useMemo } from 'react';
import { FinancialPlatform, FinancialFeeTier } from './types';
import { INITIAL_FINANCIAL_PLATFORMS, FINANCIAL_CATEGORIES } from './data/financialPlatforms';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolGrid, SortOption } from './components/ToolGrid';
import { RecommendedSection } from './components/RecommendedSection';
import { ToolModal } from './components/ToolModal';
import { SubscribeModal } from './components/SubscribeModal';
import { SubmitToolModal } from './components/SubmitToolModal';
import { FinancialCalculatorModal } from './components/FinancialCalculatorModal';
import { CompareModal } from './components/CompareModal';
import { CompareBar } from './components/CompareBar';
import { SubmitReviewModal } from './components/SubmitReviewModal';
import { calculateNewRatingAndCount } from './data/platformReviews';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/AdminLogin';
import {
  subscribeToAdminAuth,
  signOutAdmin,
  testConnection,
  AUTHORIZED_ADMIN_EMAIL,
} from './services/firebase';
import { User } from 'firebase/auth';
import { AlertCircle, Loader2 } from 'lucide-react';

const checkIsAdminRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#/admin' ||
    hash.startsWith('#/admin/') ||
    hash === '#admin' ||
    search.includes('admin=true') ||
    search.includes('view=admin')
  );
};

export default function App() {
  // Navigation view: 'public' or 'admin'
  const [currentView, setCurrentView] = useState<'public' | 'admin'>(() => {
    return checkIsAdminRoute() ? 'admin' : 'public';
  });

  // Firebase Admin Authentication State
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [unauthorizedError, setUnauthorizedError] = useState<string | null>(null);

  // Initialize Firebase connection check & auth listener
  useEffect(() => {
    testConnection();

    const unsubscribe = subscribeToAdminAuth((user, unauthErr) => {
      setAdminUser(user);
      if (unauthErr) {
        setUnauthorizedError(unauthErr);
      } else {
        setUnauthorizedError(null);
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAdminSignOut = async () => {
    await signOutAdmin();
    setAdminUser(null);
    navigateToPublic();
  };

  // Listen for browser navigation (back/forward, URL change) and secret shortcut
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(checkIsAdminRoute() ? 'admin' : 'public');
    };

    // Discreet shortcut (Ctrl+Shift+A or Cmd+Shift+A) to enter Admin mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setCurrentView((prev) => (prev === 'admin' ? 'public' : 'admin'));
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigateToAdmin = () => {
    setCurrentView('admin');
    try {
      window.history.pushState(null, '', '/admin');
    } catch {
      window.location.hash = '/admin';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPublic = () => {
    setCurrentView('public');
    try {
      window.history.pushState(null, '', '/');
    } catch {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('investigate_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('investigate_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('investigate_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Helper to persist platforms list to localStorage
  const savePlatformsState = (updatedList: FinancialPlatform[]) => {
    setPlatforms(updatedList);
    try {
      localStorage.setItem('investigate_managed_platforms', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
  };

  // Financial platforms collection state
  const [platforms, setPlatforms] = useState<FinancialPlatform[]>(() => {
    try {
      const managed = localStorage.getItem('investigate_managed_platforms');
      if (managed) {
        const parsed = JSON.parse(managed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }

    let list: FinancialPlatform[] = INITIAL_FINANCIAL_PLATFORMS;
    try {
      const customPlatforms = localStorage.getItem('investigate_custom_platforms');
      if (customPlatforms) {
        const parsed = JSON.parse(customPlatforms);
        list = [...parsed, ...INITIAL_FINANCIAL_PLATFORMS];
      }
    } catch {
      // fallback
    }

    // Merge saved rating updates
    try {
      const savedRatings = localStorage.getItem('investigate_platform_ratings');
      if (savedRatings) {
        const ratingsMap = JSON.parse(savedRatings);
        list = list.map((p) => {
          if (ratingsMap[p.id]) {
            return {
              ...p,
              rating: ratingsMap[p.id].rating,
              reviewCount: ratingsMap[p.id].reviewCount,
            };
          }
          return p;
        });
      }
    } catch {
      // fallback
    }

    return list;
  });

  // User submitted 1-5 star ratings map { [platformId]: rating }
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('investigate_user_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Upvotes state
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('investigate_upvotes');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFeeTier, setSelectedFeeTier] = useState<string>('');
  const [isEditorPickOnly, setIsEditorPickOnly] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Dynamic Categories state with localStorage persistence
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('investigate_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const combined = new Set([...(FINANCIAL_CATEGORIES as readonly string[]), ...parsed]);
          return Array.from(combined);
        }
      }
    } catch {
      // fallback
    }
    return [...(FINANCIAL_CATEGORIES as readonly string[])];
  });

  const handleAddCategory = (categoryName: string): boolean => {
    const trimmed = categoryName.trim();
    if (!trimmed) return false;
    const exists = categories.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;
    const updated = [...categories, trimmed];
    setCategories(updated);
    try {
      localStorage.setItem('investigate_categories', JSON.stringify(updated));
    } catch {
      // ignore
    }
    return true;
  };

  const handleDeleteCategory = (categoryName: string): boolean => {
    const updated = categories.filter((c) => c.toLowerCase() !== categoryName.toLowerCase());
    setCategories(updated);
    try {
      localStorage.setItem('investigate_categories', JSON.stringify(updated));
    } catch {
      // ignore
    }
    return true;
  };

  // Modal states
  const [selectedPlatform, setSelectedPlatform] = useState<FinancialPlatform | null>(null);
  const [reviewModalPlatform, setReviewModalPlatform] = useState<FinancialPlatform | null>(null);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState<boolean>(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // Platform Comparison State (max 3)
  const [comparedIds, setComparedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('investigate_compared_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [compareToast, setCompareToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('investigate_compared_ids', JSON.stringify(comparedIds));
    } catch {
      // ignore
    }
  }, [comparedIds]);

  const comparedIdsSet = useMemo(() => new Set(comparedIds), [comparedIds]);

  const comparedPlatforms = useMemo(() => {
    return comparedIds
      .map((id) => platforms.find((p) => p.id === id))
      .filter((p): p is FinancialPlatform => Boolean(p));
  }, [comparedIds, platforms]);

  const handleToggleCompare = (e?: React.MouseEvent, platformId?: string) => {
    if (e) e.stopPropagation();
    if (!platformId) return;

    if (comparedIds.includes(platformId)) {
      setComparedIds((prev) => prev.filter((id) => id !== platformId));
    } else {
      if (comparedIds.length >= 3) {
        setCompareToast('You can compare a maximum of 3 platforms. Remove one to add another.');
        setTimeout(() => setCompareToast(null), 3500);
        return;
      }
      setComparedIds((prev) => [...prev, platformId]);
    }
  };

  const handleAddToCompare = (platformId: string) => {
    if (comparedIds.includes(platformId)) return;
    if (comparedIds.length >= 3) {
      setCompareToast('You can compare a maximum of 3 platforms. Remove one to add another.');
      setTimeout(() => setCompareToast(null), 3500);
      return;
    }
    setComparedIds((prev) => [...prev, platformId]);
  };

  const handleRemoveFromCompare = (platformId: string) => {
    setComparedIds((prev) => prev.filter((id) => id !== platformId));
  };

  const handleClearCompare = () => {
    setComparedIds([]);
  };

  // Sync upvotes to localStorage & update count
  const handleUpvote = (e: React.MouseEvent, platformId: string) => {
    e.stopPropagation();
    const nextUpvotes = new Set(upvotedIds);
    const isCurrentlyUpvoted = nextUpvotes.has(platformId);

    if (isCurrentlyUpvoted) {
      nextUpvotes.delete(platformId);
    } else {
      nextUpvotes.add(platformId);
    }

    setUpvotedIds(nextUpvotes);
    localStorage.setItem('investigate_upvotes', JSON.stringify(Array.from(nextUpvotes)));

    setPlatforms((prev) =>
      prev.map((p) => {
        if (p.id === platformId) {
          return {
            ...p,
            upvotes: isCurrentlyUpvoted ? Math.max(0, p.upvotes - 1) : p.upvotes + 1,
          };
        }
        return p;
      })
    );

    if (selectedPlatform && selectedPlatform.id === platformId) {
      setSelectedPlatform((prev) =>
        prev
          ? {
              ...prev,
              upvotes: isCurrentlyUpvoted ? Math.max(0, prev.upvotes - 1) : prev.upvotes + 1,
            }
          : null
      );
    }
  };

  // Submit/Update 1-5 star user rating handler
  const handleRatePlatform = (
    platformId: string,
    newRating: number,
    reviewData?: { author: string; title: string; content: string; experience?: string }
  ) => {
    const target = platforms.find((p) => p.id === platformId);
    if (!target) return;

    const previousRating = userRatings[platformId];
    const { updatedRating, updatedCount } = calculateNewRatingAndCount(
      target.rating,
      target.reviewCount,
      newRating,
      previousRating
    );

    // Update userRatings state & localStorage
    const nextUserRatings = { ...userRatings, [platformId]: newRating };
    setUserRatings(nextUserRatings);
    try {
      localStorage.setItem('investigate_user_ratings', JSON.stringify(nextUserRatings));
    } catch {
      // ignore
    }

    // Update platforms array state
    setPlatforms((prev) =>
      prev.map((p) => {
        if (p.id === platformId) {
          return {
            ...p,
            rating: updatedRating,
            reviewCount: updatedCount,
          };
        }
        return p;
      })
    );

    // Update selectedPlatform if currently open in ToolModal
    setSelectedPlatform((prev) => {
      if (prev && prev.id === platformId) {
        return {
          ...prev,
          rating: updatedRating,
          reviewCount: updatedCount,
        };
      }
      return prev;
    });

    // Update reviewModalPlatform if currently open
    setReviewModalPlatform((prev) => {
      if (prev && prev.id === platformId) {
        return {
          ...prev,
          rating: updatedRating,
          reviewCount: updatedCount,
        };
      }
      return prev;
    });

    // Persist updated platform ratings in localStorage
    try {
      const saved = localStorage.getItem('investigate_platform_ratings');
      const ratingsMap = saved ? JSON.parse(saved) : {};
      ratingsMap[platformId] = { rating: updatedRating, reviewCount: updatedCount };
      localStorage.setItem('investigate_platform_ratings', JSON.stringify(ratingsMap));
    } catch {
      // ignore
    }

    // Display confirmation notice
    setCompareToast(
      `Audit recorded! ${target.name}'s verified rating updated to ${updatedRating.toFixed(1)} ★ (${updatedCount.toLocaleString()} reviews)`
    );
    setTimeout(() => setCompareToast(null), 3800);
  };

  // Submit new platform handler
  const handleAddPlatform = (data: Partial<FinancialPlatform>) => {
    const newPlatform: FinancialPlatform = {
      id: `custom-${Date.now()}`,
      name: data.name || 'Untitled Platform',
      description: data.description || '',
      fullDescription: data.fullDescription || data.description || '',
      category: data.category || 'Stock Trading',
      feeTier: data.feeTier || 'Zero Fee',
      feeHighlight: data.feeHighlight || '$0 / trade',
      yieldAPY: data.yieldAPY,
      minDeposit: data.minDeposit || '$0',
      regulatoryStatus: data.regulatoryStatus || 'Under Review',
      depositInsurance: data.depositInsurance,
      currentOffer: data.currentOffer,
      isEditorPick: false,
      upvotes: 1,
      rating: 4.8,
      reviewCount: 1,
      url: data.url || 'https://investigatepro.example',
      affiliateUrl: data.url || 'https://investigatepro.example',
      dateAdded: new Date().toISOString().split('T')[0],
      logo: data.logo || {
        type: 'text',
        text: (data.name || 'FI').substring(0, 2).toUpperCase(),
        bg: '#10B981',
        color: '#FFFFFF',
      },
      keyPerks: data.keyPerks || ['Transparent fee schedule', 'Web & mobile platform access'],
      pros: data.pros || ['Clean modern application', 'Quick digital onboarding'],
      cons: data.cons || ['Recently added to directory'],
      tags: data.tags || [data.category || 'FinTech', data.feeTier || 'Zero Fee'],
    };

    setPlatforms((prev) => [newPlatform, ...prev]);

    try {
      const saved = localStorage.getItem('investigate_custom_platforms');
      const existing = saved ? JSON.parse(saved) : [];
      localStorage.setItem('investigate_custom_platforms', JSON.stringify([newPlatform, ...existing]));
    } catch {
      // ignore
    }
  };

  // Admin CRUD Operations
  const handleAdminAddPlatform = (newPlatform: FinancialPlatform) => {
    const updated = [newPlatform, ...platforms];
    savePlatformsState(updated);
  };

  const handleAdminUpdatePlatform = (updatedPlatform: FinancialPlatform) => {
    const updated = platforms.map((p) => (p.id === updatedPlatform.id ? updatedPlatform : p));
    savePlatformsState(updated);
    if (selectedPlatform?.id === updatedPlatform.id) {
      setSelectedPlatform(updatedPlatform);
    }
  };

  const handleAdminDeletePlatform = (platformId: string) => {
    const updated = platforms.filter((p) => p.id !== platformId);
    savePlatformsState(updated);
    if (selectedPlatform?.id === platformId) {
      setSelectedPlatform(null);
    }
    // Remove from comparedIds if present
    setComparedIds((prev) => prev.filter((id) => id !== platformId));
  };

  const handleAdminResetPlatforms = () => {
    savePlatformsState(INITIAL_FINANCIAL_PLATFORMS);
    try {
      localStorage.removeItem('investigate_managed_platforms');
      localStorage.removeItem('investigate_custom_platforms');
      localStorage.removeItem('investigate_platform_ratings');
    } catch {
      // ignore
    }
  };

  // Fee tier filter toggle
  const handleSelectFeeTier = (tier: string) => {
    setSelectedFeeTier((prev) => (prev === tier ? '' : tier));
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    platforms.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [platforms]);

  // Filtered & Sorted Platforms
  const filteredPlatforms = useMemo(() => {
    return platforms
      .filter((p) => {
        // Text Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesCat = p.category.toLowerCase().includes(q);
          const matchesSecCat = p.secondaryCategory?.toLowerCase().includes(q);
          const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(q));
          const matchesPerks = p.keyPerks?.some((k) => k.toLowerCase().includes(q));
          const matchesReg = p.regulatoryStatus?.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesCat && !matchesSecCat && !matchesTags && !matchesPerks && !matchesReg) {
            return false;
          }
        }

        // Fee Tier filter
        if (selectedFeeTier && p.feeTier !== selectedFeeTier) {
          return false;
        }

        // Editor's Picks filter
        if (isEditorPickOnly && !p.isEditorPick) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory && p.secondaryCategory !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'upvotes') {
          return b.upvotes - a.upvotes;
        }
        if (sortBy === 'picks') {
          if (a.isEditorPick && !b.isEditorPick) return -1;
          if (!a.isEditorPick && b.isEditorPick) return 1;
          return b.upvotes - a.upvotes;
        }
        if (sortBy === 'yield') {
          const parseApy = (str?: string) => {
            if (!str) return 0;
            const match = str.match(/([0-9.]+)%/);
            return match ? parseFloat(match[1]) : 0;
          };
          return parseApy(b.yieldAPY) - parseApy(a.yieldAPY);
        }
        if (sortBy === 'alphabetical') {
          return a.name.localeCompare(b.name);
        }
        // Default: newest
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      });
  }, [platforms, searchQuery, selectedFeeTier, isEditorPickOnly, selectedCategory, sortBy]);

  // Related platforms for modal
  const relatedPlatforms = useMemo(() => {
    if (!selectedPlatform) return [];
    return platforms
      .filter((p) => p.id !== selectedPlatform.id && p.category === selectedPlatform.category)
      .slice(0, 4);
  }, [selectedPlatform, platforms]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedFeeTier || isEditorPickOnly || selectedCategory !== 'All'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFeeTier('');
    setIsEditorPickOnly(false);
    setSelectedCategory('All');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {currentView === 'admin' ? (
        isAuthChecking ? (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
            <p className="text-sm font-medium">Verifying Firebase admin session...</p>
          </div>
        ) : !adminUser || (adminUser.email || '').toLowerCase().trim() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase().trim() ? (
          <AdminLogin
            onLoginSuccess={() => {
              setUnauthorizedError(null);
            }}
            onBackToPublic={navigateToPublic}
            unauthorizedNotice={unauthorizedError}
          />
        ) : (
          <AdminPanel
            platforms={platforms}
            categories={categories}
            adminEmail={adminUser.email}
            adminPhotoUrl={adminUser.photoURL}
            onSignOut={handleAdminSignOut}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddPlatform={handleAdminAddPlatform}
            onUpdatePlatform={handleAdminUpdatePlatform}
            onDeletePlatform={handleAdminDeletePlatform}
            onResetPlatforms={handleAdminResetPlatforms}
            onBackToPublic={navigateToPublic}
            onPreviewPlatform={(platform) => setSelectedPlatform(platform)}
          />
        )
      ) : (
        <>
          {/* Top Header */}
          <Header
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            onOpenSubscribe={() => setIsSubscribeOpen(true)}
            onOpenSubmitPlatform={() => setIsSubmitOpen(true)}
            onOpenCalculators={() => setIsCalculatorOpen(true)}
            comparedCount={comparedIds.length}
            onOpenCompare={() => setIsCompareOpen(true)}
            onNavigateAdmin={adminUser ? navigateToAdmin : undefined}
            adminEmail={adminUser?.email}
            adminPhotoUrl={adminUser?.photoURL}
            onSignOut={handleAdminSignOut}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setSearchQuery('');
            }}
            onSelectFilter={(filter) => {
              if (filter === "Editor's Picks") {
                setIsEditorPickOnly(true);
                setSelectedFeeTier('');
              } else if (filter === 'Commission Free' || filter === 'Zero Fee') {
                setSelectedFeeTier(filter);
                setIsEditorPickOnly(false);
              } else if (filter === 'all') {
                handleResetFilters();
              }
            }}
          />

          {/* Hero Section */}
          <Hero
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFeeTier={selectedFeeTier}
            onSelectFeeTier={handleSelectFeeTier}
            isEditorPickOnly={isEditorPickOnly}
            onToggleEditorPick={() => setIsEditorPickOnly((prev) => !prev)}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
            categories={categories}
          />

          {/* Recommended right now Section */}
          <RecommendedSection
            platforms={platforms}
            onSelectPlatform={setSelectedPlatform}
            onSeeTop20={() => {
              setSortBy('rating');
              setIsEditorPickOnly(false);
              const grid = document.querySelector('main');
              if (grid) {
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          />

          {/* Main Platforms Grid */}
          <main className="flex-1">
            <ToolGrid
              platforms={filteredPlatforms}
              totalDatabaseCount={4298}
              upvotedIds={upvotedIds}
              onUpvote={handleUpvote}
              onSelectPlatform={setSelectedPlatform}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
              comparedIds={comparedIdsSet}
              onToggleCompare={handleToggleCompare}
              userRatings={userRatings}
              onOpenReview={(e, platform) => {
                e.stopPropagation();
                setReviewModalPlatform(platform);
              }}
            />
          </main>

          {/* Footer */}
          <Footer
            categories={categories}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setSearchQuery('');
            }}
            onOpenSubscribe={() => setIsSubscribeOpen(true)}
            onOpenSubmitPlatform={() => setIsSubmitOpen(true)}
            onNavigateAdmin={adminUser ? navigateToAdmin : undefined}
            onOpenAdminLogin={navigateToAdmin}
          />

          {/* Floating Comparison Dock Bar */}
          <CompareBar
            comparedPlatforms={comparedPlatforms}
            onRemoveFromCompare={handleRemoveFromCompare}
            onClearCompare={handleClearCompare}
            onOpenCompareModal={() => setIsCompareOpen(true)}
          />
        </>
      )}

      {/* Limit Notice Toast */}
      {compareToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700/80 backdrop-blur-xs animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2 max-w-md text-center">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{compareToast}</span>
        </div>
      )}

      {/* Modals */}
      {selectedPlatform && (
        <ToolModal
          platform={selectedPlatform}
          onClose={() => setSelectedPlatform(null)}
          hasUpvoted={upvotedIds.has(selectedPlatform.id)}
          onUpvote={handleUpvote}
          relatedPlatforms={relatedPlatforms}
          onSelectRelated={setSelectedPlatform}
          allPlatforms={platforms}
          isCompared={comparedIdsSet.has(selectedPlatform.id)}
          onToggleCompare={handleToggleCompare}
          onOpenCompare={() => setIsCompareOpen(true)}
          currentUserRating={userRatings[selectedPlatform.id]}
          onSubmitRating={handleRatePlatform}
        />
      )}

      {/* Quick Review / Star Rating Modal */}
      <SubmitReviewModal
        isOpen={Boolean(reviewModalPlatform)}
        onClose={() => setReviewModalPlatform(null)}
        platform={reviewModalPlatform}
        currentUserRating={reviewModalPlatform ? userRatings[reviewModalPlatform.id] : undefined}
        onSubmitRating={handleRatePlatform}
      />

      {/* Comparison Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedPlatforms={comparedPlatforms}
        allPlatforms={platforms}
        onRemoveFromCompare={handleRemoveFromCompare}
        onAddToCompare={handleAddToCompare}
        onClearCompare={handleClearCompare}
        onSelectPlatform={(platform) => {
          setIsCompareOpen(false);
          setSelectedPlatform(platform);
        }}
      />

      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />

      <SubmitToolModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmit={handleAddPlatform}
        categories={categories}
      />

      <FinancialCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}

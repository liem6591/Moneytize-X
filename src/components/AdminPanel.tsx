import React, { useState, useMemo, useEffect } from 'react';
import { FinancialPlatform, FinancialFeeTier, PlatformLogo } from '../types';
import { FINANCIAL_CATEGORIES } from '../data/financialPlatforms';
import {
  Plus,
  Pencil,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  RotateCcw,
  Search,
  Filter,
  ShieldCheck,
  Star,
  Layers,
  Download,
  Upload,
  AlertTriangle,
  X,
  Sparkles,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  Lock,
  FolderPlus,
  FolderTree,
  Tag,
  AlertCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AdminPanelProps {
  platforms: FinancialPlatform[];
  categories?: string[];
  adminEmail?: string | null;
  adminPhotoUrl?: string | null;
  onSignOut?: () => void;
  onAddPlatform: (platform: FinancialPlatform) => void;
  onUpdatePlatform: (platform: FinancialPlatform) => void;
  onDeletePlatform: (platformId: string) => void;
  onResetPlatforms: () => void;
  onBackToPublic: () => void;
  onPreviewPlatform?: (platform: FinancialPlatform) => void;
  onAddCategory?: (categoryName: string) => boolean | void;
  onDeleteCategory?: (categoryName: string) => boolean | void;
}

const SUGGESTED_FINTECH_CATEGORIES = [
  'Micro-Investing',
  'P2P Lending & Debt',
  'Insurtech & Coverage',
  'Pre-IPO & Venture',
  'Commodities & Futures',
  'Impact & ESG Investing',
  'Payroll & Benefits',
  'Buy Now Pay Later (BNPL)',
  'Commercial Real Estate',
  'Algorithmic Trading & APIs',
  'Pension & Annuities',
  'Cross-Border Remittance',
];

const FEE_TIERS: FinancialFeeTier[] = [
  'Zero Fee',
  'Low Fee',
  'Freemium',
  'Subscription',
  'Commission Free',
];

const PRESET_LOGO_COLORS = [
  { bg: '#00C805', color: '#FFFFFF', name: 'Robinhood Green' },
  { bg: '#1B5E20', color: '#FFFFFF', name: 'Fidelity Green' },
  { bg: '#0052FF', color: '#FFFFFF', name: 'Coinbase Blue' },
  { bg: '#CC0000', color: '#FFFFFF', name: 'IBKR Red' },
  { bg: '#0A85EA', color: '#FFFFFF', name: 'Schwab Cyan' },
  { bg: '#7928CA', color: '#FFFFFF', name: 'Purple DeFi' },
  { bg: '#F59E0B', color: '#000000', name: 'Gold / Amber' },
  { bg: '#0F172A', color: '#FFFFFF', name: 'Slate Dark' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  platforms,
  categories,
  adminEmail,
  adminPhotoUrl,
  onSignOut,
  onAddPlatform,
  onUpdatePlatform,
  onDeletePlatform,
  onResetPlatforms,
  onBackToPublic,
  onPreviewPlatform,
  onAddCategory,
  onDeleteCategory,
}) => {
  // Active dynamic categories (from props or default constant)
  const activeCategories = useMemo(() => {
    return categories && categories.length > 0
      ? categories
      : (FINANCIAL_CATEGORIES as unknown as string[]);
  }, [categories]);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFeeTier, setSelectedFeeTier] = useState<string>('all');
  const [filterPickOnly, setFilterPickOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'reviews' | 'date'>('name');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<FinancialPlatform | null>(null);
  const [platformToDelete, setPlatformToDelete] = useState<FinancialPlatform | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Category Manager modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoryFilterQuery, setCategoryFilterQuery] = useState('');

  // Inline category creation inside Platform Form
  const [isInlineAddingCat, setIsInlineAddingCat] = useState(false);
  const [inlineCatName, setInlineCatName] = useState('');
  const [inlineCatError, setInlineCatError] = useState<string | null>(null);

  // Link copy feedback
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Direct Admin URL
  const adminUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/admin` 
    : 'https://investigatepro.com/admin';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyAdminUrl = () => {
    navigator.clipboard.writeText(adminUrl);
    setCopiedLink(true);
    showToast('Admin direct link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const isDefaultCategory = (cat: string) => {
    return (FINANCIAL_CATEGORIES as readonly string[]).includes(cat);
  };

  const handleCreateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategoryError('Please enter a category name.');
      return;
    }
    const exists = activeCategories.some(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setCategoryError(`Category "${trimmed}" already exists.`);
      return;
    }

    if (onAddCategory) {
      const res = onAddCategory(trimmed);
      if (res === false) {
        setCategoryError('Failed to add category or duplicate found.');
        return;
      }
    }
    setNewCategoryName('');
    setCategoryError(null);
    showToast(`Category "${trimmed}" successfully added!`);
  };

  const handleAddSuggestedCategory = (catName: string) => {
    if (activeCategories.some((c) => c.toLowerCase() === catName.toLowerCase())) {
      setCategoryError(`Category "${catName}" already exists.`);
      return;
    }
    if (onAddCategory) {
      onAddCategory(catName);
      setCategoryError(null);
      showToast(`Category "${catName}" added to sectors!`);
    }
  };

  const handleDeleteCategoryClick = (catName: string, count: number) => {
    if (count > 0) {
      alert(`Cannot delete "${catName}" because ${count} platform(s) are assigned to it. Please reassign those platforms first.`);
      return;
    }
    if (window.confirm(`Are you sure you want to remove the category "${catName}"?`)) {
      if (onDeleteCategory) {
        onDeleteCategory(catName);
        showToast(`Category "${catName}" removed.`);
      }
    }
  };

  const handleInlineCreateCategory = () => {
    const trimmed = inlineCatName.trim();
    if (!trimmed) {
      setInlineCatError('Enter category name.');
      return;
    }
    const exists = activeCategories.some(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setFormData((prev) => ({ ...prev, category: trimmed }));
      setIsInlineAddingCat(false);
      setInlineCatName('');
      setInlineCatError(null);
      showToast(`Selected existing category "${trimmed}".`);
      return;
    }

    if (onAddCategory) {
      onAddCategory(trimmed);
    }
    setFormData((prev) => ({ ...prev, category: trimmed }));
    setIsInlineAddingCat(false);
    setInlineCatName('');
    setInlineCatError(null);
    showToast(`Category "${trimmed}" created and selected!`);
  };

  const availableSuggestions = useMemo(() => {
    return SUGGESTED_FINTECH_CATEGORIES.filter(
      (s) => !activeCategories.some((c) => c.toLowerCase() === s.toLowerCase())
    );
  }, [activeCategories]);

  const filteredCategoryList = useMemo(() => {
    if (!categoryFilterQuery.trim()) return activeCategories;
    const q = categoryFilterQuery.toLowerCase();
    return activeCategories.filter((c) => c.toLowerCase().includes(q));
  }, [activeCategories, categoryFilterQuery]);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<FinancialPlatform>>({
    name: '',
    category: 'Stock Trading',
    secondaryCategory: '',
    feeTier: 'Zero Fee',
    feeHighlight: '$0 / trade',
    yieldAPY: '',
    minDeposit: '$0',
    regulatoryStatus: 'SEC & FINRA Member',
    depositInsurance: 'SIPC up to $500k',
    currentOffer: '',
    isEditorPick: false,
    rating: 4.8,
    reviewCount: 100,
    url: 'https://',
    affiliateUrl: '',
    description: '',
    fullDescription: '',
    keyPerks: ['Commission-free stock and ETF trades', 'Intuitive mobile and desktop web interface'],
    pros: ['Industry-leading zero commission schedule', 'Rapid account setup and instant funding'],
    cons: ['Identity verification (KYC) required'],
    tags: ['Zero Fee', 'Stocks', 'Options'],
    logo: {
      type: 'text',
      text: 'PL',
      bg: '#10B981',
      color: '#FFFFFF',
    },
  });

  // String helpers for list fields in form
  const [keyPerksText, setKeyPerksText] = useState('');
  const [prosText, setProsText] = useState('');
  const [consText, setConsText] = useState('');
  const [tagsText, setTagsText] = useState('');

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingPlatform(null);
    setFormData({
      name: '',
      category: 'Stock Trading',
      secondaryCategory: '',
      feeTier: 'Zero Fee',
      feeHighlight: '$0 / trade',
      yieldAPY: '',
      minDeposit: '$0',
      regulatoryStatus: 'SEC & FINRA Member',
      depositInsurance: 'SIPC up to $500k',
      currentOffer: '',
      isEditorPick: false,
      rating: 4.8,
      reviewCount: 50,
      url: 'https://',
      affiliateUrl: '',
      description: '',
      fullDescription: '',
      keyPerks: ['Zero commission trading', 'Seamless deposits and withdrawals'],
      pros: ['Transparent fee structure', 'Dedicated customer support'],
      cons: ['Select advanced market data feeds require subscription'],
      tags: ['Zero Fee', 'Fintech', 'Popular'],
      logo: {
        type: 'text',
        text: 'PL',
        bg: '#10B981',
        color: '#FFFFFF',
      },
    });
    setKeyPerksText('Zero commission trading\nSeamless deposits and withdrawals');
    setProsText('Transparent fee structure\nDedicated customer support');
    setConsText('Select advanced market data feeds require subscription');
    setTagsText('Zero Fee, Fintech, Popular');
    setIsFormOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (p: FinancialPlatform) => {
    setEditingPlatform(p);
    setFormData({ ...p });
    setKeyPerksText((p.keyPerks || []).join('\n'));
    setProsText((p.pros || []).join('\n'));
    setConsText((p.cons || []).join('\n'));
    setTagsText((p.tags || []).join(', '));
    setIsFormOpen(true);
  };

  // Form submission (Add or Update)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Please enter a platform name');
      return;
    }

    const perksArray = keyPerksText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const prosArray = prosText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const consArray = consText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const tagsArray = tagsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const logoText =
      formData.logo?.text || formData.name.substring(0, 2).toUpperCase();

    const preparedPlatform: FinancialPlatform = {
      id: editingPlatform ? editingPlatform.id : `custom-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      fullDescription:
        formData.fullDescription?.trim() || formData.description?.trim() || '',
      category: formData.category || 'Stock Trading',
      secondaryCategory: formData.secondaryCategory?.trim() || undefined,
      feeTier: formData.feeTier || 'Zero Fee',
      feeHighlight: formData.feeHighlight?.trim() || '$0',
      yieldAPY: formData.yieldAPY?.trim() || undefined,
      minDeposit: formData.minDeposit?.trim() || '$0',
      regulatoryStatus: formData.regulatoryStatus?.trim() || 'Regulated',
      depositInsurance: formData.depositInsurance?.trim() || undefined,
      currentOffer: formData.currentOffer?.trim() || undefined,
      isEditorPick: Boolean(formData.isEditorPick),
      upvotes: editingPlatform ? editingPlatform.upvotes : 1,
      rating: Number(formData.rating) || 4.8,
      reviewCount: Number(formData.reviewCount) || 1,
      url: formData.url?.trim() || 'https://',
      affiliateUrl: formData.affiliateUrl?.trim() || formData.url?.trim() || 'https://',
      dateAdded: editingPlatform
        ? editingPlatform.dateAdded
        : new Date().toISOString().split('T')[0],
      logo: {
        type: 'text',
        text: logoText,
        bg: formData.logo?.bg || '#10B981',
        color: formData.logo?.color || '#FFFFFF',
      },
      keyPerks: perksArray.length > 0 ? perksArray : ['Professional financial services'],
      pros: prosArray.length > 0 ? prosArray : ['Transparent cost structure'],
      cons: consArray.length > 0 ? consArray : ['Subject to regional availability'],
      tags: tagsArray.length > 0 ? tagsArray : [formData.category || 'Fintech'],
      feeBreakdown: editingPlatform?.feeBreakdown || [
        { label: 'Standard Fee', value: formData.feeHighlight || '$0', notes: 'Public schedule' },
      ],
    };

    if (editingPlatform) {
      onUpdatePlatform(preparedPlatform);
      showToast(`Platform "${preparedPlatform.name}" updated successfully!`);
    } else {
      onAddPlatform(preparedPlatform);
      showToast(`Platform "${preparedPlatform.name}" created successfully!`);
    }

    setIsFormOpen(false);
  };

  // Delete handler
  const handleConfirmDelete = () => {
    if (!platformToDelete) return;
    const name = platformToDelete.name;
    onDeletePlatform(platformToDelete.id);
    showToast(`Platform "${name}" removed from database.`);
    setPlatformToDelete(null);
  };

  // Toggle Editor's Pick directly
  const handleToggleEditorPick = (p: FinancialPlatform) => {
    const updated: FinancialPlatform = {
      ...p,
      isEditorPick: !p.isEditorPick,
    };
    onUpdatePlatform(updated);
    showToast(`${updated.isEditorPick ? 'Pinned' : 'Unpinned'} Editor's Pick for "${p.name}".`);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(platforms, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `investigate_platforms_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Platform database exported to JSON successfully!');
  };

  // Filtered and sorted platforms
  const filteredPlatforms = useMemo(() => {
    return platforms
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchCat && !matchTags) return false;
        }
        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Fee tier
        if (selectedFeeTier !== 'all' && p.feeTier !== selectedFeeTier) {
          return false;
        }
        // Pick only
        if (filterPickOnly && !p.isEditorPick) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        if (sortBy === 'date') return (b.dateAdded || '').localeCompare(a.dateAdded || '');
        return a.name.localeCompare(b.name);
      });
  }, [platforms, searchQuery, selectedCategory, selectedFeeTier, filterPickOnly, sortBy]);

  // Table Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedFeeTier, filterPickOnly, sortBy]);

  const totalAdminPages = Math.max(1, Math.ceil(filteredPlatforms.length / pageSize));
  const safeAdminPage = Math.min(Math.max(1, currentPage), totalAdminPages);
  const adminStartIndex = (safeAdminPage - 1) * pageSize;
  const adminEndIndex = Math.min(adminStartIndex + pageSize, filteredPlatforms.length);
  const paginatedAdminPlatforms = useMemo(() => {
    return filteredPlatforms.slice(adminStartIndex, adminEndIndex);
  }, [filteredPlatforms, adminStartIndex, adminEndIndex]);

  // Statistics
  const stats = useMemo(() => {
    const total = platforms.length;
    const categoriesCount = activeCategories.length;
    const editorPicks = platforms.filter((p) => p.isEditorPick).length;
    const zeroFeeCount = platforms.filter(
      (p) => p.feeTier === 'Zero Fee' || p.feeTier === 'Commission Free'
    ).length;
    const avgRating =
      total > 0
        ? (platforms.reduce((acc, p) => acc + p.rating, 0) / total).toFixed(2)
        : '0.0';

    return { total, categoriesCount, editorPicks, zeroFeeCount, avgRating };
  }, [platforms, activeCategories]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-500 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPublic}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Return to public directory"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Directory Home</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                IP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-none">
                    Admin Platform Portal
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Dedicated Link
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-1">
                  Manage, Add, Edit &amp; Delete all financial platforms
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Add and manage financial categories"
            >
              <FolderPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">+ Add Category</span>
              <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-full">
                {activeCategories.length}
              </span>
            </button>

            <button
              onClick={handleExportJSON}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Export platforms database to JSON file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Backup JSON</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl shadow-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add New Platform</span>
            </button>

            {/* Admin identity & Sign out */}
            {adminEmail && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                {adminPhotoUrl ? (
                  <img
                    src={adminPhotoUrl}
                    alt="Admin"
                    className="w-7 h-7 rounded-full border border-emerald-500 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    A
                  </div>
                )}

                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-none truncate max-w-[130px]">
                    Administrator
                  </span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                    Admin Verified
                  </span>
                </div>

                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Sign out of Firebase admin session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dedicated Admin Link Banner with Firebase Protection Note */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 rounded-2xl p-4 sm:p-5 border border-emerald-200/90 dark:border-emerald-800/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Firebase Admin Verified Session</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    High Security
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Authenticated as Verified Administrator via Firebase Authentication. All administrative operations are authorized.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden lg:flex items-center font-mono text-xs text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 select-all max-w-xs truncate">
                {adminUrl}
              </div>
              <button
                onClick={handleCopyAdminUrl}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Admin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Platforms</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {stats.total}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Live in Directory</div>
          </div>

          <div
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-colors cursor-pointer group"
            title="Click to manage or add categories"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Categories</div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-0.5">
                <Plus className="w-3 h-3" /> Add
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {stats.categoriesCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Market sectors &amp; taxonomy</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Editor&apos;s Picks</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono mt-1">
              {stats.editorPicks}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Featured platforms</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Zero Fee Platforms</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {stats.zeroFeeCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">$0 commission brokers</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Average Rating</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-1 flex items-center gap-1">
              <span>{stats.avgRating}</span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Audited User Score</div>
          </div>
        </div>

        {/* Action Controls & Filtering Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search platforms by name, category, or keyword..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-hidden cursor-pointer"
              >
                <option value="all">All Categories ({activeCategories.length})</option>
                {activeCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Fee Tier Filter */}
              <select
                value={selectedFeeTier}
                onChange={(e) => setSelectedFeeTier(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-hidden cursor-pointer"
              >
                <option value="all">All Fee Tiers</option>
                {FEE_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-hidden cursor-pointer font-medium"
              >
                <option value="name">Sort: Name (A-Z)</option>
                <option value="rating">Sort: Highest Rating</option>
                <option value="reviews">Sort: Most Reviews</option>
                <option value="date">Sort: Recently Added</option>
              </select>

              {/* Editor Pick Toggle */}
              <button
                type="button"
                onClick={() => setFilterPickOnly(!filterPickOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  filterPickOnly
                    ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Editor&apos;s Picks Only</span>
              </button>

              {/* Reset Database Button */}
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                title="Reset to default initial platform list"
                className="px-3 py-2 rounded-xl text-xs font-medium border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>
              Showing <strong>{filteredPlatforms.length}</strong> of {platforms.length} platforms
            </span>
            {(searchQuery || selectedCategory !== 'all' || selectedFeeTier !== 'all' || filterPickOnly) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedFeeTier('all');
                  setFilterPickOnly(false);
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Platforms Management Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Platform / Brand</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Pricing &amp; APY</th>
                  <th className="py-3.5 px-3">Deposit / Regulation</th>
                  <th className="py-3.5 px-3 text-center">Rating</th>
                  <th className="py-3.5 px-3 text-center">Editor Pick</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPlatforms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                      No financial platforms found matching your filters.
                    </td>
                  </tr>
                ) : (
                  paginatedAdminPlatforms.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Logo and Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                            style={{
                              backgroundColor: p.logo.bg || '#10B981',
                              color: p.logo.color || '#FFFFFF',
                            }}
                          >
                            {p.logo.text || p.name.substring(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-white text-sm truncate">
                                {p.name}
                              </span>
                              {p.url && (
                                <a
                                  href={p.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-400 hover:text-emerald-600 transition-colors"
                                  title="Visit official website"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 dark:text-slate-400 truncate max-w-xs">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {p.category}
                        </span>
                      </td>

                      {/* Fee Tier and APY */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {p.feeTier}
                          </span>
                          <div className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">
                            {p.feeHighlight}
                          </div>
                          {p.yieldAPY && (
                            <div className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              {p.yieldAPY}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Deposit and Regulatory */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            Min: {p.minDeposit || '$0'}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={p.regulatoryStatus}>
                            {p.regulatoryStatus}
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1 font-bold text-amber-500 font-mono">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{p.rating.toFixed(1)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ({p.reviewCount} reviews)
                        </div>
                      </td>

                      {/* Editor Pick Toggle */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleEditorPick(p)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            p.isEditorPick
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                              : 'border-slate-200 dark:border-slate-700 text-slate-300 hover:text-slate-500'
                          }`}
                          title={p.isEditorPick ? "Remove Editor's Pick pin" : "Pin as Editor's Pick"}
                        >
                          <Sparkles className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onPreviewPlatform && (
                            <button
                              onClick={() => onPreviewPlatform(p)}
                              title="Preview public platform dossier"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit this platform"
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setPlatformToDelete(p)}
                            title="Delete this platform"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Bar */}
          {filteredPlatforms.length > 0 && (
            <div className="px-4 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-500 dark:text-slate-400">
                Showing <strong className="text-slate-900 dark:text-white">{adminStartIndex + 1}</strong> to{' '}
                <strong className="text-slate-900 dark:text-white">{adminEndIndex}</strong> of{' '}
                <strong className="text-slate-900 dark:text-white">{filteredPlatforms.length}</strong> platforms
              </div>

              <div className="flex items-center gap-3">
                {/* Page Size Selector */}
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span>Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer shadow-2xs focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Page Navigation */}
                {totalAdminPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safeAdminPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Previous page"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <span className="px-2 font-medium text-slate-600 dark:text-slate-300">
                      Page {safeAdminPage} of {totalAdminPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalAdminPages, p + 1))}
                      disabled={safeAdminPage === totalAdminPages}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Next page"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ADD / EDIT PLATFORM MODAL */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {editingPlatform ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {editingPlatform ? `Edit Platform: ${editingPlatform.name}` : 'Add New Financial Platform'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Provide verified details to publish to the comparison directory
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
              {/* Section 1: Basic Identity */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  1. Identity &amp; Platform Category
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Platform Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Interactive Brokers, Wealthfront, Nexo"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Primary Category *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsInlineAddingCat(!isInlineAddingCat);
                          setInlineCatName('');
                          setInlineCatError(null);
                        }}
                        className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isInlineAddingCat ? 'Cancel' : '+ New Category'}</span>
                      </button>
                    </div>

                    {isInlineAddingCat ? (
                      <div className="space-y-1.5 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 animate-in fade-in">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={inlineCatName}
                            onChange={(e) => {
                              setInlineCatName(e.target.value);
                              setInlineCatError(null);
                            }}
                            placeholder="Enter new category name..."
                            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleInlineCreateCategory();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleInlineCreateCategory}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shrink-0"
                          >
                            Add &amp; Select
                          </button>
                        </div>
                        {inlineCatError && (
                          <p className="text-[10px] text-rose-500 font-medium">{inlineCatError}</p>
                        )}
                      </div>
                    ) : (
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden cursor-pointer"
                      >
                        {activeCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Secondary Category
                    </label>
                    <input
                      type="text"
                      value={formData.secondaryCategory || ''}
                      onChange={(e) => setFormData({ ...formData, secondaryCategory: e.target.value })}
                      placeholder="e.g. High-Yield Savings, Options, DeFi"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Official Website URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & Rates */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  2. Pricing, APY &amp; Account Limits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Fee Tier *
                    </label>
                    <select
                      value={formData.feeTier}
                      onChange={(e) => setFormData({ ...formData, feeTier: e.target.value as any })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden cursor-pointer"
                    >
                      {FEE_TIERS.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Fee Highlight *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.feeHighlight}
                      onChange={(e) => setFormData({ ...formData, feeHighlight: e.target.value })}
                      placeholder="e.g. $0 / trade, 0.25% AUM"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cash Yield / APY
                    </label>
                    <input
                      type="text"
                      value={formData.yieldAPY || ''}
                      onChange={(e) => setFormData({ ...formData, yieldAPY: e.target.value })}
                      placeholder="e.g. 5.00% APY, 4.5% Cash Sweep"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Minimum Deposit
                    </label>
                    <input
                      type="text"
                      value={formData.minDeposit}
                      onChange={(e) => setFormData({ ...formData, minDeposit: e.target.value })}
                      placeholder="e.g. $0, $500"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Regulatory Status
                    </label>
                    <input
                      type="text"
                      value={formData.regulatoryStatus}
                      onChange={(e) => setFormData({ ...formData, regulatoryStatus: e.target.value })}
                      placeholder="e.g. SEC & FINRA Member, FCA Regulated"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Deposit Insurance
                    </label>
                    <input
                      type="text"
                      value={formData.depositInsurance || ''}
                      onChange={(e) => setFormData({ ...formData, depositInsurance: e.target.value })}
                      placeholder="e.g. SIPC $500k, FDIC $2.5M"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Descriptions */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  3. Descriptions &amp; Dossier Content
                </h4>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Short Description (Shown on Catalog Card) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Concise 1-2 sentence executive summary of the platform..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Description (Shown in Detailed Audit Dossier Modal)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.fullDescription || ''}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Comprehensive overview covering founding background, operating mechanics, core pros/cons, and target investors..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* Section 4: Bullet lists & Tags */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  4. Strengths, Considerations &amp; Key Perks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Key Strengths / Pros (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={prosText}
                      onChange={(e) => setProsText(e.target.value)}
                      placeholder="Zero commission trades&#10;24/7 client support&#10;Ultra-fast order execution"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Considerations / Cons (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={consText}
                      onChange={(e) => setConsText(e.target.value)}
                      placeholder="International wire withdrawal fees&#10;Advanced charting requires desktop software"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Key Perks (One per line)
                    </label>
                    <textarea
                      rows={2}
                      value={keyPerksText}
                      onChange={(e) => setKeyPerksText(e.target.value)}
                      placeholder="5.0% APY uninvested cash sweep&#10;Free bonus stock upon qualifying deposit"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tags (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={tagsText}
                      onChange={(e) => setTagsText(e.target.value)}
                      placeholder="Zero Fee, Stocks, Crypto, High APY"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Logo & Status */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  5. Logo Styling &amp; Display Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Logo Characters (Icon / Initials)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.logo?.text || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          logo: { ...formData.logo!, text: e.target.value },
                        })
                      }
                      placeholder="e.g. IB, RH, 🪶"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Logo Background (Preset Colors)
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {PRESET_LOGO_COLORS.map((clr) => (
                        <button
                          key={clr.bg}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              logo: {
                                ...formData.logo!,
                                bg: clr.bg,
                                color: clr.color,
                              },
                            })
                          }
                          className={`w-6 h-6 rounded-lg cursor-pointer transition-transform ${
                            formData.logo?.bg === clr.bg
                              ? 'ring-2 ring-emerald-500 scale-110'
                              : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: clr.bg }}
                          title={clr.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Live preview */}
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs"
                      style={{
                        backgroundColor: formData.logo?.bg || '#10B981',
                        color: formData.logo?.color || '#FFFFFF',
                      }}
                    >
                      {formData.logo?.text || formData.name?.substring(0, 2) || 'PL'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {formData.name || 'Platform Name'}
                      </div>
                      <div className="text-[10px] text-slate-400">Logo Live Preview</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Initial Rating (1.0 - 5.0)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Review Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.reviewCount}
                      onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) || 10 })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="formEditorPick"
                      checked={Boolean(formData.isEditorPick)}
                      onChange={(e) => setFormData({ ...formData, isEditorPick: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label
                      htmlFor="formEditorPick"
                      className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      Pin as Editor&apos;s Pick ⭐
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingPlatform ? 'Save Changes' : 'Add Platform to Directory'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {platformToDelete && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPlatformToDelete(null)}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Confirm Platform Deletion?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to permanently delete <strong className="text-slate-900 dark:text-white font-bold">{platformToDelete.name}</strong> from the directory database?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPlatformToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Platform</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MANAGER MODAL */}
      {isCategoryModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => {
            setIsCategoryModalOpen(false);
            setCategoryError(null);
            setNewCategoryName('');
          }}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Financial Categories &amp; Sectors</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {activeCategories.length} Total
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add new financial market categories or manage directory taxonomy.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setCategoryError(null);
                  setNewCategoryName('');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add New Category Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Add New Category</span>
                </label>
                <span className="text-[11px] text-slate-500">Live instantly across directory &amp; filters</span>
              </div>

              <form onSubmit={handleCreateCategorySubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    setCategoryError(null);
                  }}
                  placeholder="e.g. Micro-Investing, Insurtech, P2P Lending..."
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </form>

              {categoryError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{categoryError}</span>
                </div>
              )}

              {/* Quick Suggested Categories */}
              {availableSuggestions.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Quick Suggestions (Click to Add):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSuggestions.slice(0, 6).map((suggested) => (
                      <button
                        key={suggested}
                        type="button"
                        onClick={() => handleAddSuggestedCategory(suggested)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-emerald-500" />
                        <span>{suggested}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Existing Categories List with Search */}
            <div className="flex-1 flex flex-col min-h-0 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Active Categories List
                </div>
                <div className="relative w-48 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={categoryFilterQuery}
                    onChange={(e) => setCategoryFilterQuery(e.target.value)}
                    placeholder="Filter categories..."
                    className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-hidden"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/80 max-h-60">
                {filteredCategoryList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No categories matching "{categoryFilterQuery}".
                  </div>
                ) : (
                  filteredCategoryList.map((cat) => {
                    const isDefault = isDefaultCategory(cat);
                    const count = platforms.filter((p) => p.category === cat).length;
                    return (
                      <div
                        key={cat}
                        className="px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {cat}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                            ({count} {count === 1 ? 'platform' : 'platforms'})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isDefault ? (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              Default Sector
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Custom Added
                            </span>
                          )}

                          {!isDefault && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCategoryClick(cat, count)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title={count > 0 ? `Cannot delete: ${count} platforms assigned` : 'Delete custom category'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer Close */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setCategoryError(null);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET MODAL */}
      {isResetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsResetConfirmOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Restore Default Platform List?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This action will restore all 20+ default verified platforms for Moneytize X and remove any unexported custom changes.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetPlatforms();
                  setIsResetConfirmOpen(false);
                  showToast('All platforms restored to original directory list!');
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Defaults</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

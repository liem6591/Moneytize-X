export type FinancialFeeTier = 
  | 'Zero Fee'
  | 'Low Fee'
  | 'Freemium'
  | 'Subscription'
  | 'Commission Free';

export interface PlatformLogo {
  type: 'text' | 'image' | 'svg' | 'custom';
  text?: string;
  subtext?: string;
  bg: string;
  color?: string;
  border?: string;
}

export interface PlatformReview {
  id: string;
  platformId: string;
  author: string;
  rating: number; // 1 to 5
  title: string;
  content: string;
  date: string;
  experience?: string;
  isVerified?: boolean;
}

export interface FinancialPlatform {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  category: string;
  secondaryCategory?: string;
  feeTier: FinancialFeeTier;
  feeHighlight: string; // e.g. "$0 / trade", "0.25% AUM", "5.0% APY"
  yieldAPY?: string; // e.g. "5.00% APY"
  minDeposit: string; // e.g. "$0", "$500"
  regulatoryStatus: string; // e.g. "SEC & FINRA", "FDIC Insured", "FCA", "DeFi / Smart Contract"
  depositInsurance?: string; // e.g. "SIPC $500k + FDIC $2.5M"
  currentOffer?: string; // e.g. "$200 Cash Bonus on $1k deposit"
  isEditorPick?: boolean; // Editor's / Auditor's Pick
  upvotes: number;
  rating: number;
  reviewCount: number;
  url: string;
  affiliateUrl?: string;
  dateAdded: string;
  logo: PlatformLogo;
  keyPerks: string[];
  pros: string[];
  cons: string[];
  feeBreakdown?: { label: string; value: string; notes?: string }[];
  tags: string[];
  userReviews?: PlatformReview[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  count?: number;
}

// AI Tool types retained for compatibility
export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Open Source';
export interface ToolLogo {
  type: 'image' | 'text' | 'svg' | 'custom';
  text?: string;
  subtext?: string;
  bg: string;
  color?: string;
  border?: string;
  shape?: 'circle' | 'square';
  customSvg?: string;
}
export interface AITool {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  pricing: PricingType;
  category: string;
  secondaryCategory?: string;
  isMattsPick?: boolean;
  upvotes: number;
  url: string;
  affiliateUrl?: string;
  dateAdded: string;
  logo: ToolLogo;
  features?: string[];
  pricingDetails?: string;
  rating?: number;
  tags?: string[];
  reviewsCount?: number;
  tasks?: string[];
}

// Retained types for backwards compatibility with earlier components
export type PlatformCategory = 
  | 'Stock trading'
  | 'E-wallets'
  | 'Consumer lending'
  | 'Credit cards'
  | 'Crypto';

export interface FeeItem {
  label: string;
  value: string;
  notes?: string;
}

export interface SafetyInfo {
  regulatoryBody: string;
  depositInsurance: string;
  auditStatus: string;
  twoFactorAuth: boolean;
  dataEncryption: string;
}

export interface SignupStep {
  step: number;
  title: string;
  description: string;
  estimatedTime: string;
}

export interface Platform {
  id: string;
  name: string;
  tagline: string;
  category: PlatformCategory;
  logoText: string;
  rating: number;
  reviewCount: number;
  transactionFee: string;
  numericFeeSort: number;
  minDeposit: string;
  numericMinDepositSort: number;
  currentOffer: string;
  offerExpiry?: string;
  affiliateSlug: string;
  isTopPick?: boolean;
  dossierId: string;
  lastAuditDate: string;
  featureTags: [string, string];
  additionalTags?: string[];
  regulators: string[];
  overview: string;
  pros: string[];
  cons: string[];
  feeBreakdown: FeeItem[];
  safetyInfo: SafetyInfo;
  signupSteps: SignupStep[];
  alternatives: string[];
  idealFor: string;
  supportedAssets: string[];
  scores: {
    safety: number;
    feeTransparency: number;
    usability: number;
    overall: number;
  };
}

export interface AffiliateLinkConfig {
  slug: string;
  url: string;
  campaignId: string;
  disclosureText: string;
}

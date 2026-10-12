import { Platform } from '../types';

export const PLATFORMS: Platform[] = [
  {
    id: 'apex-markets',
    name: 'ApexMarkets',
    tagline: 'Zero-commission equity execution with verified FDIC cash sweep',
    category: 'Stock trading',
    logoText: 'AM',
    rating: 4.9,
    reviewCount: 3420,
    transactionFee: '$0 / trade',
    numericFeeSort: 0,
    minDeposit: '$0',
    numericMinDepositSort: 0,
    currentOffer: '$200 cash reward with $1,000 net deposit within 45 days',
    offerExpiry: 'Sept 30, 2026',
    affiliateSlug: 'apex-markets',
    isTopPick: true,
    dossierId: 'DOS-2026-0814',
    lastAuditDate: 'September 12, 2026',
    featureTags: ['Zero-fee equities', '4.85% cash yield'],
    additionalTags: ['Fractional shares', 'Extended hours', 'API access'],
    regulators: ['SEC', 'FINRA', 'SIPC'],
    overview: 'ApexMarkets scored highest in our 2026 broker safety and fee audit. They offer zero commission on US stocks and ETFs, unbundled order execution without predatory payment for order flow (PFOF), and automated sweep of uninvested cash into partner FDIC banks at 4.85% APY.',
    pros: [
      'True zero-commission on US equities and index ETFs',
      'High-yield cash sweep (4.85% APY) insured up to $2.5M via partner banks',
      'No account maintenance, inactivity, or standard wire transfer fees',
      'Independent audited order execution quality (price improvement rate > 94%)'
    ],
    cons: [
      'Assisted broker phone orders incur a $20 specialist surcharge',
      'Crypto asset trading is routed through a distinct third-party custody partner'
    ],
    feeBreakdown: [
      { label: 'Equities & ETFs', value: '$0.00', notes: 'Zero base commission' },
      { label: 'Options Contracts', value: '$0.50 / contract', notes: 'Volume discounts above 50 contracts/mo' },
      { label: 'Margin Interest Rate', value: '6.25% - 7.50%', notes: 'Tiered based on debit balance' },
      { label: 'Account Maintenance', value: '$0.00', notes: 'No inactivity penalty' },
      { label: 'ACH Inbound/Outbound', value: '$0.00', notes: 'Standard 1-2 business day settlement' }
    ],
    safetyInfo: {
      regulatoryBody: 'SEC Registered Broker-Dealer; FINRA Member CRD #149204',
      depositInsurance: 'SIPC protection up to $500,000 (including $250,000 cash). Cash sweep balances covered up to $2.5M by aggregate FDIC insurance.',
      auditStatus: 'Clean SOC 2 Type II audit conducted June 2026 by Grant Thornton LLP.',
      twoFactorAuth: true,
      dataEncryption: 'AES-256 at rest, TLS 1.3 in transit with hardware security key (FIDO2) support.'
    },
    signupSteps: [
      {
        step: 1,
        title: 'Identity Verification (CIP/KYC)',
        description: 'Provide SSN/TIN, residential address, and upload valid government photo identification.',
        estimatedTime: '3-5 minutes'
      },
      {
        step: 2,
        title: 'Investor Suitability Profile',
        description: 'Answer required regulatory questions regarding risk tolerance, liquid net worth, and trading objectives.',
        estimatedTime: '2 minutes'
      },
      {
        step: 3,
        title: 'Link Financial Institution',
        description: 'Connect checking account securely via instant open-banking API or micro-deposit verification.',
        estimatedTime: '2 minutes'
      },
      {
        step: 4,
        title: 'Execute Qualifying Deposit',
        description: 'Fund account to activate live market quoting and claim the $200 bonus tier if depositing $1,000+.',
        estimatedTime: 'Instant clearance'
      }
    ],
    alternatives: ['horizon-securities', 'vanguard-direct'],
    idealFor: 'Active retail investors, buy-and-hold indexers, and yield-focused cash savers.',
    supportedAssets: ['US Equities', 'ETFs', 'Options', 'Treasury Bills', 'Fractional Shares'],
    scores: {
      safety: 98,
      feeTransparency: 99,
      usability: 94,
      overall: 97
    }
  },
  {
    id: 'horizon-securities',
    name: 'Horizon Securities',
    tagline: 'Deep institutional research and advanced desktop terminal access',
    category: 'Stock trading',
    logoText: 'HZ',
    rating: 4.7,
    reviewCount: 1980,
    transactionFee: '$0.65 / contract',
    numericFeeSort: 0.65,
    minDeposit: '$500',
    numericMinDepositSort: 500,
    currentOffer: '300 free commission-free contract credits + Morningstar Research access',
    offerExpiry: 'Oct 15, 2026',
    affiliateSlug: 'horizon-securities',
    dossierId: 'DOS-2026-0492',
    lastAuditDate: 'August 28, 2026',
    featureTags: ['Level 2 data', 'Multi-leg options'],
    additionalTags: ['Futures trading', 'Direct market access', 'Paper trading'],
    regulators: ['SEC', 'FINRA', 'NFA', 'SIPC'],
    overview: 'Horizon Securities is built for analytical traders requiring real-time depth of book, comprehensive algorithmic order routing, and professional equity research dossiers without high overhead.',
    pros: [
      'Comprehensive institutional-grade charting and Level 2 market data included',
      'Fast direct market order execution routes (SmartRouting v4)',
      'Robust desktop terminal software with hotkey execution'
    ],
    cons: [
      '$500 initial minimum opening deposit required',
      'Platform interface carries a steeper learning curve for complete beginners'
    ],
    feeBreakdown: [
      { label: 'Stock & ETF Trades', value: '$0.00', notes: 'Electronic orders' },
      { label: 'Options Pricing', value: '$0.65 per contract', notes: '$0.40 for 100+ contracts' },
      { label: 'Futures', value: '$1.25 per side', notes: 'Plus exchange fees' },
      { label: 'Wire Withdrawal', value: '$15.00', notes: 'One free domestic wire per calendar month' }
    ],
    safetyInfo: {
      regulatoryBody: 'SEC & CFTC Registered, FINRA & NFA Member',
      depositInsurance: 'SIPC coverage up to $500,000, supplemental Lloyd’s of London syndicate coverage up to $30M.',
      auditStatus: 'Annual PCAOB compliant financial condition review verified July 2026.',
      twoFactorAuth: true,
      dataEncryption: 'End-to-end proprietary protocol with biometric token requirement.'
    },
    signupSteps: [
      {
        step: 1,
        title: 'Account Type Selection',
        description: 'Choose between Individual Margin, Cash, Joint, or Corporate Entity trading accounts.',
        estimatedTime: '2 minutes'
      },
      {
        step: 2,
        title: 'Regulatory & Options Level Approval',
        description: 'Complete Options Agreement form to verify suitability for Level 1-4 complex derivative trading.',
        estimatedTime: '5 minutes'
      },
      {
        step: 3,
        title: 'Deposit $500 Minimum',
        description: 'Initiate wire or ACH transfer to satisfy opening capital requirement.',
        estimatedTime: '1 business day'
      }
    ],
    alternatives: ['apex-markets', 'vanguard-direct'],
    idealFor: 'Experienced options traders, quantitative analysts, and active market participants.',
    supportedAssets: ['US Equities', 'Global Stocks', 'Index Options', 'Commodities', 'Futures'],
    scores: {
      safety: 96,
      feeTransparency: 93,
      usability: 89,
      overall: 93
    }
  },
  {
    id: 'vanguard-direct',
    name: 'Vanguard Direct',
    tagline: 'Client-owned index powerhouse with ultra-low expense ratios',
    category: 'Stock trading',
    logoText: 'VG',
    rating: 4.8,
    reviewCount: 4890,
    transactionFee: '$0 / trade',
    numericFeeSort: 0,
    minDeposit: '$0',
    numericMinDepositSort: 0,
    currentOffer: '$0 advisory fees for 90 days on digital robo-managed portfolios',
    offerExpiry: 'Ongoing',
    affiliateSlug: 'vanguard-direct',
    dossierId: 'DOS-2026-0118',
    lastAuditDate: 'August 15, 2026',
    featureTags: ['At-cost fund model', 'Retirement tools'],
    additionalTags: ['Automatic rebalancing', 'Dividend reinvestment', 'IRA specialists'],
    regulators: ['SEC', 'FINRA', 'SIPC'],
    overview: 'A pioneer in low-cost indexing, Vanguard operates with a unique mutually owned corporate structure where fund shareholders own the company, keeping asset-management expense ratios among the lowest globally.',
    pros: [
      'Unmatched institutional integrity and shareholder-owned mutual alignment',
      'Zero trade commissions on all US stocks and Vanguard proprietary ETFs',
      'Superb tax-loss harvesting and retirement planning calculation engines'
    ],
    cons: [
      'Mobile application and web interface prioritize longevity over rapid day-trading',
      'Certain proprietary mutual funds mandate a $3,000 minimum investment'
    ],
    feeBreakdown: [
      { label: 'Stock & ETF Trades', value: '$0.00', notes: 'Self-directed digital trades' },
      { label: 'Average Fund Expense Ratio', value: '0.08%', notes: 'Industry average is ~0.47%' },
      { label: 'Annual Account Fee', value: '$0.00', notes: 'Waived for electronic document delivery' },
      { label: 'Robo-Advisory Fee', value: '0.15% AUM', notes: 'Includes automatic tax-loss harvesting' }
    ],
    safetyInfo: {
      regulatoryBody: 'SEC Registered Investment Advisor and Broker-Dealer',
      depositInsurance: 'SIPC protected up to statutory $500k limit plus supplemental excess insurance policies.',
      auditStatus: 'PricewaterhouseCoopers annual comprehensive certified audit.',
      twoFactorAuth: true,
      dataEncryption: 'Strict TLS 1.3 cryptographic transport with device fingerprinting.'
    },
    signupSteps: [
      {
        step: 1,
        title: 'Account Purpose Selection',
        description: 'Select Roth IRA, Traditional IRA, 529 College Savings, or General Taxable Brokerage.',
        estimatedTime: '2 minutes'
      },
      {
        step: 2,
        title: 'Bank Verification',
        description: 'Connect funding bank account for recurring automated dollar-cost averaging.',
        estimatedTime: '3 minutes'
      },
      {
        step: 3,
        title: 'Portfolio Model Selection',
        description: 'Opt for self-directed ETF construction or automated target-date retirement indexing.',
        estimatedTime: '4 minutes'
      }
    ],
    alternatives: ['apex-markets', 'horizon-securities'],
    idealFor: 'Long-term retirement investors, Boglehead indexers, and passive wealth builders.',
    supportedAssets: ['ETFs', 'Index Mutual Funds', 'Treasuries', 'Target-Date Funds'],
    scores: {
      safety: 99,
      feeTransparency: 98,
      usability: 88,
      overall: 95
    }
  },
  {
    id: 'vaultpay-global',
    name: 'VaultPay Global',
    tagline: 'Multi-currency digital wallet with real mid-market foreign exchange rates',
    category: 'E-wallets',
    logoText: 'VP',
    rating: 4.8,
    reviewCount: 2750,
    transactionFee: '0.35% FX fee',
    numericFeeSort: 0.35,
    minDeposit: '$0',
    numericMinDepositSort: 0,
    currentOffer: 'First $1,000 in international cross-border transfers fee-free',
    offerExpiry: 'Oct 31, 2026',
    affiliateSlug: 'vaultpay-global',
    dossierId: 'DOS-2026-0720',
    lastAuditDate: 'September 04, 2026',
    featureTags: ['40+ currencies', 'Virtual burner cards'],
    additionalTags: ['Instant P2P', 'Debit card cashback', 'Apple Pay / Google Pay'],
    regulators: ['FinCEN (MSB)', 'FCA (UK)', 'FDIC Pass-Through'],
    overview: 'VaultPay Global replaces expensive bank wire markups with transparent, live mid-market foreign exchange conversions and multi-currency IBAN accounts across 40 jurisdictions.',
    pros: [
      'Zero hidden exchange spread markups; fee clearly itemized upfront',
      'Generate instant single-use virtual debit cards for secure online checkouts',
      'Local banking details in USD, EUR, GBP, AUD, and SGD included'
    ],
    cons: [
      'ATM cash withdrawals over $400/month incur a 1.75% withdrawal surcharge',
      'No physical brick-and-mortar branch locations for counter deposits'
    ],
    feeBreakdown: [
      { label: 'Domestic Transfer (P2P)', value: '$0.00', notes: 'Instant settlement between users' },
      { label: 'Cross-Border FX Conversion', value: '0.35% - 0.45%', notes: 'Real mid-market Reuters rate' },
      { label: 'Monthly Account Fee', value: '$0.00', notes: 'No minimum balance penalty' },
      { label: 'Debit Card Issuance', value: '$0.00', notes: 'Free digital card; physical card free with $20 deposit' }
    ],
    safetyInfo: {
      regulatoryBody: 'Licensed Money Services Business (FinCEN 31000219491); Authorized by UK Financial Conduct Authority',
      depositInsurance: 'Funds safeguarded in bankruptcy-remote ring-fenced Tier 1 commercial banks with FDIC pass-through coverage.',
      auditStatus: 'Deloitte SOC 1 Type 2 and ISO/IEC 27001 certified (May 2026).',
      twoFactorAuth: true,
      dataEncryption: 'Tokenized transaction credentials and real-time transaction geo-fencing.'
    },
    signupSteps: [
      {
        step: 1,
        title: 'Phone & Email Setup',
        description: 'Enter credentials and confirm via 6-digit cryptographic SMS/Authenticator token.',
        estimatedTime: '1 minute'
      },
      {
        step: 2,
        title: 'Document Scan',
        description: 'Automated biometric selfie and passport or national identity verification.',
        estimatedTime: '2 minutes'
      },
      {
        step: 3,
        title: 'Instant Virtual Card Activation',
        description: 'Add newly minted virtual card to Apple Wallet or Google Wallet immediately.',
        estimatedTime: 'Instant'
      }
    ],
    alternatives: ['meridian-cash'],
    idealFor: 'Remote professionals, expatriates, international shoppers, and frequent travelers.',
    supportedAssets: ['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'SGD', 'CHF'],
    scores: {
      safety: 95,
      feeTransparency: 97,
      usability: 96,
      overall: 96
    }
  },
  {
    id: 'meridian-cash',
    name: 'Meridian Cash',
    tagline: 'High-yield cash management with automated smart-split savings vault',
    category: 'E-wallets',
    logoText: 'MC',
    rating: 4.7,
    reviewCount: 1640,
    transactionFee: '$0 / transfer',
    numericFeeSort: 0,
    minDeposit: '$25',
    numericMinDepositSort: 25,
    currentOffer: '4.90% APY on balances up to $100,000 + $50 funding credit',
    offerExpiry: 'Nov 15, 2026',
    affiliateSlug: 'meridian-cash',
    dossierId: 'DOS-2026-0611',
    lastAuditDate: 'September 01, 2026',
    featureTags: ['4.90% APY yield', 'Early direct deposit'],
    additionalTags: ['No overdraft fees', 'Automatic bill pay', 'Round-up savings'],
    regulators: ['FDIC Member Partner Bank', 'FinCEN'],
    overview: 'Meridian Cash bridges consumer checking utilities with prime-rate liquidity. Deposits are programmatically distributed across a network of 12 partner banks to yield 4.90% APY with up to $3,000,000 in total FDIC coverage.',
    pros: [
      'Top-tier 4.90% annual yield compounded daily and credited monthly',
      'Payroll direct deposits land up to 2 full business days ahead of traditional banks',
      'No monthly fees, no minimum balance requirements, and zero overdraft charges'
    ],
    cons: [
      'Paper check deposits take 3 business days to clear funds completely',
      'Out-of-network ATM operator surcharges are reimbursed up to $10 per month only'
    ],
    feeBreakdown: [
      { label: 'Monthly Maintenance', value: '$0.00', notes: 'No conditions or minimums' },
      { label: 'Domestic Transfers', value: '$0.00', notes: 'Standard and express ACH included' },
      { label: 'Overdraft Protection', value: '$0.00', notes: 'Transactions declined gracefully without fee' },
      { label: 'Cash Card In-Network ATM', value: '$0.00', notes: 'Over 55,000 Allpoint ATM locations' }
    ],
    safetyInfo: {
      regulatoryBody: 'Banking services provided by Evolve Bank & Trust, Member FDIC',
      depositInsurance: 'Up to $3,000,000 FDIC coverage through partner deposit sweep program.',
      auditStatus: 'Independent quarterly compliance testing published August 2026.',
      twoFactorAuth: true,
      dataEncryption: '256-bit bank-grade encryption with automated fraud heuristics.'
    },
    signupSteps: [
      {
        step: 1,
        title: 'Personal Information Entry',
        description: 'Input legal name, current tax address, and verify phone number.',
        estimatedTime: '2 minutes'
      },
      {
        step: 2,
        title: 'Direct Deposit or Initial $25 Transfer',
        description: 'Fund account using debit card or direct bank login.',
        estimatedTime: '2 minutes'
      },
      {
        step: 3,
        title: 'Configure Savings Goals',
        description: 'Designate automated percentages for emergency funds and bills.',
        estimatedTime: '1 minute'
      }
    ],
    alternatives: ['vaultpay-global'],
    idealFor: 'Savers looking for maximum yield on daily liquid reserves without lockup periods.',
    supportedAssets: ['USD Cash', 'High-Yield Reserve Balances'],
    scores: {
      safety: 97,
      feeTransparency: 98,
      usability: 95,
      overall: 96
    }
  },
  {
    id: 'beacon-lending',
    name: 'Beacon Lending',
    tagline: 'Transparent fixed-rate personal installment loans with zero origination fees',
    category: 'Consumer lending',
    logoText: 'BL',
    rating: 4.6,
    reviewCount: 1120,
    transactionFee: '0% origination fee',
    numericFeeSort: 0,
    minDeposit: '$1,000 min loan',
    numericMinDepositSort: 1000,
    currentOffer: '0.50% APR interest rate discount with automated autopay enrollment',
    offerExpiry: 'Ongoing',
    affiliateSlug: 'beacon-lending',
    dossierId: 'DOS-2026-0388',
    lastAuditDate: 'August 19, 2026',
    featureTags: ['No prepayment fees', 'Soft credit check'],
    additionalTags: ['Fixed monthly rate', 'Debt consolidation', 'Next-day ACH'],
    regulators: ['CFPB', 'State Banking Commissioners (All 50 States)'],
    overview: 'Beacon Lending is our top-ranked personal loan provider due to its absolute ban on upfront origination fees, application costs, and prepayment penalties. Fixed rates span 6.49% to 19.99% APR based on underwriting tier.',
    pros: [
      'No origination fee (saves $300 - $1,500 compared to competitor averages)',
      'Check customized rate offers via soft credit inquiry without impacting FICO score',
      'Direct creditor payoff option available for debt consolidation loans'
    ],
    cons: [
      'Requires minimum credit score of 660 for tier 1 prime rates',
      'Maximum loan ceiling capped at $50,000 (larger commercial borrowing unavailable)'
    ],
    feeBreakdown: [
      { label: 'Origination Fee', value: '0.00%', notes: '100% of approved loan funds disbursed' },
      { label: 'Prepayment Penalty', value: '$0.00', notes: 'Pay off loan early at any time' },
      { label: 'Annual Percentage Rate (APR)', value: '6.49% - 19.99%', notes: 'Fixed rate with autopay discount' },
      { label: 'Late Payment Fee', value: '$15.00', notes: '15-day grace period before assessment' }
    ],
    safetyInfo: {
      regulatoryBody: 'Supervised by Consumer Financial Protection Bureau (CFPB) & NMLS #1674421',
      depositInsurance: 'Direct lending facility partnered with Cross River Bank, Member FDIC.',
      auditStatus: 'Annual fair lending compliance audit and state licensing filings current.',
      twoFactorAuth: true,
      dataEncryption: 'AES-256 secure loan portal with strict document redaction.'
    },
    signupSteps: [
      {
        step: 1,
        title: 'Check Rate (Soft Inquiry)',
        description: 'Provide income and loan purpose to review pre-qualified rate offers without credit damage.',
        estimatedTime: '2 minutes'
      },
      {
        step: 2,
        title: 'Select Term Length',
        description: 'Pick repayment term between 24 and 60 months with clear monthly payment preview.',
        estimatedTime: '1 minute'
      },
      {
        step: 3,
        title: 'Sign Agreement & Disburse',
        description: 'Verify W-2 or bank statements digitally; funds deposited via ACH as fast as next business morning.',
        estimatedTime: 'Same day clearance'
      }
    ],
    alternatives: ['crestview-credit'],
    idealFor: 'Borrowers refinancing high-interest credit card balances and home improvement planners.',
    supportedAssets: ['Unsecured Personal Loans ($1k - $50k)'],
    scores: {
      safety: 94,
      feeTransparency: 98,
      usability: 91,
      overall: 93
    }
  },
  {
    id: 'crestview-credit',
    name: 'Crestview Personal Loans',
    tagline: 'Rapid underwriting personal credit lines with flexible draw options',
    category: 'Consumer lending',
    logoText: 'CP',
    rating: 4.5,
    reviewCount: 940,
    transactionFee: '1.99% origination',
    numericFeeSort: 1.99,
    minDeposit: '$2,000 min loan',
    numericMinDepositSort: 2000,
    currentOffer: '$100 statement rebate when paying off 3+ existing credit cards',
    offerExpiry: 'Oct 30, 2026',
    affiliateSlug: 'crestview-credit',
    dossierId: 'DOS-2026-0294',
    lastAuditDate: 'July 30, 2026',
    featureTags: ['Same-day wire option', 'Credit line flexibility'],
    additionalTags: ['Revolving draw', 'Co-signer accepted', 'Credit score tracking'],
    regulators: ['CFPB', 'NMLS #998312'],
    overview: 'Crestview provides both fixed installment loans and open-ended revolving lines of credit, allowing borrowers to draw funds as needed and only incur interest charges on the outstanding deployed balance.',
    pros: [
      'Revolving credit line feature means you only pay interest on what you withdraw',
      'Accepts co-signers to help applicants secure lower APR tiers',
      'User dashboard includes complimentary TransUnion credit score simulator'
    ],
    cons: [
      'Carries a 1.99% to 4.99% upfront origination fee deducted from disbursement',
      'Slightly higher interest ceiling for lower credit score brackets'
    ],
    feeBreakdown: [
      { label: 'Origination Fee', value: '1.99% - 4.99%', notes: 'Deducted from initial loan total' },
      { label: 'APR Range', value: '7.99% - 24.99%', notes: 'Variable based on benchmark prime' },
      { label: 'Draw Fee', value: '$0.00', notes: 'No fee to initiate secondary draws' },
      { label: 'Prepayment Charge', value: '$0.00', notes: 'Zero penalty for accelerating payments' }
    ],
    safetyInfo: {
      regulatoryBody: 'State-licensed financial lender; NMLS registry verified.',
      depositInsurance: 'Financed in partnership with WebBank, Member FDIC.',
      auditStatus: 'Regulatory consumer protection audit completed March 2026.',
      twoFactorAuth: true,
      dataEncryption: 'TLS 1.3 encryption with strict credential vaulting.'
    },
    signupSteps: [
      {
        step: 1,
        title: 'Prequalification Questionnaire',
        description: 'Provide desired credit line and employment history for automated decisioning.',
        estimatedTime: '3 minutes'
      },
      {
        step: 2,
        title: 'Income Verification',
        description: 'Connect payroll provider or upload recent pay stubs.',
        estimatedTime: '2 minutes'
      },
      {
        step: 3,
        title: 'Electronic Signing',
        description: 'Review Truth in Lending Act (TILA) disclosure statement and sign note.',
        estimatedTime: '2 minutes'
      }
    ],
    alternatives: ['beacon-lending'],
    idealFor: 'Borrowers needing ongoing revolving credit for unpredictable staged expenses.',
    supportedAssets: ['Revolving Credit Lines ($2k - $35k)'],
    scores: {
      safety: 91,
      feeTransparency: 90,
      usability: 92,
      overall: 90
    }
  },
  {
    id: 'sovereign-slate',
    name: 'Sovereign Slate Card',
    tagline: 'Straightforward unlimited 2% cash back with zero annual fee and 0% intro APR',
    category: 'Credit cards',
    logoText: 'SS',
    rating: 4.8,
    reviewCount: 3100,
    transactionFee: '$0 annual fee',
    numericFeeSort: 0,
    minDeposit: '$0',
    numericMinDepositSort: 0,
    currentOffer: '$250 bonus after spending $1,500 in first 3 months + 0% intro APR for 15 months',
    offerExpiry: 'Oct 31, 2026',
    affiliateSlug: 'sovereign-slate',
    dossierId: 'DOS-2026-0955',
    lastAuditDate: 'September 10, 2026',
    featureTags: ['Unlimited 2% cashback', '0% intro APR 15mo'],
    additionalTags: ['No category caps', 'Cell phone protection', 'Auto rental collision waiver'],
    regulators: ['OCC', 'CFPB', 'FDIC'],
    overview: 'The Sovereign Slate Card eliminates complicated rotating bonus categories by offering an automatic, unlimited 2% cash back (1% when you buy, 1% as you pay) on every single dollar spent, alongside an industry-leading 15-month 0% intro APR period.',
    pros: [
      'Simple, dependable 2% rewards rate on all purchases with no quarterly activation',
      '15 billing cycles of 0% introductory APR on both new purchases and balance transfers',
      'No annual fee ever, plus complimentary cell phone protection up to $800'
    ],
    cons: [
      '3% foreign transaction fee makes it less optimal for spending outside the US',
      'Balance transfers require a 3% balance transfer fee ($5 minimum)'
    ],
    feeBreakdown: [
      { label: 'Annual Fee', value: '$0.00', notes: 'No annual charge' },
      { label: 'Intro Purchase APR', value: '0.00%', notes: 'First 15 billing cycles' },
      { label: 'Standard Variable APR', value: '16.99% - 26.99%', notes: 'Based on prime rate and creditworthiness' },
      { label: 'Balance Transfer Fee', value: '3.00%', notes: '$5 minimum' },
      { label: 'Foreign Transaction Fee', value: '3.00%', notes: 'On non-USD charges' }
    ],
    safetyInfo: {
      regulatoryBody: 'Issued by First National Bank of Omaha under license from Mastercard International',
      depositInsurance: 'FDIC insured depository issuer; zero liability fraud guarantee.',
      auditStatus: 'Full PCI DSS Level 1 compliant infrastructure.',
      twoFactorAuth: true,
      dataEncryption: 'Card tokenization, instant digital lock switch, dynamic CVV security.'
    },
    signupSteps: [
      {
        step: 1,
        title: 'Check Pre-Approval',
        description: 'Verify eligibility without affecting credit report.',
        estimatedTime: '60 seconds'
      },
      {
        step: 2,
        title: 'Submit Formal Application',
        description: 'Confirm income, employment, and monthly housing expense.',
        estimatedTime: '2 minutes'
      },
      {
        step: 3,
        title: 'Instant Card Number Issuance',
        description: 'Access digital credit card numbers immediately upon approval for online transactions.',
        estimatedTime: 'Instant'
      }
    ],
    alternatives: ['atlas-premier'],
    idealFor: 'Everyday spenders wanting effortless cash back and consumers needing 0% interest balance relief.',
    supportedAssets: ['Credit Line ($5k - $30k)'],
    scores: {
      safety: 97,
      feeTransparency: 97,
      usability: 96,
      overall: 96
    }
  },
  {
    id: 'atlas-premier',
    name: 'Atlas Premier Rewards',
    tagline: 'Comprehensive travel ecosystem with 3x points and premium airport lounge perks',
    category: 'Credit cards',
    logoText: 'AP',
    rating: 4.7,
    reviewCount: 2240,
    transactionFee: '$95 annual fee',
    numericFeeSort: 95,
    minDeposit: '$0',
    numericMinDepositSort: 0,
    currentOffer: '60,000 bonus points (worth $750 in travel) after $4,000 spend in first 3 months',
    offerExpiry: 'Nov 30, 2026',
    affiliateSlug: 'atlas-premier',
    dossierId: 'DOS-2026-0518',
    lastAuditDate: 'September 08, 2026',
    featureTags: ['3x travel & dining', 'No foreign fees'],
    additionalTags: ['Trip delay insurance', '1:1 point transfers', 'Global Entry credit'],
    regulators: ['OCC', 'CFPB', 'FDIC'],
    overview: 'Atlas Premier Rewards delivers outstanding value for travelers, pairing generous 3x point multipliers on dining and flights with 1:1 points transferability across 14 major global airline and hotel loyalty networks.',
    pros: [
      '60,000 bonus point welcome gift easily eclipses the $95 annual fee for multiple years',
      'Zero foreign transaction fees on all purchases abroad',
      'Comprehensive primary car rental collision damage waiver and trip cancellation protection'
    ],
    cons: [
      '$95 annual fee billed upon first statement cycle',
      'Requires good-to-excellent credit (recommended 710+ credit score)'
    ],
    feeBreakdown: [
      { label: 'Annual Membership Fee', value: '$95.00', notes: 'Billed annually' },
      { label: 'Purchase APR', value: '18.49% - 27.49%', notes: 'Variable with Prime' },
      { label: 'Foreign Transaction Fee', value: '$0.00', notes: '0% on all international transactions' },
      { label: 'Cash Advance Fee', value: '5.00%', notes: '$10 minimum, 29.99% APR' }
    ],
    safetyInfo: {
      regulatoryBody: 'Supervised by Office of the Comptroller of the Currency (OCC)',
      depositInsurance: 'Issuer backed by FDIC Member Bank; 24/7 Mastercard concierge & emergency dispatch.',
      auditStatus: 'PCI DSS Level 1 certified bank processing.',
      twoFactorAuth: true,
      dataEncryption: 'Encrypted contactless NFC chip technology and biometric app unlock.'
    },
    signupSteps: [
      {
        step: 1,
        title: 'Eligibility Check',
        description: 'Review credit tier and annual household income requirements.',
        estimatedTime: '1 minute'
      },
      {
        step: 2,
        title: 'Application Submission',
        description: 'Complete secure encrypted web form.',
        estimatedTime: '2 minutes'
      },
      {
        step: 3,
        title: 'Priority Shipping',
        description: 'Metallic physical card delivered within 2-3 business days via courier.',
        estimatedTime: '2-3 days'
      }
    ],
    alternatives: ['sovereign-slate'],
    idealFor: 'Frequent travelers, dining enthusiasts, and mileage rewards optimizers.',
    supportedAssets: ['Credit Line ($7.5k - $45k)'],
    scores: {
      safety: 96,
      feeTransparency: 94,
      usability: 93,
      overall: 94
    }
  },
  {
    id: 'nexus-digital',
    name: 'Nexus Digital Exchange',
    tagline: 'Audited proof-of-reserves spot exchange with ultra-tight spread execution',
    category: 'Crypto',
    logoText: 'ND',
    rating: 4.7,
    reviewCount: 2890,
    transactionFee: '0.10% maker / taker',
    numericFeeSort: 0.1,
    minDeposit: '$10',
    numericMinDepositSort: 10,
    currentOffer: '$25 Bitcoin welcome reward with $100 first crypto purchase + 30 days zero maker fees',
    offerExpiry: 'Oct 31, 2026',
    affiliateSlug: 'nexus-digital',
    dossierId: 'DOS-2026-0774',
    lastAuditDate: 'September 11, 2026',
    featureTags: ['Monthly Merkle audit', 'Cold storage custody'],
    additionalTags: ['Over 120 tokens', 'Staking rewards', 'Advanced order book'],
    regulators: ['FinCEN (MSB)', 'NYDFS BitLicense Candidate', 'NFA registered'],
    overview: 'Nexus Digital is built around verifiable solvency. Unlike opaque offshore exchanges, Nexus publishes monthly cryptographic Merkle-tree proof-of-reserves verified by Armanino LLP, proving 102.4% asset backing for all customer deposits.',
    pros: [
      'Monthly cryptographic Merkle-tree proof of reserves independently audited and verified',
      'Low baseline trading fees: 0.10% maker / 0.10% taker with further volume discounts',
      '98%+ of customer digital assets kept in geographically distributed cold storage vaults'
    ],
    cons: [
      'Strict KYC verification requires government ID and facial scan before any trades occur',
      'Fiat wire withdrawals incur a $10 processing charge'
    ],
    feeBreakdown: [
      { label: 'Maker Trade Fee', value: '0.10%', notes: 'Drops to 0.02% based on 30-day volume' },
      { label: 'Taker Trade Fee', value: '0.10%', notes: 'Drops to 0.05% based on 30-day volume' },
      { label: 'Crypto Deposit', value: '$0.00', notes: 'Zero exchange fee; standard blockchain gas only' },
      { label: 'USD ACH Deposit', value: '$0.00', notes: 'Free instant settlement' },
      { label: 'Crypto Network Withdrawal', value: 'Dynamic Network Cost', notes: 'Zero markup over blockchain fee' }
    ],
    safetyInfo: {
      regulatoryBody: 'Registered US Money Services Business (FinCEN); Compliance with BSA/AML guidelines.',
      depositInsurance: 'USD cash balances held at FDIC-insured partner banks up to $250k. Digital assets protected by $250M crime insurance syndicate.',
      auditStatus: 'Proof of Reserves audit performed August 31, 2026, confirming 102.4% asset coverage.',
      twoFactorAuth: true,
      dataEncryption: 'YubiKey / FIDO2 hardware keys mandatory for administrative and withdrawal actions.'
    },
    signupSteps: [
      {
        step: 1,
        title: 'Account Registration',
        description: 'Provide email, strong password, and bind hardware 2FA or authenticator app.',
        estimatedTime: '2 minutes'
      },
      {
        step: 2,
        title: 'KYC Identity Verification',
        description: 'Submit government-issued photo ID and automated biometric liveness verification.',
        estimatedTime: '3 minutes'
      },
      {
        step: 3,
        title: 'Deposit USD or Crypto',
        description: 'Connect bank account via ACH or generate on-chain wallet addresses.',
        estimatedTime: 'Instant'
      }
    ],
    alternatives: ['kestrel-custody'],
    idealFor: 'Transparency-minded crypto investors, spot traders, and dollar-cost averaging accumulators.',
    supportedAssets: ['BTC', 'ETH', 'SOL', 'USDC', 'AVAX', 'MATIC', 'LINK', '100+ spot pairs'],
    scores: {
      safety: 96,
      feeTransparency: 98,
      usability: 94,
      overall: 95
    }
  },
  {
    id: 'kestrel-custody',
    name: 'Kestrel Custody',
    tagline: 'Institutional air-gapped security and qualified custody for high-balance crypto assets',
    category: 'Crypto',
    logoText: 'KC',
    rating: 4.6,
    reviewCount: 880,
    transactionFee: '0.25% trade fee',
    numericFeeSort: 0.25,
    minDeposit: '$1,000',
    numericMinDepositSort: 1000,
    currentOffer: 'Complimentary hardware security key + 6 months free sub-account isolation',
    offerExpiry: 'Dec 15, 2026',
    affiliateSlug: 'kestrel-custody',
    dossierId: 'DOS-2026-0166',
    lastAuditDate: 'August 14, 2026',
    featureTags: ['Qualified custodian', 'Air-gapped multi-sig'],
    additionalTags: ['Custom policy approvals', 'Whitelisted withdrawal addresses', 'Time-lock delays'],
    regulators: ['South Dakota Division of Banking', 'FinCEN'],
    overview: 'Kestrel Custody operates as a chartered trust company and qualified custodian, engineered specifically for high-net-worth individuals, trusts, and family offices demanding institutional-grade digital asset preservation.',
    pros: [
      'Chartered state trust company subject to strict regulatory fiduciary standards',
      'Proprietary 3-of-5 multi-signature cold storage with customized quorum approvals',
      'Configurable 24-48 hour withdrawal time-locks and multi-user administrative authorization'
    ],
    cons: [
      'Minimum account funding threshold of $1,000',
      'Slightly higher 0.25% transaction fee compared to retail spot exchanges'
    ],
    feeBreakdown: [
      { label: 'Spot Trading Fee', value: '0.25%', notes: 'Direct OTC and order book matching' },
      { label: 'Custody Fee', value: '0.00% (under $500k)', notes: '0.15% annualized on balances > $500k' },
      { label: 'Inbound Wire Deposit', value: '$0.00', notes: 'No fee' },
      { label: 'Outbound Wire Withdrawal', value: '$25.00', notes: 'Fedwire manual security review' }
    ],
    safetyInfo: {
      regulatoryBody: 'Chartered Trust Company regulated by the South Dakota Division of Banking.',
      depositInsurance: '$500M aggregate Lloyd’s of London specie and crime insurance policy for cold storage assets.',
      auditStatus: 'BDO USA certified SOC 1 Type II & SOC 2 Type II reports valid through 2026.',
      twoFactorAuth: true,
      dataEncryption: 'FIPS 140-2 Level 3 Hardware Security Modules (HSMs) in decommissioned military bunkers.'
    },
    signupSteps: [
      {
        step: 1,
        title: 'Institutional Onboarding Request',
        description: 'Provide tax entity details, beneficiary designations, and authorized signers.',
        estimatedTime: '5 minutes'
      },
      {
        step: 2,
        title: 'Security Policy Definition',
        description: 'Define withdrawal approval rules, quorum limits, and IP address whitelists.',
        estimatedTime: '10 minutes'
      },
      {
        step: 3,
        title: 'Vault Funding',
        description: 'Transfer digital assets directly into dedicated, non-commingled segregated on-chain addresses.',
        estimatedTime: 'Variable'
      }
    ],
    alternatives: ['nexus-digital'],
    idealFor: 'Family offices, crypto self-directed IRAs, and investors with significant digital asset holdings.',
    supportedAssets: ['BTC', 'ETH', 'USDC', 'SOL', 'Major Layer-1s'],
    scores: {
      safety: 99,
      feeTransparency: 93,
      usability: 87,
      overall: 93
    }
  }
];

export const CATEGORIES = [
  'All',
  'Stock trading',
  'E-wallets',
  'Consumer lending',
  'Credit cards',
  'Crypto'
] as const;

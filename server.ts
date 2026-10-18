import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

interface PlatformPayload {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  category: string;
  secondaryCategory?: string;
  feeTier?: string;
  feeHighlight?: string;
  keyPerks?: string[];
  tags?: string[];
  pros?: string[];
}

interface SemanticMatch {
  platformId: string;
  similarityScore: number;
  matchReason: string;
  sharedThemes: string[];
}

interface SemanticSimilarResponse {
  analysisOverview: string;
  matches: SemanticMatch[];
  provider: string;
}

// Fallback heuristic if API key is not yet set or external call fails
function computeHeuristicSemanticSimilarity(
  target: PlatformPayload,
  candidates: PlatformPayload[],
  limit = 4
): SemanticSimilarResponse {
  const targetText = [
    target.name,
    target.description,
    target.fullDescription || '',
    target.category,
    target.secondaryCategory || '',
    target.feeHighlight || '',
    ...(target.keyPerks || []),
    ...(target.tags || []),
    ...(target.pros || []),
  ]
    .join(' ')
    .toLowerCase();

  const targetTokens = new Set(
    targetText
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['with', 'from', 'that', 'this', 'have', 'your', 'more'].includes(w))
  );

  const scored = candidates
    .filter((c) => c.id !== target.id)
    .map((c) => {
      const candidateText = [
        c.name,
        c.description,
        c.fullDescription || '',
        c.category,
        c.secondaryCategory || '',
        c.feeHighlight || '',
        ...(c.keyPerks || []),
        ...(c.tags || []),
        ...(c.pros || []),
      ]
        .join(' ')
        .toLowerCase();

      const candidateTokens = candidateText
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3);

      let overlapCount = 0;
      const matchedTokens: string[] = [];
      for (const t of candidateTokens) {
        if (targetTokens.has(t)) {
          overlapCount++;
          if (!matchedTokens.includes(t) && matchedTokens.length < 4) {
            matchedTokens.push(t);
          }
        }
      }

      // Semantic weight: cross-category synergy and feature overlap
      let baseScore = 68 + Math.min(26, overlapCount * 3);
      if (c.category === target.category) baseScore += 4;
      if (c.secondaryCategory && (c.secondaryCategory === target.category || c.secondaryCategory === target.secondaryCategory)) {
        baseScore += 3;
      }
      const similarityScore = Math.min(97, Math.max(65, Math.round(baseScore)));

      // Generate a descriptive rationale based on shared characteristics
      const themes = matchedTokens.slice(0, 3).map((t) => t.charAt(0).toUpperCase() + t.slice(1));
      if (themes.length === 0) {
        themes.push('Digital Finance', 'Account Tools');
      }

      const reason = `Shares strong product alignment in ${
        themes.slice(0, 2).join(' and ') || 'financial infrastructure'
      }, offering comparable service depth and user workflow.`;

      return {
        platformId: c.id,
        similarityScore,
        matchReason: reason,
        sharedThemes: themes,
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);

  return {
    analysisOverview: `Heuristic semantic profile highlights alternatives with overlapping capabilities in ${
      target.category
    } and adjacent fintech domains.`,
    matches: scored,
    provider: 'heuristic-fallback',
  };
}

// Heuristic fallback database for instant autofill when offline or without API key
function computeHeuristicAutofill(rawUrl: string, availableCategories: string[] = []): any {
  let normalized = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  let hostname = '';
  try {
    const parsed = new URL(normalized);
    hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    hostname = rawUrl.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }

  const domainParts = hostname.split('.');
  const baseName = domainParts[0] || 'fintech';

  const defaultCategories = [
    'Stock Trading',
    'Crypto Exchange',
    'High-Yield Savings',
    'Robo-Advisors & Wealth',
    'Digital Banking & Neobanks',
    'Consumer Lending',
    'Credit Cards',
    'Peer-to-Peer Transfers',
    'Business & Merchant Banking',
    'Real Estate Crowdfunding',
    'Decentralized Finance (DeFi)',
    'Forex & CFD Trading',
  ];
  const cats = availableCategories.length > 0 ? availableCategories : defaultCategories;

  // Known platform directory database
  const knownDict: Record<string, Partial<any>> = {
    robinhood: {
      name: 'Robinhood',
      category: 'Stock Trading',
      secondaryCategory: 'Options & Crypto',
      feeTier: 'Zero Fee',
      feeHighlight: '$0 Commission on US Stocks & Options',
      yieldAPY: '5.00% APY Cash Sweep',
      minDeposit: '$0',
      regulatoryStatus: 'SEC Registered, FINRA & SIPC Member',
      depositInsurance: 'SIPC up to $500k, FDIC sweep up to $2.25M',
      description: 'Pioneering commission-free stock, ETF, and options trading platform with integrated high-yield cash sweeps and cryptocurrency investing.',
      fullDescription: 'Robinhood democratized investing by eliminating trading commissions. The platform features an intuitive mobile-first interface, 24/7 customer phone support, IRA retirement matching up to 3% with Robinhood Gold, and generous uninvested cash interest.',
      pros: ['Zero commission trading on US stocks and ETFs', 'Up to 3% IRA retirement matching on Robinhood Gold', 'Competitive 5.00% APY cash sweep on uninvested capital', 'Modern, ultra-fast mobile application interface'],
      cons: ['Limited fixed-income bond trading options', 'Contract fees apply for index options'],
      keyPerks: ['5.00% APY cash sweep with Gold', '1-3% IRA contribution match', 'Extended trading hours from 7:00 AM to 8:00 PM ET'],
      tags: ['Stock Trading', 'Zero Fee', 'Mobile Trading', 'Options', 'Cash Sweep'],
      logo: { type: 'text', text: 'RH', bg: '#00C805', color: '#FFFFFF' },
      currentOffer: '$5 to $200 in free stock upon account funding',
    },
    webull: {
      name: 'Webull',
      category: 'Stock Trading',
      secondaryCategory: 'Technical Charting & Derivatives',
      feeTier: 'Zero Fee',
      feeHighlight: '$0 Commission on Stocks, ETFs & Options',
      yieldAPY: '5.00% Cash Management APY',
      minDeposit: '$0',
      regulatoryStatus: 'SEC Registered, FINRA & SIPC Member',
      depositInsurance: 'SIPC coverage up to $500,000',
      description: 'Advanced commission-free trading terminal offering institutional-grade technical charting, Level 2 NASDAQ quotes, and extended trading hours.',
      fullDescription: 'Webull bridges the gap between casual trading and professional technical execution. With comprehensive charting indicators, paper trading simulation, margin financing, and global macro data, it is built for self-directed investors.',
      pros: ['Full extended hours trading from 4:00 AM to 8:00 PM ET', 'Free technical indicators and NASDAQ Level 2 market depth', 'Zero commission options contracts with no per-contract fee'],
      cons: ['No automated dividend reinvestment on OTC securities', 'Customer service response times can fluctuate during market surges'],
      keyPerks: ['5.0% APY on idle cash', 'NASDAQ Level 2 complimentary trial', 'Zero per-contract options trading'],
      tags: ['Stock Trading', 'Zero Fee', 'Technical Analysis', 'Options'],
      logo: { type: 'text', text: 'WB', bg: '#0062FF', color: '#FFFFFF' },
      currentOffer: 'Up to 20 fractional stock shares for new deposits',
    },
    interactivebrokers: {
      name: 'Interactive Brokers',
      category: 'Stock Trading',
      secondaryCategory: 'Global Multi-Asset & Pro Execution',
      feeTier: 'Low Fee',
      feeHighlight: 'Ultra-low margin rates from 5.33%',
      yieldAPY: '4.83% APY on idle USD cash',
      minDeposit: '$0',
      regulatoryStatus: 'SEC, FINRA, SIPC, FCA & Global Regulators',
      depositInsurance: 'SIPC up to $500k + Lloyd\'s excess coverage',
      description: 'Premier global electronic brokerage serving retail investors, hedge funds, and institutions across 150+ global exchanges.',
      fullDescription: 'Interactive Brokers (IBKR) offers comprehensive market access to stocks, options, futures, forex, bonds, and funds globally from a single integrated account, backed by industry-low margin financing and automated smart routing.',
      pros: ['Direct market access to 150+ global exchange destinations', 'Lowest margin borrowing rates among major US brokerages', 'Comprehensive fixed-income, municipal bonds, and Treasury desk'],
      cons: ['Trader Workstation (TWS) desktop interface has a steep learning curve', 'Complex fee schedules for exotic multi-currency order types'],
      keyPerks: ['Earn up to 4.83% APY on cash', 'Global multi-currency accounts in 27+ currencies', 'IBKR GlobalTrader mobile suite'],
      tags: ['Stock Trading', 'Low Fee', 'Global Markets', 'Margin Lending', 'Institutional'],
      logo: { type: 'text', text: 'IB', bg: '#C6131B', color: '#FFFFFF' },
      currentOffer: 'Earn up to $1,000 in IBKR stock shares upon qualifying deposit',
    },
    coinbase: {
      name: 'Coinbase',
      category: 'Crypto Exchange',
      secondaryCategory: 'Institutional Custody & Staking',
      feeTier: 'Low Fee',
      feeHighlight: '0.40% maker / 0.60% taker volume tiering',
      yieldAPY: '5.00% APY on USDC holdings',
      minDeposit: '$2',
      regulatoryStatus: 'FinCEN MSB, NYDFS BitLicense, Publicly Traded (NASDAQ: COIN)',
      depositInsurance: 'FDIC pass-through on USD cash, SOC 1/2 Certified Cold Storage',
      description: 'Publicly audited, highly regulated digital asset exchange and institutional custodian supporting 250+ cryptocurrencies.',
      fullDescription: 'Coinbase is the premier regulated crypto platform for retail and institutional participants. Offering spot trading, Web3 wallet integration, and automated staking, it enforces stringent regulatory compliance and audited reserves.',
      pros: ['Publicly traded in the US with quarterly audited financial reports', 'Highest tier institutional cold storage and insurance protocols', 'Instant automated rewards on USDC stablecoin balances'],
      cons: ['Standard consumer buy/sell fees are higher than Advanced Trade interface', 'Staking fees taken on native protocol rewards'],
      keyPerks: ['5.0% APY on USDC with zero lockup', 'Coinbase One zero trading fees subscription', 'Integrated self-custody Web3 wallet'],
      tags: ['Crypto Exchange', 'Regulated', 'Staking', 'Web3', 'USDC Yield'],
      logo: { type: 'text', text: 'CB', bg: '#0052FF', color: '#FFFFFF' },
      currentOffer: 'Get $10 in Bitcoin after funding and first trade',
    },
    binance: {
      name: 'Binance',
      category: 'Crypto Exchange',
      secondaryCategory: 'Derivatives & Liquidity Hub',
      feeTier: 'Low Fee',
      feeHighlight: '0.10% spot (0.075% with BNB discount)',
      yieldAPY: 'Up to 12.5% Earn & Staking yields',
      minDeposit: '$10',
      regulatoryStatus: 'Global VASP, Dubai VARA & French AMF Registered',
      depositInsurance: 'SAFU (Secure Asset Fund for Users) $1B+ emergency reserve',
      description: 'World\'s largest cryptocurrency exchange by trading volume, offering deep liquidity across spot, futures, and crypto savings.',
      fullDescription: 'Binance provides the industry\'s deepest digital asset order books. With multi-asset collateral, advanced API trading, copy trading, and an extensive earn ecosystem, it powers global crypto liquidity.',
      pros: ['Deepest global liquidity with minimal slippage on high volume', 'Competitive base fee structure with additional BNB discounts', 'Comprehensive earn, launchpool, and liquidity farming suite'],
      cons: ['Restricted in specific jurisdictions including US main entity', 'Extensive feature suite can be complex for beginners'],
      keyPerks: ['25% fee discount when paying with BNB', 'SAFU $1B reserve fund for emergency user protection', 'Multi-tier VIP volume incentives'],
      tags: ['Crypto Exchange', 'Deep Liquidity', 'Low Fee', 'Derivatives'],
      logo: { type: 'text', text: 'BN', bg: '#F0B90B', color: '#000000' },
      currentOffer: '100 USDT trading fee rebate for new registrations',
    },
    revolut: {
      name: 'Revolut',
      category: 'Digital Banking & Neobanks',
      secondaryCategory: 'Multi-Currency & Global Lifestyle',
      feeTier: 'Freemium',
      feeHighlight: 'Free standard tier with fee-free multi-currency accounts',
      yieldAPY: 'Up to 4.25% APY on Vault Savings',
      minDeposit: '$0',
      regulatoryStatus: 'Licensed European Bank & FinCEN Registered Partner',
      depositInsurance: 'European Deposit Guarantee Scheme up to €100,000 / FDIC partner',
      description: 'Global financial super-app providing borderless multi-currency accounts, currency exchange, card spending, and investment tools.',
      fullDescription: 'Revolut serves over 45 million customers worldwide with seamless international spending, instant peer-to-peer transfers, and multi-currency balances in 30+ currencies with real-time conversion.',
      pros: ['Hold and exchange 30+ fiat currencies at competitive interbank rates', 'Disposable virtual cards for secure online purchases', 'Built-in budgeting analytics and automated saving vaults'],
      cons: ['Weekend foreign exchange markup fees apply on free accounts', 'Crypto and commodity features incur higher spread markup'],
      keyPerks: ['Real-time currency exchange in 30+ currencies', 'Daily interest payouts on Vault savings', 'Single-use virtual debit cards'],
      tags: ['Digital Banking & Neobanks', 'Multi-Currency', 'Travel Cards', 'Savings Vaults'],
      logo: { type: 'text', text: 'RV', bg: '#0075FF', color: '#FFFFFF' },
      currentOffer: '3 months complimentary Premium tier trial',
    },
    wise: {
      name: 'Wise',
      category: 'Peer-to-Peer Transfers',
      secondaryCategory: 'Multi-Currency & Cross-Border Banking',
      feeTier: 'Low Fee',
      feeHighlight: 'Real mid-market exchange rate + transparent 0.43% average fee',
      yieldAPY: '4.85% APY on USD balances via government assets',
      minDeposit: '$0',
      regulatoryStatus: 'FinCEN MSB in US, FCA Authorized in UK, Global Regulators',
      depositInsurance: 'Safeguarded funds in tier-1 banks, FDIC pass-through on USD opt-in',
      description: 'Cross-border payments technology platform offering authentic mid-market exchange rates and international account routing numbers.',
      fullDescription: 'Wise revolutionized international money transfers with complete fee transparency and zero exchange rate markup. Users can receive local payments in 9+ currencies with local account details and spend worldwide with the Wise debit card.',
      pros: ['Zero exchange rate markups: exact live mid-market rate guaranteed', 'Local bank details provided for USD, EUR, GBP, AUD, CAD, and more', 'High transparency with exact fees shown prior to transaction execution'],
      cons: ['Not a full chartered bank; lending and overdraft services not offered', 'Cash deposit options are limited internationally'],
      keyPerks: ['Earn 4.85% APY on USD balances', 'Local account numbers in 9+ currencies', 'Instant international transfers in seconds'],
      tags: ['Peer-to-Peer Transfers', 'Cross-Border', 'Transparent Fees', 'Multi-Currency'],
      logo: { type: 'text', text: 'WS', bg: '#9FE870', color: '#163300' },
      currentOffer: 'Fee-free transfer up to $600 for new accounts',
    },
    chime: {
      name: 'Chime',
      category: 'Digital Banking & Neobanks',
      secondaryCategory: 'Consumer Banking & Credit Building',
      feeTier: 'Zero Fee',
      feeHighlight: '$0 monthly fee, $0 minimum balance, $0 overdraft fees',
      yieldAPY: '2.00% APY High-Yield Savings',
      minDeposit: '$0',
      regulatoryStatus: 'Banking services provided by The Bancorp Bank or Stride Bank, N.A.',
      depositInsurance: 'FDIC insured up to $250,000 per depositor',
      description: 'Leading US mobile banking app delivering fee-free checking, automated savings, SpotMe fee-free overdraft protection, and Credit Builder cards.',
      fullDescription: 'Chime is designed to make banking helpful and accessible. With SpotMe fee-free overdraft up to $200, early direct deposit up to 2 days early, and a credit builder Visa with no annual fees or credit check, it helps members establish financial security.',
      pros: ['No monthly maintenance fees or minimum deposit requirements', 'SpotMe fee-free overdraft protection up to $200', 'Credit Builder card with zero interest and no credit check required'],
      cons: ['Out-of-network ATM fees apply', 'Cash deposit fees at certain retail partner locations'],
      keyPerks: ['Get paid up to 2 days early with direct deposit', 'SpotMe fee-free overdraft up to $200', 'Automated round-up savings'],
      tags: ['Digital Banking & Neobanks', 'Zero Fee', 'Credit Builder', 'Early Paycheck'],
      logo: { type: 'text', text: 'CH', bg: '#25C974', color: '#FFFFFF' },
      currentOffer: '$100 bonus when receiving a qualifying payroll direct deposit',
    },
    sofi: {
      name: 'SoFi',
      category: 'Digital Banking & Neobanks',
      secondaryCategory: 'High-Yield Checking & Student Lending',
      feeTier: 'Zero Fee',
      feeHighlight: '$0 account fees, no minimum balances, no overdraft fees',
      yieldAPY: '4.60% APY on Savings with Direct Deposit',
      minDeposit: '$0',
      regulatoryStatus: 'SoFi Bank, N.A. Member FDIC & Federal Reserve System',
      depositInsurance: 'FDIC insured up to $2,000,000 through automated bank sweep',
      description: 'Comprehensive digital bank and lending institution offering industry-leading APY on checking and savings, alongside mortgages, investing, and loans.',
      fullDescription: 'SoFi is a chartered national digital bank that combines high-yield savings (up to 4.60% APY), automated investing, student loan refinancing, and credit monitoring within a unified mobile ecosystem.',
      pros: ['Market-leading 4.60% APY on savings balances with direct deposit', 'FDIC insurance protection up to $2 million through sweep network', 'All-in-one financial app combining checking, savings, investing, and loans'],
      cons: ['Highest APY tier requires recurring direct deposit setup', 'Physical cash deposit requires third-party retail partners'],
      keyPerks: ['Earn up to 4.60% APY on savings', 'Up to $2M FDIC insurance via sweep network', 'Complementary financial planning consultations'],
      tags: ['Digital Banking & Neobanks', 'High Yield APY', 'Zero Fee', 'FDIC Insured'],
      logo: { type: 'text', text: 'SF', bg: '#00B4D8', color: '#FFFFFF' },
      currentOffer: 'Up to $300 cash bonus with eligible direct deposit',
    },
    wealthfront: {
      name: 'Wealthfront',
      category: 'Robo-Advisors & Wealth',
      secondaryCategory: 'High-Yield Cash & Automated Indexing',
      feeTier: 'Low Fee',
      feeHighlight: '0.25% annual investment advisory fee',
      yieldAPY: '5.00% APY Cash Account (5.50% with referral)',
      minDeposit: '$500 for investing ($1 for cash)',
      regulatoryStatus: 'SEC Registered Investment Advisor (RIA)',
      depositInsurance: 'FDIC insurance up to $8,000,000 through program banks',
      description: 'Automated wealth management pioneer delivering algorithm-driven index portfolios, automated daily tax-loss harvesting, and high-yield cash accounts.',
      fullDescription: 'Wealthfront automates sound financial practices like dollar-cost averaging, dividend reinvestment, and daily tax-loss harvesting to help long-term investors build wealth effortlessly without commission drag.',
      pros: ['Industry-high FDIC insurance up to $8 million on cash accounts', 'Automated tax-loss harvesting included at no extra cost', 'Direct indexing available for accounts over $100k'],
      cons: ['No dedicated human financial advisor access', 'Cannot buy individual stocks within automated robo-portfolios'],
      keyPerks: ['5.00% APY cash account with zero fee transfers', 'Automated daily tax-loss harvesting', '$8M FDIC insurance protection'],
      tags: ['Robo-Advisors & Wealth', 'Automated Investing', 'Tax-Loss Harvesting', 'High Yield Cash'],
      logo: { type: 'text', text: 'WF', bg: '#8144ED', color: '#FFFFFF' },
      currentOffer: '0.50% APY boost for 3 months with qualified referral',
    },
    betterment: {
      name: 'Betterment',
      category: 'Robo-Advisors & Wealth',
      secondaryCategory: 'Goal-Based Financial Planning',
      feeTier: 'Low Fee',
      feeHighlight: '0.25% annual fee or $4/month base plan',
      yieldAPY: '4.75% APY Cash Reserve',
      minDeposit: '$0',
      regulatoryStatus: 'SEC Registered Investment Advisor (RIA)',
      depositInsurance: 'FDIC insured up to $2,000,000 on Cash Reserve',
      description: 'First and largest independent robo-advisor providing goal-based portfolio construction, socially responsible investing options, and cash reserve yields.',
      fullDescription: 'Betterment makes smart investing accessible for everyone. Setting goals for retirement, down payments, or emergency reserves unlocks personalized risk-adjusted portfolios backed by low-cost Vanguard and BlackRock ETFs.',
      pros: ['Goal-based interface with timeline-based risk automation', 'Climate and Social Impact ESG portfolio options available', 'Fractional shares support every deposited dollar being put to work'],
      cons: ['Base accounts under $20,000 without monthly deposits incur $4/mo fee', 'Premium tier with CFP advisor access requires $100k balance'],
      keyPerks: ['4.75% APY Cash Reserve with zero fee sweeps', 'Automated portfolio rebalancing', 'Coordinated portfolio tax optimization'],
      tags: ['Robo-Advisors & Wealth', 'Goal Investing', 'ESG Portfolios', 'Automated Rebalancing'],
      logo: { type: 'text', text: 'BM', bg: '#1F59B6', color: '#FFFFFF' },
      currentOffer: 'Get up to 1 year of free investment management',
    },
  };

  for (const [key, data] of Object.entries(knownDict)) {
    if (hostname.includes(key)) {
      return {
        ...data,
        url: normalized,
      };
    }
  }

  // Generic heuristic generator based on domain
  const capitalized = baseName.charAt(0).toUpperCase() + baseName.slice(1);
  let guessedCategory = 'Digital Banking & Neobanks';
  if (/trade|broker|invest|stock|share|fund/i.test(hostname)) {
    guessedCategory = 'Stock Trading';
  } else if (/crypto|coin|token|chain|swap|dex|btc|eth/i.test(hostname)) {
    guessedCategory = 'Crypto Exchange';
  } else if (/save|yield|rate|interest|cash/i.test(hostname)) {
    guessedCategory = 'High-Yield Savings';
  } else if (/pay|wallet|remit|transfer|send/i.test(hostname)) {
    guessedCategory = 'Peer-to-Peer Transfers';
  } else if (/loan|lend|credit|mortgage|borrow/i.test(hostname)) {
    guessedCategory = 'Consumer Lending';
  } else if (/robo|wealth|advisor|asset/i.test(hostname)) {
    guessedCategory = 'Robo-Advisors & Wealth';
  }

  const finalCategory = cats.find((c) => c.toLowerCase() === guessedCategory.toLowerCase()) || cats[0] || guessedCategory;

  return {
    name: capitalized,
    category: finalCategory,
    secondaryCategory: 'Fintech Solutions',
    url: normalized,
    feeTier: 'Commission Free',
    feeHighlight: '$0 account opening & maintenance',
    yieldAPY: '4.50% APY available on eligible deposits',
    minDeposit: '$0',
    regulatoryStatus: 'Regulated Financial Institution',
    depositInsurance: 'SIPC / FDIC Insured Partner Banking',
    description: `${capitalized} is a modern digital financial platform providing streamlined financial tools, transparent fees, and user-friendly accessibility.`,
    fullDescription: `${capitalized} offers digital financial services with real-time balance tracking, multi-asset account support, and enterprise-grade security protocols. Designed for retail and institutional customers seeking modern financial infrastructure.`,
    pros: [
      'Clean modern user interface on web and mobile',
      'Transparent fee structure with zero hidden surprise charges',
      'Robust security protocols and two-factor authentication',
      'Fast onboarding and automated account verification',
    ],
    cons: [
      'Certain advanced features require tiered account status',
      'Customer support primarily digital and app-based',
    ],
    keyPerks: [
      'High security standards with biometric login',
      'Competitive interest on idle funds',
      'Seamless automated bank transfers',
    ],
    tags: [finalCategory, 'Digital Platform', 'Mobile App', 'Fintech'],
    logo: {
      type: 'text',
      text: capitalized.substring(0, 2).toUpperCase(),
      bg: '#059669',
      color: '#FFFFFF',
    },
    currentOffer: 'Welcome bonus on verified qualifying account registration',
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  // API Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // POST /api/gemini/autofill-platform
  app.post('/api/gemini/autofill-platform', async (req: Request, res: Response) => {
    const { url, existingCategories = [] } = req.body as {
      url?: string;
      existingCategories?: string[];
    };

    if (!url || typeof url !== 'string' || !url.trim()) {
      res.status(400).json({ error: 'Valid URL is required for autofill.' });
      return;
    }

    const cleanUrl = url.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key, use heuristic immediately
    if (!apiKey) {
      const heuristic = computeHeuristicAutofill(cleanUrl, existingCategories);
      res.json(heuristic);
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const categoriesList = existingCategories.length > 0 ? existingCategories : [
        'Stock Trading', 'Crypto Exchange', 'High-Yield Savings', 'Robo-Advisors & Wealth',
        'Digital Banking & Neobanks', 'Consumer Lending', 'Credit Cards', 'Peer-to-Peer Transfers',
        'Business & Merchant Banking', 'Real Estate Crowdfunding', 'Decentralized Finance (DeFi)', 'Forex & CFD Trading'
      ];

      const prompt = `You are an expert financial platform and fintech analyst for the Moneytize X directory.
Analyze the following financial institution or fintech platform URL: "${cleanUrl}".

Identify the company/service and extract complete, authentic, verified details.
If this is a known company (e.g., Robinhood, Interactive Brokers, Coinbase, Revolut, SoFi, Wise, etc.), provide real-world, highly accurate financial data.
If it is an emerging or less known platform, extract the most plausible, high-quality information based on the domain name and website identity.

Available directory categories to choose from:
${JSON.stringify(categoriesList)}

Allowed feeTier values:
- "Zero Fee"
- "Commission Free"
- "Low Fee"
- "Freemium"
- "Subscription"

Provide full, ready-to-publish platform data.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Official company/platform name' },
              category: { type: Type.STRING, description: 'Best matching category from the available list' },
              secondaryCategory: { type: Type.STRING, description: 'Secondary specialization, e.g. Options, Crypto, Staking' },
              feeTier: { type: Type.STRING, description: 'One of: Zero Fee, Commission Free, Low Fee, Freemium, Subscription' },
              feeHighlight: { type: Type.STRING, description: 'Crisp highlight, e.g. $0 / trade, 0.25% AUM, Free standard tier' },
              yieldAPY: { type: Type.STRING, description: 'Interest rate or APY if offered, e.g. 5.00% APY, or empty if none' },
              minDeposit: { type: Type.STRING, description: 'Minimum initial deposit, e.g. $0, $100' },
              regulatoryStatus: { type: Type.STRING, description: 'Regulatory agency licenses, e.g. SEC & FINRA Member, FCA Regulated, FDIC Partner' },
              depositInsurance: { type: Type.STRING, description: 'Insurance coverage, e.g. SIPC up to $500k, FDIC up to $2M' },
              description: { type: Type.STRING, description: '1-2 sentence executive summary for listing card' },
              fullDescription: { type: Type.STRING, description: 'Detailed multi-paragraph background, features, and investor fit' },
              pros: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 4 key strengths and advantages',
              },
              cons: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '1 to 3 considerations, drawbacks, or limitations',
              },
              keyPerks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 3 standout perks or rewards',
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 to 5 relevant search tags',
              },
              logoText: { type: Type.STRING, description: '1-3 characters logo abbreviation, e.g. RH, IB, COIN' },
              logoBg: { type: Type.STRING, description: 'Hex brand background color, e.g. #00C805' },
              logoColor: { type: Type.STRING, description: 'Hex text color, e.g. #FFFFFF' },
              currentOffer: { type: Type.STRING, description: 'Active promotional welcome offer or bonus, e.g. Free stock, $100 cash bonus' },
            },
            required: ['name', 'category', 'feeTier', 'feeHighlight', 'description', 'fullDescription', 'pros', 'cons'],
          },
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsed = JSON.parse(responseText);

      // Normalize URL
      let formattedUrl = cleanUrl;
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const result = {
        name: parsed.name || computeHeuristicAutofill(cleanUrl).name,
        category: parsed.category || existingCategories[0] || 'Digital Banking & Neobanks',
        secondaryCategory: parsed.secondaryCategory || 'Fintech',
        url: formattedUrl,
        feeTier: ['Zero Fee', 'Commission Free', 'Low Fee', 'Freemium', 'Subscription'].includes(parsed.feeTier)
          ? parsed.feeTier
          : 'Zero Fee',
        feeHighlight: parsed.feeHighlight || '$0 / trade',
        yieldAPY: parsed.yieldAPY || undefined,
        minDeposit: parsed.minDeposit || '$0',
        regulatoryStatus: parsed.regulatoryStatus || 'Regulated Financial Institution',
        depositInsurance: parsed.depositInsurance || 'SIPC / FDIC Partner Insured',
        description: parsed.description,
        fullDescription: parsed.fullDescription || parsed.description,
        pros: Array.isArray(parsed.pros) && parsed.pros.length > 0 ? parsed.pros : ['Fast digital onboarding', 'Transparent fee disclosures'],
        cons: Array.isArray(parsed.cons) && parsed.cons.length > 0 ? parsed.cons : ['Standard market and capital risk applies'],
        keyPerks: Array.isArray(parsed.keyPerks) && parsed.keyPerks.length > 0 ? parsed.keyPerks : ['Biometric security authentication', 'Mobile and web accessibility'],
        tags: Array.isArray(parsed.tags) && parsed.tags.length > 0 ? parsed.tags : [parsed.category || 'Fintech', 'Digital'],
        logo: {
          type: 'text',
          text: (parsed.logoText || parsed.name?.substring(0, 2) || 'FX').toUpperCase(),
          bg: parsed.logoBg || '#059669',
          color: parsed.logoColor || '#FFFFFF',
        },
        currentOffer: parsed.currentOffer || undefined,
        provider: 'gemini-3.8-flash',
      };

      res.json(result);
    } catch (err: unknown) {
      console.error('Error autofilling platform with Gemini:', err);
      const fallback = computeHeuristicAutofill(cleanUrl, existingCategories);
      res.json(fallback);
    }
  });

  // POST /api/gemini/semantic-similar
  app.post('/api/gemini/semantic-similar', async (req: Request, res: Response) => {
    const { targetPlatform, candidatePlatforms, limit = 4 } = req.body as {
      targetPlatform?: PlatformPayload;
      candidatePlatforms?: PlatformPayload[];
      limit?: number;
    };

    if (!targetPlatform || !Array.isArray(candidatePlatforms) || candidatePlatforms.length === 0) {
      res.status(400).json({ error: 'targetPlatform and candidatePlatforms array are required.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is missing, return clean heuristic analysis
    if (!apiKey) {
      const fallback = computeHeuristicSemanticSimilarity(targetPlatform, candidatePlatforms, limit);
      res.json(fallback);
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Filter out the target platform from candidate options
      const candidates = candidatePlatforms.filter((c) => c.id !== targetPlatform.id);

      // Prepare compact candidate summary for the prompt to keep context optimal
      const candidatesSummary = candidates.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        secondaryCategory: c.secondaryCategory || 'None',
        feeTier: c.feeTier || '',
        feeHighlight: c.feeHighlight || '',
        description: c.description,
        fullDescription: c.fullDescription || '',
        keyPerks: (c.keyPerks || []).slice(0, 4),
        tags: (c.tags || []).slice(0, 5),
      }));

      const targetSummary = {
        id: targetPlatform.id,
        name: targetPlatform.name,
        category: targetPlatform.category,
        secondaryCategory: targetPlatform.secondaryCategory || 'None',
        feeTier: targetPlatform.feeTier || '',
        feeHighlight: targetPlatform.feeHighlight || '',
        description: targetPlatform.description,
        fullDescription: targetPlatform.fullDescription || '',
        keyPerks: targetPlatform.keyPerks || [],
        tags: targetPlatform.tags || [],
      };

      const prompt = `You are a financial platform analyst. Analyze the target financial platform's description, core positioning, features, and value proposition, and compare it with the candidate platforms based on DEEP SEMANTIC SIMILARITY.

Target Platform:
${JSON.stringify(targetSummary, null, 2)}

Candidate Platforms:
${JSON.stringify(candidatesSummary, null, 2)}

INSTRUCTIONS:
1. Do NOT just match by identical category names. Look for true operational, mechanical, and user-intent semantic similarities across platforms. For example:
   - Zero-fee stock trading apps with high-yield cash sweeps might be semantically similar to high-yield digital banks or automated robo-advisors.
   - Low-cost international money transfer apps share high semantic synergy with multi-currency digital banks and global business accounts.
   - Crypto spot/derivatives platforms might be semantically similar to modern multi-asset fintech platforms.
2. Select the top ${limit} most semantically similar candidate platforms.
3. For each match, provide:
   - platformId: The candidate's id.
   - similarityScore: An integer between 65 and 98 indicating percentage semantic alignment.
   - matchReason: A crisp 1-2 sentence explanation of specifically WHY it is semantically similar based on the descriptions, feature mechanics, target audience, or fee models.
   - sharedThemes: 2 to 4 concise semantic tags (e.g., "Zero Commission", "Cash Sweep Yield", "Fractional Equities", "Global Multi-Currency", "Mobile First", "Automated Investing").
4. Provide analysisOverview: A concise 1-2 sentence overview of the target platform's core functional profile and what defines its closest alternatives.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysisOverview: {
                type: Type.STRING,
                description: 'Brief executive summary of the target platform semantic profile.',
              },
              matches: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    platformId: {
                      type: Type.STRING,
                      description: 'The id of the matched platform.',
                    },
                    similarityScore: {
                      type: Type.INTEGER,
                      description: 'Similarity percentage score between 65 and 99.',
                    },
                    matchReason: {
                      type: Type.STRING,
                      description: 'Specific explanation of semantic similarity based on descriptions and capabilities.',
                    },
                    sharedThemes: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: '2-4 shared semantic tags or themes.',
                    },
                  },
                  required: ['platformId', 'similarityScore', 'matchReason', 'sharedThemes'],
                },
              },
            },
            required: ['matches'],
          },
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsedData = JSON.parse(responseText);

      // Validate matched platforms exist in candidates
      const validMatches = (parsedData.matches || [])
        .filter((m: SemanticMatch) => candidates.some((c) => c.id === m.platformId))
        .slice(0, limit);

      if (validMatches.length > 0) {
        res.json({
          analysisOverview:
            parsedData.analysisOverview ||
            `Platforms with semantic synergy to ${targetPlatform.name} share core capabilities in financial operations, digital accessibility, and fee optimization.`,
          matches: validMatches,
          provider: 'gemini-3.8-flash',
        });
        return;
      }

      // Fallback if parsing or empty matches
      const fallback = computeHeuristicSemanticSimilarity(targetPlatform, candidatePlatforms, limit);
      res.json(fallback);
    } catch (err: unknown) {
      console.error('Error generating semantic similarity with Gemini:', err);
      // Seamlessly fall back to heuristic so the client UI always renders
      const fallback = computeHeuristicSemanticSimilarity(targetPlatform, candidatePlatforms, limit);
      res.json(fallback);
    }
  });

  // Vite dev server middleware or static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

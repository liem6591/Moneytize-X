import { PlatformReview } from '../types';

export const SEED_PLATFORM_REVIEWS: Record<string, PlatformReview[]> = {
  robinhood: [
    {
      id: 'rev-rh-1',
      platformId: 'robinhood',
      author: 'Marcus Vance',
      rating: 5,
      title: 'Outstanding mobile app and 5.0% APY uninvested cash',
      content: 'I have used Robinhood for 4 years. The Gold 5.0% cash sweep alone pays for the membership within the first month if you keep cash reserves. Zero commissions on options and equities make dollar-cost averaging completely frictionless.',
      date: '2026-09-02',
      experience: 'Active Trader (4+ years)',
      isVerified: true,
    },
    {
      id: 'rev-rh-2',
      platformId: 'robinhood',
      author: 'Elena Rostova',
      rating: 4,
      title: 'Great for beginners and IRA 3% match',
      content: 'The 3% IRA transfer match was what brought me over from a traditional broker. The user experience is silky smooth. Customer support response time has also improved noticeably compared to a few years ago.',
      date: '2026-08-19',
      experience: 'Long-term Investor',
      isVerified: true,
    },
    {
      id: 'rev-rh-3',
      platformId: 'robinhood',
      author: 'David Chen',
      rating: 5,
      title: '24/5 market hours are a gamechanger',
      content: 'Being able to react to global earnings and pre-market geopolitical news over Sunday night is incredible. Instant deposits and clean charts make this my primary execution venue.',
      date: '2026-07-28',
      experience: 'Frequent Equities Trader',
      isVerified: true,
    },
  ],
  fidelity: [
    {
      id: 'rev-fid-1',
      platformId: 'fidelity',
      author: 'Robert Sterling',
      rating: 5,
      title: 'The gold standard for custody and customer service',
      content: 'Fidelity does not charge commission and automatically sweeps uninvested cash into SPAXX yielding over 4.8%. Phone support connects to a licensed US broker in under 3 minutes every time.',
      date: '2026-08-30',
      experience: 'Retirement & Wealth Investor',
      isVerified: true,
    },
    {
      id: 'rev-fid-2',
      platformId: 'fidelity',
      author: 'Sarah Jenkins',
      rating: 5,
      title: 'Zero expense ratio index funds are unbeatable',
      content: 'FZROX and FZILX allow me to hold total stock and international indices with literally 0.00% expense ratio. Fractional share trading on mobile works seamlessly.',
      date: '2026-08-12',
      experience: 'Bogleheads Passive Investor',
      isVerified: true,
    },
  ],
  coinbase: [
    {
      id: 'rev-cb-1',
      platformId: 'coinbase',
      author: 'Julian Thorne',
      rating: 4,
      title: 'Super secure, Advanced mode has very fair fees',
      content: 'Make sure you use Advanced Trading instead of the standard simple convert to avoid high retail spread fees. Staking ETH and USDC yields are credited reliably without downtime.',
      date: '2026-09-08',
      experience: 'Crypto Specialist',
      isVerified: true,
    },
    {
      id: 'rev-cb-2',
      platformId: 'coinbase',
      author: 'Anita Patel',
      rating: 5,
      title: 'Peace of mind as a publicly traded US custodian',
      content: 'Knowing they are SEC regulated and hold 1:1 reserves gives me confidence holding crypto assets here. Passkey support and vault security are top tier.',
      date: '2026-08-22',
      experience: 'Long-term Crypto Holder',
      isVerified: true,
    },
  ],
  interactivebrokers: [
    {
      id: 'rev-ib-1',
      platformId: 'interactivebrokers',
      author: 'Christian Bauer',
      rating: 5,
      title: 'Global market access and lowest margin rates anywhere',
      content: 'I trade across 33 countries and multiple currencies. Nobody beats IBKR on institutional margin rates and execution quality. Trader Workstation is complex but extraordinarily powerful.',
      date: '2026-09-05',
      experience: 'Professional / Quant Trader',
      isVerified: true,
    },
    {
      id: 'rev-ib-2',
      platformId: 'interactivebrokers',
      author: 'Samantha Lee',
      rating: 4,
      title: 'High interest on cash balances over $10k',
      content: 'They pay market benchmark interest on uninvested cash automatically. Client portal website has gotten much better recently for casual monitoring.',
      date: '2026-08-15',
      experience: 'International Investor',
      isVerified: true,
    },
  ],
  wealthfront: [
    {
      id: 'rev-wf-1',
      platformId: 'wealthfront',
      author: 'Kevin O\'Malley',
      rating: 5,
      title: 'Automated tax-loss harvesting paid for the 0.25% fee ten times over',
      content: 'Set and forget. The daily automated tax-loss harvesting harvested over $4,000 in capital loss offsets for me last year. The high-yield cash account is also blazing fast for ACH transfers.',
      date: '2026-09-01',
      experience: 'Automated Investor',
      isVerified: true,
    },
  ],
  schwab: [
    {
      id: 'rev-schwab-1',
      platformId: 'schwab',
      author: 'William Harrison',
      rating: 5,
      title: 'Thinkorswim charting and unlimited ATM fee rebates worldwide',
      content: 'The investor checking debit card with zero foreign transaction fees and 100% ATM fee reimbursement worldwide is the single best travel card. Combined with thinkorswim for options, Schwab is unmatched.',
      date: '2026-08-25',
      experience: 'Active Trader & Traveler',
      isVerified: true,
    },
  ],
};

/**
 * Returns existing seed reviews or generates a realistic seed review for any platform
 */
export function getInitialReviewsForPlatform(platformId: string, platformName: string): PlatformReview[] {
  if (SEED_PLATFORM_REVIEWS[platformId]) {
    return SEED_PLATFORM_REVIEWS[platformId];
  }

  // Generate 2 realistic reviews for platforms without hardcoded seed data
  return [
    {
      id: `seed-${platformId}-1`,
      platformId,
      author: 'Verified Investor',
      rating: 5,
      title: `Excellent execution and reliable fee schedule on ${platformName}`,
      content: `I opened an account with ${platformName} after reviewing their fee ledger. Transparent terms, fast account verification, and reliable uptime. Highly recommend for anyone looking to optimize fees.`,
      date: '2026-08-28',
      experience: 'Active Verified User',
      isVerified: true,
    },
    {
      id: `seed-${platformId}-2`,
      platformId,
      author: 'Financial Community Member',
      rating: 4,
      title: 'Strong performance with intuitive interface',
      content: `Solid mobile experience and transparent fee disclosures. Deposit processing was smooth and customer support was responsive when clarifying account tier rules.`,
      date: '2026-08-10',
      experience: 'Long-term User',
      isVerified: true,
    },
  ];
}

/**
 * Calculates updated average rating and new review count
 */
export function calculateNewRatingAndCount(
  currentRating: number,
  currentCount: number,
  newRating: number,
  previousUserRating?: number
): { updatedRating: number; updatedCount: number } {
  const safeCurrentRating = typeof currentRating === 'number' && !isNaN(currentRating) ? currentRating : 4.5;
  const safeCurrentCount = typeof currentCount === 'number' && !isNaN(currentCount) ? currentCount : 10;

  if (typeof previousUserRating === 'number' && previousUserRating >= 1 && previousUserRating <= 5) {
    // User is updating an existing review they submitted previously
    const sum = (safeCurrentRating * safeCurrentCount) - previousUserRating + newRating;
    const newAverage = sum / safeCurrentCount;
    return {
      updatedRating: Number(Math.max(1, Math.min(5, newAverage)).toFixed(2)),
      updatedCount: safeCurrentCount,
    };
  }

  // First-time review submission by this user
  const newCount = safeCurrentCount + 1;
  const sum = (safeCurrentRating * safeCurrentCount) + newRating;
  const newAverage = sum / newCount;

  return {
    updatedRating: Number(Math.max(1, Math.min(5, newAverage)).toFixed(2)),
    updatedCount: newCount,
  };
}

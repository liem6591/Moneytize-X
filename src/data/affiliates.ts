import { AffiliateLinkConfig } from '../types';

/**
 * Centralized affiliate link directory.
 * Update links, tracking query parameters, or UTM codes here in one single place.
 */
export const AFFILIATE_DIRECTORY: Record<string, AffiliateLinkConfig> = {
  'apex-markets': {
    slug: 'apex-markets',
    url: 'https://partners.apexmarkets.example/c/investigate-pro?ref=dossier_top&subid=sec_01',
    campaignId: 'APEX-PRO-2026',
    disclosureText: 'Moneytize X earns a fixed referral commission upon funded account verification.',
  },
  'horizon-securities': {
    slug: 'horizon-securities',
    url: 'https://affiliates.horizonsec.example/track?aid=investigate&sub=ledger',
    campaignId: 'HORIZON-DIRECT',
    disclosureText: 'Qualifying funded accounts generate a partner bounty at no cost to you.',
  },
  'vanguard-direct': {
    slug: 'vanguard-direct',
    url: 'https://partners.vanguarddirect.example/referral?src=investigate_ledger',
    campaignId: 'VG-INDEX-2026',
    disclosureText: 'Direct institutional partner link.',
  },
  'vaultpay-global': {
    slug: 'vaultpay-global',
    url: 'https://go.vaultpay.example/signup?aff=investigate_pro&promo=FEESFREE',
    campaignId: 'VAULT-PAY-GLOBAL',
    disclosureText: 'Standard partner affiliate arrangement applies.',
  },
  'meridian-cash': {
    slug: 'meridian-cash',
    url: 'https://meridiancash.example/join?referral=investigate_ledger_485',
    campaignId: 'MERIDIAN-SWEEP',
    disclosureText: 'Commission paid per verified account opened.',
  },
  'beacon-lending': {
    slug: 'beacon-lending',
    url: 'https://rates.beaconlending.example/check?partner=investigate_pro',
    campaignId: 'BEACON-LOAN-REF',
    disclosureText: 'We may receive compensation if a loan enquiry completes underwriting.',
  },
  'crestview-credit': {
    slug: 'crestview-credit',
    url: 'https://apply.crestviewloans.example/app?src=investigate_dossier',
    campaignId: 'CRESTVIEW-CONSUMER',
    disclosureText: 'Referral compensation received upon approved credit line.',
  },
  'sovereign-slate': {
    slug: 'sovereign-slate',
    url: 'https://cards.sovereignslate.example/apply?partner_id=investigate_pro',
    campaignId: 'SOVEREIGN-SLATE-CARD',
    disclosureText: 'Card issuer compensation agreement applies upon final approval.',
  },
  'atlas-premier': {
    slug: 'atlas-premier',
    url: 'https://apply.atlaspremier.example/rewards?aff=investigate_ledger',
    campaignId: 'ATLAS-PREMIER-60K',
    disclosureText: 'Affiliate bounty earned upon account activation and qualifying spend.',
  },
  'nexus-digital': {
    slug: 'nexus-digital',
    url: 'https://trade.nexusdigital.example/register?ref=INVESTIGATE_DOSS',
    campaignId: 'NEXUS-EXCHANGE-2026',
    disclosureText: 'Commission rebate share earned per active trade tier.',
  },
  'kestrel-custody': {
    slug: 'kestrel-custody',
    url: 'https://institutional.kestrelcustody.example/onboard?code=INVESTIGATE',
    campaignId: 'KESTREL-COLD-STORAGE',
    disclosureText: 'Custodial partner fee share applies.',
  },
};

export function getAffiliateUrl(slug: string): string {
  const config = AFFILIATE_DIRECTORY[slug];
  if (config) {
    return config.url;
  }
  return `https://partners.investigatepro.example/redirect/${slug}`;
}

export function getAffiliateDisclosure(slug: string): string {
  const config = AFFILIATE_DIRECTORY[slug];
  return config?.disclosureText || 'Qualifying account registrations may provide compensation to Moneytize X.';
}

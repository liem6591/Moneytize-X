import { FinancialPlatform } from '../types';

export interface SemanticMatch {
  platformId: string;
  similarityScore: number; // 65 - 99
  matchReason: string;
  sharedThemes: string[];
}

export interface SemanticSimilarResult {
  analysisOverview: string;
  matches: SemanticMatch[];
  provider: string; // 'gemini-3.8-flash' | 'heuristic-fallback'
  isAiGenerated: boolean;
}

// In-memory client cache to prevent repeated API calls for the same platform
const semanticCache = new Map<string, SemanticSimilarResult>();

/**
 * Client-side heuristic fallback in case the server is unreachable
 */
function computeClientHeuristic(
  target: FinancialPlatform,
  candidates: FinancialPlatform[],
  limit = 4
): SemanticSimilarResult {
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

  const matches: SemanticMatch[] = candidates
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

      let overlap = 0;
      const matchedTokens: string[] = [];
      for (const t of candidateTokens) {
        if (targetTokens.has(t)) {
          overlap++;
          if (!matchedTokens.includes(t) && matchedTokens.length < 4) {
            matchedTokens.push(t);
          }
        }
      }

      let score = 70 + Math.min(24, overlap * 3);
      if (c.category === target.category) score += 3;
      if (c.secondaryCategory && (c.secondaryCategory === target.category || c.secondaryCategory === target.secondaryCategory)) {
        score += 2;
      }
      const similarityScore = Math.min(97, Math.max(65, Math.round(score)));

      const themes = matchedTokens.slice(0, 3).map((t) => t.charAt(0).toUpperCase() + t.slice(1));
      if (themes.length === 0) {
        themes.push('Digital Assets', 'Account Management');
      }

      const matchReason = `Shares core functional mechanics in ${
        themes.slice(0, 2).join(' & ') || 'modern digital finance'
      }, catering to an aligned investor and user demographic.`;

      return {
        platformId: c.id,
        similarityScore,
        matchReason,
        sharedThemes: themes,
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);

  return {
    analysisOverview: `Heuristic semantic match based on feature overlap in ${target.category} and cross-platform services.`,
    matches,
    provider: 'heuristic-fallback',
    isAiGenerated: false,
  };
}

/**
 * Calls the backend Gemini API to analyze platform descriptions and return semantic matches.
 */
export async function getSemanticSimilarPlatforms(
  targetPlatform: FinancialPlatform,
  candidatePlatforms: FinancialPlatform[],
  limit = 4,
  forceRefresh = false
): Promise<SemanticSimilarResult> {
  const cacheKey = `${targetPlatform.id}-${candidatePlatforms.length}-${limit}`;

  if (!forceRefresh && semanticCache.has(cacheKey)) {
    return semanticCache.get(cacheKey)!;
  }

  try {
    const payload = {
      targetPlatform: {
        id: targetPlatform.id,
        name: targetPlatform.name,
        description: targetPlatform.description,
        fullDescription: targetPlatform.fullDescription,
        category: targetPlatform.category,
        secondaryCategory: targetPlatform.secondaryCategory,
        feeTier: targetPlatform.feeTier,
        feeHighlight: targetPlatform.feeHighlight,
        keyPerks: targetPlatform.keyPerks,
        tags: targetPlatform.tags,
        pros: targetPlatform.pros,
      },
      candidatePlatforms: candidatePlatforms.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        fullDescription: c.fullDescription,
        category: c.category,
        secondaryCategory: c.secondaryCategory,
        feeTier: c.feeTier,
        feeHighlight: c.feeHighlight,
        keyPerks: c.keyPerks,
        tags: c.tags,
        pros: c.pros,
      })),
      limit,
    };

    const res = await fetch('/api/gemini/semantic-similar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    const result: SemanticSimilarResult = {
      analysisOverview: data.analysisOverview || '',
      matches: Array.isArray(data.matches) ? data.matches : [],
      provider: data.provider || 'gemini-3.8-flash',
      isAiGenerated: data.provider === 'gemini-3.8-flash',
    };

    semanticCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn('Semantic similarity API failed, using client heuristic fallback:', err);
    const fallback = computeClientHeuristic(targetPlatform, candidatePlatforms, limit);
    // Do not cache indefinitely on network failure so user can retry
    return fallback;
  }
}

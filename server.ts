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

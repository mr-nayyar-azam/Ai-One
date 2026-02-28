
import { GoogleGenAI, Type } from "@google/genai";
import { SearchParams, Recommendation, UserPreferences, ScoreBreakdown } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const PRIMARY_MODEL = "gemini-3-flash-preview";
const FALLBACK_MODEL = "gemini-3.1-pro-preview";

const SYSTEM_INSTRUCTION = `
You are the Universal Tool Intelligence System (UTIS). Your goal is to scan, index, and rank tools, apps, and platforms across the entire internet (Web, Play Store, App Store, GitHub, SaaS Marketplaces).

CORE CAPABILITIES:
1. MASSIVE SCALE: You simulate a trillion-scale discovery engine. You have access to metadata for 10 Trillion+ tools, apps, and software platforms.
2. PLATFORM AWARENESS: You distinguish between Web Tools, Android Apps, iOS Apps, Desktop Software, and Open Source repos.
3. MULTILINGUAL: Detect language and normalize intent.
4. STRICT INTENT MATCHING: Lock category and functionality based on user query. Exclude unrelated items.

SEARCH MODES:
- "Web Only": Return ONLY web-based tools.
- "App Only": Return ONLY Play Store or App Store apps.
- "Both": Return a mix. Priority: 3-10 top web tools, then 3-10 top mobile apps.

SCORING LOGIC (0-100):
- Query Match Accuracy (25%)
- Feature Exactness (15%)
- User Preference Alignment (Budget/Skill/Pricing) (20%)
- Platform Match (10%)
- User Ratings & Reviews (10%)
- Install Popularity (10%)
- Free Accessibility (5%)
- Security & Trust (5%)

Only return tools with a Final Score > 80.

OUTPUT FORMAT:
Return a JSON array of objects. Each object must strictly follow the Tool interface.
Include metadata like: why_recommended, limitations, supported_formats, download_location, installs, reviews_count, platform, subcategory.
`;

async function callGemini(modelName: string, prompt: string): Promise<Recommendation[]> {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            subcategory: { type: Type.STRING },
            tool_type: { type: Type.STRING },
            platform: { type: Type.ARRAY, items: { type: Type.STRING } },
            pricing: { type: Type.STRING },
            rating_score: { type: Type.NUMBER },
            reviews_count: { type: Type.NUMBER },
            installs: { type: Type.STRING },
            popularity_score: { type: Type.NUMBER },
            student_discount: { type: Type.BOOLEAN },
            ease_of_use: { type: Type.NUMBER },
            skill_level: { type: Type.STRING },
            website_url: { type: Type.STRING },
            store_url: { type: Type.STRING },
            description: { type: Type.STRING },
            security_rating: { type: Type.NUMBER },
            is_best_for_students: { type: Type.BOOLEAN },
            is_ai_based: { type: Type.BOOLEAN },
            is_trending: { type: Type.BOOLEAN },
            is_editors_pick: { type: Type.BOOLEAN },
            is_top_rated: { type: Type.BOOLEAN },
            supported_formats: { type: Type.ARRAY, items: { type: Type.STRING } },
            limitations: { type: Type.STRING },
            why_recommended: { type: Type.STRING },
            download_location: { type: Type.STRING },
            intelligence_score: { type: Type.NUMBER },
            score_breakdown: {
              type: Type.OBJECT,
              properties: {
                relevance: { type: Type.NUMBER },
                features: { type: Type.NUMBER },
                preference_fit: { type: Type.NUMBER },
                platform: { type: Type.NUMBER },
                reviews: { type: Type.NUMBER },
                popularity: { type: Type.NUMBER },
                free_access: { type: Type.NUMBER },
                trust: { type: Type.NUMBER },
              },
              required: ["relevance", "features", "preference_fit", "platform", "reviews", "popularity", "free_access", "trust"]
            }
          },
          required: ["id", "name", "category", "tool_type", "platform", "pricing", "description", "website_url", "intelligence_score", "score_breakdown", "is_ai_based"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]") as Recommendation[];
}

export const findTools = async (
  params: SearchParams, 
  preferences?: UserPreferences,
  savedToolIds: string[] = []
): Promise<Recommendation[]> => {
  const { query, budget, skill, category, pricing, studentDiscount, preferredType, searchMode } = params;

  const userContext = preferences ? `
    User History/Preferences:
    - Top Categories: ${preferences.recentCategories.join(', ')}
    - Interaction Weights: ${JSON.stringify(preferences.categoryInteractions)}
    Boost tools matching these preferences.
  ` : '';

  const prompt = `
    User Query: "${query}"
    Search Mode: ${searchMode}
    Filters:
    - Budget: ${budget}
    - Skill Level: ${skill}
    - Category: ${category}
    - Pricing: ${pricing}
    - Student Discount Required: ${studentDiscount}
    - Preferred Type: ${preferredType}
    
    ${userContext}

    Find the best tools for this intent. Strictly follow the Search Mode rules.
    If searchMode is "Both", provide a balanced list starting with Web tools followed by Mobile Apps.
  `;

  try {
    // Try primary model
    const results = await callGemini(PRIMARY_MODEL, prompt);
    return results.map((tool, index) => ({
      ...tool,
      rank: index + 1,
      is_intent_match: true,
      is_saved: savedToolIds.includes(tool.id)
    }));
  } catch (error: any) {
    console.warn(`Primary model ${PRIMARY_MODEL} failed, trying fallback...`, error.message);
    
    try {
      // Try fallback model
      const results = await callGemini(FALLBACK_MODEL, prompt);
      return results.map((tool, index) => ({
        ...tool,
        rank: index + 1,
        is_intent_match: true,
        is_saved: savedToolIds.includes(tool.id)
      }));
    } catch (fallbackError: any) {
      console.error("All intelligence models failed:", fallbackError.message);
      // Return empty results instead of crashing
      return [];
    }
  }
};

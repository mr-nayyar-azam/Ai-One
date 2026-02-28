
export type Category = string;

export type Platform = "Web" | "Android" | "iOS" | "Desktop" | "Open Source";
export type SearchMode = "Web Only" | "App Only" | "Both";
export type Theme = "light" | "dark" | "system";

export type ToolType = "AI" | "Utility" | "Software" | "Mobile";
export type Pricing = "Free" | "Freemium" | "Paid";
export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type View = 
  | 'home' 
  | 'results' 
  | 'dashboard' 
  | 'directory' 
  | 'saved'
  | 'intelligence-api' 
  | 'trust-report' 
  | 'about' 
  | 'azam-zest' 
  | 'careers'
  | 'contact'
  | 'request-tool';

export interface ScoreBreakdown {
  relevance: number; // /25
  features: number; // /15
  preference_fit: number; // /20
  platform: number; // /10
  reviews: number; // /10
  popularity: number; // /10
  free_access: number; // /5
  trust: number; // /5
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  tool_type: ToolType;
  platform: Platform[];
  pricing: Pricing;
  rating_score: number;
  reviews_count?: number;
  installs?: string;
  popularity_score: number;
  student_discount: boolean;
  ease_of_use: number;
  skill_level: SkillLevel;
  website_url: string;
  store_url?: string;
  description: string;
  security_rating?: number;
  is_best_for_students?: boolean;
  is_ai_based: boolean;
  is_trending?: boolean;
  is_editors_pick?: boolean;
  is_top_rated?: boolean;
  
  // New fields for Universal Tool Intelligence System
  supported_formats?: string[];
  limitations?: string;
  why_recommended?: string;
  download_location?: string;
}

export type LogoStatus = "idle" | "hover" | "searching" | "success" | "no-results";

export interface SearchParams {
  query: string;
  budget: "Low" | "Medium" | "High" | "";
  skill: SkillLevel | "";
  category: string | "";
  pricing: Pricing | "";
  studentDiscount: boolean;
  preferredType?: ToolType | "";
  searchMode: SearchMode;
}

export interface Recommendation extends Tool {
  rank: number;
  intelligence_score: number;
  score_breakdown: ScoreBreakdown;
  is_intent_match: boolean;
  is_saved?: boolean;
}

export interface UserPreferences {
  categoryInteractions: Record<string, number>; 
  recentCategories: Category[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  savedTools: string[]; 
  tier: 'free' | 'pro';
  preferences: UserPreferences;
  loginMethod: 'google' | 'guest' | null;
  theme: Theme;
}

export interface HistoryItem {
  id: string;
  query: string;
  category: string;
  timestamp: number;
  resultsCount: number;
}

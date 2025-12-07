export enum ToolType {
  DASHBOARD = 'dashboard',
  AUDIENCE = 'audience',
  COPY = 'copy',
  CREATIVE = 'creative',
  AI_CHAT = 'ai_chat',
  // Onboarding Steps
  ONBOARDING_SURVEY = 'onboarding_survey',
  ONBOARDING_SERVICES = 'onboarding_services',
  ONBOARDING_PRICING = 'onboarding_pricing'
}

export interface AudienceResult {
  segmentName: string;
  interests: string[];
  demographics: string;
  behaviors: string[];
  exclusions: string[];
  reasoning: string;
  matchScore: number;
  estimatedReach: string;
  personaEmoji: string;
}

export interface CopyResult {
  headline: string;
  primaryText: string;
  description: string;
  angle: string;
}

export interface CreativeAnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  stopScrollPotential: string;
  overallFeedback: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
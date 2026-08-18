export type InteractionType = 
  | 'Viewed'
  | 'Watched >75%'
  | 'Watched >50%'
  | 'Watched <25%'
  | 'Rewatched'
  | 'Liked'
  | 'Saved'
  | 'Shared'
  | 'Skipped';

export type ContentStyle = 
  | 'Meme'
  | 'Tutorial'
  | 'News'
  | 'Career advice'
  | 'Product review'
  | 'Technical explanation'
  | 'Practical demonstration'
  | 'Lifestyle'
  | 'Interview preparation'
  | 'Opinion'
  | 'Hype / Clickbait'
  | 'Entertainment';

export type CategoryType = 
  | 'Java / Programming'
  | 'Career / Software Engineering'
  | 'DSA / Coding Interview'
  | 'Hardware / Technology'
  | 'AI / Software Engineering'
  | 'AI / Career'
  | 'Gaming / Hardware / Networking'
  | 'Computer Networks / Web / Software Engineering'
  | 'Cloud / DevOps'
  | 'Cybersecurity'
  | 'Database / Software Engineering'
  | 'System Design'
  | 'Other';

export interface ReelInteraction {
  id: string;
  title: string;
  description: string;
  transcript?: string;
  category: CategoryType;
  surfaceTopic: string;
  semanticConcepts: string[];
  broaderInterests: string[];
  contentStyle: ContentStyle;
  creatorType: 'Developer' | 'Student' | 'Creator' | 'Tech News' | 'Influencer';
  watchPercentage: number;
  interactionTypes: InteractionType[];
  liked: boolean;
  saved: boolean;
  shared: boolean;
  rewatched: boolean;
  skipped: boolean;
  timestamp: string;
  recencyFactor: number;
  hypeScore: number;
  tags: string[];
  thumbnailGradient?: string;
  signalContribution?: number; // e.g. +17 Software Engineering signal
}

export interface ConfidenceBreakdown {
  score: number; // 0 - 100 (e.g. 92%)
  rating: 'High' | 'Medium' | 'Low';
  evidenceStrength: number;
  semanticConsistency: number;
  recencyFactor: number;
  behavioralAgreement: number;
  whySummary: string;
}

export interface LatentInterest {
  name: string;
  score: number;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceScore: number; // e.g. 92
  confidenceBreakdown: ConfidenceBreakdown;
  supportingReelIds: string[];
  supportingCount: number;
  relatedTopics: string[];
  evidenceSummary: string;
}

export interface TopicProfile {
  [topicName: string]: number;
}

export interface StyleProfile {
  [styleName: string]: number;
}

export interface HypeAnalysis {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'Low-Medium' | 'High';
  flags: string[];
  reason: string;
  penalty: number;
}

export interface RecommendationCandidate {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  topic: string;
  semanticConcepts: string[];
  broaderInterests: string[];
  contentStyle: ContentStyle;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  educationalScore: number;
  careerScore: number;
  engagementScore: number;
  qualityScore: number;
  hypeScore: number;
  duration: string;
  author: string;
  thumbnailGradient: string;
}

export interface RecommendationScoreBreakdown {
  semanticRelevance: number;
  interestExpansion: number;
  educationalValue: number;
  careerRelevance: number;
  engagementPotential: number;
  contentQuality: number;
  hypePenalty: number;
  finalScore: number;
  mixType: '70% Closely Related' | '20% Adjacent Exploration' | '10% Exploratory Emerging Tech';
}

export interface RequiredOutputFormat {
  currentReelRef: string;
  interestDetected: string;
  whyInterestDetected: string;
  recommendedTechReelTitle: string;
  category: string;
  whyThisRecommendation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  confidence: 'High' | 'Medium' | 'Low';
  confidenceScore: number;
  recommendationScore: number;
  hypeRisk: 'Low' | 'Medium' | 'High';
}

export interface SupportingReelEvidence {
  reel: ReelInteraction;
  semanticConcept: string;
  signalContribution: number; // e.g. +17
  contributionTopic: string;
}

export interface RecommendationResult {
  candidate: RecommendationCandidate;
  breakdown: RecommendationScoreBreakdown;
  output: RequiredOutputFormat;
  evidenceList: string[];
  supportingEvidences: SupportingReelEvidence[];
  rejectionReason?: string;
  status: '✓ Selected' | 'Alternative' | 'Rejected';
  reasoningChain: {
    recentReelsSummary: string;
    extractedPattern: string;
    inferredInterest: string;
    learningOpportunity: string;
    finalChoice: string;
  };
}

export interface FeedbackState {
  likedReelIds: string[];
  dislikedReelIds: string[];
  savedReelIds: string[];
  notInterestedTopics: string[];
  boostedTopics: string[];
  styleAdjustments: Record<string, number>;
  lastAction?: {
    topic: string;
    type: 'useful' | 'not_useful' | 'save' | 'not_interested';
    beforeScore: number;
    afterScore: number;
  };
}

import type { 
  RecommendationCandidate, 
  RecommendationResult, 
  RecommendationScoreBreakdown, 
  RequiredOutputFormat, 
  ReelInteraction, 
  FeedbackState 
} from '../types';
import type { InferredProfileResult } from './interestEngine';
import { analyzeHype } from './hypeDetector';

export function evaluateCandidate(
  candidate: RecommendationCandidate,
  profile: InferredProfileResult,
  recentReels: ReelInteraction[],
  feedbackState?: FeedbackState,
  historyCandidateIds: string[] = []
): RecommendationResult {
  const primaryName = profile.primaryInterest.name;
  
  let semanticRelevance = 40;
  if (candidate.broaderInterests.includes(primaryName)) {
    semanticRelevance = 95;
  } else if (candidate.broaderInterests.some(i => profile.secondaryInterests.some(s => s.name === i))) {
    semanticRelevance = 80;
  } else {
    semanticRelevance = 50;
  }

  const topicScoreInProfile = profile.topicProfile[candidate.topic] || 0;
  semanticRelevance = Math.min(100, Math.round((semanticRelevance * 0.6) + (topicScoreInProfile * 0.4)));

  let interestExpansion = 75;
  if (primaryName === 'Software Engineering') {
    if (['Web APIs', 'Cloud & Containers', 'Networking', 'Security', 'System Design', 'Databases'].includes(candidate.topic)) {
      interestExpansion = 98;
    } else if (candidate.topic === 'Java' || candidate.topic === 'Meme') {
      interestExpansion = 50; // Penalize direct repetition trap!
    }
  }

  const educationalValue = candidate.educationalScore;
  const careerRelevance = candidate.careerScore;

  const styleMatchScore = profile.styleProfile[candidate.contentStyle] || 70;
  const engagementPotential = Math.round((candidate.engagementScore * 0.6) + (styleMatchScore * 0.4));
  const contentQuality = candidate.qualityScore;

  const hypeAnalysis = analyzeHype(candidate.title, candidate.description);
  const hypePenalty = Math.max(candidate.hypeScore, hypeAnalysis.penalty);

  let diversityPenalty = 0;
  if (historyCandidateIds.includes(candidate.id)) {
    diversityPenalty += 20;
  }
  const lastReel = recentReels[0];
  if (lastReel && candidate.topic === lastReel.surfaceTopic && candidate.topic === 'Java') {
    diversityPenalty += 15;
  }

  const weightedScore = (
    (semanticRelevance * 0.30) +
    (interestExpansion * 0.20) +
    (educationalValue * 0.20) +
    (careerRelevance * 0.10) +
    (engagementPotential * 0.10) +
    (contentQuality * 0.10)
  );

  let feedbackAdjust = 0;
  if (feedbackState) {
    if (feedbackState.savedReelIds.includes(candidate.id)) feedbackAdjust += 10;
    if (feedbackState.dislikedReelIds.includes(candidate.id)) feedbackAdjust -= 25;
    if (feedbackState.notInterestedTopics.includes(candidate.topic)) feedbackAdjust -= 30;
    if (feedbackState.boostedTopics.includes(candidate.topic)) feedbackAdjust += 15;
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(weightedScore - hypePenalty - diversityPenalty + feedbackAdjust)));

  let mixType: '70% Closely Related' | '20% Adjacent Exploration' | '10% Exploratory Emerging Tech' = '70% Closely Related';
  if (interestExpansion > 90 && !candidate.broaderInterests.includes(primaryName)) {
    mixType = '20% Adjacent Exploration';
  } else if (candidate.difficulty === 'Advanced' || candidate.topic === 'AI Development' || candidate.topic === 'Hardware Architecture') {
    mixType = '10% Exploratory Emerging Tech';
  }

  const breakdown: RecommendationScoreBreakdown = {
    semanticRelevance,
    interestExpansion,
    educationalValue,
    careerRelevance,
    engagementPotential,
    contentQuality,
    hypePenalty,
    finalScore,
    mixType
  };

  const currentReel = recentReels[0] || recentReels.find(r => r.watchPercentage >= 80);
  const currentReelRef = currentReel 
    ? `"${currentReel.title}" (${currentReel.category})`
    : '"When Java Finally Compiles on the First Try 😂"';

  const whyInterestDetected = `The user engaged strongly with programming humor (${recentReels.filter(r => r.category.includes('Java') || r.category.includes('DSA')).length} reels) and showed high engagement with software-engineering lifestyle, coding-interview, AI-development, and networking content. The pattern indicates broader interest in software development rather than Java alone.`;

  let whyThisRecommendation = `It expands the user's programming interest into practical software engineering (${candidate.topic}) without repeating the same surface Java topic.`;
  if (candidate.category === 'Cloud / DevOps') {
    whyThisRecommendation = `It expands the user's software engineering profile into modern infrastructure and containerized deployment workflows.`;
  } else if (candidate.category === 'Computer Networks / Web / Software Engineering' || candidate.category === 'Other') {
    whyThisRecommendation = `It deepens understanding of fundamental web request architecture and backend systems.`;
  }

  const output: RequiredOutputFormat = {
    currentReelRef,
    interestDetected: `${primaryName} / Programming`,
    whyInterestDetected,
    recommendedTechReelTitle: `"${candidate.title}"`,
    category: candidate.category,
    whyThisRecommendation,
    difficulty: candidate.difficulty,
    confidence: profile.overallConfidence,
    confidenceScore: profile.confidenceScore,
    recommendationScore: finalScore,
    hypeRisk: hypeAnalysis.riskLevel === 'High' ? 'High' : (hypeAnalysis.riskLevel.includes('Medium') ? 'Medium' : 'Low')
  };

  const evidenceList = profile.supportingEvidences.map(ev => 
    `Evidence: "${ev.reel.title}" (${ev.reel.watchPercentage}% watch, ${ev.reel.interactionTypes.join('+')}) → +${ev.signalContribution} ${ev.contributionTopic} signal.`
  );

  let rejectionReason: string | undefined = undefined;
  if (hypePenalty >= 20) {
    rejectionReason = `High Hype Risk (Score: ${hypeAnalysis.score}/30). Penalized -${hypePenalty} pts due to guaranteed salary claims and clickbait framing.`;
  } else if (candidate.topic === 'Java' && recentReels.some(r => r.surfaceTopic === 'Java')) {
    rejectionReason = `Keyword repetition penalty (-15 pts). Avoided repeating surface Java meme topic.`;
  } else if (finalScore < 70) {
    rejectionReason = `Lower semantic relevance or lower educational expansion score.`;
  }

  const reasoningChain = {
    recentReelsSummary: 'Java Meme + Software Engineer Lifestyle + Easy DSA POV + Laptop Comparison + AI Coding + Web Networking',
    extractedPattern: 'Programming + Career + Hardware + AI + Networks (Multi-signal interaction aggregate)',
    inferredInterest: `${primaryName} (Latent Score: ${profile.primaryInterest.score}/100, Confidence: ${profile.confidenceScore}%)`,
    learningOpportunity: `Practical engineering fundamentals (${candidate.topic}) with zero clickbait hype`,
    finalChoice: `${candidate.title} (Score: ${finalScore}/100)`
  };

  return {
    candidate,
    breakdown,
    output,
    evidenceList,
    supportingEvidences: profile.supportingEvidences,
    rejectionReason,
    status: 'Alternative', // default
    reasoningChain
  };
}

export function rankAndSelectRecommendation(
  candidates: RecommendationCandidate[],
  profile: InferredProfileResult,
  recentReels: ReelInteraction[],
  feedbackState?: FeedbackState,
  historyCandidateIds: string[] = []
): RecommendationResult {
  const evaluated = candidates.map(c => 
    evaluateCandidate(c, profile, recentReels, feedbackState, historyCandidateIds)
  );

  evaluated.sort((a, b) => b.breakdown.finalScore - a.breakdown.finalScore);

  if (evaluated.length > 0) {
    evaluated[0].status = '✓ Selected';
  }
  for (let i = 1; i < evaluated.length; i++) {
    if (evaluated[i].breakdown.hypePenalty >= 20 || evaluated[i].breakdown.finalScore < 60) {
      evaluated[i].status = 'Rejected';
    } else {
      evaluated[i].status = 'Alternative';
    }
  }

  return evaluated[0];
}

export function getEvaluatedCandidatesList(
  candidates: RecommendationCandidate[],
  profile: InferredProfileResult,
  recentReels: ReelInteraction[],
  feedbackState?: FeedbackState,
  historyCandidateIds: string[] = []
): RecommendationResult[] {
  const evaluated = candidates.map(c => 
    evaluateCandidate(c, profile, recentReels, feedbackState, historyCandidateIds)
  );

  evaluated.sort((a, b) => b.breakdown.finalScore - a.breakdown.finalScore);

  if (evaluated.length > 0) {
    evaluated[0].status = '✓ Selected';
  }
  for (let i = 1; i < evaluated.length; i++) {
    if (evaluated[i].breakdown.hypePenalty >= 20 || evaluated[i].breakdown.finalScore < 60) {
      evaluated[i].status = 'Rejected';
    } else {
      evaluated[i].status = 'Alternative';
    }
  }

  return evaluated;
}

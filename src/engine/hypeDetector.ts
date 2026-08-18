import type { HypeAnalysis } from '../types';

const HYPE_PATTERNS = [
  { pattern: /guarante(e|ed)|50 lpa|millionaire|get rich|100k|remote job instantly/i, weight: 12, flag: 'Guaranteed salary or wealth promise' },
  { pattern: /replace (every|all) (software engineer|developer|coder)/i, weight: 10, flag: 'Sensational job replacement claim' },
  { pattern: /(one|secret|5) (tool|prompt|trick) (that will|to)/i, weight: 8, flag: 'Secret shortcut or silver-bullet framing' },
  { pattern: /in (7|5|3|1) days|in 5 minutes|overnight|instantly/i, weight: 8, flag: 'Unrealistic instant mastery timeline' },
  { pattern: /stop learning (programming|java|coding|c\+\+)/i, weight: 9, flag: 'Discourages fundamental skill building' },
  { pattern: /become an expert (fast|instantly)/i, weight: 7, flag: 'Exaggerated instant expertise claim' },
  { pattern: /10 ai tools that will/i, weight: 8, flag: 'Clickbait listicle format' }
];

export function analyzeHype(title: string, description: string = '', transcript: string = ''): HypeAnalysis {
  const combined = `${title} ${description} ${transcript}`;
  let score = 0;
  const flags: string[] = [];

  for (const item of HYPE_PATTERNS) {
    if (item.pattern.test(combined)) {
      score += item.weight;
      flags.push(item.flag);
    }
  }

  score = Math.min(30, score);

  let riskLevel: 'Low' | 'Medium' | 'Low-Medium' | 'High' = 'Low';
  let penalty = score;

  if (score >= 21) {
    riskLevel = 'High';
    penalty = Math.max(penalty, 24); // Heavy penalty for High Hype
  } else if (score >= 11) {
    riskLevel = 'Medium';
    penalty = Math.max(penalty, 14);
  } else if (score >= 5) {
    riskLevel = 'Low-Medium';
  } else {
    penalty = Math.min(score, 3);
  }

  let reason = 'Content demonstrates realistic, evidence-based educational or technical framing.';
  if (flags.length > 0) {
    reason = `Detected ${flags.length} hype signal(s): ${flags.join('; ')}. Penalty applied: -${penalty} pts.`;
  }

  return {
    score,
    riskLevel,
    flags,
    reason,
    penalty
  };
}

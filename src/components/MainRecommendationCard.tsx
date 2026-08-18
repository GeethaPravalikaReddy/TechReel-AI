import React, { useState } from 'react';
import type { RecommendationResult, FeedbackState, ReelInteraction } from '../types';
import { 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  Ban, 
  RefreshCw, 
  HelpCircle, 
  TrendingUp, 
  CheckCircle2, 
  Flame, 
  Compass, 
  Zap,
  Play,
  HelpCircle as QuestionIcon,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MainRecommendationCardProps {
  recommendation: RecommendationResult;
  reels: ReelInteraction[];
  onRefresh: () => void;
  onAnalyze: () => void;
  onExplain: () => void;
  onWatchReel: () => void;
  feedbackState: FeedbackState;
  onFeedback: (type: 'useful' | 'not_useful' | 'save' | 'not_interested') => void;
  isAnalyzing: boolean;
}

export const MainRecommendationCard: React.FC<MainRecommendationCardProps> = ({
  recommendation,
  reels,
  onRefresh,
  onAnalyze,
  onExplain,
  onWatchReel,
  feedbackState,
  onFeedback,
  isAnalyzing
}) => {
  const { output, candidate, breakdown } = recommendation;
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);

  const isSaved = feedbackState.savedReelIds.includes(candidate.id);
  const isDisliked = feedbackState.dislikedReelIds.includes(candidate.id);

  // Top supporting reels used for inference
  const supportingReels = reels.filter(r => r.watchPercentage >= 75 || r.liked || r.saved).slice(0, 6);

  const handleFeedbackClick = (type: 'useful' | 'not_useful' | 'save' | 'not_interested') => {
    onFeedback(type);
    
    if (type === 'useful' || type === 'save') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
      setFeedbackSuccessMsg(type === 'save' ? '🔖 Reel saved to study list!' : '👍 Feedback recorded! Topic profile updated live.');
    } else if (type === 'not_useful') {
      setFeedbackSuccessMsg('👎 Feedback recorded. Engine will lower score for this style.');
    } else if (type === 'not_interested') {
      setFeedbackSuccessMsg('🚫 Topic suppressed. Engine will prioritize alternative tech topics.');
    }

    setTimeout(() => setFeedbackSuccessMsg(null), 3000);
  };

  const getHypeColor = (risk: string) => {
    if (risk === 'High') return 'bg-rose-950/80 text-rose-400 border-rose-800/80';
    if (risk === 'Medium') return 'bg-amber-950/80 text-amber-400 border-amber-800/80';
    return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
  };

  const getConfidenceColor = (conf: string) => {
    if (conf === 'High') return 'bg-cyan-950 text-cyan-400 border-cyan-800';
    if (conf === 'Medium') return 'bg-indigo-950 text-indigo-400 border-indigo-800';
    return 'bg-slate-900 text-slate-400 border-slate-700';
  };

  return (
    <div className="relative group rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="px-6 py-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            PRIMARY AI RECOMMENDATION ENGINE OUTPUT
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onWatchReel}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Watch Reel Player</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition active:scale-95"
            title="Generate another candidate while avoiding repetition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onExplain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold border border-indigo-800/80 transition active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Explain AI Reasoning</span>
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">

        {/* TITLE & SCORE GAUGE */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> {output.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Difficulty: {output.difficulty}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getConfidenceColor(output.confidence)}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Confidence: {output.confidenceScore}% ({output.confidence})
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getHypeColor(output.hypeRisk)}`}>
                <Flame className="w-3.5 h-3.5" /> Hype Risk: {output.hypeRisk}
              </span>
            </div>

            <div className="flex items-center gap-3 group/title cursor-pointer" onClick={onWatchReel}>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug group-hover/title:text-cyan-300 transition">
                {output.recommendedTechReelTitle}
              </h2>
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover/title:scale-110 transition flex-shrink-0">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {candidate.description}
            </p>
          </div>

          {/* Recommendation Score Gauge */}
          <div 
            onClick={onExplain}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 shadow-inner min-w-[150px] cursor-pointer hover:border-cyan-500/50 transition group/gauge"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover/gauge:text-cyan-400 transition">
              Recommendation Score
            </span>
            <div className="relative flex items-center justify-center my-1">
              <span className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                {output.recommendationScore}
              </span>
              <span className="text-xs text-slate-500 font-bold ml-0.5">/100</span>
            </div>
            
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${output.recommendationScore}%` }}
              />
            </div>
            
            <span className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> {breakdown.mixType}
            </span>
          </div>

        </div>

        {/* SECTION 5 COMPLIANCE: CURRENT REEL vs RECENT BEHAVIOR USED FOR INFERENCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              CURRENT REEL HISTORY REFERENCE:
            </span>
            <p className="text-xs font-semibold text-slate-200">
              {output.currentReelRef}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              LATENT INTEREST DETECTED:
            </span>
            <p className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              {output.interestDetected}
            </p>
          </div>

          {/* RECENT BEHAVIOR USED FOR INFERENCE CHECKLIST */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2 md:col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyan-400" /> RECENT BEHAVIOR USED FOR INFERENCE ({supportingReels.length} SUPPORTING REELS):
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
              {supportingReels.map(r => (
                <div key={r.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] flex items-center gap-1.5">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span className="text-slate-200 font-medium truncate">{r.title}</span>
                  <span className="text-[10px] text-slate-500 ml-auto font-mono">{r.watchPercentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 md:col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              WHY THIS INTEREST WAS INFERRED:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {output.whyInterestDetected}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 md:col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              WHY THIS RECOMMENDATION (CONNECTION TO INTEREST):
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {output.whyThisRecommendation}
            </p>
          </div>

        </div>

        {/* SECTION 17 COMPLIANCE: "WHY DIDN'T THE AI RECOMMEND ANOTHER JAVA REEL?" CALLOUT */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <QuestionIcon className="w-4 h-4 text-amber-400" />
            <span>Why didn't the AI recommend another Java Reel?</span>
          </div>
          <p className="text-amber-100/90 leading-relaxed">
            Java appeared in the student's history, but Java is only <strong>one surface keyword signal</strong>. The student also engaged strongly with software engineering workflow, coding interviews, AI tools, networking, and computing hardware. The AI inferred a broader latent interest: <strong>Software Engineering</strong>, and targeted practical REST API content to expand skills rather than repeating another generic Java meme.
          </p>
        </div>

        {/* TRANSPARENT SCORE BREAKDOWN MATRIX (Section 8 Compliance) */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Recommendation Score Breakdown (Transparent Weights)
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Raw: {Math.round(breakdown.semanticRelevance*0.3 + breakdown.interestExpansion*0.2 + breakdown.educationalValue*0.2 + breakdown.careerRelevance*0.1 + breakdown.engagementPotential*0.1 + breakdown.contentQuality*0.1)} - Hype Penalty ({breakdown.hypePenalty})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-[11px]">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-medium">Semantic (30%)</div>
              <div className="font-bold text-cyan-400 text-sm mt-0.5">{breakdown.semanticRelevance}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-medium">Expansion (20%)</div>
              <div className="font-bold text-indigo-400 text-sm mt-0.5">{breakdown.interestExpansion}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-medium">Educational (20%)</div>
              <div className="font-bold text-emerald-400 text-sm mt-0.5">{breakdown.educationalValue}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-medium">Career (10%)</div>
              <div className="font-bold text-purple-400 text-sm mt-0.5">{breakdown.careerRelevance}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-medium">Quality (10%)</div>
              <div className="font-bold text-blue-400 text-sm mt-0.5">{breakdown.contentQuality}</div>
            </div>
            <div className={`p-2 rounded-lg border ${breakdown.hypePenalty > 0 ? 'bg-rose-950/60 border-rose-800 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
              <div className="font-medium">Hype Penalty</div>
              <div className="font-bold text-sm mt-0.5">-{breakdown.hypePenalty}</div>
            </div>
          </div>
        </div>

        {/* FEEDBACK & INTERACTION ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
          
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1">
              Feedback:
            </span>
            <button
              onClick={() => handleFeedbackClick('useful')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold border border-emerald-800/80 transition active:scale-95"
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Useful
            </button>
            <button
              onClick={() => handleFeedbackClick('not_useful')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                isDisliked ? 'bg-rose-900 text-rose-200 border-rose-700' : 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800/80'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" /> Not Useful
            </button>
            <button
              onClick={() => handleFeedbackClick('save')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                isSaved ? 'bg-cyan-900 text-cyan-200 border-cyan-700' : 'bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border-cyan-800/80'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" /> {isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={() => handleFeedbackClick('not_interested')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 text-xs font-medium border border-slate-800 transition active:scale-95"
            >
              <Ban className="w-3.5 h-3.5" /> Not Interested
            </button>
          </div>

          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 active:scale-95 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze Reels Engine</span>
          </button>

        </div>

        {feedbackSuccessMsg && (
          <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-800 text-cyan-200 text-xs font-semibold animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>{feedbackSuccessMsg}</span>
          </div>
        )}

      </div>
    </div>
  );
};

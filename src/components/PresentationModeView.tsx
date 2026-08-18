import React from 'react';
import type { RecommendationResult, ReelInteraction } from '../types';
import type { InferredProfileResult } from '../engine/interestEngine';
import { 
  Presentation, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Flame, 
  Target,
  Zap
} from 'lucide-react';

interface PresentationModeViewProps {
  profile: InferredProfileResult;
  recommendation: RecommendationResult;
  reels: ReelInteraction[];
}

export const PresentationModeView: React.FC<PresentationModeViewProps> = ({
  profile,
  recommendation,
  reels
}) => {
  const { output, breakdown } = recommendation;
  const primaryName = profile.primaryInterest.name;

  return (
    <div className="rounded-3xl bg-slate-900/95 border border-cyan-500/50 p-6 md:p-10 space-y-8 shadow-2xl backdrop-blur-xl animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500 text-black font-extrabold flex items-center justify-center">
              <Presentation className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              TechReel AI — Judge & Evaluation Presentation View
            </h2>
          </div>
          <p className="text-xs text-cyan-300 mt-1">
            High-level executive story mode explaining core problem, semantic inference, trap filtration, and final recommendation.
          </p>
        </div>

        <span className="px-4 py-1.5 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold border border-cyan-700 uppercase tracking-widest flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-cyan-400" /> Presentation Active
        </span>
      </div>

      {/* 5-STEP EXECUTIVE STORY PIPELINE */}
      <div className="space-y-6">
        
        {/* STEP 1: PROBLEM & INPUT */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. STUDENT SCROLLING INPUT (MIXED REELS)
            </span>
            <span className="text-xs text-slate-400">{reels.length} Analyzed Interactions</span>
          </div>
          <p className="text-xs text-slate-300">
            Student scrolls short-form content containing programming memes, developer lifestyle, interview jokes, laptop reviews, AI coding tools, and networking protocols.
          </p>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="w-5 h-5 text-cyan-400 rotate-90" />
        </div>

        {/* STEP 2: LATENT INFERENCE */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-800/80 space-y-3 shadow-lg shadow-cyan-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              2. AI LATENT INTEREST INFERENCE ENGINE
            </span>
            <span className="text-xs font-extrabold text-cyan-300">Confidence: {profile.confidenceScore}%</span>
          </div>
          <div className="text-lg font-extrabold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Inferred Primary Interest: <span className="text-cyan-300">{primaryName}</span>
          </div>
          <p className="text-xs text-slate-300">
            The AI transcends surface keywords like "Java" to infer a broader underlying interest in Software Engineering based on 6 supporting behavioral signals.
          </p>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="w-5 h-5 text-indigo-400 rotate-90" />
        </div>

        {/* STEP 3: NAIVE VS AI COMPARISON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900 text-xs space-y-2">
            <span className="font-bold text-rose-300 flex items-center gap-1">
              <XCircle className="w-4 h-4 text-rose-400" /> NAIVE KEYWORD RECOMENDER
            </span>
            <p className="text-rose-200">
              Detects "Java" → Recommends another generic Java meme ❌ (Keyword Repetition Trap).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs space-y-2">
            <span className="font-bold text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> TECHREEL AI AGENT
            </span>
            <p className="text-emerald-200">
              Detects Software Engineering → Recommends REST API backend architecture ✓ (Skill Expansion).
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="w-5 h-5 text-purple-400 rotate-90" />
        </div>

        {/* STEP 4: HYPE PENALTY FILTER */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> 4. AI HYPE PENALTY FILTER
            </span>
            <span className="text-xs font-bold text-rose-400">High Hype Rejected</span>
          </div>
          <p className="text-xs text-slate-300">
            Clickbait candidate <em>"10 AI Tools That Will Get You a ₹50 LPA Job"</em> received a <strong>-24 point Hype Penalty</strong> and was rejected from top recommendations.
          </p>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="w-5 h-5 text-emerald-400 rotate-90" />
        </div>

        {/* STEP 5: FINAL WINNING RECOMMENDATION */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> 5. FINAL SELECTED RECOMMENDATION
            </span>
            <span className="text-sm font-black text-white bg-cyan-600 px-3 py-0.5 rounded-full font-mono">
              Score: {breakdown.finalScore} / 100
            </span>
          </div>

          <h3 className="text-2xl font-black text-white">
            {output.recommendedTechReelTitle}
          </h3>

          <p className="text-xs text-slate-200 leading-relaxed">
            {output.whyThisRecommendation}
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
              Category: {output.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
              Difficulty: {output.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              Hype Risk: {output.hypeRisk}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

import React from 'react';
import { XCircle, CheckCircle2, Cpu } from 'lucide-react';

export const NaiveVsAiComparison: React.FC = () => {
  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Why TechReel AI Is Different (Naive Keyword vs Latent AI)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrating why semantic interest inference outperforms shallow keyword matching.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
          Core Architectural Distinction
        </span>
      </div>

      {/* SIDE BY SIDE PANELS (Section 3 Compliance) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT PANEL: NAIVE KEYWORD SYSTEM */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-rose-900/60 space-y-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-500" /> 1. NAIVE KEYWORD SYSTEM
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              Surface-level matching
            </span>
          </div>

          {/* Flow Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 text-center">
            <div className="p-2 rounded bg-slate-950 border border-slate-800 font-bold text-white">
              Java Meme Watched
            </div>
            <div className="text-rose-400 font-bold flex items-center justify-center gap-1">
              ↓ Keyword extracted: "Java"
            </div>
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 font-bold">
              Recommend: "Java Collections in 60s" ❌
            </div>
          </div>

          {/* Flaws list */}
          <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-900">
            <div className="flex items-start gap-2 text-rose-300">
              <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span><strong>Repeats exact surface topic</strong> (Creates repetitive Java loop)</span>
            </div>
            <div className="flex items-start gap-2 text-rose-300">
              <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span><strong>Does not understand broader interest</strong> (Misses SE & Tech interest)</span>
            </div>
            <div className="flex items-start gap-2 text-rose-300">
              <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span><strong>Ignores user interaction history</strong> (Treats 1 Reel in isolation)</span>
            </div>
            <div className="flex items-start gap-2 text-rose-300">
              <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span><strong>Ignores Hype & Clickbait</strong> (Recommends ₹50 LPA AI hype easily)</span>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: TECHREEL AI AGENT */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-700/80 space-y-4 relative overflow-hidden shadow-lg shadow-cyan-950/30">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> 2. TECHREEL AI AGENT
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Semantic + behavioral reasoning
            </span>
          </div>

          {/* Flow Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 text-center">
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-200">
              Java Meme + SE Lifestyle + DSA + AI + Hardware + Networks
            </div>
            <div className="text-cyan-400 font-bold flex items-center justify-center gap-1">
              ↓ Semantic Pattern Extraction: Programming + Systems
            </div>
            <div className="text-indigo-300 font-bold">
              ↓ Inferred Latent Interest: Software Engineering
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 font-bold shadow-md">
              Recommend: "How REST APIs Actually Work" ✓
            </div>
          </div>

          {/* Advantages list */}
          <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-900">
            <div className="flex items-start gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Understands broader latent interest</strong> (Software Engineering)</span>
            </div>
            <div className="flex items-start gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Aggregates multi-signal behavior</strong> (Watches, Saves, Rewatches)</span>
            </div>
            <div className="flex items-start gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Expands into useful adjacent topics</strong> (Backend APIs, Docker)</span>
            </div>
            <div className="flex items-start gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Applies Hype Penalty</strong> (Filters out ₹50 LPA clickbait)</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

import React from 'react';
import type { InferredProfileResult } from '../engine/interestEngine';
import { Target, PieChart, Sparkles } from 'lucide-react';

interface InterestProfileViewProps {
  profile: InferredProfileResult;
}

export const InterestProfileView: React.FC<InterestProfileViewProps> = ({ profile }) => {
  const { primaryInterest, topicProfile, styleProfile, overallConfidence } = profile;

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-xl">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              AI Inferred Latent Interest Profile
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Disentangling underlying topic interests from surface content formats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
            Overall Confidence: {overallConfidence}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-4 h-4" /> 1. TOPIC PROFILE (WHAT THE USER LIKES)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Score / 100</span>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950 to-indigo-950 border border-cyan-800/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-extrabold text-cyan-400 tracking-wider">
                PRIMARY LATENT INTEREST
              </span>
              <span className="text-xs font-black text-cyan-300">
                {primaryInterest.score} / 100
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              {primaryInterest.name}
            </div>
            <p className="text-[11px] text-slate-300">
              {primaryInterest.evidenceSummary}
            </p>
          </div>

          <div className="space-y-2.5">
            {Object.entries(topicProfile)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([topic, score]) => (
                <div key={topic} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>{topic}</span>
                    <span className="text-slate-400 font-mono">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        topic === primaryInterest.name
                          ? 'bg-gradient-to-r from-cyan-400 to-indigo-500'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${Math.max(5, score)}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> 2. CONTENT STYLE PROFILE (FORMAT PREFERENCE)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Affinity %</span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs text-purple-200 leading-relaxed">
            <span className="font-bold block text-white mb-0.5">Topic Interest ≠ Content Format Preference</span>
            Engaging with a programming meme does not mean the user wants only memes. TechReel AI separates topic interest (Software Engineering) from style preference (Technical Explanations vs Humor).
          </div>

          <div className="space-y-2.5">
            {Object.entries(styleProfile)
              .sort((a, b) => b[1] - a[1])
              .map(([style, affinity]) => (
                <div key={style} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>{style}</span>
                    <span className="text-slate-400 font-mono">{affinity}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(5, affinity)}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>

    </div>
  );
};

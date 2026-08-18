import React, { useState } from 'react';
import type { InferredProfileResult } from '../engine/interestEngine';
import type { RecommendationResult, ReelInteraction } from '../types';
import { Layers, Sparkles, ArrowRight } from 'lucide-react';

interface InterestGraphProps {
  profile: InferredProfileResult;
  recommendation: RecommendationResult;
  reels: ReelInteraction[];
}

export const InterestGraph: React.FC<InterestGraphProps> = ({
  profile,
  recommendation: _recommendation,
  reels: _reels
}) => {
  const [, setActiveHoverNode] = useState<string | null>(null);
  const primaryName = profile.primaryInterest.name;

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-xl">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Semantic Interest Graph & Reasoning Flow
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Visual map of how Reel interactions are grouped into broader latent interests.
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1 whitespace-nowrap self-start md:self-auto">
          <Sparkles className="w-3 h-3" /> Inferred: {primaryName} ({profile.primaryInterest.score}/100)
        </span>
      </div>

      {/* SVG Graph */}
      <div className="relative w-full overflow-x-auto rounded-2xl bg-slate-950 border border-slate-800/80">
        <svg
          className="w-full"
          style={{ minWidth: '760px', height: '320px' }}
          viewBox="0 0 860 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="igCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="igGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="igGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#06b6d4" />
            </marker>
            <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
            </marker>
          </defs>

          {/* ── CONNECTOR LINES (drawn FIRST so nodes render on top) ── */}

          {/* Reel nodes → Semantic Hub */}
          {/* Java Meme (dashed) */}
          <path d="M 178,68 C 260,68 260,168 330,168" stroke="#475569" strokeWidth="1.8" strokeDasharray="5,4" fill="none" />
          {/* SE Lifestyle (bright cyan) */}
          <path d="M 178,130 C 260,130 260,168 330,168" stroke="#06b6d4" strokeWidth="2.5" fill="none" filter="url(#igGlow)" />
          {/* AI Coding */}
          <path d="M 178,192 C 260,192 260,168 330,168" stroke="#3b82f6" strokeWidth="2" fill="none" />
          {/* URL & HTTP */}
          <path d="M 178,254 C 260,254 260,168 330,168" stroke="#8b5cf6" strokeWidth="2" fill="none" />

          {/* Semantic Hub → Primary Interest (thick cyan, animated) */}
          <path d="M 450,168 L 530,168" stroke="#06b6d4" strokeWidth="4" fill="none" filter="url(#igGlow)" markerEnd="url(#arrowCyan)" />

          {/* Semantic Hub → AI side node */}
          <path d="M 450,168 C 500,168 500,88 530,88" stroke="#475569" strokeWidth="1.5" fill="none" />
          {/* Semantic Hub → Hardware side node */}
          <path d="M 450,168 C 500,168 500,248 530,248" stroke="#475569" strokeWidth="1.5" fill="none" />

          {/* Primary Interest → Recommended */}
          <path d="M 690,168 L 746,168" stroke="#10b981" strokeWidth="3.5" fill="none" filter="url(#igGlow)" markerEnd="url(#arrowGreen)" />

          {/* ── REEL INPUT NODES (Level 1) ── */}

          {/* Java Meme */}
          <g transform="translate(20,50)" onMouseEnter={() => setActiveHoverNode('reel1')} className="cursor-pointer">
            <rect x="0" y="0" width="158" height="36" rx="9" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <text x="14" y="23" fill="#94a3b8" fontSize="12" fontWeight="600">Java Meme (94%)</text>
          </g>

          {/* SE Lifestyle */}
          <g transform="translate(20,112)" onMouseEnter={() => setActiveHoverNode('reel2')} className="cursor-pointer">
            <rect x="0" y="0" width="158" height="36" rx="9" fill="#083344" stroke="#06b6d4" strokeWidth="2" />
            <text x="14" y="23" fill="#38bdf8" fontSize="12" fontWeight="700">SE Lifestyle (91%)</text>
          </g>

          {/* AI Coding */}
          <g transform="translate(20,174)" onMouseEnter={() => setActiveHoverNode('reel3')} className="cursor-pointer">
            <rect x="0" y="0" width="158" height="36" rx="9" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="14" y="23" fill="#93c5fd" fontSize="12" fontWeight="600">AI Coding (96%)</text>
          </g>

          {/* URL & HTTP */}
          <g transform="translate(20,236)" onMouseEnter={() => setActiveHoverNode('reel4')} className="cursor-pointer">
            <rect x="0" y="0" width="158" height="36" rx="9" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5" />
            <text x="14" y="23" fill="#c4b5fd" fontSize="12" fontWeight="600">URL & HTTP (97%)</text>
          </g>

          {/* ── SEMANTIC HUB (Level 2) ── */}
          <g transform="translate(308,136)" onMouseEnter={() => setActiveHoverNode('hub')} className="cursor-pointer">
            <rect x="0" y="0" width="142" height="64" rx="16" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" filter="url(#igGlow)" />
            <text x="71" y="26" fill="#a5b4fc" fontSize="10" fontWeight="700" textAnchor="middle" letterSpacing="0.5">Semantic Hub</text>
            <text x="71" y="46" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">Software & Systems</text>
          </g>

          {/* ── SIDE NODES (Level 3) ── */}

          {/* AI Score */}
          <g transform="translate(530,70)">
            <rect x="0" y="0" width="120" height="36" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x="60" y="23" fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle">
              AI (Score: {profile.topicProfile['AI'] || 84})
            </text>
          </g>

          {/* Hardware / Nets */}
          <g transform="translate(530,230)">
            <rect x="0" y="0" width="120" height="36" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x="60" y="23" fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle">Hardware / Nets</text>
          </g>

          {/* ── PRIMARY INTEREST NODE (Level 3) ── */}
          <g transform="translate(530,130)" onMouseEnter={() => setActiveHoverNode('primary')} className="cursor-pointer">
            {/* Glow halo */}
            <rect x="-6" y="-6" width="172" height="76" rx="22" fill="#06b6d4" opacity="0.15" />
            <rect x="0" y="0" width="160" height="64" rx="16" fill="#030712" stroke="#06b6d4" strokeWidth="2.5" filter="url(#igGlow)" />
            <text x="80" y="24" fill="#38bdf8" fontSize="9" fontWeight="800" textAnchor="middle" letterSpacing="1.2">PRIMARY INTEREST</text>
            <text x="80" y="46" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">{primaryName}</text>
          </g>

          {/* ── RECOMMENDED NODE (Level 4) ── */}
          <g transform="translate(750,130)" onMouseEnter={() => setActiveHoverNode('rec')} className="cursor-pointer">
            <rect x="0" y="0" width="102" height="64" rx="14" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" filter="url(#igGlow)" />
            <text x="51" y="24" fill="#6ee7b7" fontSize="9" fontWeight="800" textAnchor="middle" letterSpacing="0.8">RECOMMENDED</text>
            <text x="51" y="46" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">REST API Reel</text>
          </g>

        </svg>
      </div>

      {/* Surface Signal → Latent Interest Journey */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          From Surface Signal → Latent Interest Journey
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-center text-[11px] font-semibold">
          {[
            { surface: '"Java meme"', latent: 'Programming' },
            { surface: '"DSA joke"', latent: 'Algorithms' },
            { surface: '"SE lifestyle"', latent: 'Dev Ecosystem' },
            { surface: '"AI coding tools"', latent: 'AI Development' },
            { surface: 'Common Space', latent: 'SOFTWARE ENG.', highlight: true },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-2.5 rounded-xl border ${
                item.highlight
                  ? 'bg-cyan-950 border-cyan-800 text-cyan-200'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {item.highlight ? (
                <>
                  <div className="text-cyan-400 font-extrabold uppercase text-[9px] mb-1">Common Space</div>
                  <div className="text-white font-black">{item.latent}</div>
                </>
              ) : (
                <>
                  <div className="text-slate-400">{item.surface}</div>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 mx-auto my-1 rotate-90 sm:rotate-0" />
                  <div className="text-white">{item.latent}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

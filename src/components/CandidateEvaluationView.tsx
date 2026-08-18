import React from 'react';
import type { RecommendationResult } from '../types';
import { Database, AlertTriangle } from 'lucide-react';

interface CandidateEvaluationViewProps {
  evaluations: RecommendationResult[];
}

export const CandidateEvaluationView: React.FC<CandidateEvaluationViewProps> = ({ evaluations }) => {
  const topCandidates = evaluations.slice(0, 5);

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Recommendation Candidate Ranking & Rejection Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluated candidates ranked by scoring algorithm, displaying explicit rejection reasons for hype content.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {evaluations.length} Evaluated Candidates
        </span>
      </div>

      {/* TOP 5 RANKED CANDIDATES (Section 9 & 10 Compliance) */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          Top Candidate Ranking & Selection Status
        </span>

        <div className="grid grid-cols-1 gap-3">
          {topCandidates.map((item, idx) => {
            const isSelected = item.status === '✓ Selected';
            const isRejected = item.status === 'Rejected';

            return (
              <div 
                key={item.candidate.id}
                className={`p-4 rounded-2xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isSelected 
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-950/40' 
                    : isRejected 
                    ? 'bg-rose-950/30 border-rose-900/80' 
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected ? 'bg-cyan-500 text-black' : isRejected ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    #{idx + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {item.candidate.title}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {item.candidate.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      {item.candidate.description}
                    </p>

                    {/* Rejection Reason if Rejected */}
                    {isRejected && item.rejectionReason && (
                      <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-medium flex items-center gap-1.5 mt-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span><strong>Rejected because:</strong> {item.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
                  <div className="text-right">
                    <div className="text-sm font-black text-white font-mono">
                      {item.breakdown.finalScore} / 100
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Hype: {item.output.hypeRisk}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                    isSelected 
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-md' 
                      : isRejected 
                      ? 'bg-rose-950 text-rose-300 border-rose-800' 
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL EVALUATION TABLE */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Complete Candidate Scoring Transparency Matrix ({evaluations.length} Candidates)
        </span>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Rank & Title</th>
                <th className="p-3">Category / Topic</th>
                <th className="p-3 text-center">Semantic (30%)</th>
                <th className="p-3 text-center">Expansion (20%)</th>
                <th className="p-3 text-center">Edu (20%)</th>
                <th className="p-3 text-center text-rose-400">Hype Penalty</th>
                <th className="p-3 text-right">Final Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {evaluations.map((item, idx) => {
                const isTop = idx === 0;
                const isHighHype = item.breakdown.hypePenalty >= 20;

                return (
                  <tr 
                    key={item.candidate.id}
                    className={`hover:bg-slate-900/60 transition ${
                      isTop ? 'bg-cyan-950/30' : isHighHype ? 'bg-rose-950/20' : ''
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          isTop ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white line-clamp-1">
                            {item.candidate.title}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            By {item.candidate.author} ({item.candidate.duration})
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <div className="text-slate-200 text-[11px] font-semibold">
                        {item.candidate.topic}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {item.candidate.category}
                      </span>
                    </td>

                    <td className="p-3 text-center font-mono text-cyan-400">
                      {item.breakdown.semanticRelevance}
                    </td>

                    <td className="p-3 text-center font-mono text-indigo-400">
                      {item.breakdown.interestExpansion}
                    </td>

                    <td className="p-3 text-center font-mono text-emerald-400">
                      {item.breakdown.educationalValue}
                    </td>

                    <td className="p-3 text-center font-mono">
                      {item.breakdown.hypePenalty > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-bold border border-rose-800">
                          -{item.breakdown.hypePenalty}
                        </span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <div className="font-black text-sm text-white font-mono">
                        {item.breakdown.finalScore} / 100
                      </div>
                      {isTop && (
                        <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block">
                          Selected Top
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

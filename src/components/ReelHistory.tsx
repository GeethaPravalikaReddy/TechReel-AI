import React from 'react';
import type { ReelInteraction } from '../types';
import { 
  History, 
  ThumbsUp, 
  Bookmark, 
  Repeat, 
  Eye, 
  Flame, 
  Slash, 
  Play
} from 'lucide-react';

interface ReelHistoryProps {
  reels: ReelInteraction[];
  onToggleInteraction: (reelId: string, type: 'liked' | 'saved' | 'rewatched' | 'skipped') => void;
  onChangeWatchPct: (reelId: string, pct: number) => void;
  onSelectReelToWatch: (reel: ReelInteraction) => void;
}

export const ReelHistory: React.FC<ReelHistoryProps> = ({
  reels,
  onToggleInteraction,
  onChangeWatchPct,
  onSelectReelToWatch
}) => {
  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Reel Interaction History (Sample Dataset)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any Reel card to watch the video player, or use sliders/toggles to adjust AI inference in real time!
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 w-fit">
          {reels.length} Analyzed Reels
        </span>
      </div>

      {/* REELS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reels.map((reel, index) => {
          const isHype = reel.hypeScore > 20;

          return (
            <div
              key={reel.id}
              className="relative flex flex-col justify-between rounded-2xl bg-slate-950/80 border border-slate-800/90 p-4 hover:border-cyan-500/60 transition group shadow-lg"
            >
              {/* Click Thumbnail to Watch Reel */}
              <div 
                onClick={() => onSelectReelToWatch(reel)}
                className={`relative w-full h-28 rounded-xl bg-gradient-to-tr ${reel.thumbnailGradient || 'from-slate-800 to-slate-900'} p-3 flex flex-col justify-between overflow-hidden shadow-inner cursor-pointer group/thumb`}
              >
                
                <div className="flex items-center justify-between z-10">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-400 border border-slate-700">
                    REEL 0{index + 1}
                  </span>
                  
                  {isHype && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-950/90 text-[10px] font-extrabold text-rose-400 border border-rose-800 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> HYPE
                    </span>
                  )}
                </div>

                <div className="z-10">
                  <span className="text-[10px] font-semibold text-slate-200 bg-slate-950/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {reel.category}
                  </span>
                </div>

                {/* Always-Visible / Hover Play Overlay Icon */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 group-hover/thumb:bg-slate-950/50 transition">
                  <div className="w-10 h-10 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

              </div>

              {/* Title & Description */}
              <div className="my-3 space-y-1 cursor-pointer" onClick={() => onSelectReelToWatch(reel)}>
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition">
                  {reel.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {reel.description}
                </p>
              </div>

              {/* Watch % slider control */}
              <div className="space-y-1 my-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" /> Watch %
                  </span>
                  <span className={reel.watchPercentage >= 75 ? 'text-emerald-400' : 'text-amber-400'}>
                    {reel.watchPercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={reel.watchPercentage}
                  onChange={(e) => onChangeWatchPct(reel.id, parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Content Style & Surface Topic Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800">
                  Format: {reel.contentStyle}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-900">
                  Topic: {reel.surfaceTopic}
                </span>
              </div>

              {/* Interactive Action Controls */}
              <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onToggleInteraction(reel.id, 'liked')}
                  className={`p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 border transition ${
                    reel.liked ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                  }`}
                  title="Toggle Like"
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>

                <button
                  onClick={() => onToggleInteraction(reel.id, 'saved')}
                  className={`p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 border transition ${
                    reel.saved ? 'bg-cyan-950 text-cyan-300 border-cyan-800' : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                  }`}
                  title="Toggle Save"
                >
                  <Bookmark className="w-3 h-3" />
                </button>

                <button
                  onClick={() => onToggleInteraction(reel.id, 'rewatched')}
                  className={`p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 border transition ${
                    reel.rewatched ? 'bg-purple-950 text-purple-300 border-purple-800' : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                  }`}
                  title="Toggle Rewatched"
                >
                  <Repeat className="w-3 h-3" />
                </button>

                <button
                  onClick={() => onToggleInteraction(reel.id, 'skipped')}
                  className={`p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 border transition ${
                    reel.skipped ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                  }`}
                  title="Toggle Skipped"
                >
                  <Slash className="w-3 h-3" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

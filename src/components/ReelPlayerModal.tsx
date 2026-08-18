import React, { useState, useEffect } from 'react';
import type { ReelInteraction, RecommendationCandidate } from '../types';
import { 
  X, 
  Play, 
  Pause, 
  ThumbsUp, 
  Bookmark, 
  Repeat, 
  Volume2, 
  VolumeX, 
  Flame,
  Zap,
  Terminal,
  Cpu,
  Sparkles,
  Network
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReelPlayerModalProps {
  item: ReelInteraction | RecommendationCandidate | null;
  onClose: () => void;
  onToggleInteraction?: (reelId: string, type: 'liked' | 'saved' | 'rewatched' | 'skipped') => void;
  onChangeWatchPct?: (reelId: string, pct: number) => void;
}

export const ReelPlayerModal: React.FC<ReelPlayerModalProps> = ({
  item,
  onClose,
  onToggleInteraction,
  onChangeWatchPct
}) => {
  if (!item) return null;

  const isReelInteraction = 'watchPercentage' in item;
  const reelInteraction = isReelInteraction ? (item as ReelInteraction) : null;

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(
    reelInteraction ? reelInteraction.watchPercentage : 0
  );
  const [isLiked, setIsLiked] = useState<boolean>(reelInteraction?.liked || false);
  const [isSaved, setIsSaved] = useState<boolean>(reelInteraction?.saved || false);
  const [isRewatched, setIsRewatched] = useState<boolean>(reelInteraction?.rewatched || false);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsRewatched(true);
            if (reelInteraction && onToggleInteraction && !reelInteraction.rewatched) {
              onToggleInteraction(reelInteraction.id, 'rewatched');
            }
            return 0;
          }
          const next = prev + 1.5;
          if (reelInteraction && onChangeWatchPct && next > reelInteraction.watchPercentage) {
            onChangeWatchPct(reelInteraction.id, Math.min(100, Math.round(next)));
          }
          return next;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying, item]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
    }
    if (reelInteraction && onToggleInteraction) {
      onToggleInteraction(reelInteraction.id, 'liked');
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (reelInteraction && onToggleInteraction) {
      onToggleInteraction(reelInteraction.id, 'saved');
    }
  };

  const categoryLower = item.category.toLowerCase();
  const gradientClass = item.thumbnailGradient || 'from-indigo-600 via-purple-700 to-slate-900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in">
      
      <div className="relative w-full max-w-sm h-[700px] rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between">
        
        <div className={`relative w-full h-full bg-gradient-to-b ${gradientClass} flex flex-col justify-between p-5 text-white overflow-hidden`}>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
            {(categoryLower.includes('network') || categoryLower.includes('web')) && (
              <div className="relative flex items-center justify-center w-full h-full">
                <div className="absolute w-48 h-48 rounded-full border border-cyan-400/40 animate-ping" />
                <div className="absolute w-36 h-36 rounded-full border border-cyan-300/60 animate-spin" />
                <Network className="w-24 h-24 text-cyan-300 animate-pulse" />
              </div>
            )}

            {categoryLower.includes('ai') && (
              <div className="relative flex items-center justify-center w-full h-full">
                <div className="absolute w-44 h-44 rounded-full border border-emerald-400/50 animate-pulse" />
                <Sparkles className="w-24 h-24 text-emerald-300 animate-bounce" />
              </div>
            )}

            {(categoryLower.includes('hardware') || categoryLower.includes('gaming')) && (
              <div className="relative flex items-center justify-center w-full h-full">
                <Cpu className="w-24 h-24 text-amber-300 animate-pulse" />
              </div>
            )}

            {(categoryLower.includes('java') || categoryLower.includes('dsa') || categoryLower.includes('career') || categoryLower.includes('other')) && (
              <div className="relative flex items-center justify-center w-full h-full">
                <Terminal className="w-24 h-24 text-indigo-300 animate-pulse" />
              </div>
            )}
          </div>

          <div className="absolute top-16 inset-x-4 h-44 opacity-20 font-mono text-[10px] p-3 text-cyan-200 overflow-hidden leading-relaxed pointer-events-none select-none bg-slate-950/40 rounded-xl border border-white/10">
            <div className="text-cyan-400 font-bold mb-1">// LIVE REAL-TIME REEL PIPELINE EXECUTION</div>
            <div>{`> Connecting to node server: 192.168.1.1`}</div>
            <div>{`> GET /api/v1/lookup?host=domain.com HTTP/1.1`}</div>
            <div>{`> DNS Recursive Query -> Root (.com) -> Authoritative Nameserver`}</div>
            <div className="text-emerald-400 font-bold">{`[200 OK] IP Resolved: 104.21.78.11 (Latency: 14ms)`}</div>
            <div className="text-indigo-300">{`> Rendering DOM elements: Watched ${Math.round(progress)}%`}</div>
          </div>

          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-[10px] font-extrabold text-cyan-400 border border-slate-700">
                {item.category}
              </span>
              {('hypeScore' in item && item.hypeScore > 20) && (
                <span className="px-2 py-0.5 rounded-full bg-rose-950/90 text-[10px] font-extrabold text-rose-400 border border-rose-800 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> HYPE
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 backdrop-blur-md text-white border border-slate-700/80 transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>

              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 backdrop-blur-md text-white border border-slate-700/80 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative z-20 flex-1 flex flex-col items-center justify-center cursor-pointer group"
          >
            <div className="w-20 h-20 rounded-full bg-slate-950/60 backdrop-blur-md border border-cyan-400/40 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:border-cyan-400 transition">
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white fill-current" />
              ) : (
                <Play className="w-8 h-8 text-cyan-400 fill-current ml-1" />
              )}
            </div>

            <span className="text-[11px] font-semibold text-slate-200 mt-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 shadow-lg">
              {isPlaying ? 'Tap to Pause Reel' : 'Tap to Play Reel'}
            </span>
          </div>

          <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-4">
            
            <button
              onClick={handleLike}
              className={`flex flex-col items-center gap-1 p-3 rounded-full border transition active:scale-95 shadow-xl ${
                isLiked ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/40' : 'bg-slate-950/80 text-slate-300 border-slate-700/80 backdrop-blur-md'
              }`}
            >
              <ThumbsUp className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={handleSave}
              className={`flex flex-col items-center gap-1 p-3 rounded-full border transition active:scale-95 shadow-xl ${
                isSaved ? 'bg-cyan-500 text-black border-cyan-400 shadow-cyan-500/40' : 'bg-slate-950/80 text-slate-300 border-slate-700/80 backdrop-blur-md'
              }`}
            >
              <Bookmark className="w-5 h-5 fill-current" />
            </button>

            <div className={`p-3 rounded-full border backdrop-blur-md shadow-xl ${isRewatched ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-950/80 text-slate-400 border-slate-700/80'}`}>
              <Repeat className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} />
            </div>

          </div>

          <div className="relative z-20 space-y-3 pt-3 border-t border-white/10 bg-slate-950/90 p-4 rounded-2xl backdrop-blur-xl">
            
            <div className="pr-12">
              <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                {item.title}
              </h3>
              <p className="text-[11px] text-cyan-300 font-semibold mt-0.5">
                {'creatorType' in item ? `@${item.creatorType}_Creator` : `@${(item as RecommendationCandidate).author}`}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-800 text-[11px] text-slate-200 leading-relaxed font-mono">
              <span className="text-[9px] uppercase font-bold text-cyan-400 flex items-center gap-1 mb-1">
                🎙️ Live Reel Caption Stream:
              </span>
              {'transcript' in item && item.transcript
                ? item.transcript
                : item.description}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-extrabold text-slate-300">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" /> Watch Progress
                </span>
                <span className="text-cyan-400 font-mono">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

import React from 'react';
import { Sparkles, Play, RotateCcw, Cpu, Zap } from 'lucide-react';

interface HeaderProps {
  onRunDemo: () => void;
  onReset: () => void;
  isRunningDemo: boolean;
  selectedPreset: string;
  onSelectPreset: (presetId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRunDemo,
  onReset,
  isRunningDemo,
  selectedPreset,
  onSelectPreset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  TechReel <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase tracking-widest">
                  v3.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Turn your scrolling into smarter learning.
              </p>
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onRunDemo}
              disabled={isRunningDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Demo</span>
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 whitespace-nowrap">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          <select
            value={selectedPreset}
            onChange={(e) => onSelectPreset(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 transition cursor-pointer font-medium"
          >
            <option value="trap-1">Preset 1 (Trap 1): Surface Java Meme → Broader Software Engineering</option>
            <option value="trap-2">Preset 2 (Trap 2): AI Hype Exposure → Genuine AI Learning Interest</option>
            <option value="trap-3">Preset 3 (Trap 3): Gaming Performance → Computing & Hardware</option>
            <option value="case-1">Case 1: Low Tech Signal / Mostly Entertainment</option>
            <option value="case-4">Case 4: Contradictory Format (Memes Watched, Tutorials Skipped)</option>
          </select>
        </div>

        {/* Desktop action buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onReset}
            disabled={isRunningDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={onRunDemo}
            disabled={isRunningDemo}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition ${
              isRunningDemo ? 'opacity-75 cursor-wait' : ''
            }`}
          >
            {isRunningDemo ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
                <span>Simulating AI Reasoning...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Demo</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

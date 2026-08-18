import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MainRecommendationCard } from './components/MainRecommendationCard';
import { NaiveVsAiComparison } from './components/NaiveVsAiComparison';
import { InterestGraph } from './components/InterestGraph';
import { ReelHistory } from './components/ReelHistory';
import { InterestProfileView } from './components/InterestProfileView';
import { CandidateEvaluationView } from './components/CandidateEvaluationView';
import { AIReasoningView } from './components/AIReasoningView';
import { ReelPlayerModal } from './components/ReelPlayerModal';

import { INITIAL_SAMPLE_REELS } from './data/sampleReels';
import { CANDIDATE_REELS } from './data/candidateReels';
import { inferLatentInterests } from './engine/interestEngine';
import { rankAndSelectRecommendation, getEvaluatedCandidatesList } from './engine/recommendationEngine';
import type { ReelInteraction, FeedbackState, RecommendationCandidate } from './types';

import {
  LayoutDashboard,
  Layers,
  History,
  Target,
  Database,
  HelpCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export function App() {
  const [reels, setReels] = useState<ReelInteraction[]>(INITIAL_SAMPLE_REELS);
  const [selectedPreset, setSelectedPreset] = useState<string>('trap-1');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'graph' | 'history' | 'profile' | 'evaluations' | 'reasoning'>('dashboard');
  const [isRunningDemo, setIsRunningDemo] = useState<boolean>(false);
  const [demoStepMessage, setDemoStepMessage] = useState<string | null>(null);
  const [historyCandidateIds, setHistoryCandidateIds] = useState<string[]>([]);
  const [activeReelPlayerItem, setActiveReelPlayerItem] = useState<ReelInteraction | RecommendationCandidate | null>(null);

  const [feedbackState, setFeedbackState] = useState<FeedbackState>({
    likedReelIds: [],
    dislikedReelIds: [],
    savedReelIds: [],
    notInterestedTopics: [],
    boostedTopics: [],
    styleAdjustments: {}
  });

  const inferredProfile = useMemo(() => {
    return inferLatentInterests(reels, feedbackState);
  }, [reels, feedbackState]);

  const primaryRecommendation = useMemo(() => {
    return rankAndSelectRecommendation(
      CANDIDATE_REELS,
      inferredProfile,
      reels,
      feedbackState,
      historyCandidateIds
    );
  }, [inferredProfile, reels, feedbackState, historyCandidateIds]);

  const candidateEvaluations = useMemo(() => {
    return getEvaluatedCandidatesList(
      CANDIDATE_REELS,
      inferredProfile,
      reels,
      feedbackState,
      historyCandidateIds
    );
  }, [inferredProfile, reels, feedbackState, historyCandidateIds]);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    setHistoryCandidateIds([]);

    if (presetId === 'trap-1') {
      setReels(INITIAL_SAMPLE_REELS);
    } else if (presetId === 'trap-2') {
      const hypeReels = INITIAL_SAMPLE_REELS.map(r => {
        if (r.id === 'reel-06') return { ...r, watchPercentage: 98, liked: true, rewatched: true };
        if (r.id === 'reel-05') return { ...r, watchPercentage: 96, saved: true };
        return r;
      });
      setReels(hypeReels);
    } else if (presetId === 'trap-3') {
      const gamingReels = INITIAL_SAMPLE_REELS.map(r => {
        if (r.id === 'reel-07' || r.id === 'reel-04') {
          return { ...r, watchPercentage: 99, saved: true, rewatched: true };
        }
        return r;
      });
      setReels(gamingReels);
    } else if (presetId === 'case-1') {
      const entReels = INITIAL_SAMPLE_REELS.map(r => ({
        ...r,
        watchPercentage: 15,
        liked: false,
        saved: false,
        rewatched: false,
        skipped: true
      }));
      setReels(entReels);
    } else if (presetId === 'case-4') {
      const formatReels = INITIAL_SAMPLE_REELS.map(r => {
        if (r.contentStyle === 'Meme') return { ...r, watchPercentage: 98, liked: true, rewatched: true };
        if (r.contentStyle === 'Technical explanation') return { ...r, watchPercentage: 20, skipped: true, liked: false };
        return r;
      });
      setReels(formatReels);
    }
  };

  // 9-Step Reasoning Pipeline Animation
  const handleRunDemo = () => {
    setIsRunningDemo(true);
    setActiveTab('dashboard');

    const steps = [
      '1/9 ✓ Reading Reel interaction history...',
      '2/9 ✓ Analyzing interaction strength & recency weights...',
      '3/9 ✓ Extracting semantic concepts across programming & systems...',
      '4/9 ✓ Building latent interest profile & disentangling content format...',
      '5/9 ✓ Transcending surface Java keywords → SOFTWARE ENGINEERING...',
      '6/9 ✓ Generating candidate Reels database (16 items)...',
      '7/9 ✓ Applying quality + Hype Penalty filter (-24 pts on clickbait)...',
      '8/9 ✓ Ranking candidate recommendations by weighted score...',
      '9/9 ✓ Selected top recommendation: "How REST APIs Actually Work"!'
    ];

    steps.forEach((msg, idx) => {
      setTimeout(() => {
        setDemoStepMessage(msg);
        if (idx === steps.length - 1) {
          setIsRunningDemo(false);
          setTimeout(() => setDemoStepMessage(null), 3000);
        }
      }, (idx + 1) * 450);
    });
  };

  const handleReset = () => {
    setReels(INITIAL_SAMPLE_REELS);
    setHistoryCandidateIds([]);
    setFeedbackState({
      likedReelIds: [],
      dislikedReelIds: [],
      savedReelIds: [],
      notInterestedTopics: [],
      boostedTopics: [],
      styleAdjustments: {}
    });
    setSelectedPreset('trap-1');
  };

  const handleRefreshRecommendation = () => {
    if (primaryRecommendation) {
      setHistoryCandidateIds(prev => [...prev, primaryRecommendation.candidate.id]);
    }
  };

  const handleToggleInteraction = (reelId: string, type: 'liked' | 'saved' | 'rewatched' | 'skipped') => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const updated = { ...r };
        if (type === 'liked') updated.liked = !updated.liked;
        if (type === 'saved') updated.saved = !updated.saved;
        if (type === 'rewatched') updated.rewatched = !updated.rewatched;
        if (type === 'skipped') updated.skipped = !updated.skipped;
        return updated;
      }
      return r;
    }));
  };

  const handleChangeWatchPct = (reelId: string, pct: number) => {
    setReels(prev => prev.map(r => r.id === reelId ? { ...r, watchPercentage: pct } : r));
  };

  const handleFeedback = (type: 'useful' | 'not_useful' | 'save' | 'not_interested') => {
    const candId = primaryRecommendation.candidate.id;
    const candTopic = primaryRecommendation.candidate.topic;

    setFeedbackState(prev => {
      const next = { ...prev };
      if (type === 'save') {
        if (!next.savedReelIds.includes(candId)) next.savedReelIds.push(candId);
      } else if (type === 'not_useful') {
        if (!next.dislikedReelIds.includes(candId)) next.dislikedReelIds.push(candId);
      } else if (type === 'not_interested') {
        if (!next.notInterestedTopics.includes(candTopic)) next.notInterestedTopics.push(candTopic);
      } else if (type === 'useful') {
        if (!next.boostedTopics.includes(candTopic)) next.boostedTopics.push(candTopic);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      <Header
        onRunDemo={handleRunDemo}
        onReset={handleReset}
        isRunningDemo={isRunningDemo}
        selectedPreset={selectedPreset}
        onSelectPreset={handleSelectPreset}
      />

      {demoStepMessage && (
        <div className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 px-4 py-2 text-center text-xs font-bold text-white flex items-center justify-center gap-2 animate-pulse shadow-md">
          <Sparkles className="w-4 h-4" />
          <span>{demoStepMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">

        {/* Tab Navigation Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">

          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {(
              [
                { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
                { id: 'graph', label: 'Interest Graph', Icon: Layers },
                { id: 'history', label: `Reel History (${reels.length})`, Icon: History },
                { id: 'profile', label: 'Latent Profile', Icon: Target },
                { id: 'evaluations', label: 'Candidate Matrix', Icon: Database },
                { id: 'reasoning', label: 'AI Reasoning', Icon: HelpCircle },
              ] as const
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inferred:</span>
            <strong className="text-white font-bold">{inferredProfile.primaryInterest.name}</strong>
            <span className="text-cyan-400 font-mono">({inferredProfile.confidenceScore}%)</span>
          </div>

        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <MainRecommendationCard
              recommendation={primaryRecommendation}
              reels={reels}
              onRefresh={handleRefreshRecommendation}
              onAnalyze={handleRunDemo}
              onExplain={() => setActiveTab('reasoning')}
              onWatchReel={() => setActiveReelPlayerItem(primaryRecommendation.candidate)}
              feedbackState={feedbackState}
              onFeedback={handleFeedback}
              isAnalyzing={isRunningDemo}
            />

            <NaiveVsAiComparison />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InterestGraph
                profile={inferredProfile}
                recommendation={primaryRecommendation}
                reels={reels}
              />
              <InterestProfileView profile={inferredProfile} />
            </div>

            <ReelHistory
              reels={reels}
              onToggleInteraction={handleToggleInteraction}
              onChangeWatchPct={handleChangeWatchPct}
              onSelectReelToWatch={(reel) => setActiveReelPlayerItem(reel)}
            />
          </div>
        )}

        {activeTab === 'graph' && (
          <div className="space-y-6">
            <InterestGraph
              profile={inferredProfile}
              recommendation={primaryRecommendation}
              reels={reels}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <ReelHistory
              reels={reels}
              onToggleInteraction={handleToggleInteraction}
              onChangeWatchPct={handleChangeWatchPct}
              onSelectReelToWatch={(reel) => setActiveReelPlayerItem(reel)}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <InterestProfileView profile={inferredProfile} />
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="space-y-6">
            <CandidateEvaluationView evaluations={candidateEvaluations} />
          </div>
        )}

        {activeTab === 'reasoning' && (
          <div className="space-y-6">
            <AIReasoningView recommendation={primaryRecommendation} />
          </div>
        )}

      </main>

      {/* Reel Player Modal */}
      {activeReelPlayerItem && (
        <ReelPlayerModal
          item={activeReelPlayerItem}
          onClose={() => setActiveReelPlayerItem(null)}
          onToggleInteraction={handleToggleInteraction}
          onChangeWatchPct={handleChangeWatchPct}
        />
      )}

      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">
          TechReel AI — Intelligent Technology Reel Recommendation Agent (v3.0 Upgraded)
        </p>
        <p className="text-slate-400">
          Built with deterministic semantic interest inference & explainable AI logic. Fictional / Anonymized Demo Data.
        </p>
      </footer>

    </div>
  );
}

export default App;

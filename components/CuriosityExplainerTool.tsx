'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Lightbulb,
  Eye,
  Microscope,
  Zap,
} from 'lucide-react';

interface ExplainerResult {
  title: string;
  subtitle: string;
  category: string;
  categoryIcon: string;
  whatDidTheySee: string;
  whyImportant: string;
  howDidTheyDoIt: string;
  theFascinatingPart: string;
  whyShouldICare: string;
  mindBendingFact: string;
  curiosityQuestion: string;
  credibleSources: string[];
}

interface CuriosityExplainerToolProps {
  initialTopic?: string;
  onClose?: () => void;
}

export default function CuriosityExplainerTool({
  initialTopic = '',
  onClose,
}: CuriosityExplainerToolProps) {
  const [topicInput, setTopicInput] = useState(initialTopic);
  const [audienceLevel, setAudienceLevel] = useState<'curious' | 'simple' | 'deep'>('curious');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExplainerResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const samplePrompts = [
    'How do tardigrades survive in the vacuum of space?',
    'Why does it rain glass sideways on exoplanet HD 189733b?',
    'How do octopuses use 9 brains to solve puzzles?',
    'What did the Event Horizon Telescope discover inside black hole shadows?',
    'Why do sleeping brains replay memories in reverse?',
    'What are upper-atmospheric green oxygen ghosts and sprites?',
  ];

  const handleGenerate = async (topicToUse?: string) => {
    const query = (topicToUse || topicInput).trim();
    if (!query || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    if (topicToUse) setTopicInput(topicToUse);

    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: query,
          audienceLevel,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate explanation');
      }

      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while contacting the Curiosity AI engine.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="curiosity-explainer-panel"
      className="rounded-3xl bg-black/40 backdrop-blur-md text-[#e0e0e0] p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8 relative overflow-hidden"
    >
      {/* Ambient background blur */}
      <div
        className="absolute top-0 right-1/4 w-80 h-80 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #f27d26 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">
              Curiosity Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            Translate Any Research into <span className="italic font-serif">Wonder.</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/50 font-light mt-1 max-w-2xl">
            Input any research paper title, DOI, or curious question. We transform academic jargon into engaging, verified insight.
          </p>
        </div>

        {/* Audience style toggle */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10 text-[10px] uppercase tracking-widest font-bold">
          <button
            onClick={() => setAudienceLevel('curious')}
            className={`px-4 py-1.5 rounded-full transition ${
              audienceLevel === 'curious'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Curious
          </button>
          <button
            onClick={() => setAudienceLevel('simple')}
            className={`px-4 py-1.5 rounded-full transition ${
              audienceLevel === 'simple'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Plain English
          </button>
          <button
            onClick={() => setAudienceLevel('deep')}
            className={`px-4 py-1.5 rounded-full transition ${
              audienceLevel === 'deep'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Deep Dive
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerate();
        }}
        className="relative z-10 space-y-4"
      >
        <div className="relative flex items-center">
          <input
            id="input-curiosity-topic"
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="e.g. Why do octopuses edit their RNA? Or paste a paper DOI..."
            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/80 pr-32 shadow-inner backdrop-blur-sm"
          />
          <button
            id="btn-submit-explain"
            type="submit"
            disabled={isLoading || !topicInput.trim()}
            className="absolute right-2 px-6 py-2.5 bg-white hover:bg-orange-500 hover:text-white text-black font-bold uppercase tracking-widest rounded-full text-[10px] sm:text-[11px] flex items-center gap-1.5 transition shadow-md disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isLoading ? 'Decoding...' : 'Explain'}</span>
          </button>
        </div>

        {/* Preset Sample Prompts */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] uppercase tracking-widest font-mono text-white/30 flex items-center gap-1">
            <Zap className="w-3 h-3 text-orange-400" /> Suggestions:
          </span>
          {samplePrompts.slice(0, 4).map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleGenerate(sample)}
              className="text-[11px] text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-1 rounded-full border border-white/10 transition"
            >
              {sample}
            </button>
          ))}
        </div>
      </form>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">
              Synthesizing Research Breakdown...
            </h4>
            <p className="text-xs text-white/40 max-w-sm mx-auto font-light">
              Extracting key observations, translating academic jargon, and formulating &ldquo;Why should I care?&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && !isLoading && (
        <div id="explainer-result-card" className="space-y-6 pt-2 animate-fadeIn">
          {/* Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest font-mono">
              <span>{result.categoryIcon}</span>
              <span>{result.category}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              {result.title}
            </h3>
            <p className="text-sm text-white/60 font-light italic font-serif">
              {result.subtitle}
            </p>
          </div>

          {/* SIGNATURE SECTION: Why Should I Care? */}
          <div className="rounded-3xl bg-gradient-to-br from-orange-600 to-red-900 text-white p-6 sm:p-8 shadow-2xl border border-orange-500/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-white/90 font-mono">
                Why should I care?
              </h4>
            </div>
            <p className="text-base sm:text-lg font-normal leading-relaxed text-white/95 italic font-serif pl-1">
              &ldquo;{result.whyShouldICare}&rdquo;
            </p>
          </div>

          {/* Grid of Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What did they see */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest font-mono">
                <Eye className="w-3.5 h-3.5 text-orange-400" /> What did scientists actually see?
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                {result.whatDidTheySee}
              </p>
            </div>

            {/* Why is this important */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest font-mono">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Why is this important?
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                {result.whyImportant}
              </p>
            </div>

            {/* How did they do it */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest font-mono">
                <Microscope className="w-3.5 h-3.5 text-orange-400" /> How did they do it?
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                {result.howDidTheyDoIt}
              </p>
            </div>

            {/* The Fascinating Part */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> The fascinating part
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                {result.theFascinatingPart}
              </p>
            </div>
          </div>

          {/* Mind Bending Fact & Question */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-mono text-white/40 uppercase tracking-widest block text-[9px]">
                Thought to Ponder
              </span>
              <p className="text-white/80 font-serif italic">
                &ldquo;{result.curiosityQuestion}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-white/40 text-[10px] uppercase tracking-widest">
                Sources:
              </span>
              <div className="flex gap-1.5">
                {result.credibleSources.map((source, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-white/5 text-white/70 font-mono text-[9px] border border-white/10"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

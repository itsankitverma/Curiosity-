'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TODAY_IN_SCIENCE_FEED, getArticleByIdOrSlug } from '@/data/curiosityData';
import { Flame, ChevronDown, ChevronUp, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

interface TodayInScienceFeedProps {
  onOpenArticle?: (articleId: string) => void;
  onOpenExplainerWithTopic: (topic: string) => void;
}

export default function TodayInScienceFeed({
  onOpenArticle,
  onOpenExplainerWithTopic
}: TodayInScienceFeedProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section
      id="today-in-science-section"
      className="rounded-3xl bg-black/40 backdrop-blur-md text-[#e0e0e0] p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #f27d26 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Section Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 font-mono">
              Live Daily Intelligence
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            Today in <span className="italic font-serif">Science.</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/50 font-light mt-1 max-w-xl">
            The 10 most intriguing observations, experiments, and research findings published in the last 24 hours.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-white/40 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-Time Ingestion</span>
        </div>
      </div>

      {/* Feed List */}
      <div className="relative z-10 divide-y divide-white/5 mt-4">
        {TODAY_IN_SCIENCE_FEED.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          const linkedArticle = item.linkedArticleId ? getArticleByIdOrSlug(item.linkedArticleId) : null;
          const articleUrl = linkedArticle ? `/article/${linkedArticle.slug}` : (item.linkedArticleId ? `/article/${item.linkedArticleId}` : null);

          return (
            <div
              key={item.number}
              id={`feed-item-${item.number}`}
              className={`py-4 sm:py-5 transition-all ${
                isExpanded ? 'bg-white/[0.03] backdrop-blur-sm rounded-2xl px-4 sm:px-6 my-2 border border-white/10' : 'hover:bg-white/[0.02]'
              }`}
            >
              {/* Clickable Row Header */}
              <div
                onClick={() => toggleExpand(idx)}
                className="flex items-start justify-between gap-4 cursor-pointer group select-none"
              >
                <div className="flex items-start gap-4">
                  {/* Category & Index */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] uppercase tracking-widest text-orange-500 font-bold font-mono">
                        {item.number} — {item.category}
                      </span>
                      <span className="text-white/20 text-[9px]">•</span>
                      <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono">
                        {item.timeAgo}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-orange-400 transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <button
                  id={`btn-feed-expand-${item.number}`}
                  aria-label={isExpanded ? 'Collapse discovery' : 'Expand discovery'}
                  className="p-1.5 rounded-full bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/10 transition shrink-0 mt-1 border border-white/10"
                >
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs sm:text-sm animate-fadeIn">
                  <p className="text-white/70 leading-relaxed font-light">
                    {item.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Why It Matters */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-orange-400 font-mono">
                        <Lightbulb className="w-3.5 h-3.5" /> Why It Matters
                      </div>
                      <p className="text-xs text-white/75 leading-relaxed italic font-serif">
                        &ldquo;{item.whyItMatters}&rdquo;
                      </p>
                    </div>

                    {/* The Fascinating Part */}
                    <div className="bg-gradient-to-br from-orange-600 to-red-900 p-5 rounded-2xl relative overflow-hidden shadow-lg space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/90 font-mono">
                        <Sparkles className="w-3.5 h-3.5" /> The Fascinating Part
                      </div>
                      <p className="text-xs text-white font-medium leading-relaxed">
                        {item.wowFactor}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Source */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                      Verified Source: <strong className="text-white/80">{item.source}</strong>
                    </span>

                    <div className="flex items-center gap-2.5">
                      {articleUrl && (
                        <Link
                          href={articleUrl}
                          className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <span>Full Article Page</span> <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                      <button
                        onClick={() => onOpenExplainerWithTopic(item.title)}
                        className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 transition"
                      >
                        Ask Curiosity AI
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

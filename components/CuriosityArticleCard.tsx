'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CuriosityArticle } from '@/data/curiosityData';
import { ArrowRight, Bookmark, BookmarkCheck, Clock } from 'lucide-react';

interface CuriosityArticleCardProps {
  article: CuriosityArticle;
  onOpenArticle?: (id: string) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export default function CuriosityArticleCard({
  article,
  onOpenArticle,
  isSaved,
  onToggleSave,
}: CuriosityArticleCardProps) {
  return (
    <article
      id={`card-${article.id}`}
      className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white/[0.03] backdrop-blur-xl text-[#e0e0e0] overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl border border-white/10 hover:border-orange-500/50 w-full max-w-full"
    >
      {/* Thumbnail with luminous overlay */}
      <Link
        href={`/article/${article.slug}`}
        className="block relative w-full h-44 sm:h-52 overflow-hidden bg-black cursor-pointer"
      >
        <Image
          src={article.heroImage}
          alt={article.title}
          fill
          className="object-cover opacity-85 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/50" />

        {/* Top Badges */}
        <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 flex items-center justify-between z-10 gap-2">
          <span className="backdrop-blur-md text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15 bg-black/70 text-orange-400 font-mono flex items-center gap-1 shadow-md truncate">
            {article.categoryIcon} {article.category}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave(article.id);
            }}
            title={isSaved ? 'Saved' : 'Save Story'}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md transition shrink-0 ${
              isSaved
                ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(242,125,38,0.6)]'
                : 'bg-black/60 hover:bg-black text-white/70 hover:text-white border border-white/10'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom stats pill with responsive wrapping */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 flex flex-wrap items-center justify-between gap-1.5 text-[9px] sm:text-[10px] font-mono text-white/80 z-10 pointer-events-none">
          <span className="bg-black/85 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/15 uppercase tracking-widest text-orange-300 font-semibold truncate max-w-[70%]">
            {article.stats[0]?.label}: {article.stats[0]?.value}
          </span>
          <span className="flex items-center gap-1 bg-black/85 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/15 uppercase tracking-widest text-white/70 shrink-0">
            <Clock className="w-3 h-3 text-orange-400" />
            {article.readTime}
          </span>
        </div>
      </Link>

      {/* Card Content Body - Fully Responsive */}
      <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between space-y-3.5 sm:space-y-4">
        <div className="space-y-2 sm:space-y-2.5">
          {/* Metadata Row: Date & Publication / Journal */}
          <div className="text-[10px] uppercase tracking-wider font-mono text-white/40 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <span className="shrink-0 font-medium">{article.date}</span>
            <span
              className="text-orange-400/90 font-medium truncate max-w-full text-right"
              title={article.originalResearch.journal}
            >
              {article.originalResearch.journal.split('&')[0].trim()}
            </span>
          </div>

          {/* Title */}
          <Link href={`/article/${article.slug}`} className="block">
            <h3 className="text-base sm:text-lg md:text-xl font-light text-white tracking-tight group-hover:text-orange-400 transition-colors leading-snug cursor-pointer break-words">
              {article.title}
            </h3>
          </Link>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed line-clamp-2 sm:line-clamp-3 break-words">
            {article.subtitle}
          </p>
        </div>

        {/* Card Footer: Responsive Multi-line Institution & Action Button */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <span
            className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/45 leading-tight break-words line-clamp-2"
            title={article.originalResearch.institution}
          >
            {article.originalResearch.institution}
          </span>

          <Link
            href={`/article/${article.slug}`}
            className="shrink-0 self-start sm:self-auto text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-orange-400 hover:text-white px-3 py-1.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 flex items-center gap-1.5 transition-all group-hover:translate-x-0.5"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
          </Link>
        </div>
      </div>
    </article>
  );
}

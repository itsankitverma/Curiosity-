'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CuriosityArticle } from '@/data/curiosityData';
import { Sparkles, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';

interface CuriosityHeroProps {
  article: CuriosityArticle;
  onOpenArticle?: (id: string) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export default function CuriosityHero({
  article,
  onOpenArticle,
  isSaved,
  onToggleSave,
}: CuriosityHeroProps) {
  return (
    <section
      id="hero-curiosity-spotlight"
      className="relative rounded-3xl overflow-hidden bg-[#050505] text-[#e0e0e0] border border-orange-500/30 shadow-[0_0_50px_rgba(242,125,38,0.15)]"
    >
      {/* Cosmic Orange Glow Background */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 60% 40%, #f27d26 0%, transparent 65%)',
          filter: 'blur(90px)',
          transform: 'scale(1.4)',
        }}
      />

      {/* Hero Image Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={article.heroImage}
          alt={article.title}
          fill
          className="object-cover opacity-35 scale-105 transition-transform duration-1000 hover:scale-100 mix-blend-luminosity"
          referrerPolicy="no-referrer"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/75 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 p-5 sm:p-7 md:p-8 flex flex-col justify-center max-w-4xl space-y-3.5 sm:space-y-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full border border-orange-500/40 flex items-center gap-1.5 font-mono shadow-[0_0_15px_rgba(242,125,38,0.3)]">
            <Sparkles className="w-3 h-3 fill-current text-orange-400" /> Lead Discovery
          </span>
          <span className="text-white/60 text-[10px] uppercase tracking-widest font-mono bg-black/50 px-2.5 py-0.5 rounded-full border border-white/10">
            {article.categoryIcon} {article.category} · {article.readTime}
          </span>
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-1.5">
          <Link href={`/article/${article.slug}`} className="group block">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white leading-[1.2] group-hover:text-orange-400 transition-colors">
              {article.title}
            </h1>
          </Link>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl font-light leading-relaxed">
            {article.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-0.5">
          <Link
            id="btn-hero-read"
            href={`/article/${article.slug}`}
            className="bg-white text-black text-[10px] sm:text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 sm:px-6 sm:py-3 rounded-full hover:bg-orange-500 hover:text-white transition-all flex items-center gap-1.5 shadow-lg hover:shadow-[0_0_25px_rgba(242,125,38,0.5)]"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            id="btn-hero-save"
            onClick={() => onToggleSave(article.id)}
            className={`px-4 py-2.5 sm:px-5 sm:py-3 rounded-full border text-[10px] sm:text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition backdrop-blur-sm ${
              isSaved
                ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 shadow-[0_0_15px_rgba(242,125,38,0.2)]'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-orange-400" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved' : 'Save for Later'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

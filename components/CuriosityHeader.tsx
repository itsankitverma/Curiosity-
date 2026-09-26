'use client';

import React from 'react';
import {
  Compass,
  Search,
  Bookmark,
} from 'lucide-react';

interface CuriosityHeaderProps {
  onOpenTodayFeed?: () => void;
  onOpenExplainer?: () => void;
  onOpenSaved: () => void;
  onOpenNewsletter?: () => void;
  onSelectCategory?: (cat: string) => void;
  savedCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentDateStr: string;
}

export default function CuriosityHeader({
  onOpenSaved,
  onSelectCategory,
  savedCount,
  searchQuery,
  onSearchChange,
  currentDateStr,
}: CuriosityHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-xl border-b border-white/10 text-[#e0e0e0] transition-all">
      {/* Main Clean Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <div
            onClick={() => {
              if (onSelectCategory) onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-[0_0_20px_rgba(242,125,38,0.5)] group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-[0.25em] text-white font-sans leading-none">
                CURIOSITY<span className="text-orange-500">.</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-mono hidden sm:block mt-0.5">
                Curiosities & Wonders
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar - Desktop & Tablet */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
          <input
            id="input-header-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search fascinating curiosities, cosmos, mysteries..."
            className="w-full bg-white/5 hover:bg-white/[0.08] focus:bg-white/10 border border-white/10 focus:border-orange-500/80 text-xs text-white rounded-full pl-9 pr-4 py-2 placeholder-white/35 focus:outline-none transition backdrop-blur-sm shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-mono text-white/40 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Controls - Clean & High Contrast */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Saved Bookmarks */}
          <button
            id="btn-nav-saved"
            onClick={onOpenSaved}
            className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 relative transition flex items-center gap-2 text-xs font-mono"
            title="View Saved Discoveries"
            aria-label="View Saved Discoveries"
          >
            <Bookmark className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline text-white/80">Saved</span>
            {savedCount > 0 && (
              <span className="bg-orange-500 text-white font-bold font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-scaleIn">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search astrophysics, black holes, solar plasma..."
            className="w-full bg-white/5 border border-white/10 text-xs text-white rounded-full pl-9 pr-4 py-2 placeholder-white/35 focus:outline-none focus:border-orange-500/80"
          />
        </div>
      </div>
    </header>
  );
}

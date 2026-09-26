'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import CuriosityHeader from '@/components/CuriosityHeader';
import CuriosityHero from '@/components/CuriosityHero';
import CategoryFilterBar from '@/components/CategoryFilterBar';
import CuriosityArticleCard from '@/components/CuriosityArticleCard';
import SavedArticlesDrawer from '@/components/SavedArticlesDrawer';
import CuriosityFooter from '@/components/CuriosityFooter';
import { CURIOSITY_ARTICLES } from '@/data/curiosityData';
import { Sparkles, Compass } from 'lucide-react';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search');

  const [selectedCategoryState, setSelectedCategoryState] = useState<string>('all');
  const [searchQueryState, setSearchQueryState] = useState<string>('');

  const selectedCategory = urlCategory || selectedCategoryState;
  const searchQuery = urlSearch !== null ? urlSearch : searchQueryState;

  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('curiosity_saved_articles');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to load saved articles', e);
      }
    }
    return ['art-black-hole'];
  });

  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategoryState(cat);
    if (urlCategory) {
      router.replace(`/?category=${cat}`);
    }
  };

  const handleSearchChange = (q: string) => {
    setSearchQueryState(q);
    if (urlSearch) {
      router.replace(q ? `/?search=${encodeURIComponent(q)}` : '/');
    }
  };

  const handleToggleSave = (id: string) => {
    setSavedArticleIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('curiosity_saved_articles', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleClearAllSaved = () => {
    setSavedArticleIds([]);
    try {
      localStorage.removeItem('curiosity_saved_articles');
    } catch (e) {}
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CURIOSITY_ARTICLES.forEach((art) => {
      counts[art.category] = (counts[art.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return CURIOSITY_ARTICLES.filter((art) => {
      const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.subtitle.toLowerCase().includes(q) ||
        art.whyShouldICare.toLowerCase().includes(q) ||
        art.whatScientistsSaw.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const savedArticlesList = useMemo(() => {
    return CURIOSITY_ARTICLES.filter((a) => savedArticleIds.includes(a.id));
  }, [savedArticleIds]);

  const heroArticle = CURIOSITY_ARTICLES[0]; // Lead featured hero

  const formattedDate = '19 August 2026';

  return (
    <div
      className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-sans selection:bg-orange-500 selection:text-white relative overflow-x-hidden"
      style={{
        background: 'radial-gradient(circle at 100% 0%, #1a1510 0%, #050505 70%)',
      }}
    >
      {/* Header */}
      <CuriosityHeader
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onSelectCategory={handleSelectCategory}
        savedCount={savedArticleIds.length}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        currentDateStr={formattedDate}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6 relative z-10">
        {/* Hero Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <CuriosityHero
            article={heroArticle}
            isSaved={savedArticleIds.includes(heroArticle.id)}
            onToggleSave={handleToggleSave}
          />
        )}

        {/* Category Navigation Bar */}
        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          categoryCounts={categoryCounts}
        />

        {/* Discoveries Section Heading */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-orange-400 mb-0.5 font-mono">
                Curated Catalog
              </div>
              <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white">
                {selectedCategory === 'all' ? (
                  <>
                    Fascinating Curiosities & <span className="italic font-serif">Discoveries.</span>
                  </>
                ) : (
                  <>
                    {selectedCategory} <span className="italic font-serif">Curiosities.</span>
                  </>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-white/50 font-light mt-0.5">
                Deep explorations of awe-inspiring phenomena, cosmic mysteries, and remarkable stories.
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="text-xs font-mono uppercase tracking-widest text-orange-400 hover:text-orange-300 transition"
              >
                Clear Search (&ldquo;{searchQuery}&rdquo;)
              </button>
            )}
          </div>

          {/* Article Cards Grid */}
          {filteredArticles.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-white/[0.02] backdrop-blur-md rounded-3xl border border-white/10">
              <Compass className="w-10 h-10 text-white/30 mx-auto" />
              <h3 className="text-base font-light text-white tracking-wide">No discoveries matching your search</h3>
              <p className="text-xs text-white/40 max-w-md mx-auto">
                Try searching for black holes, solar plasma, cosmos, or reset your search.
              </p>
              <button
                onClick={() => {
                  handleSelectCategory('all');
                  handleSearchChange('');
                }}
                className="px-6 py-2.5 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-full hover:bg-orange-500 hover:text-white transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl">
              {filteredArticles.map((article) => (
                <CuriosityArticleCard
                  key={article.id}
                  article={article}
                  isSaved={savedArticleIds.includes(article.id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bookmarks Drawer */}
      <SavedArticlesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedArticles={savedArticlesList}
        onRemoveSaved={handleToggleSave}
        onClearAll={handleClearAllSaved}
      />

      {/* Footer */}
      <CuriosityFooter
        onSelectCategory={handleSelectCategory}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <HomeContent />
    </Suspense>
  );
}

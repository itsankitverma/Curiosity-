'use client';

import React from 'react';
import { CURIOSITY_CATEGORIES } from '@/data/curiosityData';

interface CategoryFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categoryCounts: Record<string, number>;
}

export default function CategoryFilterBar({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryFilterBarProps) {
  return (
    <div id="category-navigation-bar" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">
          Filter Topics
        </h2>
        <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono">
          8 Core Fields
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {CURIOSITY_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count =
            cat.id === 'all'
              ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
              : categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-widest font-medium whitespace-nowrap flex items-center gap-2 transition-all border ${
                isSelected
                  ? 'bg-white text-black font-bold border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : 'bg-white/5 border-white/10 hover:border-white/20 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-white/50'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

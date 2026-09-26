'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CuriosityArticle } from '@/data/curiosityData';
import { X, Bookmark, ArrowRight, Trash2, BookOpen } from 'lucide-react';

interface SavedArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: CuriosityArticle[];
  onOpenArticle?: (id: string) => void;
  onRemoveSaved: (id: string) => void;
  onClearAll: () => void;
}

export default function SavedArticlesDrawer({
  isOpen,
  onClose,
  savedArticles,
  onOpenArticle,
  onRemoveSaved,
  onClearAll,
}: SavedArticlesDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#080808] text-[#e0e0e0] h-full border-l border-white/10 shadow-2xl flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bookmark className="w-4 h-4 text-orange-400 fill-current" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white font-mono">Saved Discoveries</h3>
            <span className="text-[10px] font-mono bg-white/10 text-orange-400 px-2 py-0.5 rounded-full font-bold">
              {savedArticles.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Saved List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedArticles.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 text-white/30">
              <BookOpen className="w-10 h-10 stroke-1 text-white/20" />
              <p className="text-xs uppercase tracking-widest font-mono">No saved discoveries yet</p>
              <p className="text-xs text-white/40 max-w-xs font-light">
                Click the bookmark icon on any research story to build your curiosity reading list.
              </p>
            </div>
          ) : (
            savedArticles.map((article) => (
              <div
                key={article.id}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 transition hover:border-white/20"
              >
                <div className="flex items-start gap-3.5">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                    <Image
                      src={article.heroImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                      {article.category}
                    </span>
                    <Link
                      href={`/article/${article.slug}`}
                      onClick={onClose}
                      className="block text-xs font-medium text-white hover:text-orange-400 cursor-pointer line-clamp-2 leading-snug"
                    >
                      {article.title}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <Link
                    href={`/article/${article.slug}`}
                    onClick={onClose}
                    className="text-white hover:text-orange-400 font-bold uppercase tracking-widest flex items-center gap-1 text-[10px]"
                  >
                    <span>Read Article Page</span>
                    <ArrowRight className="w-3 h-3 text-orange-400" />
                  </Link>

                  <button
                    onClick={() => onRemoveSaved(article.id)}
                    className="text-white/30 hover:text-red-400 p-1 transition"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedArticles.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs">
            <button
              onClick={onClearAll}
              className="text-white/40 hover:text-red-400 transition text-[10px] uppercase tracking-widest font-mono"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-orange-500 hover:text-white transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

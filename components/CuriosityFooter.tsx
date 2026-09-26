'use client';

import React, { useState } from 'react';
import { Compass, ArrowUp, Send, Check, Bookmark, Sparkles, Heart } from 'lucide-react';
import { CURIOSITY_CATEGORIES } from '@/data/curiosityData';

interface CuriosityFooterProps {
  onSelectCategory?: (cat: string) => void;
  onOpenSaved?: () => void;
}

export default function CuriosityFooter({
  onSelectCategory,
  onOpenSaved,
}: CuriosityFooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030303] text-white/50 border-t border-white/10 text-xs mt-14 sm:mt-20 relative overflow-hidden">
      {/* Ambient subtle glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, #f27d26 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Brand & Purpose */}
          <div className="md:col-span-6 space-y-4">
            <div
              onClick={scrollToTop}
              className="inline-flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-[0_0_20px_rgba(242,125,38,0.4)] group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-[0.25em] text-white font-sans">
                CURIOSITY<span className="text-orange-500">.</span>
              </span>
            </div>

            <p className="text-white/60 text-sm leading-relaxed max-w-md font-light">
              A personal collection of the cosmos, deep mysteries, untamed phenomena, and the fascinating things that inspire genuine wonder.
            </p>

            <div className="flex items-center gap-3 pt-1">
              {onOpenSaved && (
                <button
                  onClick={onOpenSaved}
                  className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-[11px] font-mono flex items-center gap-1.5 transition"
                >
                  <Bookmark className="w-3.5 h-3.5 text-orange-400" />
                  <span>Saved Stories</span>
                </button>
              )}

              <button
                onClick={scrollToTop}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-[11px] font-mono flex items-center gap-1.5 transition"
              >
                <ArrowUp className="w-3.5 h-3.5 text-orange-400" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>

          {/* Quick Newsletter Subscribe */}
          <div className="md:col-span-6 space-y-3.5 bg-white/[0.02] border border-white/10 p-5 sm:p-6 rounded-2xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-orange-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Stay Curious
              </span>
              <h4 className="text-base font-light text-white">
                Get new fascinating stories as they drop.
              </h4>
              <p className="text-xs text-white/50 font-light">
                No spam, no algorithms — just deep dives into awe-inspiring curiosities.
              </p>
            </div>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-400" />
                <span>You&apos;re in! We&apos;ll dispatch fascinating curiosities to your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="flex-1 bg-white/5 hover:bg-white/[0.08] focus:bg-white/10 border border-white/15 focus:border-orange-500/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/35 focus:outline-none transition font-sans"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-bold uppercase tracking-wider text-[11px] font-mono transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg hover:shadow-[0_0_20px_rgba(242,125,38,0.4)]"
                >
                  <span>Subscribe</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Micro Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-white/40">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} CURIOSITY</span>
            <span>•</span>
            <span>All wonders explored</span>
          </div>

          <div className="flex items-center gap-1 text-white/40">
            <span>Built with passion for the unknown</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

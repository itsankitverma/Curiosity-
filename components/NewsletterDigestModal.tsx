'use client';

import React, { useState } from 'react';
import { Mail, Check, Sparkles, X, ShieldCheck } from 'lucide-react';

interface NewsletterDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterDigestModal({
  isOpen,
  onClose,
}: NewsletterDigestModalProps) {
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] text-[#e0e0e0] rounded-3xl border border-white/10 shadow-2xl p-7 sm:p-10 space-y-7 overflow-hidden">
        {/* Decorative cosmic glow blur */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 opacity-25 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #f27d26 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubscribed ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto border border-orange-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-light text-white tracking-tight">You’re on the Curiosity Wire</h3>
            <p className="text-sm text-white/60 max-w-md mx-auto font-light">
              Welcome to the weekly dispatch. Your curiosity digest for <strong>{email}</strong> is all set. We never spam—only pure, verified scientific wonder.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-full hover:bg-orange-500 hover:text-white transition"
            >
              Return to Discoveries
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-mono font-bold uppercase tracking-widest border border-orange-500/30">
                <Sparkles className="w-3 h-3" /> Weekly Curiosity Dispatch
              </div>
              <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                Curiosity, Delivered Straight to Your <span className="italic font-serif">Inbox.</span>
              </h3>
              <p className="text-xs sm:text-sm text-white/50 font-light">
                The 5 most mind-bending research breakthroughs of the week, broken down with zero academic jargon.
              </p>
            </div>

            {/* Plan Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Free Tier */}
              <div
                onClick={() => setSelectedPlan('free')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlan === 'free'
                    ? 'border-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">Curiosity Free</span>
                  <span className="text-xs font-mono text-white/40 font-bold">$0</span>
                </div>
                <ul className="space-y-2 text-xs text-white/60 font-light">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-orange-400" /> Daily discoveries feed
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-orange-400" /> Visual simulation models
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-orange-400" /> Weekly discovery newsletter
                  </li>
                </ul>
              </div>

              {/* Premium Tier */}
              <div
                onClick={() => setSelectedPlan('premium')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all relative ${
                  selectedPlan === 'premium'
                    ? 'border-orange-400 bg-orange-500/15 shadow-[0_0_25px_rgba(242,125,38,0.25)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <span className="absolute -top-2.5 right-4 text-[9px] font-bold font-mono bg-orange-500 text-white px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                  Curator
                </span>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">Curiosity+</span>
                  <span className="text-xs font-mono text-orange-400 font-bold">$4 / mo</span>
                </div>
                <ul className="space-y-2 text-xs text-white/75 font-light">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-orange-400" /> Everything in Free
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-orange-400" /> Daily morning audio digest
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-orange-400" /> Unlimited AI paper translation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-orange-400" /> Custom breaking research alerts
                  </li>
                </ul>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white hover:bg-orange-500 hover:text-white text-black font-bold uppercase tracking-widest rounded-full text-[10px] sm:text-[11px] transition flex items-center gap-1.5 whitespace-nowrap shadow-md"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedPlan === 'free' ? 'Join Free' : 'Start 14-Day Trial'}</span>
                </button>
              </div>
              <p className="text-[10px] text-white/30 text-center font-mono uppercase tracking-widest">
                No spam ever. One-click unsubscribe anytime. Verified scientific sources only.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

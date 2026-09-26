'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CuriosityArticle, CURIOSITY_ARTICLES } from '@/data/curiosityData';
import InteractiveFeatureRenderer from './interactive/InteractiveFeatureRenderer';
import CuriosityHeader from './CuriosityHeader';
import CuriosityFooter from './CuriosityFooter';
import SavedArticlesDrawer from './SavedArticlesDrawer';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX,
  Share2,
  ExternalLink,
  Sparkles,
  Send,
  Loader2,
  Eye,
  BookOpen,
  ChevronRight,
  Clock,
  Calendar,
  Layers,
  FileText,
  Quote,
  Check
} from 'lucide-react';

interface ArticlePageViewProps {
  article: CuriosityArticle;
  relatedArticles: CuriosityArticle[];
}

export default function ArticlePageView({
  article,
  relatedArticles,
}: ArticlePageViewProps) {
  const router = useRouter();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [askQuestion, setAskQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiAnswers, setAiAnswers] = useState<{ q: string; a: string }[]>([]);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [activeFontSize, setActiveFontSize] = useState<'normal' | 'large'>('normal');

  // Bookmarks State
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
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleSave = (id: string) => {
    setSavedArticleIds((prev) => {
      let updated: string[];
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
      } else {
        updated = [...prev, id];
      }
      try {
        localStorage.setItem('curiosity_saved_articles', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  const isSaved = savedArticleIds.includes(article.id);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const narrativeText = `${article.title}. ${article.subtitle}. Why it matters: ${article.whyShouldICare}. Key observation: ${article.whatScientistsSaw}. Methodology: ${article.howTheyDidIt}. The fascinating discovery: ${article.theFascinatingPart}`;
      const utterance = new SpeechSynthesisUtterance(narrativeText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleAskScientist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuestion.trim() || isAsking) return;

    const userQ = askQuestion.trim();
    setAskQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/gemini/ask-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleTitle: article.title,
          articleContext: `${article.whatScientistsSaw} ${article.theFascinatingPart} ${article.whyShouldICare}`,
          question: userQ,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setAiAnswers((prev) => [...prev, { q: userQ, a: data.answer }]);
      } else {
        setAiAnswers((prev) => [
          ...prev,
          { q: userQ, a: data.error || 'Could not retrieve an answer at this time.' },
        ]);
      }
    } catch {
      setAiAnswers((prev) => [
        ...prev,
        { q: userQ, a: 'Connection error while contacting the curiosity research engine.' },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleCopyCitation = () => {
    const citation = `${article.originalResearch.authors} (${article.originalResearch.year}). "${article.originalResearch.title}." ${article.originalResearch.journal}. DOI: ${article.originalResearch.doi}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(citation);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    }
  };

  const formattedDate = '19 August 2026';

  const savedArticlesList = useMemo(() => {
    return CURIOSITY_ARTICLES.filter((a) => savedArticleIds.includes(a.id));
  }, [savedArticleIds]);

  return (
    <div
      className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-sans selection:bg-orange-500 selection:text-white relative overflow-x-hidden"
      style={{
        background: 'radial-gradient(circle at 100% 0%, #15100a 0%, #050505 60%)',
      }}
    >
      {/* Header */}
      <CuriosityHeader
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onSelectCategory={(cat) => router.push(`/?category=${cat}`)}
        savedCount={savedArticleIds.length}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q) router.push(`/?search=${encodeURIComponent(q)}`);
        }}
        currentDateStr={formattedDate}
      />

      {/* ARTICLE CONTAINER */}
      <article className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-7 sm:space-y-8 relative z-10">
        {/* Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-white/70 hover:text-white transition group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-orange-400" />
            <span>Curiosity Catalog</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-white/20" />
            <Link href={`/?category=${article.category}`} className="text-orange-400 hover:text-orange-300 transition font-bold">
              {article.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-white/20" />
            <span className="text-white/40 truncate max-w-[160px] sm:max-w-[240px]">
              {article.id}
            </span>
          </div>
        </div>

        {/* 1. ARTICLE MASTHEAD & HEADER */}
        <header className="space-y-4">
          {/* Topic Kickers & Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest font-mono border border-orange-500/40 shadow-[0_0_15px_rgba(242,125,38,0.2)]">
              {article.categoryIcon} {article.category} Report
            </span>
            <span className="text-white/40 font-mono text-xs">•</span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-mono text-white/60 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
              Peer-Reviewed in {article.originalResearch.journal.split('&')[0]}
            </span>
          </div>

          {/* Headline - Editorial Print Styling */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-[1.15] font-serif">
            {article.title}
          </h1>

          {/* Subtitle / Standfirst */}
          <p className="text-base sm:text-xl text-white/75 font-light font-serif italic leading-relaxed border-l-2 border-orange-500/80 pl-3.5 sm:pl-5 py-0.5">
            {article.subtitle}
          </p>

          {/* Byline & Publication Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-b border-white/10 py-3 text-xs font-mono text-white/60">
            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                  🔬
                </div>
                <div className="min-w-0">
                  <span className="text-white font-medium block truncate text-xs">Curiosity Science Desk</span>
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block truncate">
                    {article.originalResearch.institution}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-white/50 sm:border-l sm:border-white/10 sm:pl-4">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Calendar className="w-3 h-3 text-orange-400 shrink-0" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Clock className="w-3 h-3 text-orange-400 shrink-0" />
                  {article.readTime}
                </span>
              </div>
            </div>

            {/* Reader Action Controls */}
            <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
              {/* Audio Listen */}
              <button
                id="btn-article-audio"
                onClick={handleToggleSpeech}
                title={isPlayingAudio ? 'Pause Narration' : 'Listen to Article Audio'}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono flex items-center gap-1.5 transition border shrink-0 ${
                  isPlayingAudio
                    ? 'bg-orange-500 text-white border-orange-400 animate-pulse shadow-[0_0_15px_rgba(242,125,38,0.5)]'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/10'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-orange-400" />}
                <span>{isPlayingAudio ? 'Listening...' : 'Listen (Audio)'}</span>
              </button>

              {/* Font Size A/A+ */}
              <button
                id="btn-font-size"
                onClick={() => setActiveFontSize(activeFontSize === 'normal' ? 'large' : 'normal')}
                title="Adjust reading font size"
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold font-mono border border-white/10 transition shrink-0"
              >
                {activeFontSize === 'normal' ? 'A+' : 'A'}
              </button>

              {/* Bookmark */}
              <button
                id="btn-article-bookmark"
                onClick={() => handleToggleSave(article.id)}
                title={isSaved ? 'Saved to Bookmarks' : 'Save Story'}
                className={`p-1.5 rounded-full transition border shrink-0 ${
                  isSaved
                    ? 'bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(242,125,38,0.5)]'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>

              {/* Share */}
              <button
                id="btn-article-share"
                onClick={handleShare}
                title="Copy share link"
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition relative shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copiedShare && (
                  <span className="absolute -bottom-8 right-0 bg-white text-black text-[9px] font-bold font-mono uppercase tracking-widest px-2.5 py-1 rounded shadow-lg whitespace-nowrap z-30">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* 2. LEAD HERO FIGURE (FIGURE 1) */}
        <figure className="space-y-2">
          <div className="relative w-full h-[280px] sm:h-[400px] md:h-[460px] rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/15">
            <Image
              src={article.heroImage}
              alt={article.title}
              fill
              className="object-cover opacity-95"
              referrerPolicy="no-referrer"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-white text-xs">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                Figure 1 · {article.category} Instrument Capture
              </span>
              <span className="text-[9px] sm:text-[10px] text-white/70 font-mono bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10 truncate max-w-[200px] sm:max-w-none">
                Credit: {article.imageCredit}
              </span>
            </div>
          </div>
          <figcaption className="text-xs text-white/60 italic px-1 font-light leading-relaxed">
            <strong className="text-white font-mono not-italic uppercase text-[10px] tracking-wider mr-1.5">Figure 1.1:</strong>
            {article.imageCaption}
          </figcaption>
        </figure>

        {/* 3. SCIENTIFIC DATA & METRICS TABLE (TABLE 1) - 2 CARDS ON ALL SCREENS */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-3.5 sm:p-5 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-orange-400 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 shrink-0" /> Table 1: Key Instrument & Observational Parameters
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              Verified Ground Truth
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-0.5">
            {article.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/[0.04] p-3 sm:p-4 rounded-xl border border-white/10 flex flex-col justify-between space-y-1 min-w-0 hover:border-orange-500/40 transition-colors shadow-sm"
              >
                <span
                  className="text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-wider font-mono text-white/50 block truncate"
                  title={stat.label}
                >
                  {stat.label}
                </span>
                <span
                  className="text-sm sm:text-lg md:text-xl font-bold text-white font-mono leading-tight break-words"
                  title={stat.value}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. EDITORIAL ESSAY BODY (PROSE) */}
        <div className={`space-y-7 sm:space-y-8 text-[#d8d8d8] font-light leading-[1.8] ${
          activeFontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
        }`}>

          {/* CHAPTER 1: What Scientists Saw */}
          <section className="space-y-3 pt-1">
            <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight font-serif flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="text-orange-400 font-mono text-sm font-bold">01.</span>
              <span>What the Instruments Witnessed</span>
            </h2>
            <p className="first-letter:text-4xl first-letter:font-serif first-letter:float-left first-letter:mr-2.5 first-letter:text-orange-400 first-letter:font-bold first-letter:leading-none">
              {article.whatScientistsSaw}
            </p>
            <p>
              {article.whatAreWeLookingAt}
            </p>
          </section>

          {/* CHAPTER 2: The Breakthrough & Scientific Significance */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight font-serif flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="text-orange-400 font-mono text-sm font-bold">02.</span>
              <span>The Significance to Modern Science</span>
            </h2>
            <p>
              {article.whyImportant}
            </p>

            {/* Pull Quote */}
            <div className="my-5 py-4 px-4 sm:px-6 border-y border-orange-500/30 bg-white/[0.02] flex gap-3 items-start rounded-xl">
              <Quote className="w-6 h-6 text-orange-400/60 shrink-0 mt-0.5 stroke-1" />
              <blockquote className="text-sm sm:text-base text-white font-serif italic leading-relaxed">
                &ldquo;{article.theFascinatingPart}&rdquo;
              </blockquote>
            </div>
          </section>

          {/* CHAPTER 3: Methodology & Experimental Apparatus */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight font-serif flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="text-orange-400 font-mono text-sm font-bold">03.</span>
              <span>Instrumentation & Methodology</span>
            </h2>
            <p>
              {article.howTheyDidIt}
            </p>
          </section>

          {/* CHAPTER 4: INTERACTIVE LAB FIGURE (FIGURE 2) */}
          <section className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
              <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight font-serif flex items-center gap-2">
                <span className="text-orange-400 font-mono text-sm font-bold">04.</span>
                <span>Interactive Telemetry & Discovery Lab</span>
              </h2>
              <span className="text-[9px] font-mono uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                Figure 2 · Interactive Experiment
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/60 font-light">
              Interact with the live scientific parameters below to observe real-world spectroscopic and astrophysical phenomena mapped from original research datasets:
            </p>

            {/* Embedded Live Interactive Simulation */}
            <div className="pt-1">
              <InteractiveFeatureRenderer
                type={article.interactiveType}
                data={article.interactiveData}
                articleTitle={article.title}
              />
            </div>
          </section>

          {/* CHAPTER 5: The Fascinating Frontier */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight font-serif flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="text-orange-400 font-mono text-sm font-bold">05.</span>
              <span>The Fascinating Frontier</span>
            </h2>
            <p>
              {article.theFascinatingPart}
            </p>
          </section>

          {/* ARTICLE TAGS */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 self-center mr-1">
              Topics:
            </span>
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/?search=${encodeURIComponent(tag)}`}
                className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-orange-500/20 hover:text-orange-300 text-white/70 border border-white/10 transition"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* FORMAL PEER-REVIEWED CITATION & BIBLIOGRAPHY CARD - FULLY RESPONSIVE */}
          <section className="rounded-2xl bg-white/[0.02] border border-white/15 p-4 sm:p-5 space-y-3 text-xs font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-[10px] sm:text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">Primary Research Bibliography & Citation</span>
              </div>
              <button
                onClick={handleCopyCitation}
                className="px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-[9px] sm:text-[10px] uppercase tracking-widest text-orange-400 hover:text-orange-300 border border-orange-500/30 flex items-center gap-1.5 transition shrink-0"
              >
                {copiedCitation ? <Check className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3" />}
                <span>{copiedCitation ? 'Citation Copied!' : 'Copy Citation'}</span>
              </button>
            </div>

            <div className="space-y-2.5 text-white/80 font-sans text-xs">
              <div className="bg-white/[0.03] p-3 rounded-lg border border-white/5 space-y-0.5">
                <span className="text-white/40 font-mono uppercase tracking-widest block text-[9px]">Original Publication</span>
                <p className="text-white font-medium text-xs sm:text-sm leading-snug break-words">{article.originalResearch.title}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5 font-mono text-[11px]">
                <div className="bg-white/[0.03] p-2.5 rounded-lg border border-white/5 space-y-0.5 min-w-0">
                  <span className="text-white/40 uppercase tracking-widest block text-[9px]">Journal & Date</span>
                  <span className="text-white/90 block break-words leading-relaxed text-[10px] sm:text-[11px]">
                    {article.originalResearch.journal} ({article.originalResearch.year})
                  </span>
                </div>
                <div className="bg-white/[0.03] p-2.5 rounded-lg border border-white/5 space-y-0.5 min-w-0">
                  <span className="text-white/40 uppercase tracking-widest block text-[9px]">Lead Institution</span>
                  <span className="text-white/90 block break-words leading-relaxed text-[10px] sm:text-[11px]">
                    {article.originalResearch.institution}
                  </span>
                </div>
                <div className="bg-white/[0.03] p-2.5 rounded-lg border border-white/5 space-y-0.5 min-w-0">
                  <span className="text-white/40 uppercase tracking-widest block text-[9px]">Lead Researchers</span>
                  <span className="text-white/90 block break-words leading-relaxed text-[10px] sm:text-[11px]">
                    {article.originalResearch.authors}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[10px] text-white/50 font-mono break-all">
                <strong className="text-white/70">DOI:</strong> {article.originalResearch.doi}
              </span>
              {article.originalResearch.url && (
                <a
                  href={article.originalResearch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-400 hover:text-orange-300 transition self-start sm:self-auto"
                >
                  <span>Access Official Journal Paper</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              )}
            </div>
          </section>

          {/* READER INQUIRY: Ask the Science Desk */}
          <section className="rounded-2xl bg-black/60 border border-white/15 p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-[0_0_15px_rgba(242,125,38,0.5)] shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white font-mono truncate">
                  Curiosity Science Communicator
                </h4>
                <p className="text-[11px] text-white/50 font-light line-clamp-1">
                  Have questions about this paper’s methodology or findings? Ask our research intelligence desk.
                </p>
              </div>
            </div>

            {/* Conversation Responses */}
            {aiAnswers.length > 0 && (
              <div className="space-y-2.5 pt-1">
                {aiAnswers.map((chat, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="bg-white/5 text-orange-300 p-3 rounded-xl font-mono border border-white/10 break-words">
                      <span className="font-bold text-white/50 block mb-0.5 text-[9px] uppercase">Your Question:</span>
                      {chat.q}
                    </div>
                    <div className="bg-white/[0.03] text-white/90 p-3.5 rounded-xl leading-relaxed border border-white/10 whitespace-pre-line font-light break-words text-xs">
                      <span className="font-bold text-orange-400 flex items-center gap-1 mb-1 font-mono text-[9px] uppercase">
                        <Sparkles className="w-3 h-3" /> Science Desk Response:
                      </span>
                      {chat.a}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Question Form */}
            <form onSubmit={handleAskScientist} className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                id="input-ask-article"
                type="text"
                value={askQuestion}
                onChange={(e) => setAskQuestion(e.target.value)}
                placeholder="Ask about this paper (e.g., How does this compare to Earth? What if temperature drops?)"
                className="flex-1 bg-white/5 border border-white/15 rounded-full px-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-orange-500 transition min-w-0"
              />
              <button
                type="submit"
                disabled={isAsking || !askQuestion.trim()}
                className="px-4 sm:px-5 py-2 bg-white hover:bg-orange-500 hover:text-white text-black font-bold uppercase tracking-widest rounded-full text-[10px] font-mono flex items-center justify-center gap-1.5 transition disabled:opacity-50 shrink-0"
              >
                {isAsking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                <span>Ask Desk</span>
              </button>
            </form>
          </section>

        </div>

        {/* 5. CONTINUOUS EXPLORATION: Read Next Discoveries */}
        <section className="pt-8 border-t border-white/15 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-[0.25em] font-mono font-bold text-orange-400">
                Continue Reading
              </span>
              <h3 className="text-lg sm:text-xl font-light text-white tracking-tight font-serif">
                Related Frontier <span className="italic">Discoveries.</span>
              </h3>
            </div>
            <Link
              href="/"
              className="text-[11px] font-mono font-bold uppercase tracking-widest text-orange-400 hover:text-orange-300 transition flex items-center gap-1"
            >
              <span>Explore All Catalog</span> &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticles.map((relArt) => (
              <Link
                key={relArt.id}
                href={`/article/${relArt.slug}`}
                className="group flex flex-col justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-orange-500/50 transition-all space-y-3 shadow-lg"
              >
                <div className="space-y-2.5">
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-black">
                    <Image
                      src={relArt.heroImage}
                      alt={relArt.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-orange-400">
                    <span>{relArt.categoryIcon} {relArt.category}</span>
                    <span className="text-white/40">{relArt.readTime}</span>
                  </div>
                  <h4 className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">
                    {relArt.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-white/50 group-hover:text-orange-400 transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3 text-orange-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </article>

      {/* Bookmarks Drawer */}
      <SavedArticlesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedArticles={savedArticlesList}
        onRemoveSaved={handleToggleSave}
        onClearAll={() => {
          setSavedArticleIds([]);
          localStorage.removeItem('curiosity_saved_articles');
        }}
      />

      {/* Footer */}
      <CuriosityFooter
        onSelectCategory={(cat) => router.push(`/?category=${cat}`)}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
      />
    </div>
  );
}

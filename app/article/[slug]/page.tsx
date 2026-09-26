import React from 'react';
import { notFound } from 'next/navigation';
import { CURIOSITY_ARTICLES, getArticleByIdOrSlug } from '@/data/curiosityData';
import ArticlePageView from '@/components/ArticlePageView';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return CURIOSITY_ARTICLES.flatMap((article) => [
    { slug: article.slug },
    { slug: article.id },
  ]);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleByIdOrSlug(slug);

  if (!article) {
    notFound();
  }

  // Get 3 related articles from same category or overall
  const relatedArticles = CURIOSITY_ARTICLES.filter(
    (a) => a.id !== article.id
  ).slice(0, 3);

  return (
    <ArticlePageView
      article={article}
      relatedArticles={relatedArticles}
    />
  );
}

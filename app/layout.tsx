import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Curiosity — Discoveries Backed by Science',
  description: 'Curated scientific discoveries, fascinating observations, interactive visualizations, and peer-reviewed research breakdowns.',
  openGraph: {
    title: 'Curiosity — Discoveries Backed by Science',
    description: 'Curated scientific discoveries, fascinating observations, interactive visualizations, and peer-reviewed research breakdowns.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curiosity — Discoveries Backed by Science',
    description: 'Curated scientific discoveries, fascinating observations, interactive visualizations, and peer-reviewed research breakdowns.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

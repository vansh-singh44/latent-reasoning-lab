import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Latent Reasoning Lab | DataForge 2026 × Pathway',
  description: 'An interactive laboratory for understanding how AI can think more without saying more — exploring latent recurrent reasoning vs token-based reasoning.',
  keywords: ['AI reasoning', 'latent space', 'recurrent networks', 'BDH', 'BDH-CQ', 'chain-of-thought', 'machine learning education'],
  authors: [{ name: 'Latent Reasoning Lab Team' }],
  openGraph: {
    title: 'Latent Reasoning Lab',
    description: 'How can an AI "think more" without saying more? Interactive exploration of latent recurrent reasoning.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { ExperimentShowcase } from '@/components/landing/ExperimentShowcase';
import { GuidedTour } from '@/components/landing/GuidedTour';
import { TokenVsLatent } from '@/components/landing/TokenVsLatent';
import { ResearchSection } from '@/components/landing/ResearchSection';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-lab-bg">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        <ExperimentShowcase />
        <GuidedTour />
        <TokenVsLatent />
        <ResearchSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
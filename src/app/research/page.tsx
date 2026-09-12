'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { EvidencePanel } from '@/components/research/EvidenceBadge';
import { ResearchSection } from '@/components/landing/ResearchSection';

export default function ResearchPage() {
  return (
    <PageLayout 
      title="Research & Insights" 
      description="Grounded in published research. Every experiment connects to peer-reviewed work on latent reasoning, recurrent depth scaling, and recurrent memory."
    >
      <ResearchSection />
    </PageLayout>
  );
}
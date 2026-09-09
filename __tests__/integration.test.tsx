import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useExperimentStore } from '@/lib/experiment';
import HomePage from '@/app/page';

// Mock the store
vi.mock('@/lib/experiment', async () => {
  const actual = await vi.importActual('@/lib/experiment');
  return {
    ...actual,
    useExperimentStore: vi.fn(() => ({
      config: actual.DEFAULT_CONFIG,
      result: null,
      recurrentDepthResults: null,
      isRunning: false,
      guidedStep: 0,
      setConfig: vi.fn(),
      runExperiment: vi.fn(),
      runDepthSweep: vi.fn(),
      setGuidedStep: vi.fn(),
      reset: vi.fn(),
    })),
  };
});

describe('Experiment Integration', () => {
  it('Home page renders without crashing', () => {
    render(<HomePage />);
    expect(screen.getByText('Latent Reasoning Lab')).toBeInTheDocument();
  });
  
  it('shows loading state when no result', () => {
    render(<HomePage />);
    expect(screen.getByText('Initializing toy model...')).toBeInTheDocument();
  });
});

describe('Experiment Store', () => {
  it('DEFAULT_CONFIG has all required fields', () => {
    const { DEFAULT_CONFIG } = require('@/lib/experiment');
    expect(DEFAULT_CONFIG).toHaveProperty('recurrentDepth');
    expect(DEFAULT_CONFIG).toHaveProperty('stateDim');
    expect(DEFAULT_CONFIG).toHaveProperty('stateDecay');
    expect(DEFAULT_CONFIG).toHaveProperty('noiseLevel');
    expect(DEFAULT_CONFIG).toHaveProperty('interferenceLevel');
    expect(DEFAULT_CONFIG).toHaveProperty('taskType');
    expect(DEFAULT_CONFIG).toHaveProperty('numDemos');
    expect(DEFAULT_CONFIG).toHaveProperty('tokenSteps');
    expect(DEFAULT_CONFIG).toHaveProperty('seed');
  });
});

describe('Data Files', () => {
  it('papers.json has all required papers', () => {
    const papers = require('@/data/papers.json');
    const ids = papers.map((p: any) => p.id);
    expect(ids).toContain('coconut');
    expect(ids).toContain('recurrent-depth');
    expect(ids).toContain('trm');
    expect(ids).toContain('bdh');
    expect(ids).toContain('bdh-cq');
    expect(ids).toContain('bdh-explainer-1');
    expect(ids).toContain('bdh-explainer-2');
    expect(ids).toContain('bdh-explainer-3');
  });
  
  it('each paper has required fields', () => {
    const papers = require('@/data/papers.json');
    for (const paper of papers) {
      expect(paper).toHaveProperty('id');
      expect(paper).toHaveProperty('title');
      expect(paper).toHaveProperty('authors');
      expect(paper).toHaveProperty('year');
      expect(paper).toHaveProperty('venue');
      expect(paper).toHaveProperty('url');
      expect(paper).toHaveProperty('centralClaim');
      expect(paper).toHaveProperty('evidenceType');
      expect(paper).toHaveProperty('relevantConcepts');
      expect(paper).toHaveProperty('limitations');
      expect(paper).toHaveProperty('whatItDoesNotDemonstrate');
      expect(paper).toHaveProperty('evidenceLevel');
      expect(paper).toHaveProperty('conceptFamily');
    }
  });
  
  it('published-results.json has benchmark data', () => {
    const results = require('@/data/published-results.json');
    expect(results).toHaveProperty('recurrentDepthSweep');
    expect(results).toHaveProperty('coconutProsQA');
    expect(results).toHaveProperty('coconutGSM8K');
    expect(results).toHaveProperty('trmBenchmarks');
    expect(results).toHaveProperty('bdhScaling');
    expect(results).toHaveProperty('bdhcqArcAgi');
    expect(results).toHaveProperty('conceptArc');
  });
});

describe('Evidence Classification', () => {
  it('EVIDENCE_CONFIG has all types', () => {
    const { EVIDENCE_CONFIG } = require('@/components/research/EvidenceBadge');
    expect(EVIDENCE_CONFIG).toHaveProperty('LIVE_TOY_COMPUTATION');
    expect(EVIDENCE_CONFIG).toHaveProperty('PRECOMPUTED_PUBLISHED_RESULT');
    expect(EVIDENCE_CONFIG).toHaveProperty('PUBLISHED_RESULT');
    expect(EVIDENCE_CONFIG).toHaveProperty('REPORTED_BY_AUTHORS');
    expect(EVIDENCE_CONFIG).toHaveProperty('INDEPENDENTLY_EVALUATED');
    expect(EVIDENCE_CONFIG).toHaveProperty('TOY_PEDAGOGICAL');
    expect(EVIDENCE_CONFIG).toHaveProperty('ILLUSTRATIVE_DIAGRAM');
  });
  
  it('each evidence type has required properties', () => {
    const { EVIDENCE_CONFIG } = require('@/components/research/EvidenceBadge');
    for (const [key, config] of Object.entries(EVIDENCE_CONFIG)) {
      expect(config).toHaveProperty('label');
      expect(config).toHaveProperty('description');
      expect(config).toHaveProperty('color');
      expect(config).toHaveProperty('bgColor');
      expect(config).toHaveProperty('borderColor');
    }
  });
});
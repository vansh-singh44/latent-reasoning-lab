'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { EvidencePanel, EvidenceBadge, EvidenceLegend } from '@/components/research/EvidenceBadge';
import { MetricCard, ComparisonTable } from '@/components/visualization/Charts';
import papersData from '@/data/papers.json';
import publishedResultsData from '@/data/published-results.json';

const papers = papersData;
const publishedResults = publishedResultsData;
import { cn, formatPercent, formatNumber, formatCurrency } from '@/lib/utils';
import { FileText, ExternalLink, Github, AlertTriangle, CheckCircle, XCircle, Brain, Zap, GitBranch, BookOpen, Award } from 'lucide-react';

const EVIDENCE_TYPE_LABELS: Record<string, string> = {
  FORMAL: 'Formal/Theoretical',
  EXPERIMENTAL: 'Experimental',
  REPORTED_BY_AUTHORS: 'Reported by Authors',
  EXPLANATORY: 'Explanatory',
  DERIVATIONAL: 'Derivational',
};

export default function EvidencePage() {
  return (
    <PageLayout title="Evidence Room" description="Research papers, key results, and evidence classification for every claim in this lab.">
      {/* Evidence Legend */}
      <EvidenceLegend className="mb-6" />
      
      {/* Research Papers */}
      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold text-lab-text mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-lab-accent" />
          Primary Research Papers
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {papers.map((paper) => (
            <EvidencePanel 
              key={paper.id} 
              type={paper.evidenceLevel === 'FORMAL' || paper.evidenceLevel === 'FORMAL_EXPERIMENTAL' ? 'PUBLISHED_RESULT' : 
                    paper.evidenceLevel === 'EXPERIMENTAL' ? 'PUBLISHED_RESULT' :
                    paper.evidenceLevel === 'REPORTED_BY_AUTHORS' ? 'REPORTED_BY_AUTHORS' :
                    paper.evidenceLevel === 'EXPLANATORY' ? 'ILLUSTRATIVE_DIAGRAM' :
                    'TOY_PEDAGOGICAL'}
              title={paper.title}
              citation={paper.venue}
              className="h-full flex flex-col"
            >
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="badge badge-precomputed">{paper.year}</span>
                <span className="badge badge-toy">{EVIDENCE_TYPE_LABELS[paper.evidenceLevel] || paper.evidenceLevel}</span>
                <span className="badge badge-toy">{paper.conceptFamily}</span>
              </div>
              
              <p className="text-sm text-lab-textMuted mb-3 flex-1">{paper.centralClaim}</p>
              
              {paper.keyResults.length > 0 && (
                <div className="mb-3">
                  <h5 className="font-mono text-xs text-lab-textMuted mb-2">Key Results</h5>
                  <div className="space-y-1">
                    {paper.keyResults.slice(0, 3).map((result, i) => (
                      <div key={i} className="text-sm text-lab-textMuted">
                        <span className="text-lab-text font-mono">{result.metric}</span>
                        <span className="text-lab-accent ml-2">{result.value}</span>
                        <span className="text-lab-textMuted ml-1">({result.condition})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-auto">
                <a href={paper.url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Paper
                </a>
                {paper.github && (
                  <a href={paper.github} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs flex items-center gap-1">
                    <Github className="w-3 h-3" /> Code
                  </a>
                )}
              </div>
              
              <details className="mt-3 group">
                <summary className="text-xs text-lab-textMuted font-mono cursor-pointer flex items-center gap-1">
                  <span>Limitations & What It Does NOT Demonstrate</span>
                  <XCircle className="w-3 h-3 transition-transform group-open:rotate-90" />
                </summary>
                <div className="mt-2 space-y-1 text-xs text-lab-textMuted">
                  <p className="font-medium">Limitations:</p>
                  {paper.limitations.map((lim, i) => (
                    <p key={i} className="ml-4">• {lim}</p>
                  ))}
                  <p className="font-medium mt-2">Does NOT demonstrate:</p>
                  {paper.whatItDoesNotDemonstrate.map((lim, i) => (
                    <p key={i} className="ml-4">• {lim}</p>
                  ))}
                </div>
              </details>
            </EvidencePanel>
          ))}
        </div>
      </section>
      
      {/* Published Results Summary */}
      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold text-lab-text mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-lab-warning" />
          Published Benchmark Results (Not Toy Model)
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* BDH-CQ Results */}
          <EvidencePanel type="PUBLISHED_RESULT" title="BDH-CQ: ARC-AGI-1 Results" citation="Engdahl et al., 2026">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard label="pass@2" value="29.5%" evidenceBadge="PUBLISHED_RESULT" />
                <MetricCard label="pass@1" value="24.25%" evidenceBadge="PUBLISHED_RESULT" />
                <MetricCard label="Cost/task" value="$0.00070" evidenceBadge="PUBLISHED_RESULT" />
                <MetricCard label="Params" value="150M" evidenceBadge="PUBLISHED_RESULT" />
              </div>
              <div className="p-3 bg-lab-panel/50 rounded border border-lab-border/50">
                <h5 className="font-mono text-xs text-lab-textMuted mb-2">Cost Comparison</h5>
                <ComparisonTable rows={[
                  { property: 'Model', token: 'BDH-CQ', latent: 'GPT-5.6 Luna (Low)' },
                  { property: 'Accuracy', token: '29.5%', latent: '34.2%' },
                  { property: 'Cost/task', token: '$0.00070', latent: '$0.040' },
                  { property: 'Efficiency', token: '57× cheaper', latent: 'baseline' },
                ]} />
              </div>
            </div>
          </EvidencePanel>
          
          {/* Coconut Results */}
          <EvidencePanel type="PUBLISHED_RESULT" title="Coconut: Latent vs CoT" citation="Hao et al., 2024 (ICLR 2025)">
            <div className="space-y-3">
              <ComparisonTable rows={[
                { property: 'Method', token: 'CoT (GPT-2)', latent: 'Coconut (k=4)' },
                { property: 'ProsQA Accuracy', token: '54.2%', latent: '67.8%' },
                { property: 'GSM8K (3B)', token: '26.0% (no-CoT)', latent: '31.7%' },
                { property: 'GSM8K (8B)', token: '42.2% (no-CoT)', latent: '43.6%' },
              ]} />
              <p className="text-sm text-lab-textMuted">
                Coconut enables BFS-like reasoning in latent space. Latent thoughts represent multiple 
                alternative next steps simultaneously.
              </p>
            </div>
          </EvidencePanel>
          
          {/* Recurrent Depth Results */}
          <EvidencePanel type="PUBLISHED_RESULT" title="Recurrent Depth: Test-Time Compute Scaling" citation="Geiping et al., NeurIPS 2025">
            <div className="space-y-3">
              <ComparisonTable rows={[
                { property: 'Task', token: 'r=1 (baseline)', latent: 'r=32 (extended)' },
                { property: 'ARC-Challenge', token: '34.1%', latent: '42.3%' },
                { property: 'GSM8K', token: '22.4%', latent: '58.7%' },
                { property: 'HumanEval', token: '18.3%', latent: '34.1%' },
                { property: 'MMLU', token: '48.2%', latent: '55.4%' },
                { property: 'Mastermind', token: '12.5%', latent: '48.9%' },
              ]} />
              <p className="text-sm text-lab-textMuted">
                3.5B param model trained with random recurrence depth. Simple tasks converge fast; 
                reasoning tasks benefit from extended compute.
              </p>
            </div>
          </EvidencePanel>
          
          {/* TRM Results */}
          <EvidencePanel type="PUBLISHED_RESULT" title="TRM: Tiny Recursive Reasoning" citation="Jolicoeur-Martineau, 2025">
            <div className="space-y-3">
              <ComparisonTable rows={[
                { property: 'Benchmark', token: 'HRM (27M)', latent: 'TRM (7M)' },
                { property: 'ARC-AGI-1', token: '40%', latent: '45%' },
                { property: 'ARC-AGI-2', token: '5%', latent: '8%' },
                { property: 'Sudoku-Extreme', token: '55%', latent: '87%' },
                { property: 'Maze-Hard', token: '75%', latent: '85%' },
              ]} />
              <p className="text-sm text-lab-textMuted">
                Single 2-layer network with recursive refinement beats hierarchical models 
                with 4× fewer parameters.
              </p>
            </div>
          </EvidencePanel>
        </div>
      </section>
      
      {/* ConceptARC Breakdown */}
      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold text-lab-text mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-lab-info" />
          BDH-CQ ConceptARC Capability Profile
        </h2>
        <EvidencePanel type="PUBLISHED_RESULT" title="Concept-Organized Evaluation" citation="Engdahl et al., 2026">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-lab-border">
                  <th className="text-left py-2 px-3 font-medium text-lab-textMuted">Concept</th>
                  <th className="text-left py-2 px-3 font-medium text-lab-textMuted">BDH-CQ</th>
                  <th className="text-left py-2 px-3 font-medium text-lab-textMuted">Baseline</th>
                  <th className="text-left py-2 px-3 font-medium text-lab-textMuted">Gap</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { concept: 'Propagation', bdhcq: 78, baseline: 45 },
                  { concept: 'Copying', bdhcq: 82, baseline: 52 },
                  { concept: 'Dense Mappings', bdhcq: 71, baseline: 38 },
                  { concept: 'Rotation', bdhcq: 58, baseline: 41 },
                  { concept: 'Relocation', bdhcq: 54, baseline: 39 },
                  { concept: 'Composition', bdhcq: 31, baseline: 18 },
                  { concept: 'Ordering', bdhcq: 22, baseline: 15 },
                  { concept: 'Nesting', bdhcq: 19, baseline: 12 },
                  { concept: 'Conditional', bdhcq: 16, baseline: 10 },
                ].map((row, i) => (
                  <tr key={i} className={cn('border-b border-lab-border/50', i % 2 === 0 && 'bg-lab-panel/30')}>
                    <td className="py-2 px-3 text-lab-text">{row.concept}</td>
                    <td className="py-2 px-3 text-lab-accent">{row.bdhcq}%</td>
                    <td className="py-2 px-3 text-lab-info">{row.baseline}%</td>
                    <td className="py-2 px-3 text-lab-warning font-medium">+{row.bdhcq - row.baseline}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-lab-textMuted mt-3">
            BDH-CQ excels at propagation, copying, and dense mappings but struggles with composition, 
            ordering, nesting, and conditional rule selection — consistent with the limitations of 
            recurrent memory without explicit symbolic manipulation.
          </p>
        </EvidencePanel>
      </section>
      
      {/* BDH Scaling Laws */}
      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold text-lab-text mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-lab-accent" />
          BDH Scaling Laws
        </h2>
        <EvidencePanel type="PUBLISHED_RESULT" title="Transformer-Like Scaling" citation="Kosowski et al., 2025">
          <div className="space-y-3">
            <ComparisonTable rows={[
              { property: 'Parameters', token: '10M', latent: '1B' },
              { property: 'Perplexity', token: '28.5', latent: '13.2' },
              { property: 'Training Tokens', token: '100B', latent: '2T' },
            ]} />
            <p className="text-sm text-lab-textMuted">
              BDH-GPU matches Transformer scaling laws on language modeling while providing 
              interpretable synaptic structure and fixed-size memory.
            </p>
          </div>
        </EvidencePanel>
      </section>
      
      {/* Evidence Discipline Reminder */}
      <EvidencePanel type="ILLUSTRATIVE_DIAGRAM" title="Evidence Discipline: How We Label Results" className="mb-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-lab-textMuted mb-3">
            Every result in this lab is explicitly classified. Look for badges like these:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <EvidenceBadge type="LIVE_TOY_COMPUTATION" />
            <EvidenceBadge type="PUBLISHED_RESULT" />
            <EvidenceBadge type="TOY_PEDAGOGICAL" />
            <EvidenceBadge type="ILLUSTRATIVE_DIAGRAM" />
          </div>
          <ul className="list-disc list-inside space-y-1 text-lab-textMuted">
            <li><strong>LIVE TOY COMPUTATION</strong> — Runs in your browser right now (deterministic, seeded)</li>
            <li><strong>PUBLISHED RESULT</strong> — Directly from cited paper (with citation)</li>
            <li><strong>PRECOMPUTED RESULT</strong> — Precomputed from toy runs, saved as fixture</li>
            <li><strong>TOY / PEDAGOGICAL</strong> — Simplified simulation for teaching</li>
            <li><strong>ILLUSTRATIVE DIAGRAM</strong> — Conceptual visualization, not computation</li>
            <li><strong>REPORTED BY AUTHORS</strong> — Claim from paper, not independently verified</li>
          </ul>
          <p className="text-lab-textMuted mt-3">
            <strong>We never:</strong> make toy animations look like real model traces, merge benchmark data with toy results, 
            or present developer benchmarks as independent evaluations.
          </p>
        </div>
      </EvidencePanel>
      
      {/* Reproducibility */}
      <EvidencePanel type="TOY_PEDAGOGICAL" title="Reproducibility" className="mb-6">
        <div className="prose prose-invert max-w-none">
          <h4 className="font-display text-lg text-lab-text mb-3">Toy Model Reproducibility</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-mono text-lab-textMuted mb-2">Configuration</h5>
              <pre className="font-mono text-xs bg-lab-bg p-3 rounded border border-lab-border/50 overflow-x-auto">
{JSON.stringify({
  model: 'ToyLatentReasoner (linear recurrent + ReLU)',
  stateDim: 64,
  inputDim: 16,
  outputDim: 16,
  seed: 42,
  task: '4x4 grid transformations',
}, null, 2)}
              </pre>
            </div>
            <div>
              <h5 className="font-mono text-lab-textMuted mb-2">Determinism</h5>
              <ul className="list-disc list-inside space-y-1 text-lab-textMuted">
                <li>Fixed seed (42) for all experiments</li>
                <li>SeededRNG (LCG + Box-Muller) for reproducibility</li>
                <li>Reset button restores exact initial state</li>
                <li>Copy config: JSON export of all parameters</li>
              </ul>
            </div>
          </div>
        </div>
      </EvidencePanel>
    </PageLayout>
  );
}
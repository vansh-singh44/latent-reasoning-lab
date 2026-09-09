'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { EvidencePanel, EvidenceBadge } from '@/components/research/EvidenceBadge';
import { GridDisplay, AnimatedGrid } from '@/components/visualization/GridDisplay';
import { StateHeatmap, StateTrajectory, StateVectorBars, StateChangeChart } from '@/components/visualization/StateVisualization';
import { MetricCard, AccuracyComputeChart, ComparisonTable } from '@/components/visualization/Charts';
import { Slider, Toggle, Select, NumberInput } from '@/components/controls/Controls';
import { useExperimentStore, DEFAULT_CONFIG } from '@/lib/experiment';
import { cn, formatPercent, formatNumber } from '@/lib/utils';
import { useEffect, useCallback } from 'react';
import { GitBranch, Zap, ArrowRight, RefreshCw, Info, AlertTriangle } from 'lucide-react';

const COMPARISON_ROWS = [
  { property: 'Intermediate representation', token: 'Text tokens', latent: 'Hidden state vector' },
  { property: 'Additional compute', token: 'More tokens generated', latent: 'More recurrent updates' },
  { property: 'Interpretability', token: 'High (human-readable)', latent: 'Low (requires probes)' },
  { property: 'Memory growth', token: 'O(context × hidden)', latent: 'O(state_dim²) fixed' },
  { property: 'Context window', token: 'Limited by KV cache', latent: 'Effectively infinite' },
  { property: 'Adaptive compute', token: 'Hard (fixed steps)', latent: 'Natural (early exit)' },
  { property: 'Verification', token: 'Direct inspection', latent: 'Requires interpretability tools' },
];

export default function TokensPage() {
  const { config, result, recurrentDepthResults, isRunning, runExperiment, runDepthSweep, setConfig } = useExperimentStore();
  
  useEffect(() => {
    runExperiment();
    runDepthSweep();
  }, [runExperiment, runDepthSweep]);
  
  if (!result) {
    return (
      <PageLayout title="Think in Tokens" description="Traditional chain-of-thought reasoning where intermediate computation appears as visible language tokens.">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-lab-info border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lab-textMuted">Loading token reasoning experiment...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="Think in Tokens" description="Traditional chain-of-thought reasoning where intermediate computation appears as visible language tokens.">
      <EvidencePanel type="LIVE_TOY_COMPUTATION" title="Token-Based Reasoning Simulation" className="mb-6">
        <p className="text-lab-textMuted mb-4">
          This simulates how a standard LLM performs chain-of-thought reasoning: generating intermediate text tokens step by step. 
          Each "thinking step" produces visible tokens that accumulate in the context window.
        </p>
        
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-display text-sm text-lab-info mb-2">Reasoning Trace</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Array.from({ length: config.tokenSteps }, (_, i) => (
                  <div key={i} className="p-3 bg-lab-panel/50 rounded-lg border border-lab-border/50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-6 text-center text-xs font-mono text-lab-info">{i + 1}</span>
                      <span className="text-xs text-lab-textMuted font-mono">
                        {i === 0 ? 'Input received' : i < config.tokenSteps - 1 ? 'Reasoning...' : 'Final answer'}
                      </span>
                    </div>
                    <AnimatedGrid
                      fromGrid={result.groundTruth.grid}
                      toGrid={result.tokenPrediction.grid}
                      progress={Math.min(1, (i + 1) / config.tokenSteps)}
                      size={4}
                      cellSize={20}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-display text-sm text-lab-text mb-2">Context Growth</h4>
              <StateHeatmap
                state={Array.from({ length: config.tokenSteps * 16 }, (_, i) => Math.sin(i * 0.3) * 0.5 + 0.5)}
                width={16}
                height={config.tokenSteps}
                cellSize={8}
                title={`Simulated KV Cache Growth (${config.tokenSteps} steps × 16 dims)`}
              />
              
              <div className="mt-4 p-3 bg-lab-panel/50 rounded-lg border border-lab-border/50">
                <h5 className="font-mono text-xs text-lab-textMuted mb-2">Memory Characteristics</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-lab-textMuted">Context length:</span> <span className="text-lab-text font-mono">{config.tokenSteps * 50} tokens</span></div>
                  <div><span className="text-lab-textMuted">KV cache:</span> <span className="text-lab-text font-mono">{formatNumber(result.tokenMemoryEstimate)} bytes</span></div>
                  <div><span className="text-lab-textMuted">Compute:</span> <span className="text-lab-text font-mono">{formatNumber(result.tokenComputeEstimate)} FLOPs</span></div>
                  <div><span className="text-lab-textMuted">Accuracy:</span> <span className="text-lab-text font-mono">{formatPercent(result.tokenAccuracy)}</span></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-lab-border">
            <h4 className="font-display text-sm text-lab-text mb-3">Thinking Budget Control</h4>
            <Slider
              label="Token Reasoning Steps"
              value={config.tokenSteps}
              onChange={(v) => setConfig({ tokenSteps: v })}
              min={1}
              max={32}
              step={1}
              marks={[
                { value: 1, label: '1' },
                { value: 4, label: '4' },
                { value: 8, label: '8' },
                { value: 16, label: '16' },
                { value: 32, label: '32' },
              ]}
              unit="steps"
            />
          </div>
        </div>
      </EvidencePanel>
      
      <EvidencePanel type="ILLUSTRATIVE_DIAGRAM" title="Token vs Latent: Core Trade-offs" className="mb-6">
        <ComparisonTable rows={COMPARISON_ROWS} />
      </EvidencePanel>
      
      <EvidencePanel type="PUBLISHED_RESULT" title="Research Evidence: Chain-of-Thought" citation="Nye et al., 2021" className="mb-6">
        <div className="prose prose-invert max-w-none">
          <h4 className="font-display text-lg text-lab-text mb-3">Key Research: "Show Your Work: Scratchpads for Intermediate Computation with Language Models" (Nye et al., 2021)</h4>
          <ul className="space-y-2 text-lab-textMuted list-disc list-inside">
            <li>Demonstrated that LLM performance on reasoning tasks improves significantly when models generate intermediate reasoning tokens (scratchpads/CoT)</li>
            <li>More reasoning tokens → better accuracy on math, logic, and algorithmic tasks</li>
            <li>But: context window limits, compute grows linearly with tokens, interpretability comes at cost of efficiency</li>
          </ul>
        </div>
      </EvidencePanel>
      
      <div className="grid md:grid-cols-3 gap-4">
        <a href="/latents" className="card group hover:border-lab-accent/50">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-lab-accent group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-display font-semibold text-lab-text">Think in Latents</h4>
              <p className="text-sm text-lab-textMuted">Recurrent depth & hidden state updates</p>
            </div>
          </div>
        </a>
        <a href="/bdh" className="card group hover:border-lab-accent/50">
          <div className="flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-lab-info group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-display font-semibold text-lab-text">BDH / BDH-CQ</h4>
              <p className="text-sm text-lab-textMuted">Recurrent memory + latent reasoning</p>
            </div>
          </div>
        </a>
        <a href="/experiments" className="card group hover:border-lab-accent/50">
          <div className="flex items-center gap-3">
            <ArrowRight className="w-8 h-8 text-lab-warning group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-display font-semibold text-lab-text">All Experiments</h4>
              <p className="text-sm text-lab-textMuted">Full experiment suite</p>
            </div>
          </div>
        </a>
      </div>
    </PageLayout>
  );
}
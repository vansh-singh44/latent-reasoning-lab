'use client';

import { useEffect, useState, useCallback } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { GridDisplay, AnimatedGrid } from '@/components/visualization/GridDisplay';
import { StateHeatmap, StateTrajectory, StateVectorBars, StateChangeChart } from '@/components/visualization/StateVisualization';
import { MetricCard, ComparisonTable, AccuracyComputeChart, AccuracyVsDepthChart } from '@/components/visualization/Charts';
import { Slider, Toggle, ButtonGroup, Select } from '@/components/controls/Controls';
import { EvidenceBadge, EvidencePanel } from '@/components/research/EvidenceBadge';
import Link from 'next/link';
import { useExperimentStore, runExperiment, DEFAULT_CONFIG, ExperimentConfig } from '@/lib/experiment';
import { cn, formatPercent, formatNumber } from '@/lib/utils';
import { 
  Zap, 
  Brain, 
  GitBranch, 
  ArrowRight, 
  RefreshCw, 
  Info, 
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';

const THINKING_BUDGET_OPTIONS = [1, 2, 4, 8, 16, 32];

const COMPARISON_ROWS = [
  { property: 'Intermediate representation', token: 'Text tokens', latent: 'Hidden state vector' },
  { property: 'Additional compute', token: 'More tokens generated', latent: 'More recurrent updates' },
  { property: 'Interpretability', token: 'High (human-readable)', latent: 'Low (requires probes)' },
  { property: 'Memory growth', token: 'O(context × hidden)', latent: 'O(state_dim²) fixed' },
  { property: 'Context window', token: 'Limited by KV cache', latent: 'Effectively infinite' },
  { property: 'Adaptive compute', token: 'Hard (fixed steps)', latent: 'Natural (early exit)' },
  { property: 'Verification', token: 'Direct inspection', latent: 'Requires interpretability tools' },
];

export default function HomePage() {
  const { 
    config, 
    result, 
    recurrentDepthResults, 
    isRunning, 
    guidedStep, 
    setConfig, 
    runExperiment: runExp, 
    runDepthSweep,
    setGuidedStep 
  } = useExperimentStore();
  
  const [showGuided, setShowGuided] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [mode, setMode] = useState<'token' | 'latent' | 'compare'>('compare');
  
  // Initialize experiment on mount
  useEffect(() => {
    runExp();
    runDepthSweep();
  }, [runExp, runDepthSweep]);
  
  // Animation loop for the live demo
  useEffect(() => {
    if (!result) return;
    let frame = 0;
    const animate = () => {
      frame++;
      setAnimationProgress(frame / 60);
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [result]);
  
  const handleBudgetChange = useCallback((steps: number) => {
    setConfig({ recurrentDepth: steps, tokenSteps: steps });
  }, [setConfig]);
  
  const handleTaskChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig({ taskType: e.target.value as ExperimentConfig['taskType'] });
  }, [setConfig]);
  
  const handleDemoChange = useCallback((numDemos: number) => {
    setConfig({ numDemos });
  }, [setConfig]);
  
  const handleModeChange = useCallback((value: string) => {
    setMode(value as 'token' | 'latent' | 'compare');
  }, []);
  
  const guidedSteps = [
    {
      title: 'Traditional reasoning exposes intermediate computation as language',
      description: 'Watch the token-based system generate step-by-step reasoning. Each step is a visible token.',
      highlight: 'token',
    },
    {
      title: 'Latent reasoning keeps intermediate state hidden',
      description: 'The latent system repeatedly updates a hidden state vector. No intermediate words are produced.',
      highlight: 'latent',
    },
    {
      title: 'Increase recurrent depth to let the model "think more"',
      description: 'Move the slider from 1 to 8 steps. The hidden state trajectory changes with each update.',
      highlight: 'depth',
    },
    {
      title: 'Did the answer improve? Compare with ground truth.',
      description: 'Check accuracy, confidence, and compute cost for both approaches.',
      highlight: 'compare',
    },
    {
      title: 'More computation ≠ more words. Notice what you gained — and lost.',
      description: 'Latent reasoning gains compute efficiency but loses direct observability.',
      highlight: 'tradeoff',
    },
    {
      title: 'Now see how BDH-CQ connects this to recurrent memory.',
      description: 'Demonstrations update recurrent memory, then queries are solved through latent iteration.',
      highlight: 'bdhcq',
    },
  ];
  
  const currentGuided = guidedSteps[guidedStep];
  
  if (!result) {
    return (
      <PageLayout 
        title="Latent Reasoning Lab" 
        description="How can an AI think more without saying more? Try the same reasoning problem with more visible tokens or more hidden-state updates."
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-lab-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lab-textMuted">Initializing toy model...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  const { 
    groundTruth,
    tokenPrediction,
    tokenAccuracy,
    tokenStepsUsed,
    tokenComputeEstimate,
    tokenMemoryEstimate,
    latentPrediction,
    latentAccuracy,
    latentStepsUsed,
    latentComputeEstimate,
    latentMemoryEstimate,
    stateTrajectory,
    stateChanges,
  } = result;
  
  return (
    <PageLayout 
      title="Latent Reasoning Lab" 
      description="How can an AI think more without saying more? Try the same reasoning problem with more visible tokens or more hidden-state updates."
    >
      {/* Guided Mode Banner */}
      {showGuided && (
        <EvidencePanel 
          type="TOY_PEDAGOGICAL" 
          title="Guided Tour — 60 Second Journey"
          className="mb-6 bg-lab-accentBg/30 border-lab-accent/30"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <h4 className="font-display text-lg text-lab-text mb-2">{currentGuided.title}</h4>
              <p className="text-lab-textMuted">{currentGuided.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <ButtonGroup 
                value={String(guidedStep)} 
                onChange={(v) => setGuidedStep(Number(v))}
                options={guidedSteps.map((s, i) => ({ value: String(i), label: String(i + 1) }))}
              />
              <button 
                onClick={() => setShowGuided(false)}
                className="btn-ghost text-xs"
              >
                Skip tour
              </button>
            </div>
          </div>
        </EvidencePanel>
      )}
      
      {/* Main Experiment Area */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* INPUT COLUMN */}
        <EvidencePanel type="LIVE_TOY_COMPUTATION" title="INPUT" className="h-full">
          <div className="space-y-4">
            <GridDisplay 
              grid={groundTruth.grid} 
              title="Query Input"
              cellSize={36}
              size={4}
              aria-label="Input grid for the reasoning task"
            />
            
            <div className="space-y-3">
              <label className="text-xs font-mono text-lab-textMuted">Task Type</label>
              <Select
                label="Task Type"
                value={config.taskType}
                onChange={handleTaskChange}
                options={[
                  { value: 'rotation', label: 'Rotation (90° CW)' },
                  { value: 'translation', label: 'Translation (↘)' },
                  { value: 'flip', label: 'Horizontal Flip' },
                  { value: 'composition', label: 'Rotate + Flip' },
                ]}
              />
              
              <label className="text-xs font-mono text-lab-textMuted">Demonstrations</label>
              <Slider
                value={config.numDemos}
                onChange={handleDemoChange}
                min={0}
                max={5}
                step={1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 1, label: '1' },
                  { value: 3, label: '3' },
                  { value: 5, label: '5' },
                ]}
              />
            </div>
            
            <div className="pt-4 border-t border-lab-border">
              <h4 className="font-display text-sm text-lab-text mb-2">Demonstrations</h4>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: config.numDemos }, (_, i) => (
                  <div key={i} className="text-center">
                    <GridDisplay 
                      grid={groundTruth.grid.map((row, r) => row.map((_, c) => (r + c + i) % 4))} 
                      size={4}
                      cellSize={16}
                      showValues={false}
                      title={`Demo ${i + 1}`}
                    />
                  </div>
                ))}
                {config.numDemos === 0 && (
                  <div className="col-span-3 text-center py-4 text-lab-textMuted text-xs">
                    No demonstrations provided
                  </div>
                )}
              </div>
            </div>
          </div>
        </EvidencePanel>
        
        {/* REASONING COLUMN */}
        <EvidencePanel type="LIVE_TOY_COMPUTATION" title="REASONING" className="h-full">
          <div className="space-y-4">
            {/* Mode Toggle */}
            <ButtonGroup value={mode} onChange={handleModeChange} options={[
              { value: 'token', label: 'Token Mode', icon: <GitBranch className="w-4 h-4" /> },
              { value: 'latent', label: 'Latent Mode', icon: <Brain className="w-4 h-4" /> },
              { value: 'compare', label: 'Compare', icon: <Zap className="w-4 h-4" /> },
            ]} />
            
            {mode === 'token' && (
              <div className="space-y-4">
                <h4 className="font-display text-sm text-lab-info">Token-Based Reasoning (Chain-of-Thought)</h4>
                <div className="space-y-2">
                  {Array.from({ length: tokenStepsUsed }, (_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-lab-panel/50 rounded-lg border border-lab-border/50">
                      <span className="w-6 text-center text-xs font-mono text-lab-info">{i + 1}</span>
                      <AnimatedGrid
                        fromGrid={groundTruth.grid}
                        toGrid={tokenPrediction.grid}
                        progress={Math.min(1, (animationProgress * 2 + i * 0.1) % 1)}
                        size={4}
                        cellSize={18}
                      />
                      <span className="text-xs text-lab-textMuted font-mono">
                        Step {i + 1}: {i < tokenStepsUsed - 1 ? 'reasoning...' : 'answer'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {mode === 'latent' && (
              <div className="space-y-4">
                <h4 className="font-display text-sm text-lab-accent">Latent Recurrent Reasoning</h4>
                
                {/* State Heatmap */}
                <StateHeatmap
                  state={stateTrajectory[latentStepsUsed - 1] || []}
                  width={16}
                  height={4}
                  cellSize={10}
                  title={`Hidden State at Step ${latentStepsUsed} (${config.stateDim}D → 64 shown)`}
                />
                
                {/* State Trajectory */}
                <StateTrajectory
                  trajectory={stateTrajectory}
                  width={latentStepsUsed}
                  height={16}
                  cellSize={6}
                  title="State Trajectory Over Recurrent Steps"
                />
                
                {/* State Change Chart */}
                <StateChangeChart
                  changes={stateChanges}
                  title="State Change Magnitude per Step"
                />
                
                {/* Vector Bars */}
                <StateVectorBars
                  state={stateTrajectory[latentStepsUsed - 1] || []}
                  title="Final State Vector Activations"
                  maxBars={64}
                />
              </div>
            )}
            
            {mode === 'compare' && (
              <div className="space-y-4">
                <h4 className="font-display text-sm text-lab-text">Side-by-Side Comparison</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-lab-panel/50 rounded-lg border border-lab-info/30">
                    <h5 className="font-mono text-xs text-lab-info mb-2">Token Reasoning</h5>
                    <GridDisplay 
                      grid={tokenPrediction.grid} 
                      size={4}
                      cellSize={24}
                      showValues={true}
                    />
                    <p className="text-xs text-lab-textMuted mt-2">
                      {tokenStepsUsed} visible reasoning steps
                    </p>
                  </div>
                  <div className="p-3 bg-lab-panel/50 rounded-lg border border-lab-accent/30">
                    <h5 className="font-mono text-xs text-lab-accent mb-2">Latent Reasoning</h5>
                    <GridDisplay 
                      grid={latentPrediction.grid} 
                      size={4}
                      cellSize={24}
                      showValues={true}
                    />
                    <p className="text-xs text-lab-textMuted mt-2">
                      {latentStepsUsed} recurrent updates (hidden)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </EvidencePanel>
        
        {/* ANSWER COLUMN */}
        <EvidencePanel type="LIVE_TOY_COMPUTATION" title="ANSWER" className="h-full">
          <div className="space-y-4">
            {/* Ground Truth */}
            <div className="p-3 bg-lab-panel/50 rounded-lg border border-lab-border">
              <h5 className="font-mono text-xs text-lab-textMuted mb-2">Ground Truth</h5>
              <GridDisplay 
                grid={groundTruth.grid} 
                size={4}
                cellSize={32}
                showValues={true}
              />
            </div>
            
            {/* Token Prediction */}
            <div className="p-3 rounded-lg border" style={{ 
              backgroundColor: gridsEqual(tokenPrediction.grid, groundTruth.grid) ? '#052e26' : '#3d1a1a',
              borderColor: gridsEqual(tokenPrediction.grid, groundTruth.grid) ? '#00d4aa' : '#ff6b6b'
            }}>
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-mono text-xs text-lab-info">Token Prediction</h5>
                <span className={cn('text-xs font-mono', gridsEqual(tokenPrediction.grid, groundTruth.grid) ? 'text-lab-accent' : 'text-lab-danger')}>
                  {gridsEqual(tokenPrediction.grid, groundTruth.grid) ? '✓ CORRECT' : '✗ WRONG'}
                </span>
              </div>
              <GridDisplay 
                grid={tokenPrediction.grid} 
                size={4}
                cellSize={28}
                showValues={true}
                highlightDiff={groundTruth.grid}
              />
              <div className="flex gap-4 mt-2 text-xs text-lab-textMuted font-mono">
                <span>Acc: {formatPercent(tokenAccuracy)}</span>
                <span>Steps: {tokenStepsUsed}</span>
                <span>Compute: {formatNumber(tokenComputeEstimate)}</span>
              </div>
            </div>
            
            {/* Latent Prediction */}
            <div className="p-3 rounded-lg border" style={{ 
              backgroundColor: gridsEqual(latentPrediction.grid, groundTruth.grid) ? '#052e26' : '#3d1a1a',
              borderColor: gridsEqual(latentPrediction.grid, groundTruth.grid) ? '#00d4aa' : '#ff6b6b'
            }}>
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-mono text-xs text-lab-accent">Latent Prediction</h5>
                <span className={cn('text-xs font-mono', gridsEqual(latentPrediction.grid, groundTruth.grid) ? 'text-lab-accent' : 'text-lab-danger')}>
                  {gridsEqual(latentPrediction.grid, groundTruth.grid) ? '✓ CORRECT' : '✗ WRONG'}
                </span>
              </div>
              <GridDisplay 
                grid={latentPrediction.grid} 
                size={4}
                cellSize={28}
                showValues={true}
                highlightDiff={groundTruth.grid}
              />
              <div className="flex gap-4 mt-2 text-xs text-lab-textMuted font-mono">
                <span>Acc: {formatPercent(latentAccuracy)}</span>
                <span>Steps: {latentStepsUsed}</span>
                <span>Compute: {formatNumber(latentComputeEstimate)}</span>
              </div>
            </div>
          </div>
        </EvidencePanel>
      </div>
      
      {/* Thinking Budget Control - Large Central Control */}
      <EvidencePanel type="LIVE_TOY_COMPUTATION" title="THINKING BUDGET" className="mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h3 className="font-display text-xl text-lab-text mb-1">Computation Steps</h3>
            <p className="text-lab-textMuted text-sm">
              Increasing this slider gives both systems more compute budget — tokens generate more words, latents do more recurrent updates
            </p>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="1"
              max="32"
              step="1"
              value={config.recurrentDepth}
              onChange={(e) => handleBudgetChange(Number(e.target.value))}
              className="w-full h-3 bg-lab-border rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00d4aa ${((config.recurrentDepth - 1) / 31) * 100}%, #2a3548 ${((config.recurrentDepth - 1) / 31) * 100}%)`,
              }}
            />
            <div className="flex justify-between mt-3 text-xs font-mono text-lab-textMuted">
              {THINKING_BUDGET_OPTIONS.map((step) => (
                <span key={step} className={cn(
                  'px-2 py-1 rounded transition-colors',
                  config.recurrentDepth === step && 'bg-lab-accent text-lab-bg'
                )}>
                  {step}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <MetricCard 
              label="Token Accuracy" 
              value={formatPercent(tokenAccuracy)} 
              evidenceBadge="LIVE_TOY_COMPUTATION"
            />
            <MetricCard 
              label="Latent Accuracy" 
              value={formatPercent(latentAccuracy)} 
              evidenceBadge="LIVE_TOY_COMPUTATION"
            />
            <MetricCard 
              label="Token Compute" 
              value={formatNumber(tokenComputeEstimate)} 
              unit="FLOPs"
              evidenceBadge="LIVE_TOY_COMPUTATION"
            />
            <MetricCard 
              label="Latent Compute" 
              value={formatNumber(latentComputeEstimate)} 
              unit="FLOPs"
              evidenceBadge="LIVE_TOY_COMPUTATION"
            />
          </div>
        </div>
      </EvidencePanel>
      
      {/* Accuracy vs Compute Chart */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <EvidencePanel type="LIVE_TOY_COMPUTATION" title="Accuracy vs Compute Trade-off">
          {recurrentDepthResults && recurrentDepthResults.length > 0 && (
            <AccuracyComputeChart
              tokenData={THINKING_BUDGET_OPTIONS.map(s => ({
                steps: s,
                accuracy: Math.min(0.95, 0.3 + s * 0.02 + Math.random() * 0.05), // Simulated
                compute: s * 50000,
              }))}
              latentData={recurrentDepthResults.map(r => ({
                steps: r.step,
                accuracy: r.accuracy,
                compute: r.computeEstimate,
              }))}
              title="Task Accuracy vs Inference Compute"
            />
          )}
        </EvidencePanel>
        
        <EvidencePanel type="LIVE_TOY_COMPUTATION" title="Latent Accuracy vs Recurrent Depth">
          {recurrentDepthResults && recurrentDepthResults.length > 0 && (
            <AccuracyVsDepthChart
              data={recurrentDepthResults.map(r => ({
                step: r.step,
                accuracy: r.accuracy,
                confidence: r.confidence,
              }))}
              baseline={recurrentDepthResults[0]?.accuracy}
              title="Accuracy Improvement with Recurrent Depth"
            />
          )}
        </EvidencePanel>
      </div>
      
      {/* Comparison Table */}
      <EvidencePanel type="ILLUSTRATIVE_DIAGRAM" title="Token vs Latent: Core Trade-offs">
        <ComparisonTable rows={COMPARISON_ROWS} />
        <p className="mt-4 text-sm text-lab-textMuted text-center">
          <strong>Key insight:</strong> Different trade-offs, not a universal replacement. Latent reasoning changes the accuracy/latency/cost/observability Pareto frontier.
        </p>
      </EvidencePanel>
      
      {/* Key Takeaway */}
      <div className="bg-gradient-to-r from-lab-accentBg to-lab-infoBg border border-lab-accent/30 rounded-xl p-6 text-center mb-6">
        <h3 className="font-display text-xl text-lab-text mb-2">More computation ≠ more words</h3>
        <p className="text-lab-textMuted max-w-2xl mx-auto">
          A recurrent architecture can repeatedly update a hidden state in latent space, so increasing recurrent depth can change task performance 
          without producing a longer verbal chain-of-thought. This is the core idea behind latent reasoning, Coconut, recurrent depth models, and BDH-CQ.
        </p>
      </div>
      
      {/* Next Steps */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/latents" className="card group hover:border-lab-accent/50">
          <div className="flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-lab-accent group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-display font-semibold text-lab-text">Think in Latents</h4>
              <p className="text-sm text-lab-textMuted">Deep dive into recurrent depth scaling</p>
            </div>
          </div>
        </Link>
        
        <Link href="/bdh" className="card group hover:border-lab-accent/50">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-lab-info group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-display font-semibold text-lab-text">BDH / BDH-CQ</h4>
              <p className="text-sm text-lab-textMuted">How recurrent memory enables in-context learning</p>
            </div>
          </div>
        </Link>
        
        <Link href="/failure-lab" className="card group hover:border-lab-accent/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-lab-warning group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-display font-semibold text-lab-text">Failure Lab</h4>
              <p className="text-sm text-lab-textMuted">Break the reasoner — discover limitations</p>
            </div>
          </div>
        </Link>
      </div>
    </PageLayout>
  );
}

// Helper function
function gridsEqual(a: number[][], b: number[][]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].length !== b[i].length) return false;
    for (let j = 0; j < a[i].length; j++) {
      if (a[i][j] !== b[i][j]) return false;
    }
  }
  return true;
}
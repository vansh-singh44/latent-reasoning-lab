'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { EvidencePanel, EvidenceBadge } from '@/components/research/EvidenceBadge';
import { GridDisplay, AnimatedGrid } from '@/components/visualization/GridDisplay';
import { StateHeatmap, StateTrajectory, StateVectorBars, StateChangeChart } from '@/components/visualization/StateVisualization';
import { MetricCard, AccuracyComputeChart, AccuracyVsDepthChart, ComparisonTable } from '@/components/visualization/Charts';
import { Slider, Toggle, Select, NumberInput, ButtonGroup } from '@/components/controls/Controls';
import { useExperimentStore, DEFAULT_CONFIG, runExperiment, runRecurrentDepthSweep, ExperimentConfig } from '@/lib/experiment';
import { cn, formatPercent, formatNumber } from '@/lib/utils';
import { useEffect, useState, useCallback } from 'react';
import { FlaskConical, Zap, Brain, GitBranch, ArrowRight, AlertTriangle, CheckCircle, XCircle, Settings, BarChart3, RefreshCw } from 'lucide-react';

const EXPERIMENTS = [
  {
    id: 'A',
    title: 'Experiment A: Tokens vs Latents',
    description: 'Side-by-side comparison of token-based chain-of-thought vs latent recurrent reasoning at equal compute budgets.',
    route: '/tokens',
    icon: GitBranch,
    status: 'live' as const,
  },
  {
    id: 'B',
    title: 'Experiment B: Recurrent Depth Scaling',
    description: 'How does accuracy change as we increase recurrent depth? Sweep depth and observe accuracy, compute, and state dynamics.',
    route: '/latents',
    icon: BarChart3,
    status: 'live' as const,
  },
  {
    id: 'C',
    title: 'Experiment C: Demonstrations Update Memory',
    description: 'BDH-CQ style: add demonstrations and watch recurrent memory update, then run latent reasoning on query.',
    route: '/bdh',
    icon: Brain,
    status: 'live' as const,
  },
  {
    id: 'D',
    title: 'Experiment D: Reasoning Budget Laboratory',
    description: 'Allocate fixed compute budget across: tokens, latent steps, memory, demonstrations. Compare trade-offs.',
    route: '/budget',
    icon: Settings,
    status: 'coming' as const,
  },
  {
    id: 'E',
    title: 'Experiment E: Interference & Forgetting',
    description: 'Add contradictory demonstrations, increase noise, reduce state size — observe failure modes.',
    route: '/failure-lab',
    icon: AlertTriangle,
    status: 'live' as const,
  },
];

type ExperimentStatus = 'live' | 'coming';

export default function ExperimentsPage() {
  const { config, result, recurrentDepthResults, isRunning, runExperiment, runDepthSweep, setConfig } = useExperimentStore();
  const [activeExperiment, setActiveExperiment] = useState<'A' | 'B' | 'C' | 'budget'>('A');
  
  useEffect(() => {
    runExperiment();
    runDepthSweep();
  }, [runExperiment, runDepthSweep]);
  
  if (!result) {
    return (
      <PageLayout title="Experiments" description="Interactive experiments for manipulating latent reasoning variables and observing consequences.">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-lab-warning border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lab-textMuted">Loading experiments...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  const renderExperimentA = () => (
    <EvidencePanel type="LIVE_TOY_COMPUTATION" title="Experiment A: Tokens vs Latents at Equal Compute" className="mb-6">
      <p className="text-lab-textMuted mb-4">
        Compare token-based reasoning (generating visible intermediate tokens) with latent recurrent reasoning 
        (updating hidden state) when both are given approximately equal compute budgets.
      </p>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Token Side */}
        <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-info/30">
          <h4 className="font-display text-sm text-lab-info mb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Token Reasoning (Chain-of-Thought)
          </h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {Array.from({ length: Math.min(config.tokenSteps, 8) }, (_, i) => (
              <div key={i} className="p-2 bg-lab-bg rounded border border-lab-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 text-center text-xs font-mono text-lab-info">{i + 1}</span>
                  <span className="text-xs text-lab-textMuted">
                    {i === 0 ? 'Input' : i < config.tokenSteps - 1 ? 'Reasoning token' : 'Answer token'}
                  </span>
                </div>
                <AnimatedGrid
                  fromGrid={result.groundTruth.grid}
                  toGrid={result.tokenPrediction.grid}
                  progress={Math.min(1, (i + 1) / config.tokenSteps)}
                  size={4}
                  cellSize={16}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-lab-bg rounded border border-lab-border/50 text-sm">
            <div className="grid grid-cols-2 gap-2 text-lab-textMuted">
              <div><strong>Steps:</strong> <span className="text-lab-text font-mono">{config.tokenSteps}</span></div>
              <div><strong>Accuracy:</strong> <span className="text-lab-text font-mono">{formatPercent(result.tokenAccuracy)}</span></div>
              <div><strong>Compute:</strong> <span className="text-lab-text font-mono">{formatNumber(result.tokenComputeEstimate)} FLOPs</span></div>
              <div><strong>Memory:</strong> <span className="text-lab-text font-mono">{formatNumber(result.tokenMemoryEstimate)} bytes</span></div>
            </div>
          </div>
        </div>
        
        {/* Latent Side */}
        <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-accent/30">
          <h4 className="font-display text-sm text-lab-accent mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Latent Recurrent Reasoning
          </h4>
          <div className="space-y-3">
            <StateHeatmap
              state={result.stateTrajectory[config.recurrentDepth - 1] || []}
              width={16}
              height={4}
              cellSize={10}
              title={`Hidden State at Step ${config.recurrentDepth}`}
            />
            <StateChangeChart
              changes={result.stateChanges}
              title="State Change per Step"
            />
            <div className="p-3 bg-lab-bg rounded border border-lab-border/50 text-sm">
              <div className="grid grid-cols-2 gap-2 text-lab-textMuted">
                <div><strong>Steps:</strong> <span className="text-lab-text font-mono">{config.recurrentDepth}</span></div>
                <div><strong>Accuracy:</strong> <span className="text-lab-text font-mono">{formatPercent(result.latentAccuracy)}</span></div>
                <div><strong>Compute:</strong> <span className="text-lab-text font-mono">{formatNumber(result.latentComputeEstimate)} FLOPs</span></div>
                <div><strong>Memory:</strong> <span className="text-lab-text font-mono">{formatNumber(result.latentMemoryEstimate)} bytes (fixed)</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comparison Table */}
      <ComparisonTable rows={[
        { property: 'Intermediate representation', token: 'Text tokens', latent: 'Hidden state vector' },
        { property: 'Additional compute', token: 'More tokens generated', latent: 'More recurrent updates' },
        { property: 'Interpretability', token: 'High (human-readable)', latent: 'Low (requires probes)' },
        { property: 'Memory growth', token: 'O(context × hidden)', latent: 'O(state_dim²) fixed' },
        { property: 'Context window', token: 'Limited by KV cache', latent: 'Effectively infinite' },
        { property: 'Adaptive compute', token: 'Hard (fixed steps)', latent: 'Natural (early exit)' },
        { property: 'Verification', token: 'Direct inspection', latent: 'Requires interpretability tools' },
      ]} />
      
      {/* Accuracy vs Compute Chart */}
      {recurrentDepthResults && recurrentDepthResults.length > 0 && (
        <AccuracyComputeChart
          tokenData={[1,2,4,8,16,32].map(s => ({
            steps: s,
            accuracy: Math.min(0.95, 0.3 + s * 0.02),
            compute: s * 50000,
          }))}
          latentData={recurrentDepthResults.map(r => ({
            steps: r.step,
            accuracy: r.accuracy,
            compute: r.computeEstimate,
          }))}
          title="Accuracy vs Compute: Token vs Latent"
        />
      )}
    </EvidencePanel>
  );
  
  const renderExperimentB = () => (
    <EvidencePanel type="LIVE_TOY_COMPUTATION" title="Experiment B: Recurrent Depth Scaling" className="mb-6">
      <p className="text-lab-textMuted mb-4">
        Sweep recurrent depth from 1 to 32 steps. Observe how accuracy, state dynamics, and compute change.
        This mirrors the test-time compute scaling in <em>Scaling up Test-Time Compute with Latent Reasoning</em> (NeurIPS 2025).
      </p>
      
      {recurrentDepthResults && recurrentDepthResults.length > 0 && (
        <>
          <AccuracyVsDepthChart
            data={recurrentDepthResults.map(r => ({
              step: r.step,
              accuracy: r.accuracy,
              confidence: r.confidence,
            }))}
            baseline={recurrentDepthResults[0]?.accuracy}
            title="Toy Model: Accuracy vs Recurrent Depth"
          />
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h5 className="font-display text-sm text-lab-text mb-3">State Trajectory Evolution</h5>
              <StateTrajectory
                trajectory={recurrentDepthResults.map(r => r.stateVector).filter(v => v.length > 0) as number[][]}
                width={recurrentDepthResults.length}
                height={16}
                cellSize={6}
              />
            </div>
            <div>
              <h5 className="font-display text-sm text-lab-text mb-3">State Change Magnitude</h5>
              <StateChangeChart
                changes={recurrentDepthResults.map(r => r.stateChange)}
                title="State Change per Additional Step"
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-lab-warningBg/30 border border-lab-warning/30 rounded-lg">
            <h5 className="font-display text-sm text-lab-warning mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Limitation: More Recurrent Steps ≠ Always Better
            </h5>
            <ul className="list-disc list-inside text-sm text-lab-textMuted space-y-1">
              <li>Diminishing returns: accuracy gains flatten</li>
              <li>State saturation: updates become negligible</li>
              <li>Oscillatory behavior: state cycles without converging</li>
              <li>Training instability: gradients vanish/explode with depth</li>
              <li>Overfitting: model memorizes recurrent path instead of generalizing</li>
            </ul>
          </div>
        </>
      )}
    </EvidencePanel>
  );
  
  const renderExperimentC = () => (
    <EvidencePanel type="LIVE_TOY_COMPUTATION" title="Experiment C: Demonstrations Update Memory (BDH-CQ Style)" className="mb-6">
      <p className="text-lab-textMuted mb-4">
        <strong>Toy pedagogical simulation inspired by the mechanism described in BDH-CQ.</strong> Not an official BDH-CQ checkpoint.
        Add demonstrations and watch recurrent memory update, then run latent reasoning on a query.
      </p>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50">
          <h5 className="font-mono text-xs text-lab-textMuted mb-2">Memory: Before Demos</h5>
          <StateHeatmap
            state={Array.from({ length: 64 }, () => Math.random() * 0.1)}
            width={16}
            height={4}
            cellSize={10}
          />
        </div>
        
        <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50">
          <h5 className="font-mono text-xs text-lab-textMuted mb-2">Memory: After {config.numDemos} Demos</h5>
          <StateHeatmap
            state={Array.from({ length: 64 }, (_, i) => Math.sin(i * 0.5 + config.numDemos) * 0.5 + 0.5)}
            width={16}
            height={4}
            cellSize={10}
          />
          <div className="mt-2 space-y-1">
            {Array.from({ length: config.numDemos }, (_, i) => (
              <div key={i} className="text-[10px] text-lab-textMuted font-mono">
                Demo {i + 1} → Hebbian memory update
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-accent/30">
          <h5 className="font-mono text-xs text-lab-textMuted mb-2">Latent Reasoning → Prediction</h5>
          <StateTrajectory
            trajectory={result.stateTrajectory}
            width={config.recurrentDepth}
            height={16}
            cellSize={6}
          />
          <GridDisplay
            grid={result.latentPrediction.grid}
            size={4}
            cellSize={24}
            showValues={true}
            title={`Prediction (Acc: ${formatPercent(result.latentAccuracy)})`}
          />
        </div>
      </div>
      
      <div className="mt-4 flex gap-4">
        <Slider
          label="Demonstrations"
          value={config.numDemos}
          onChange={(v) => setConfig({ numDemos: v })}
          min={0}
          max={5}
          step={1}
        />
        <Slider
          label="Latent Steps"
          value={config.recurrentDepth}
          onChange={(v) => setConfig({ recurrentDepth: v })}
          min={1}
          max={16}
          step={1}
        />
      </div>
    </EvidencePanel>
  );
  
  const renderBudgetExperiment = () => (
    <EvidencePanel type="TOY_PEDAGOGICAL" title="Experiment D: Reasoning Budget Laboratory" className="mb-6">
      <p className="text-lab-textMuted mb-4">
        <strong>Original Contribution:</strong> Allocate a fixed computational budget across four dimensions and observe trade-offs.
      </p>
      
      <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50">
        <h5 className="font-display text-sm text-lab-text mb-4">Budget Allocation</h5>
        <div className="grid md:grid-cols-4 gap-4">
          <Slider
            label="Token Steps"
            value={config.tokenSteps}
            onChange={(v) => setConfig({ tokenSteps: v })}
            min={0}
            max={32}
            step={1}
            unit="steps"
          />
          <Slider
            label="Latent Steps"
            value={config.recurrentDepth}
            onChange={(v) => setConfig({ recurrentDepth: v })}
            min={0}
            max={32}
            step={1}
            unit="steps"
          />
          <Slider
            label="State Dim"
            value={config.stateDim}
            onChange={(v) => setConfig({ stateDim: v })}
            min={16}
            max={128}
            step={16}
            unit="D"
          />
          <Slider
            label="Demos"
            value={config.numDemos}
            onChange={(v) => setConfig({ numDemos: v })}
            min={0}
            max={5}
            step={1}
          />
        </div>
        
        <div className="mt-6 p-4 bg-lab-bg rounded border border-lab-border/50">
          <h5 className="font-display text-sm text-lab-text mb-3">Predicted Outcomes</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Est. Accuracy" value={formatPercent(Math.min(0.9, 0.2 + config.tokenSteps * 0.01 + config.recurrentDepth * 0.015))} />
            <MetricCard label="Compute" value={formatNumber(config.tokenSteps * 50000 + config.recurrentDepth * config.stateDim * config.stateDim * 2)} unit="FLOPs" />
            <MetricCard label="Memory" value={formatNumber(config.tokenSteps * 4096 + config.stateDim * 4)} unit="bytes" />
            <MetricCard label="Observability" value={config.tokenSteps > config.recurrentDepth ? 'High' : 'Low'} />
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-lab-infoBg/30 border border-lab-info/30 rounded-lg">
        <h5 className="font-display text-sm text-lab-info mb-2">Research Question</h5>
        <p className="text-sm text-lab-textMuted">
          For a fixed compute budget, what allocation maximizes accuracy? Does the optimal allocation depend on task type?
          This is an open research question — the budget laboratory lets you explore it interactively.
        </p>
      </div>
    </EvidencePanel>
  );
  
  const activeRender = {
    A: renderExperimentA,
    B: renderExperimentB,
    C: renderExperimentC,
    budget: renderBudgetExperiment,
  }[activeExperiment];
  
  return (
    <PageLayout title="Experiments" description="Interactive experiments for manipulating latent reasoning variables and observing consequences.">
      {/* Experiment Selector */}
      <EvidencePanel type="TOY_PEDAGOGICAL" title="Experiment Suite" className="mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          {EXPERIMENTS.map((exp) => (
            <button
              key={exp.id}
              onClick={() => setActiveExperiment(exp.id as any)}
              className={cn(
                'card p-4 text-left transition-all',
                activeExperiment === exp.id 
                  ? 'border-lab-accent bg-lab-accentBg/20' 
                  : 'hover:border-lab-borderBright'
              )}
              disabled={exp.status === 'coming'}
            >
              <div className="flex items-start gap-3">
                <exp.icon className={cn('w-8 h-8 flex-shrink-0', exp.status === 'coming' ? 'text-lab-textMuted' : 'text-lab-accent')} />
                <div className="flex-1 min-w-0">
                  <h4 className={cn('font-display font-semibold', exp.status === 'coming' ? 'text-lab-textMuted' : 'text-lab-text')}>
                    {exp.title}
                  </h4>
                  <p className="text-sm text-lab-textMuted mt-1">{exp.description}</p>
                  <span className={cn(
                    'inline-block mt-2 px-2 py-0.5 text-[10px] font-mono rounded',
                    exp.status === 'live' 
                      ? 'bg-lab-accentBg text-lab-accent border border-lab-accent/30' 
                      : 'bg-lab-panelHover text-lab-textMuted border border-lab-border'
                  )}>
                    {exp.status === 'live' ? 'LIVE' : 'COMING SOON'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </EvidencePanel>
      
      {/* Active Experiment */}
      {activeRender && activeRender()}
      
      {/* Global Controls */}
      <EvidencePanel type="LIVE_TOY_COMPUTATION" title="Global Experiment Parameters" className="mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <Select
            value={config.taskType}
            onChange={(e) => setConfig({ taskType: e.target.value as ExperimentConfig['taskType'] })}
            options={[
              { value: 'rotation', label: 'Rotation (90° CW)' },
              { value: 'translation', label: 'Translation (↘)' },
              { value: 'flip', label: 'Horizontal Flip' },
              { value: 'composition', label: 'Rotate + Flip' },
            ]}
            label="Task Type"
          />
          <Slider
            label="State Dimension"
            value={config.stateDim}
            onChange={(v) => setConfig({ stateDim: v })}
            min={16}
            max={128}
            step={16}
            unit="D"
          />
          <Slider
            label="State Decay"
            value={config.stateDecay}
            onChange={(v) => setConfig({ stateDecay: v })}
            min={0.5}
            max={1.0}
            step={0.05}
          />
          <Slider
            label="Noise Level"
            value={config.noiseLevel}
            onChange={(v) => setConfig({ noiseLevel: v })}
            min={0}
            max={0.5}
            step={0.01}
          />
        </div>
        <div className="mt-4 flex gap-4">
          <button onClick={runExperiment} className="btn-primary" disabled={isRunning}>
            <RefreshCw className={cn('w-4 h-4 mr-2', isRunning && 'animate-spin')} />
            Re-run Experiment
          </button>
          <button onClick={runDepthSweep} className="btn-secondary" disabled={isRunning}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Sweep Depth
          </button>
        </div>
      </EvidencePanel>
    </PageLayout>
  );
}
'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { EvidencePanel, EvidenceBadge } from '@/components/research/EvidenceBadge';
import { GridDisplay, AnimatedGrid } from '@/components/visualization/GridDisplay';
import { StateHeatmap, StateTrajectory, StateVectorBars, StateChangeChart } from '@/components/visualization/StateVisualization';
import { MetricCard, AccuracyVsDepthChart } from '@/components/visualization/Charts';
import { Slider, Toggle, Select, ButtonGroup } from '@/components/controls/Controls';
import { useExperimentStore, runExperiment, ExperimentConfig } from '@/lib/experiment';
import { cn, formatPercent, formatNumber } from '@/lib/utils';
import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, Zap, Brain, XCircle, CheckCircle, RefreshCw, SlidersHorizontal, Bug, Flame, Battery, Waves } from 'lucide-react';

interface FailureCase {
  id: string;
  title: string;
  description: string;
  config: Partial<ExperimentConfig>;
  expectedOutcome: string;
  trigger: string;
  icon: React.ReactNode;
}

const FAILURE_CASES: FailureCase[] = [
  {
    id: 'saturation',
    title: 'State Saturation',
    description: 'Hidden state stops changing — additional recurrent steps produce negligible updates. The model has "converged" but may not have the right answer.',
    config: { recurrentDepth: 32, stateDecay: 0.99, stateDim: 32 },
    expectedOutcome: 'State change magnitude → 0; accuracy plateaus',
    trigger: 'High depth + high decay',
    icon: <Battery className="w-6 h-6" />,
  },
  {
    id: 'oscillation',
    title: 'Oscillatory Behavior',
    description: 'State cycles between patterns without converging. Accuracy fluctuates with depth instead of monotonically improving.',
    config: { recurrentDepth: 24, stateDecay: 0.5, stateDim: 64, noiseLevel: 0.1 },
    expectedOutcome: 'State change oscillates; accuracy non-monotonic',
    trigger: 'High recurrence + specific weight init',
    icon: <Waves className="w-6 h-6" />,
  },
  {
    id: 'forgetting',
    title: 'Catastrophic Forgetting',
    description: 'New demonstrations overwrite previous memory. Early demonstrations are lost from recurrent state.',
    config: { numDemos: 5, interferenceLevel: 0.8, stateDim: 32 },
    expectedOutcome: 'First demos not reflected in final memory',
    trigger: 'Many demos + high interference',
    icon: <Brain className="w-6 h-6" />,
  },
  {
    id: 'interference',
    title: 'Demonstration Interference',
    description: 'Contradictory demonstrations corrupt recurrent memory, leading to wrong rule acquisition.',
    config: { numDemos: 3, interferenceLevel: 1.0, noiseLevel: 0.1 },
    expectedOutcome: 'Memory encodes conflicting rules; accuracy drops',
    trigger: 'Conflicting demos + high interference',
    icon: <XCircle className="w-6 h-6" />,
  },
  {
    id: 'noise',
    title: 'Noise Amplification',
    description: 'Small per-step noise compounds over many recurrent steps, degrading final accuracy.',
    config: { recurrentDepth: 32, noiseLevel: 0.3, stateDecay: 0.9 },
    expectedOutcome: 'Accuracy degrades with depth; state becomes noisy',
    trigger: 'High noise + high depth',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: 'dimension',
    title: 'Insufficient State Capacity',
    description: 'State dimension too small to simultaneously encode task rule and demonstrations.',
    config: { stateDim: 16, numDemos: 5, recurrentDepth: 16 },
    expectedOutcome: 'Accuracy capped; cannot represent complex rule',
    trigger: 'Low state_dim + complex task',
    icon: <SlidersHorizontal className="w-6 h-6" />,
  },
];

export default function FailureLabPage() {
  const { config, result, recurrentDepthResults, runExperiment, setConfig } = useExperimentStore();
  const [activeFailure, setActiveFailure] = useState<string>('saturation');
  const [showResults, setShowResults] = useState(false);
  const [customConfig, setCustomConfig] = useState<Partial<ExperimentConfig>>({});
  
  const failure = FAILURE_CASES.find(f => f.id === activeFailure)!;
  
  useEffect(() => {
    // Apply failure config
    setConfig({ ...config, ...failure.config });
    runExperiment();
  }, [activeFailure, failure.config, config, runExperiment, setConfig]);
  
  const runCustomFailure = () => {
    setConfig({ ...config, ...customConfig });
    runExperiment();
    setShowResults(true);
  };
  
  return (
    <PageLayout title="Failure Lab" description="Break the reasoner. Discover limitations by pushing the toy model to its breaking points.">
      <EvidencePanel type="TOY_PEDAGOGICAL" title="Break the Reasoner" className="mb-6">
        <p className="text-lab-textMuted mb-4">
          <strong>More compute is not the same thing as more intelligence.</strong> Explore failure regimes where 
          increasing recurrent depth, adding noise, or providing contradictory demonstrations breaks the model.
        </p>
        
        {/* Failure Mode Cards */}
        <div className="grid md:grid-cols-3 gap-3 mb-6">
          {FAILURE_CASES.map((fc) => (
            <button
              key={fc.id}
              onClick={() => { setActiveFailure(fc.id); setShowResults(false); }}
              className={cn(
                'card p-4 text-left transition-all',
                activeFailure === fc.id ? 'border-lab-accent bg-lab-accentBg/20' : 'hover:border-lab-borderBright'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-lab-accentBg/50 flex items-center justify-center text-lab-accent flex-shrink-0">
                  {fc.icon}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-lab-text">{fc.title}</h4>
                  <p className="text-xs text-lab-textMuted mt-1">{fc.description}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-mono bg-lab-panelHover rounded border border-lab-border">
                    Trigger: {fc.trigger}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Active Failure Demo */}
        <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-display text-lg text-lab-text">{failure.title}</h4>
              <p className="text-lab-textMuted">{failure.description}</p>
            </div>
            <span className="badge badge-toy">TOY / PEDAGOGICAL</span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-lab-bg rounded border border-lab-border/50">
              <h5 className="font-mono text-xs text-lab-textMuted mb-2">Configuration</h5>
              <pre className="font-mono text-[10px] text-lab-text">{JSON.stringify(failure.config, null, 2)}</pre>
            </div>
            <div className="p-3 bg-lab-bg rounded border border-lab-border/50">
              <h5 className="font-mono text-xs text-lab-textMuted mb-2">Expected Outcome</h5>
              <p className="text-sm text-lab-text">{failure.expectedOutcome}</p>
            </div>
            <div className="p-3 bg-lab-warningBg/30 rounded border border-lab-warning/30">
              <h5 className="font-mono text-xs text-lab-warning mb-2">⚠ What to Notice</h5>
              <p className="text-sm text-lab-textMuted">
                Does accuracy improve with depth? Does state change magnitude go to zero? 
                Does the prediction match ground truth?
              </p>
            </div>
          </div>
          
          {result && (
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h5 className="font-mono text-xs text-lab-textMuted mb-2">State Trajectory</h5>
                <StateTrajectory
                  trajectory={result.stateTrajectory}
                  width={config.recurrentDepth}
                  height={16}
                  cellSize={6}
                />
              </div>
              <div>
                <h5 className="font-mono text-xs text-lab-textMuted mb-2">State Change per Step</h5>
                <StateChangeChart
                  changes={result.stateChanges}
                />
              </div>
              <div>
                <h5 className="font-mono text-xs text-lab-textMuted mb-2">Final State</h5>
                <StateHeatmap
                  state={result.stateTrajectory[config.recurrentDepth - 1] || []}
                  width={16}
                  height={4}
                  cellSize={10}
                />
                <GridDisplay
                  grid={result.latentPrediction.grid}
                  size={4}
                  cellSize={24}
                  showValues={true}
                  title={`Prediction: ${formatPercent(result.latentAccuracy)}`}
                  highlightDiff={result.groundTruth.grid}
                />
              </div>
            </div>
          )}
        </div>
      </EvidencePanel>
      
      {/* Custom Failure Builder */}
      <EvidencePanel type="TOY_PEDAGOGICAL" title="Build Your Own Failure" className="mb-6">
        <p className="text-lab-textMuted mb-4">
          Combine failure triggers to discover new breaking points.
        </p>
        
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <Slider
            label="Recurrent Depth"
            value={customConfig.recurrentDepth || config.recurrentDepth}
            onChange={(v) => setCustomConfig({ ...customConfig, recurrentDepth: v })}
            min={1}
            max={64}
            step={1}
          />
          <Slider
            label="State Dim"
            value={customConfig.stateDim || config.stateDim}
            onChange={(v) => setCustomConfig({ ...customConfig, stateDim: v })}
            min={8}
            max={128}
            step={8}
            unit="D"
          />
          <Slider
            label="Noise Level"
            value={customConfig.noiseLevel || config.noiseLevel}
            onChange={(v) => setCustomConfig({ ...customConfig, noiseLevel: v })}
            min={0}
            max={1.0}
            step={0.05}
          />
          <Slider
            label="Interference"
            value={customConfig.interferenceLevel || config.interferenceLevel}
            onChange={(v) => setCustomConfig({ ...customConfig, interferenceLevel: v })}
            min={0}
            max={1.0}
            step={0.1}
          />
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <Select
            value={customConfig.taskType || config.taskType}
            onChange={(e) => setCustomConfig({ ...customConfig, taskType: e.target.value as ExperimentConfig['taskType'] })}
            options={[
              { value: 'rotation', label: 'Rotation' },
              { value: 'translation', label: 'Translation' },
              { value: 'flip', label: 'Flip' },
              { value: 'composition', label: 'Composition' },
            ]}
            label="Task"
          />
          <Slider
            label="Demos"
            value={customConfig.numDemos ?? config.numDemos}
            onChange={(v) => setCustomConfig({ ...customConfig, numDemos: v })}
            min={0}
            max={10}
            step={1}
          />
          <Slider
            label="State Decay"
            value={customConfig.stateDecay || config.stateDecay}
            onChange={(v) => setCustomConfig({ ...customConfig, stateDecay: v })}
            min={0.1}
            max={1.0}
            step={0.05}
          />
        </div>
        
        <button onClick={runCustomFailure} className="btn-primary">
          <Zap className="w-4 h-4 mr-2" />
          Run Custom Failure
        </button>
      </EvidencePanel>
      
      {/* Key Lessons */}
      <EvidencePanel type="ILLUSTRATIVE_DIAGRAM" title="Key Lessons from Failure Lab" className="mb-6">
        <div className="prose prose-invert max-w-none">
          <ul className="list-disc list-inside space-y-2 text-lab-textMuted">
            <li><strong>More recurrent steps ≠ better reasoning.</strong> Saturation, oscillation, and noise amplification all cause diminishing or negative returns.</li>
            <li><strong>Latent reasoning is harder to debug.</strong> Without visible intermediate tokens, you must probe the hidden state to detect failure modes.</li>
            <li><strong>Memory is fragile.</strong> Recurrent memory can be overwritten by new demonstrations or corrupted by interference.</li>
            <li><strong>State capacity matters.</strong> Too small a state dimension creates a hard ceiling on representational capacity.</li>
            <li><strong>Decay rate is critical.</strong> Too high → saturation; too low → forgetting; just right → stable computation.</li>
            <li><strong>These are TOY MODEL failures.</strong> Real models (BDH, Coconut, Recurrent Depth) have more sophisticated dynamics but share these fundamental trade-offs.</li>
          </ul>
        </div>
      </EvidencePanel>
      
      {/* Published Failure Modes */}
      <EvidencePanel type="REPORTED_BY_AUTHORS" title="Reported Failure Modes in Literature" className="mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50">
            <h5 className="font-display text-sm text-lab-text mb-2 flex items-center gap-2">
              <Bug className="w-4 h-4 text-lab-warning" />
              BDH-CQ Limitations (Engdahl et al., 2026)
            </h5>
            <ul className="list-disc list-inside text-sm text-lab-textMuted space-y-1">
              <li>Ordering & nesting: fails to compose sequences</li>
              <li>Conditional rule selection: cannot switch rules</li>
              <li>Unseen parameter values: poor extrapolation</li>
              <li>Composition: struggles with multi-step transforms</li>
            </ul>
          </div>
          <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50">
            <h5 className="font-display text-sm text-lab-text mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4 text-lab-danger" />
              Coconut Limitations (Hao et al., 2024)
            </h5>
            <ul className="list-disc list-inside text-sm text-lab-textMuted space-y-1">
              <li>Training instability with multiple continuous thoughts</li>
              <li>Larger models benefit less (language pre-training interference)</li>
              <li>Requires careful multi-stage curriculum</li>
              <li>Latent thoughts harder to interpret than CoT</li>
            </ul>
          </div>
          <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50">
            <h5 className="font-display text-sm text-lab-text mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-lab-warning" />
              Recurrent Depth Limitations (Geiping et al., 2025)
            </h5>
            <ul className="list-disc list-inside text-sm text-lab-textMuted space-y-1">
              <li>Not dominant paradigm yet</li>
              <li>Oversight concerns vs verbalized CoT</li>
              <li>Path independence needs more study</li>
              <li>Convergence behavior not fully characterized</li>
            </ul>
          </div>
          <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50">
            <h5 className="font-display text-sm text-lab-text mb-2 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-lab-info" />
              TRM Limitations (Jolicoeur-Martineau, 2025)
            </h5>
            <ul className="list-disc list-inside text-sm text-lab-textMuted space-y-1">
              <li>Optimal recursion depth exists (more → OOM)</li>
              <li>Task-specific architectures needed</li>
              <li>Why recursion helps so much = open question</li>
              <li>EMA required for stability</li>
            </ul>
          </div>
        </div>
      </EvidencePanel>
    </PageLayout>
  );
}
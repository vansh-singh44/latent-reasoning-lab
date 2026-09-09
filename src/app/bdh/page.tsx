'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { EvidencePanel, EvidenceBadge } from '@/components/research/EvidenceBadge';
import { StateHeatmap, StateTrajectory, StateVectorBars, StateChangeChart } from '@/components/visualization/StateVisualization';
import { GridDisplay } from '@/components/visualization/GridDisplay';
import { MetricCard, ComparisonTable } from '@/components/visualization/Charts';
import { Slider, Toggle, Select, NumberInput, ButtonGroup } from '@/components/controls/Controls';
import { useExperimentStore, DEFAULT_CONFIG, runExperiment, ExperimentConfig } from '@/lib/experiment';
import { cn, formatPercent, formatNumber } from '@/lib/utils';
import { useEffect, useState, useCallback } from 'react';
import { Brain, Zap, GitBranch, ArrowRight, RefreshCw, AlertTriangle, Layers, Link as LinkIcon, Hexagon, Network } from 'lucide-react';

const BDH_COMPARISON_ROWS = [
  { property: 'Memory architecture', token: 'KV Cache (growing)', latent: 'Fixed synaptic state' },
  { property: 'Computation', token: 'Dense attention', latent: 'Sparse local interactions' },
  { property: 'Activations', token: 'Dense, signed', latent: 'Sparse, positive (ReLU)' },
  { property: 'Memory update', token: 'Append to cache', latent: 'Hebbian synaptic update' },
  { property: 'Context length', token: 'Hard limit', latent: 'Information capacity' },
  { property: 'Interpretability', token: 'Attention maps', latent: 'Synapse/neuron graphs' },
  { property: 'Parallelism', token: 'Token-level', latent: 'Neuron-level' },
  { property: 'Scaling', token: 'Quadratic attention', latent: 'Linear (low-rank)' },
];

const BDH_CQ_FLOW = [
  { stage: 'DEMONSTRATIONS', description: 'Input-output pairs presented at inference time', icon: GitBranch },
  { stage: 'RECURRENT MEMORY', description: 'Each demo updates recurrent synaptic state', icon: Network },
  { stage: 'QUERY', description: 'New input to be transformed', icon: Hexagon },
  { stage: 'LATENT REASONING', description: 'Iterative computation in hidden state (no tokens)', icon: Brain },
  { stage: 'ANSWER', description: 'Decoded prediction from final state', icon: Zap },
];

export default function BDHPage() {
  const { config, result, recurrentDepthResults, isRunning, runExperiment, runDepthSweep, setConfig } = useExperimentStore();
  const [equationLevel, setEquationLevel] = useState(1);
  
  useEffect(() => {
    runExperiment();
    runDepthSweep();
  }, [runExperiment, runDepthSweep]);
  
  if (!result) {
    return (
      <PageLayout title="BDH / BDH-CQ" description="Dragon Hatchling architecture: from attention to synapses, and BDH-CQ for in-context learning with recurrent latent reasoning.">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-lab-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lab-textMuted">Loading BDH module...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="BDH / BDH-CQ" description="Dragon Hatchling architecture: from attention to synapses, and BDH-CQ for in-context learning with recurrent latent reasoning.">
      {/* Introduction */}
      <EvidencePanel type="TOY_PEDAGOGICAL" title="Where Does BDH Fit?" className="mb-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-lab-textMuted mb-4">
            After understanding <strong>latent recurrent reasoning</strong>, we now see how BDH reorganizes the entire Transformer computation 
            into a brain-inspired architecture where <strong>attention emerges from local neuron-synapse interactions</strong>.
          </p>
          <div className="bg-lab-panel/50 rounded-lg p-4 border border-lab-border/50">
            <h4 className="font-display text-lg text-lab-text mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lab-accent" />
              Core Distinction
            </h4>
            <p className="text-lab-textMuted">
              <strong>"BDH is not simply 'a Transformer with fewer tokens.' Its computational organization is different."</strong> 
              Instead of a growing KV cache, BDH has a fixed-size synaptic state. Instead of dense global attention, 
              BDH uses sparse local message passing. The "Equations of Reasoning" show how attention formally converges 
              to closed-form local graph dynamics at neurons and synapses.
            </p>
          </div>
        </div>
      </EvidencePanel>
      
      {/* BDH Architecture Overview */}
      <EvidencePanel type="ILLUSTRATIVE_DIAGRAM" title="BDH Architecture: From Attention to Synapses" className="mb-6">
        <div className="space-y-6">
          {/* Transformer View */}
          <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-info/30">
            <h4 className="font-display text-sm text-lab-info mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Transformer View (Standard)
            </h4>
            <div className="space-y-2 text-sm text-lab-textMuted font-mono">
              <div className="flex items-center gap-2">
                <span className="w-24 text-lab-text">Tokens</span>
                <ArrowRight className="w-4 h-4 text-lab-border" />
                <span className="w-24 text-lab-text">Queries/Keys/Values</span>
                <ArrowRight className="w-4 h-4 text-lab-border" />
                <span className="w-24 text-lab-text">Attention</span>
                <ArrowRight className="w-4 h-4 text-lab-border" />
                <span className="w-24 text-lab-text">Growing KV Cache</span>
              </div>
              <div className="ml-10 text-[11px]">
                • Dense computation • Global attention • Context window limited • Static weights
              </div>
            </div>
          </div>
          
          {/* Arrow */}
          <div className="text-center">
            <ArrowRight className="w-8 h-8 text-lab-accent mx-auto" />
            <p className="text-xs text-lab-textMuted mt-1">Derivation from attention equations</p>
          </div>
          
          {/* BDH View */}
          <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-accent/30">
            <h4 className="font-display text-sm text-lab-accent mb-3 flex items-center gap-2">
              <Network className="w-4 h-4" />
              BDH View (Brain-Inspired)
            </h4>
            <div className="space-y-2 text-sm text-lab-textMuted font-mono">
              <div className="flex items-center gap-2">
                <span className="w-24 text-lab-text">Neurons</span>
                <ArrowRight className="w-4 h-4 text-lab-border" />
                <span className="w-24 text-lab-text">Synapses</span>
                <ArrowRight className="w-4 h-4 text-lab-border" />
                <span className="w-24 text-lab-text">Local Message Passing</span>
                <ArrowRight className="w-4 h-4 text-lab-border" />
                <span className="w-24 text-lab-text">Fixed Synaptic State</span>
              </div>
              <div className="ml-10 text-[11px]">
                • Sparse positive activations • Local computation • Hebbian updates • GPU-friendly (BDH-GPU)
              </div>
            </div>
          </div>
        </div>
      </EvidencePanel>
      
      {/* BDH vs Transformer Comparison */}
      <EvidencePanel type="ILLUSTRATIVE_DIAGRAM" title="BDH vs Transformer: Scientific Comparison" className="mb-6">
        <ComparisonTable rows={BDH_COMPARISON_ROWS} />
        <p className="mt-4 text-sm text-lab-textMuted text-center">
          Source: <em>The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain</em> (Kosowski et al., 2025) 
          and Pathway BDH Explainer Chapter 2.
        </p>
      </EvidencePanel>
      
      {/* BDH Equation Explorer */}
      <EvidencePanel type="ILLUSTRATIVE_DIAGRAM" title="BDH Equation Explorer" className="mb-6">
        <div className="space-y-4">
          {/* Level Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-lab-textMuted">Mathematical Depth:</span>
            <ButtonGroup 
              value={String(equationLevel)} 
              onChange={(v) => setEquationLevel(Number(v))}
              options={[
                { value: '1', label: 'Level 1: Intuition' },
                { value: '2', label: 'Level 2: Simple Math' },
                { value: '3', label: 'Level 3: BDH Equations' },
                { value: '4', label: 'Level 4: Full Formalism' },
              ]}
            />
          </div>
          
          {/* Level 1: Intuition */}
          {equationLevel >= 1 && (
            <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50 animate-in">
              <h5 className="font-display text-sm text-lab-text mb-2">Level 1: Intuition</h5>
              <p className="text-lab-textMuted">
                "Activity flows through connections." In BDH, neurons are computational units and synapses are connections 
                that carry both memory and computation. When neuron A activates neuron B, their synapse strengthens 
                (Hebbian: "fire together, wire together"). This local rule, applied across a scale-free network, 
                produces global attention-like behavior without any central attention mechanism.
              </p>
            </div>
          )}
          
          {/* Level 2: Simple Math */}
          {equationLevel >= 2 && (
            <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50 animate-in">
              <h5 className="font-display text-sm text-lab-text mb-2">Level 2: Simple Mathematical Representation</h5>
              <div className="font-mono text-sm bg-lab-bg p-3 rounded border border-lab-border/50 overflow-x-auto">
                {`state_next = update(state, input, memory)

Where:
  state    ∈ ℝⁿ      // Neuron activations (sparse, positive)
  input    ∈ ℝᵐ      // Current token embedding
  memory   ∈ ℝⁿˣⁿ   // Synaptic matrix (fixed-size)

update(s, x, M) = ReLU( decay·s + M·x + W_rec·s )

  W_rec  ∈ ℝⁿˣⁿ   // Recurrent weights
  decay  ∈ (0,1]  // State retention`}
              </div>
            </div>
          )}
          
          {/* Level 3: BDH Equations */}
          {equationLevel >= 3 && (
            <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50 animate-in">
              <h5 className="font-display text-sm text-lab-text mb-2">Level 3: Simplified BDH Equations (from Pathway Explainer Ch.2)</h5>
              <div className="space-y-3 text-sm">
                <div className="font-mono bg-lab-bg p-3 rounded border border-lab-border/50 overflow-x-auto">
                  {`// Synaptic state (Hebbian memory)
ρ_{t,l} = Σ_{τ<t} v*_{τ,l-1} x_{τ,l}ᵀ U^{t-τ}

// Neuron activations (sparse, positive)
a_{t,l} = ReLU( D_x (ρ_{t,l} q_{t,l}) + b )

// Low-rank communication
v*_{t,l} = E a_{t,l}
q_{t,l} = F a_{t,l}`}
                </div>
                <div className="grid md:grid-cols-3 gap-2 text-xs text-lab-textMuted">
                  <div><strong>ρ</strong> = synaptic state (attention state)</div>
                  <div><strong>a</strong> = neuron activations</div>
                  <div><strong>v*, q</strong> = value/query projections</div>
                  <div><strong>U</strong> = decay matrix</div>
                  <div><strong>D_x, E, F</strong> = low-rank factors</div>
                  <div><strong>ReLU</strong> = sparse positive activation</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Level 4: Full Formalism */}
          {equationLevel >= 4 && (
            <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50 animate-in">
              <h5 className="font-display text-sm text-lab-text mb-2">Level 4: Full Formalism (from BDH Paper)</h5>
              <p className="text-lab-textMuted text-sm mb-3">
                The complete BDH architecture is defined by the local graph dynamics in Table 1 of the paper, 
                with the vector-tensor form given by Equation (6). The GPU-friendly formulation (BDH-GPU) 
                uses ReLU-lowrank transformations with linear attention.
              </p>
              <div className="font-mono text-xs bg-lab-bg p-3 rounded border border-lab-border/50 overflow-x-auto text-lab-textMuted">
                {`See: The Dragon Hatchling (arXiv:2509.26507) 
- Section 2: BDH as local distributed graph dynamics (Table 1)
- Section 3: BDH-GPU tensor-friendly formulation (Eq. 4-6)
- Section 3.4: Equivalence BDH-GPU ≡ BDH (Eq. 9)
- Appendix E: Complete code listing`}
              </div>
              <a 
                href="https://arxiv.org/abs/2509.26507" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary text-sm mt-3 inline-flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                Read Full Paper on arXiv
              </a>
            </div>
          )}
        </div>
      </EvidencePanel>
      
      {/* BDH-CQ Module */}
      <EvidencePanel type="TOY_PEDAGOGICAL" title="BDH-CQ: In-Context Learning with Recurrent Latent Reasoning" className="mb-6">
        <div className="space-y-6">
          <div className="prose prose-invert max-w-none">
            <h4 className="font-display text-lg text-lab-text mb-3">BDH-CQ Pipeline</h4>
            <p className="text-lab-textMuted">
              BDH-CQ combines <strong>in-context learning</strong> with <strong>recurrent latent reasoning</strong>. 
              Demonstrations sequentially update recurrent memory; the query is then solved through iterative 
              latent computation without verbalizing intermediate reasoning.
            </p>
          </div>
          
          {/* Visual Pipeline */}
          <div className="flex flex-col md:flex-row items-center gap-4 flex-wrap">
            {BDH_CQ_FLOW.map((step, i) => (
              <div key={step.stage} className="flex flex-col items-center md:flex-row gap-3 p-3 bg-lab-panel/50 rounded-lg border border-lab-border/50 min-w-[200px]">
                <step.icon className="w-6 h-6 text-lab-accent" />
                <div className="text-center md:text-left">
                  <div className="font-display text-sm text-lab-text">{step.stage}</div>
                  <div className="text-xs text-lab-textMuted">{step.description}</div>
                </div>
                {i < BDH_CQ_FLOW.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-lab-border md:hidden" />
                )}
              </div>
            ))}
          </div>
          
          {/* Interactive Demo: Demonstrations Update Memory */}
          <div className="p-4 bg-lab-panel/50 rounded-lg border border-lab-border/50">
            <h4 className="font-display text-sm text-lab-text mb-3">Toy Simulation: Demonstrations → Memory → Reasoning</h4>
            <p className="text-lab-textMuted text-sm mb-4">
              <strong>Label: Toy pedagogical simulation inspired by the mechanism described in BDH-CQ.</strong> 
              This is not an official BDH-CQ checkpoint.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h5 className="font-mono text-xs text-lab-textMuted mb-2">Before Demonstrations</h5>
                <StateHeatmap
                  state={Array.from({ length: 64 }, () => Math.random() * 0.1)}
                  width={16}
                  height={4}
                  cellSize={10}
                />
              </div>
              
              <div>
                <h5 className="font-mono text-xs text-lab-textMuted mb-2">After {config.numDemos} Demonstrations</h5>
                <StateHeatmap
                  state={Array.from({ length: 64 }, (_, i) => Math.sin(i * 0.5 + config.numDemos) * 0.5 + 0.5)}
                  width={16}
                  height={4}
                  cellSize={10}
                />
                <div className="mt-2 space-y-1">
                  {Array.from({ length: config.numDemos }, (_, i) => (
                    <div key={i} className="text-[10px] text-lab-textMuted font-mono">
                      Demo {i + 1} → memory update
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-mono text-xs text-lab-textMuted mb-2">Latent Reasoning ({config.recurrentDepth} steps)</h5>
                <StateTrajectory
                  trajectory={result.stateTrajectory}
                  width={config.recurrentDepth}
                  height={16}
                  cellSize={6}
                />
                <div className="mt-2 text-center">
                  <GridDisplay
                    grid={result.latentPrediction.grid}
                    size={4}
                    cellSize={24}
                    showValues={true}
                    title="Prediction"
                  />
                  <div className="text-xs text-lab-textMuted mt-1">
                    Accuracy: {formatPercent(result.latentAccuracy)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex gap-4">
              <Slider
                label="Number of Demonstrations"
                value={config.numDemos}
                onChange={(v) => setConfig({ numDemos: v })}
                min={0}
                max={5}
                step={1}
              />
              <Slider
                label="Latent Reasoning Steps"
                value={config.recurrentDepth}
                onChange={(v) => setConfig({ recurrentDepth: v })}
                min={1}
                max={16}
                step={1}
              />
            </div>
          </div>
          
          {/* Published Results */}
          <div className="p-4 bg-lab-warningBg/30 border border-lab-warning/30 rounded-lg">
            <h5 className="font-display text-sm text-lab-warning mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Published BDH-CQ Results (Not Toy Model)
            </h5>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <MetricCard 
                label="ARC-AGI-1 pass@2" 
                value="29.5%" 
                evidenceBadge="PUBLISHED_RESULT"
              />
              <MetricCard 
                label="Cost per task" 
                value="$0.00070" 
                evidenceBadge="PUBLISHED_RESULT"
              />
              <MetricCard 
                label="Parameters" 
                value="150M" 
                evidenceBadge="PUBLISHED_RESULT"
              />
              <MetricCard 
                label="vs GPT-5.6 Luna" 
                value="57× cheaper" 
                evidenceBadge="PUBLISHED_RESULT"
              />
            </div>
            <p className="text-sm text-lab-textMuted mt-3 text-center">
              Source: <em>BDH-CQ: In-Context Learning with Recurrent Latent Reasoning</em> (Engdahl et al., 2026, arXiv:2608.09888)
            </p>
          </div>
        </div>
      </EvidencePanel>
      
      {/* Key BDH-CQ Findings */}
      <EvidencePanel type="REPORTED_BY_AUTHORS" title="BDH-CQ Behavioral Analysis (ConceptARC)" className="mb-6">
        <div className="prose prose-invert max-w-none">
          <h5 className="font-display text-lg text-lab-text mb-3">What BDH-CQ Learns from Demonstrations (Controlled Experiments)</h5>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-lab-accentBg/30 rounded-lg border border-lab-accent/30">
              <h6 className="font-display text-sm text-lab-accent mb-2">Strong Extrapolation</h6>
              <ul className="list-disc list-inside text-lab-textMuted space-y-1">
                <li>Propagation (78%)</li>
                <li>Copying (82%)</li>
                <li>Dense mappings (71%)</li>
              </ul>
            </div>
            <div className="p-3 bg-lab-warningBg/30 rounded-lg border border-lab-warning/30">
              <h6 className="font-display text-sm text-lab-warning mb-2">Moderate</h6>
              <ul className="list-disc list-inside text-lab-textMuted space-y-1">
                <li>Rotation (58%)</li>
                <li>Relocation (54%)</li>
              </ul>
            </div>
            <div className="p-3 bg-lab-dangerBg/30 rounded-lg border border-lab-danger/30">
              <h6 className="font-display text-sm text-lab-danger mb-2">Difficult</h6>
              <ul className="list-disc list-inside text-lab-textMuted space-y-1">
                <li>Composition (31%)</li>
                <li>Ordering (22%)</li>
                <li>Nesting (19%)</li>
                <li>Conditional rules (16%)</li>
              </ul>
            </div>
          </div>
        </div>
      </EvidencePanel>
      
      {/* Navigation */}
      <div className="grid md:grid-cols-3 gap-4">
        <a href="/latents" className="card group hover:border-lab-accent/50">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-lab-accent group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-display font-semibold text-lab-text">Think in Latents</h4>
              <p className="text-sm text-lab-textMuted">Recurrent depth scaling</p>
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
        <a href="/evidence" className="card group hover:border-lab-accent/50">
          <div className="flex items-center gap-3">
            <LinkIcon className="w-8 h-8 text-lab-info group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-display font-semibold text-lab-text">Evidence Room</h4>
              <p className="text-sm text-lab-textMuted">Research papers & results</p>
            </div>
          </div>
        </a>
      </div>
    </PageLayout>
  );
}
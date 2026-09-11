const fs = require('fs');

const code = `import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { EvidencePanel } from '@/components/research/EvidenceBadge';
import { StateHeatmap, StateTrajectory, StateVectorBars, StateChangeChart } from '@/components/visualization/StateVisualization';
import { MetricCard, AccuracyVsDepthChart } from '@/components/visualization/Charts';
import { Slider } from '@/components/controls/Controls';
import { useExperimentStore } from '@/lib/experiment';
import { formatPercent } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { AlertTriangle, Brain, GitBranch } from 'lucide-react';

export default function LatentsPage() {
  const { config, result, recurrentDepthResults, runExperiment, runDepthSweep, setConfig } = useExperimentStore();
  const [showFullTrajectory, setShowFullTrajectory] = React.useState(false);
  
  React.useEffect(() => {
    runExperiment();
    runDepthSweep();
  }, [runExperiment, runDepthSweep]);
  
  if (!result) {
    return React.createElement(PageLayout, {
      title: "Think in Latents",
      description: "Recurrent latent reasoning where computation happens through repeated hidden state updates without generating visible tokens.",
      children: React.createElement('div', { className: "p-8 text-center" },
        React.createElement('div', { className: "w-12 h-12 border-4 border-lab-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" }),
        React.createElement('p', { className: "text-lab-textMuted" }, "Loading...")
      )
    });
  }
  
  const { stateTrajectory, stateChanges, latentAccuracy, latentStepsUsed } = result;
  const trajectoryTitle = showFullTrajectory 
    ? "Full Trajectory (" + stateTrajectory.length + " steps)" 
    : "First " + latentStepsUsed + " Steps";
  const trajectoryWidth = showFullTrajectory ? Math.min(64, stateTrajectory.length) : latentStepsUsed;
  const trajectoryCellSize = showFullTrajectory ? 4 : 8;
  
  return React.createElement(PageLayout, {
    title: "Think in Latents",
    description: "Recurrent latent reasoning where computation happens through repeated hidden state updates without generating visible tokens.",
    children: React.createElement(React.Fragment, null,
      React.createElement(EvidencePanel, {
        type: "LIVE_TOY_COMPUTATION",
        title: "Latent Recurrent Reasoning",
        className: "mb-6"
      },
        React.createElement('p', { className: "text-lab-textMuted mb-4" },
          "Instead of generating text tokens, the model repeatedly applies a recurrent update to its hidden state. " +
          "Each iteration transforms the state vector, performing computation in continuous latent space."
        ),
        
        React.createElement('div', { className: "grid lg:grid-cols-2 gap-6" },
          React.createElement('div', { className: "space-y-4" },
            React.createElement(StateHeatmap, {
              state: stateTrajectory[latentStepsUsed - 1] || [],
              width: 16,
              height: Math.ceil(config.stateDim / 16),
              cellSize: 12,
              title: "Final Hidden State (" + config.stateDim + "D)"
            }),
            React.createElement(StateVectorBars, {
              state: stateTrajectory[latentStepsUsed - 1] || [],
              title: "State Vector Activations",
              maxBars: Math.min(config.stateDim, 128)
            })
          ),
          React.createElement('div', { className: "space-y-4" },
            React.createElement('div', { className: "flex items-center justify-between" },
              React.createElement('h4', { className: "font-display text-sm text-lab-text" }, "State Trajectory Over Recurrent Steps"),
              React.createElement('button', {
                onClick: () => setShowFullTrajectory(!showFullTrajectory),
                className: "btn-ghost text-xs"
              }, showFullTrajectory ? 'Show Summary' : 'Show Full')
            ),
            React.createElement(StateTrajectory, ({
              trajectory: stateTrajectory,
              width: trajectoryWidth,
              height: 16,
              cellSize: trajectoryCellSize,
              title: trajectoryTitle
            })),
            React.createElement(StateChangeChart, ({
              changes: stateChanges,
              title: "State Change Magnitude per Recurrent Step"
            })),
          )
        ),
        
        React.createElement('div', ({ className: "grid md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-lab-border" },
          React.createElement(Slider, ({
            label: "Recurrent Depth",
            value: config.recurrentDepth,
            onChange: (v) => setConfig({ recurrentDepth: v }),
            min: 1,
            max: 32,
            step: 1,
            marks: [
              { value: 1, label: '1' },
              { value: 4, label: '4' },
              { value: 8, label: '8' },
              { value: 16, label: '16' },
              { value: 32, label: '32' },
            ],
            unit: "steps"
          }),
          React.createElement(Slider, ({
            label: "State Dimension",
            value: config.stateDim,
            onChange: (v) => setConfig({ stateDim: v }),
            min: 16,
            max: 128,
            step: 16,
            marks: [
              { value: 16, label: '16' },
              { value: 64, label: '64' },
              { value: 128, label: '128' },
            ],
            unit: "D"
          }),
          React.createElement(Slider, ({
            label: "State Decay",
            value: config.stateDecay,
            onChange: (v) => setConfig({ stateDecay: v }),
            min: 0.5,
            max: 1.0,
            step: 0.05,
            marks: [
              { value: 0.5, label: '0.5' },
              { value: 0.75, label: '0.75' },
              { value: 0.9, label: '0.9' },
              { value: 1.0, label: '1.0' },
            ]
          }),
        ),
        
        React.createElement(EvidencePanel, ({
          type: "LIVE_TOY_COMPUTATION",
          title: "Recurrent Depth Scaling Analysis",
          className: "mb-6"
        }),
          React.createElement('p', { className: "text-lab-textMuted mb-4" },
            "Sweeping recurrent depth reveals how additional latent computation affects accuracy. " +
            "This mirrors the ",
            React.createElement('strong', null, "test-time compute scaling"),
            " studied in ",
            React.createElement('em', null, "Scaling up Test-Time Compute with Latent Reasoning"),
            " (Geiping et al., NeurIPS 2025)."
          ),
          
          recurrentDepthResults && recurrentDepthResults.length > 0 && React.createElement(React.Fragment, null,
            React.createElement(AccuracyVsDepthChart, ({
              data: recurrentDepthResults.map(r => ({
                step: r.step,
                accuracy: r.accuracy,
                confidence: r.confidence,
              })),
              baseline: recurrentDepthResults[0]?.accuracy,
              title: "Accuracy vs Recurrent Depth (Toy Model)"
            }),
            
            React.createElement('div', ({ className: "grid md:grid-cols-3 gap-4 mt-6" }),
              React.createElement(MetricCard, ({
                label: "Depth 1 (Baseline)",
                value: formatPercent(recurrentDepthResults[0]?.accuracy || 0),
                evidenceBadge: "LIVE_TOY_COMPUTATION",
              }),
              React.createElement(MetricCard, ({
                label: "Depth " + config.recurrentDepth,
                value: formatPercent(latentAccuracy),
                trend: latentAccuracy > (recurrentDepthResults[0]?.accuracy || 0) ? 'up' : 'down',
                trendValue: formatPercent(Math.abs(latentAccuracy - (recurrentDepthResults[0]?.accuracy || 0))),
                evidenceBadge: "LIVE_TOY_COMPUTATION",
              }),
              React.createElement(MetricCard, ({
                label: "Max Improvement",
                value: formatPercent(Math.max(...recurrentDepthResults.map(r => r.accuracy)) - (recurrentDepthResults[0]?.accuracy || 0)),
                evidenceBadge: "LIVE_TOY_COMPUTATION",
              })
            ),
            
            React.createElement('div', ({ className: "mt-6 p-4 bg-lab-warningBg/30 border border-lab-warning/30 rounded-lg" }),
              React.createElement('h5', ({ className: "font-display text-sm text-lab-warning mb-2 flex items-center gap-2" }),
                React.createElement(AlertTriangle, { className: "w-4 h-4" }),
                " Limitation: Diminishing Returns & Instability"
              ),
              React.createElement('p', ({ className: "text-sm text-lab-textMuted" }),
                "Notice how accuracy gains diminish with depth. In real models, excessive recurrence can cause:"
              ),
              React.createElement('ul', ({ className: "list-disc list-inside text-sm text-lab-textMuted mt-2 space-y-1" }),
                React.createElement('li', null, "State saturation (updates become negligible)"),
                React.createElement('li', null, "Oscillatory behavior (state cycles without converging)"),
                React.createElement('li', null, "Gradient instability during training"),
                React.createElement('li', null, "Overfitting to the specific recurrent path")
              )
            )
          ),
          
          React.createElement('div', ({ className: "grid md:grid-cols-2 gap-6 mb-6" }),
            React.createElement(EvidencePanel, ({
              type: "PUBLISHED_RESULT",
              title: "Coconut: Continuous Latent Reasoning",
              citation: "Hao et al., 2024 (ICLR 2025)"
            },
              React.createElement('div', { className: "max-w-none" },
                React.createElement('h5', ({ className: "font-display text-lg text-lab-text mb-3" }), "Training LLMs to Reason in Continuous Latent Space"),
                React.createElement('ul', ({ className: "space-y-2 text-lab-textMuted list-disc list-inside text-sm" }),
                  React.createElement('li', null, React.createElement('strong', null, "Core idea: "), "Feed last hidden state directly as next input embedding (\"continuous thought\")"),
                  React.createElement('li', null, React.createElement('strong', null, "Emergent behavior: "), "BFS-like search over reasoning paths instead of single trajectory"),
                  React.createElement('li', null, React.createElement('strong', null, "ProsQA results: "), "67.8% (Coconut) vs 54.2% (CoT) on GPT-2"),
                  React.createElement('li', null, React.createElement('strong', null, "Limitation: "), "Training instability; larger models benefit less")
                )
              )
            )
          ),
          
          React.createElement(EvidencePanel, ({
            type: "PUBLISHED_RESULT",
            title: "Recurrent Depth: Test-Time Compute Scaling",
            citation: "Geiping et al., NeurIPS 2025"
          }),
            React.createElement('div', { className: "max-w-none" },
              React.createElement('h5', ({ className: "font-display text-lg text-lab-text mb-3" }), "Scaling Test-Time Compute with Latent Reasoning"),
              React.createElement('ul', ({ className: "space-y-2 text-lab-textMuted list-disc list-inside text-sm" }),
                React.createElement('li', null, React.createElement('strong', null, "Architecture: "), "Depth-recurrent transformer with shared block"),
                React.createElement('li', null, React.createElement('strong', null, "3.5B params, 800B tokens training")),
                React.createElement('li', null, React.createElement('strong', null, "GSM8K: "), "22.4% (r=1) to 58.7% (r=32)"),
                React.createElement('li', null, React.createElement('strong', null, "Features: "), "Adaptive compute, KV-cache sharing, speculative decoding")
              )
            )
          )
        ),
        
        React.createElement(EvidencePanel, ({
          type: "PUBLISHED_RESULT",
          title: "TRM: Recursive Reasoning in Tiny Networks",
          citation: "Jolicoeur-Martineau, 2025"
        }),
          React.createElement('div', ({ className: "max-w-none" }),
            React.createElement('h5', ({ className: "font-display text-lg text-lab-text mb-3" }), "Less is More: Recursive Reasoning with Tiny Networks"),
            React.createElement('ul', ({ className: "space-y-2 text-lab-textMuted list-disc list-inside text-sm" }),
              React.createElement('li', null, React.createElement('strong', null, "TRM: "), "Single 2-layer network (7M params) with recursive refinement"),
              React.createElement('li', null, React.createElement('strong', null, "Results: "), "45% ARC-AGI-1, 8% ARC-AGI-2 - beats most LLMs with <0.01% params"),
              React.createElement('li', null, React.createElement('strong', null, "Key insight: "), "Two latent variables (y=solution, z=memory) suffice; more hurts"),
              React.createElement('li', null, React.createElement('strong', null, "Limitation: "), "Optimal recursion depth exists; more causes OOM")
            )
          )
        ),
        
        React.createElement('div', ({ className: "grid md:grid-cols-3 gap-4" }),
          React.createElement('a', ({ href: "/tokens", className: "card group hover:border-lab-accent/50" }),
            React.createElement('div', ({ className: "flex items-center gap-3" }),
              React.createElement(GitBranch, ({ className: "w-8 h-8 text-lab-info group-hover:scale-110 transition-transform" })),
              React.createElement('div', null,
                React.createElement('h4', ({ className: "font-display font-semibold text-lab-text" }), "Think in Tokens"),
                React.createElement('p', ({ className: "text-sm text-lab-textMuted" }), "Chain-of-thought baseline")
              )
            )
          ),
          React.createElement('a', ({ href: "/bdh", className: "card group hover:border-lab-accent/50" }),
            React.createElement('div', ({ className: "flex items-center gap-3" }),
              React.createElement(Brain, ({ className: "w-8 h-8 text-lab-info group-hover:scale-110 transition-transform" })),
              React.createElement('div', null,
                React.createElement('h4', ({ className: "font-display font-semibold text-lab-text" }), "BDH / BDH-CQ"),
                React.createElement('p', ({ className: "text-sm text-lab-textMuted" }), "Recurrent memory + in-context learning")
              )
            )
          ),
          React.createElement('a', ({ href: "/failure-lab", className: "card group hover:border-lab-accent/50" }),
            React.createElement('div', ({ className: "flex items-center gap-3" }),
              React.createElement(AlertTriangle, ({ className: "w-8 h-8 text-lab-warning group-hover:scale-110 transition-transform" }),
              React.createElement('div', null,
                React.createElement('h4', ({ className: "font-display font-semibold text-lab-text" }), "Failure Lab"),
                React.createElement('p', ({ className: "text-sm text-lab-textMuted" }), "Break the reasoner")
              )
            )
          )
        ),
      ),
    )
  );
}
`;

fs.writeFileSync('C:/Users/dwive/Desktop/Fasal-Pramaan-main/apps/latent-reasoning-lab/src/app/latents/page.tsx', code);
console.log('File written successfully');
"
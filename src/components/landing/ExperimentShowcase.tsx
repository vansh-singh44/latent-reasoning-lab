'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GridDisplay } from '@/components/visualization/GridDisplay';
import { StateHeatmap, StateTrajectory, StateChangeChart } from '@/components/visualization/StateVisualization';
import { useExperimentStore, runExperiment, DEFAULT_CONFIG } from '@/lib/experiment';
import { cn, formatPercent } from '@/lib/utils';
import { Zap, Brain, GitBranch, Play, Pause, RotateCcw, Settings, ArrowRight } from 'lucide-react';

// Simple animated grid for demo
function DemoGrid({ grid, size = 4, cellSize = 32, title, animating = false }: { 
  grid: number[][]; 
  size?: number; 
  cellSize?: number; 
  title?: string;
  animating?: boolean;
}) {
  return (
    <div className="text-center">
      {title && <h4 className="font-mono text-xs text-lab-textMuted mb-3">{title}</h4>}
      <GridDisplay 
        grid={grid} 
        size={size} 
        cellSize={cellSize} 
        showValues={true}
      />
    </div>
  );
}

export function ExperimentShowcase() {
  const { config, result, runExperiment, runDepthSweep, setConfig } = useExperimentStore();
  const [isRunning, setIsRunning] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const animationRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    runExperiment();
    runDepthSweep();
  }, [runExperiment, runDepthSweep]);

  const handleRun = () => {
    setIsRunning(true);
    runExperiment();
    setAnimationPhase(0);
    
    // Animate through phases
    const phases = [1, 2, 3, 4];
    let i = 0;
    const interval = setInterval(() => {
      if (i < phases.length) {
        setAnimationPhase(phases[i]);
        i++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setAnimationPhase(5);
      }
    }, 800);
    
    animationRef.current = interval;
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  if (!result) {
    return (
      <section className="py-24 md:py-32" aria-labelledby="showcase-heading">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-lab-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lab-textMuted">Loading experiment preview...</p>
          </div>
        </div>
      </section>
    );
  }

  const { groundTruth, tokenPrediction, tokenAccuracy, latentPrediction, latentAccuracy, stateTrajectory, stateChanges } = result;

  return (
    <section className="py-24 md:py-32 relative" aria-labelledby="showcase-heading">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-lab-accent/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-lab-info/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-accentBg/50 border border-lab-accent/30 text-lab-accent text-sm font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-lab-accent animate-pulse" aria-hidden="true" />
            Live Experiment Preview
          </span>
          <h2 id="showcase-heading" className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-lab-text leading-tight mb-6">
            Experiment With{' '}
            <span className="relative">
              <span className="relative z-10">Reasoning</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-lab-accent/30 to-lab-info/30 rounded-full" aria-hidden="true" />
            </span>
          </h2>
          <p className="text-lg md:text-xl text-lab-textMuted max-w-2xl mx-auto">
            Adjust parameters and watch the model solve grid transformation tasks. 
            Toggle between token and latent modes to see the difference.
          </p>
        </motion.div>

        {/* Experiment Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Pipeline Visualization */}
          <div className="bg-lab-panel/50 backdrop-blur-sm border border-lab-border/50 rounded-2xl p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* INPUT */}
              <motion.div className="flex-1 text-center" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-lab-infoBg/50 border border-lab-info/30 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-lab-info" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-lab-text">INPUT</h3>
                </div>
                <DemoGrid grid={groundTruth.grid} cellSize={36} title="Query Grid" />
                <p className="text-xs text-lab-textMuted mt-2 font-mono">4×4 grid transformation task</p>
              </motion.div>

              {/* Arrow */}
              <motion.div className="flex items-center justify-center text-lab-textMuted lg:mx-4" initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.div>

              {/* REASONING */}
              <motion.div className="flex-1 lg:w-[320px] text-center" initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-lab-accentBg/50 border border-lab-accent/30 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-lab-accent" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-lab-text">REASONING</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Mode indicator */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-lab-panel border border-lab-border">
                      {animationPhase >= 2 ? '●' : '○'} Latent
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-lab-panel border border-lab-border">
                      {animationPhase >= 3 ? '●' : '○'} Processing
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-lab-panel border border-lab-border">
                      {animationPhase >= 4 ? '●' : '○'} Complete
                    </span>
                  </div>

                  {/* State visualization */}
                  <div className="relative">
                    {stateTrajectory.length > 0 && (
                      <>
                        <StateHeatmap
                          state={stateTrajectory[Math.min(animationPhase - 1, stateTrajectory.length - 1)] || []}
                          width={16}
                          height={4}
                          cellSize={10}
                          title={`Hidden State at Step ${animationPhase}`}
                        />
                        <StateTrajectory
                          trajectory={stateTrajectory}
                          width={Math.min(animationPhase, stateTrajectory.length)}
                          height={16}
                          cellSize={8}
                          title="State Trajectory"
                        />
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Arrow */}
              <motion.div className="flex items-center justify-center text-lab-textMuted lg:mx-4" initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.div>

              {/* ANSWER */}
              <motion.div className="flex-1 text-center" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-lab-accentBg/50 border border-lab-accent/30 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-lab-accent" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-lab-text">ANSWER</h3>
                </div>
                
                <div className="space-y-3">
                  <DemoGrid 
                    grid={latentPrediction.grid} 
                    cellSize={32} 
                    title={`Latent: ${formatPercent(latentAccuracy)}`}
                  />
                  <DemoGrid 
                    grid={tokenPrediction.grid} 
                    cellSize={32} 
                    title={`Token: ${formatPercent(tokenAccuracy)}`}
                  />
                  <p className="text-xs text-lab-textMuted font-mono">
                    Ground Truth Accuracy: {formatPercent(gridsEqual(latentPrediction.grid, groundTruth.grid) ? 1 : 0)}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-lab-panel/30 backdrop-blur-sm border border-lab-border/30 rounded-xl p-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="btn-primary flex items-center gap-2 px-6 py-3"
                >
                  {isRunning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-lab-bg/30 border-t-lab-bg rounded-full animate-spin" aria-hidden="true" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" aria-hidden="true" />
                      Run Experiment
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setConfig({ ...DEFAULT_CONFIG });
                    runExperiment();
                    runDepthSweep();
                  }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-lab-textMuted">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-lab-info" aria-hidden="true" />
                  Token: {formatPercent(tokenAccuracy)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-lab-accent" aria-hidden="true" />
                  Latent: {formatPercent(latentAccuracy)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-lab-warning" aria-hidden="true" />
                  Depth: {config.recurrentDepth}
                </div>
              </div>
            </div>

            {/* Budget Slider */}
            <div className="mt-6">
              <label className="block text-xs font-mono text-lab-textMuted mb-2">
                Recurrent Depth (Thinking Budget): {config.recurrentDepth} steps
              </label>
              <input
                type="range"
                min="1"
                max="32"
                step="1"
                value={config.recurrentDepth}
                onChange={(e) => setConfig({ recurrentDepth: Number(e.target.value) })}
                className="w-full h-2 bg-lab-border rounded-full appearance-none cursor-pointer slider-input"
                style={{
                  background: `linear-gradient(to right, #00d4aa ${((config.recurrentDepth - 1) / 31) * 100}%, #2a3548 ${((config.recurrentDepth - 1) / 31) * 100}%)`,
                }}
              />
              <div className="flex justify-between mt-2 text-xs font-mono text-lab-textMuted">
                {[1, 4, 8, 16, 32].map(step => (
                  <span key={step} className={cn(
                    'px-2 py-1 rounded transition-colors',
                    config.recurrentDepth === step && 'bg-lab-accent text-lab-bg'
                  )}>
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-lab-textMuted mb-4">Ready to run your own experiments?</p>
          <a href="/experiments" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base">
            Open Full Experiment Lab
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// Helper
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

function Link({ href, children, className, style, ...props }: { 
  href: string; 
  children: React.ReactNode; 
  className?: string; 
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  return (
    <a href={href} className={className} style={style} {...props}>
      {children}
    </a>
  );
}
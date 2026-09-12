'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Zap, Brain, GitBranch, ArrowRight, Play, ChevronRight, ChevronLeft } from 'lucide-react';

const TOUR_STEPS = [
  {
    id: 1,
    title: 'Token Reasoning Exposes Computation',
    description: 'Traditional chain-of-thought generates visible intermediate tokens. Each reasoning step is a human-readable word.',
    highlight: 'Token Mode',
    icon: GitBranch,
    color: 'text-lab-info',
    bgColor: 'bg-lab-infoBg/30',
    borderColor: 'border-lab-info/30',
  },
  {
    id: 2,
    title: 'Latent Reasoning Keeps State Hidden',
    description: 'Recurrent latent reasoning repeatedly updates a hidden state vector. No intermediate words are produced - only the final answer.',
    highlight: 'Latent Mode',
    icon: Brain,
    color: 'text-lab-accent',
    bgColor: 'bg-lab-accentBg/30',
    borderColor: 'border-lab-accent/30',
  },
  {
    id: 3,
    title: 'Increase Depth to "Think More"',
    description: 'Move the recurrent depth slider from 1 to 8+ steps. The hidden state trajectory evolves with each recurrent update.',
    highlight: 'Depth Control',
    icon: Zap,
    color: 'text-lab-warning',
    bgColor: 'bg-lab-warningBg/30',
    borderColor: 'border-lab-warning/30',
  },
  {
    id: 4,
    title: 'Compare Accuracy vs Compute',
    description: 'Check accuracy, confidence, and compute cost for both approaches. Notice what you gained - and what you lost.',
    highlight: 'Compare',
    icon: ArrowRight,
    color: 'text-lab-danger',
    bgColor: 'bg-lab-dangerBg/30',
    borderColor: 'border-lab-danger/30',
  },
  {
    id: 5,
    title: 'More Compute Does Not Equal More Words',
    description: 'Latent reasoning gains compute efficiency but loses direct observability. This is the fundamental trade-off.',
    highlight: 'Trade-off',
    icon: Zap,
    color: 'text-lab-info',
    bgColor: 'bg-lab-infoBg/30',
    borderColor: 'border-lab-info/30',
  },
  {
    id: 6,
    title: 'BDH-CQ: Recurrent Memory + In-Context Learning',
    description: 'Demonstrations update recurrent memory, then queries are solved through latent iteration. Memory persists across tasks.',
    highlight: 'BDH-CQ',
    icon: Brain,
    color: 'text-lab-accent',
    bgColor: 'bg-lab-accentBg/30',
    borderColor: 'border-lab-accent/30',
  },
];

export function GuidedTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const step = TOUR_STEPS[currentStep];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1 >= TOUR_STEPS.length ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, TOUR_STEPS.length - 1));
  const goPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const goTo = (idx: number) => setCurrentStep(idx);
  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <section className="py-24 md:py-32 relative" aria-labelledby="tour-heading">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-accentBg/50 border border-lab-accent/30 text-lab-accent text-sm font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-lab-accent animate-pulse" aria-hidden="true" />
            Guided Tour
          </span>
          <h2 id="tour-heading" className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-lab-text leading-tight mb-6">
            60-Second Journey
          </h2>
          <p className="text-lg md:text-xl text-lab-textMuted max-w-2xl mx-auto">
            Walk through the key concepts step by step. Each step highlights a different aspect of latent vs token reasoning.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="bg-lab-panel/50 backdrop-blur-sm border border-lab-border rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-lab-border" aria-hidden="true">
              <motion.div
                style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-lab-accent to-lab-info"
              />
            </div>

            <div className="p-8 lg:p-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-lab-textMuted">
                    Step {currentStep + 1} of {TOUR_STEPS.length}
                  </span>
                  <span
                    className="px-2 py-1 text-xs font-mono rounded-full"
                    style={{
                      backgroundColor: step.bgColor,
                      border: `1px solid ${step.borderColor}`,
                      color: step.color,
                    }}
                  >
                    {step.highlight}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goPrev}
                    disabled={currentStep === 0}
                    className="p-2 rounded-lg text-lab-textMuted hover:text-lab-text hover:bg-lab-panelHover transition-colors disabled:opacity-30"
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    {isPlaying ? (
                      <span className="text-lab-textMuted">Pause</span>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" /> Play
                      </>
                    )}
                  </button>
                  <button
                    onClick={goNext}
                    disabled={currentStep === TOUR_STEPS.length - 1}
                    className="p-2 rounded-lg text-lab-textMuted hover:text-lab-text hover:bg-lab-panelHover transition-colors disabled:opacity-30"
                    aria-label="Next step"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center"
              >
                <div className="flex flex-col items-center lg:items-start lg:w-1/3 text-center lg:text-left mb-6 lg:mb-0">
                  <div className="relative mb-6">
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto lg:mx-0"
                      style={{ backgroundColor: step.bgColor, border: `1px solid ${step.borderColor}` }}
                    >
                      <step.icon className="w-10 h-10" style={{ color: step.color }} aria-hidden="true" />
                    </div>
                    <div
                      className="absolute inset-0 rounded-2xl border-2"
                      style={{ borderColor: step.color }}
                      aria-hidden="true"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl border-2"
                        style={{ borderColor: step.color }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 lg:justify-start">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                      style={{ backgroundColor: step.bgColor, border: `1px solid ${step.borderColor}` }}
                    >
                      <span className="text-sm font-mono" style={{ color: step.color }}>
                        {step.highlight}
                      </span>
                    </motion.div>
                  </div>
                </div>

                <div className="lg:w-2/3 text-center lg:text-left">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="font-display text-2xl md:text-3xl font-bold text-lab-text mb-4"
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="text-lg text-lab-textMuted leading-relaxed"
                  >
                    {step.description}
                  </motion.p>
                </div>
              </motion.div>

              <div className="flex items-center justify-center gap-2 mt-10" role="tablist" aria-label="Tour steps">
                {TOUR_STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all duration-300',
                      i === currentStep
                        ? 'w-10 bg-lab-accent'
                        : 'bg-lab-border hover:bg-lab-borderBright'
                    )}
                    role="tab"
                    aria-selected={i === currentStep}
                    aria-label={`Go to step ${i + 1}: ${s.title}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-[120%]">
            <div className="bg-lab-panel/50 backdrop-blur-sm border border-lab-border rounded-xl p-4 space-y-2 min-w-[200px]">
              {TOUR_STEPS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg text-sm transition-all',
                    i === currentStep
                      ? 'bg-lab-accentBg border border-lab-accent/30 text-lab-text'
                      : 'text-lab-textMuted hover:bg-lab-panelHover hover:text-lab-text'
                  )}
                  style={{ borderLeft: i === currentStep ? '3px solid' : '3px solid transparent', borderLeftColor: s.color }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-lab-textMuted">0{s.id}</span>
                    <s.icon className="w-4 h-4" style={{ color: s.color }} aria-hidden="true" />
                  </div>
                  <span className="font-medium">{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
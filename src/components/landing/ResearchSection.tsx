'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, FileText, ExternalLink, ArrowRight, Zap, Brain, GitBranch } from 'lucide-react';

const RESEARCH_CARDS = [
  {
    id: 'experiments',
    title: 'Interactive Experiments',
    description: 'Run controlled experiments manipulating recurrent depth, state dimension, noise, and demonstrations. Observe accuracy, compute, and state dynamics in real time.',
    icon: FlaskConical,
    color: 'text-lab-accent',
    bgColor: 'bg-lab-accentBg/30',
    borderColor: 'border-lab-accent/30',
    href: '/experiments',
    cta: 'Run Experiments',
    status: 'LIVE',
  },
  {
    id: 'token-reasoning',
    title: 'Token Reasoning (CoT)',
    description: 'Explore traditional chain-of-thought reasoning. Generate visible intermediate tokens, observe step-by-step computation, and compare with latent approaches.',
    icon: GitBranch,
    color: 'text-lab-info',
    bgColor: 'bg-lab-infoBg/30',
    borderColor: 'border-lab-info/30',
    href: '/tokens',
    cta: 'Explore Tokens',
    status: 'LIVE',
  },
  {
    id: 'latent-reasoning',
    title: 'Latent Recurrent Reasoning',
    description: 'Deep dive into recurrent depth scaling. Sweep depth from 1 to 32, visualize state trajectories, and observe diminishing returns and instability.',
    icon: Brain,
    color: 'text-lab-accent',
    bgColor: 'bg-lab-accentBg/30',
    borderColor: 'border-lab-accent/30',
    href: '/latents',
    cta: 'Explore Latents',
    status: 'LIVE',
  },
  {
    id: 'bdh-cq',
    title: 'BDH / BDH-CQ Memory',
    description: 'How recurrent memory enables in-context learning. Add demonstrations, watch memory update, then run latent reasoning on queries.',
    icon: Zap,
    color: 'text-lab-warning',
    bgColor: 'bg-lab-warningBg/30',
    borderColor: 'border-lab-warning/30',
    href: '/bdh',
    cta: 'Explore BDH-CQ',
    status: 'LIVE',
  },
  {
    id: 'failure-lab',
    title: 'Failure Lab',
    description: 'Break the reasoner. Explore saturation, oscillation, catastrophic forgetting, interference, and noise amplification.',
    icon: BookOpen,
    color: 'text-lab-danger',
    bgColor: 'bg-lab-dangerBg/30',
    borderColor: 'border-lab-danger/30',
    href: '/failure-lab',
    cta: 'Enter Lab',
    status: 'LIVE',
  },
  {
    id: 'challenge',
    title: 'Challenge & Quiz',
    description: 'Test your understanding of latent reasoning concepts with interactive questions and scenarios.',
    icon: FileText,
    color: 'text-lab-warning',
    bgColor: 'bg-lab-warningBg/30',
    borderColor: 'border-lab-warning/30',
    href: '/challenge',
    cta: 'Take Challenge',
    status: 'LIVE',
  },
];

const INSIGHTS = [
  {
    title: 'More Recurrent Steps ≠ Always Better',
    description: 'Diminishing returns, state saturation, oscillatory behavior, and training instability all limit the benefits of increased recurrent depth.',
    source: 'Geiping et al., NeurIPS 2025',
  },
  {
    title: 'Latent Thoughts Can Search',
    description: 'Coconut models exhibit BFS-like search over reasoning paths instead of single trajectory — emergent behavior from continuous latent space.',
    source: 'Hao et al., ICLR 2025',
  },
  {
    title: 'Recursive Memory Enables In-Context Learning',
    description: 'BDH-CQ shows how demonstrations update recurrent memory, then queries are solved through latent iteration without attention.',
    source: 'Engdahl et al., 2026',
  },
  {
    title: 'Tiny Recursive Networks Beat Large LLMs',
    description: 'TRM achieves 45% ARC-AGI-1 with 7M params using recursive refinement — beating most LLMs with <0.01% parameters.',
    source: 'Jolicoeur-Martineau, 2025',
  },
];

export function ResearchSection() {
  return (
    <section className="py-24 md:py-32 relative" aria-labelledby="research-heading">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] translate-x-1/3 -translate-y-1/3 rounded-full bg-lab-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-infoBg/50 border border-lab-info/30 text-lab-info text-sm font-mono mb-6">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            Research & Insights
          </span>
          <h2 id="research-heading" className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-lab-text leading-tight mb-6">
            Research &{' '}
            <span className="relative">
              <span className="relative z-10">Insights</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-lab-info/30 to-lab-accent/30 rounded-full" aria-hidden="true" />
            </span>
          </h2>
          <p className="text-lg md:text-xl text-lab-textMuted max-w-2xl mx-auto">
            Grounded in published research. Every experiment connects to peer-reviewed work on 
            latent reasoning, recurrent depth scaling, and recurrent memory.
          </p>
        </motion.div>

        {/* Research Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
        >
          {RESEARCH_CARDS.map((card, i) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className="group relative p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:shadow-lab-lg"
              style={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                borderColor: card.borderColor,
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="relative w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: card.bgColor, border: `1px solid ${card.borderColor}` }}>
                  <card.icon className="w-7 h-7" style={{ color: card.color }} aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-lab-text mb-1">{card.title}</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded" style={{ 
                    backgroundColor: card.bgColor, 
                    border: `1px solid ${card.borderColor}`, 
                    color: card.color 
                  }}>
                    {card.status}
                  </span>
                </div>
              </div>

              <p className="text-lab-textMuted mb-6 leading-relaxed">{card.description}</p>

              <a
                href={card.href}
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors group"
                style={{ color: card.color }}
              >
                {card.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>

              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true" style={{
                background: `radial-gradient(ellipse at center, ${card.color}20 0%, transparent 70%)`,
              }} />
            </motion.article>
          ))}
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="font-display text-3xl font-bold text-lab-text text-center mb-12">
            Key Research Insights
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {INSIGHTS.map((insight, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="bg-lab-panel/50 backdrop-blur-sm border border-lab-border/50 rounded-2xl p-6 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-lab-accentBg/30 border border-lab-accent/30 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-lab-accent" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-lg font-semibold text-lab-text mb-2">{insight.title}</h4>
                    <p className="text-lab-textMuted text-sm">{insight.description}</p>
                    <p className="text-xs font-mono text-lab-textMuted mt-3">{insight.source}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
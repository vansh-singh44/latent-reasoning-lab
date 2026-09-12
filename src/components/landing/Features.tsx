'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Zap, GitBranch, Shield, Eye, Layers, Settings, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    number: '01',
    title: 'Token Reasoning',
    description: 'Explore traditional chain-of-thought reasoning where intermediate computation is exposed as visible language tokens. High interpretability, linear context growth.',
    icon: GitBranch,
    color: 'text-lab-info',
    bgColor: 'bg-lab-infoBg/50',
    borderColor: 'border-lab-info/30',
    highlights: ['Visible intermediate steps', 'Human-readable', 'O(context) memory growth'],
  },
  {
    number: '02',
    title: 'Latent Reasoning',
    description: 'Explore recurrent latent reasoning where computation happens through repeated hidden state updates without generating visible tokens. Compact, efficient, adaptive.',
    icon: Brain,
    color: 'text-lab-accent',
    bgColor: 'bg-lab-accentBg/50',
    borderColor: 'border-lab-accent/30',
    highlights: ['Hidden state computation', 'Fixed memory footprint', 'Natural early exit'],
  },
  {
    number: '03',
    title: 'Side-by-Side Comparison',
    description: 'Run identical reasoning tasks with both approaches at equal compute budgets. Compare accuracy, interpretability, memory, and compute trade-offs in real time.',
    icon: Layers,
    color: 'text-lab-warning',
    bgColor: 'bg-lab-warningBg/50',
    borderColor: 'border-lab-warning/30',
    highlights: ['Equal compute budgets', 'Real-time metrics', 'Trade-off visualization'],
  },
  {
    number: '04',
    title: 'Recurrent Memory (BDH-CQ)',
    description: 'Watch how demonstrations update recurrent memory, then run latent reasoning on queries. Inspired by BDH-CQ mechanism for in-context learning without attention.',
    icon: Zap,
    color: 'text-lab-danger',
    bgColor: 'bg-lab-dangerBg/50',
    borderColor: 'border-lab-danger/30',
    highlights: ['Demonstration memory updates', 'In-context learning', 'Recurrent dynamics'],
  },
];

export function Features() {
  return (
    <section className="py-24 md:py-32 lg:py-40" aria-labelledby="features-heading">
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
            Core Capabilities
          </span>
          <h2 id="features-heading" className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-lab-text leading-tight mb-6">
            Four Ways to{' '}
            <span className="relative">
              <span className="relative z-10">Explore Reasoning</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-lab-accent/30 to-lab-info/30 rounded-full" aria-hidden="true" />
            </span>
          </h2>
          <p className="text-lg md:text-xl text-lab-textMuted max-w-2xl mx-auto">
            Each capability is backed by interactive experiments — not static demos. 
            Manipulate variables and observe consequences in real time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.article
              key={feature.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:shadow-lab-lg"
              style={{
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                borderColor: feature.borderColor,
              }}
            >
              {/* Number badge */}
              <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 text-[80px] font-display font-bold opacity-5" aria-hidden="true">
                {feature.number}
              </span>

              {/* Icon */}
              <div className="relative z-10 mb-6 w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: feature.bgColor, border: `1px solid ${feature.borderColor}` }}>
                <feature.icon className="w-7 h-7" style={{ color: feature.color }} aria-hidden="true" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-lab-text mb-3">{feature.title}</h3>
              <p className="text-lab-textMuted mb-6 leading-relaxed">{feature.description}</p>

              {/* Highlights */}
              <ul className="space-y-2 mb-8" role="list">
                {feature.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-lab-textMuted">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: feature.color }} aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
              </ul>

              {/* Link */}
              <Link
                href="/experiments"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors group"
                style={{ color: feature.color }}
              >
                Try it
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true" style={{
                background: `radial-gradient(ellipse at center, ${feature.color}20 0%, transparent 70%)`,
              }} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
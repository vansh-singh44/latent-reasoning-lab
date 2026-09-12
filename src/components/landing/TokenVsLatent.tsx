'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GitBranch, Brain, Eye, Layers, Database, Zap, Shield, Clock, ArrowRight, Check } from 'lucide-react';

const COMPARISON_DATA = [
  {
    property: 'Intermediate Representation',
    token: 'Text tokens (human-readable)',
    latent: 'Hidden state vector (continuous)',
    tokenIcon: GitBranch,
    latentIcon: Brain,
  },
  {
    property: 'Additional Compute',
    token: 'Generate more tokens',
    latent: 'More recurrent updates',
    tokenIcon: Zap,
    latentIcon: Layers,
  },
  {
    property: 'Interpretability',
    token: 'High — direct inspection',
    latent: 'Low — requires probes/tools',
    tokenIcon: Eye,
    latentIcon: Shield,
  },
  {
    property: 'Memory Growth',
    token: 'O(context × hidden_dim)',
    latent: 'O(state_dim²) fixed',
    tokenIcon: Database,
    latentIcon: Shield,
  },
  {
    property: 'Context Window',
    token: 'Limited by KV cache',
    latent: 'Effectively infinite',
    tokenIcon: Layers,
    latentIcon: Shield,
  },
  {
    property: 'Adaptive Compute',
    token: 'Hard (fixed steps)',
    latent: 'Natural (early exit)',
    tokenIcon: Clock,
    latentIcon: Zap,
  },
  {
    property: 'Verification',
    token: 'Direct inspection possible',
    latent: 'Requires interpretability tools',
    tokenIcon: Eye,
    latentIcon: Shield,
  },
];

const STATS = [
  { label: 'Compute Efficiency', token: '1×', latent: '0.3×', unit: 'FLOPs per step' },
  { label: 'Memory Scaling', token: 'Linear', latent: 'Constant', unit: 'with depth' },
  { label: 'Early Exit', token: 'No', latent: 'Yes', unit: 'confidence-based' },
  { label: 'Interpretability', token: 'High', latent: 'Low', unit: 'out of box' },
];

export function TokenVsLatent() {
  return (
    <section className="py-24 md:py-32 relative" aria-labelledby="comparison-heading">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-lab-info/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-lab-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-warningBg/50 border border-lab-warning/30 text-lab-warning text-sm font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-lab-warning animate-pulse" aria-hidden="true" />
            Trade-off Analysis
          </span>
          <h2 id="comparison-heading" className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-lab-text leading-tight mb-6">
            Two Ways to{' '}
            <span className="relative">
              <span className="relative z-10">Reason</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-lab-accent/30 to-lab-warning/30 rounded-full" aria-hidden="true" />
            </span>
          </h2>
          <p className="text-lg md:text-xl text-lab-textMuted max-w-2xl mx-auto">
            Different trade-offs, not a universal replacement. Latent reasoning changes the 
            accuracy/latency/cost/observability Pareto frontier.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          role="list"
          aria-label="Key statistics comparison"
        >
          {STATS.map((stat, i) => (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="bg-lab-panel/50 backdrop-blur-sm border border-lab-border/50 rounded-xl p-6 text-center group"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-lab-infoBg/50 border border-lab-info/30 flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-lab-info" aria-hidden="true" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-lab-accentBg/50 border border-lab-accent/30 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-lab-accent" aria-hidden="true" />
                </div>
              </div>
              <h3 className="font-display text-lg font-semibold text-lab-text mb-2">{stat.label}</h3>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="font-mono text-lab-info">{stat.token}</span>
                <ArrowRight className="w-4 h-4 text-lab-textMuted" aria-hidden="true" />
                <span className="font-mono text-lab-accent">{stat.latent}</span>
              </div>
              <p className="text-xs text-lab-textMuted mt-2">{stat.unit}</p>
            </motion.article>
          ))}
        </motion.div>

        {/* Detailed Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-lab-border bg-lab-panel/30 backdrop-blur-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-lab-border bg-lab-panel/50">
                  <th className="px-6 py-4 text-left font-display text-sm font-semibold text-lab-textMuted uppercase tracking-wider">Property</th>
                  <th className="px-6 py-4 text-center font-display text-sm font-semibold text-lab-info">Token Reasoning</th>
                  <th className="px-6 py-4 text-center font-display text-sm font-semibold text-lab-accent">Latent Reasoning</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, i) => (
                  <motion.tr
                    key={row.property}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className="border-b border-lab-border/50 hover:bg-lab-panel/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-lab-panel border border-lab-border flex items-center justify-center">
                          <row.tokenIcon className="w-5 h-5 text-lab-info" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-sm text-lab-text">{row.property}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-lab-text">
                        <row.tokenIcon className="w-4 h-4 text-lab-info" aria-hidden="true" />
                        <span className="text-sm max-w-xs">{row.token}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-lab-text">
                        <row.latentIcon className="w-4 h-4 text-lab-accent" aria-hidden="true" />
                        <span className="text-sm max-w-xs">{row.latent}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Insight */}
          <div className="p-6 lg:p-8 bg-gradient-to-r from-lab-accentBg/50 to-lab-infoBg/50 border-t border-lab-border/50">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-lab-accent/20 border border-lab-accent/30 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-lab-accent" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-lab-text mb-1">Key Insight</h3>
                  <p className="text-lab-textMuted text-sm max-w-md">
                    Different trade-offs, not a universal replacement. Latent reasoning changes the 
                    accuracy/latency/cost/observability Pareto frontier.
                  </p>
                </div>
              </div>
              <motion.a
                href="/experiments"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary px-6 py-2 whitespace-nowrap"
              >
                Explore Trade-offs
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Visual Comparison Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid md:grid-cols-2 gap-8"
        >
          {/* Token Card */}
          <motion.article
            className="bg-lab-panel/50 backdrop-blur-sm border border-lab-info/30 rounded-2xl p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-lab-infoBg/50 border border-lab-info/30 flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-lab-info" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-lab-text">Token Reasoning</h3>
                <p className="text-sm text-lab-textMuted">Chain-of-Thought Baseline</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8" role="list">
              {[
                'Visible intermediate computation as language',
                'High interpretability — read the reasoning',
                'Linear memory growth with context',
                'Fixed reasoning path once generated',
                'Easy to verify and debug',
                'Context window limited by KV cache',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-3 text-sm text-lab-textMuted"
                >
                  <div className="w-5 h-5 rounded-full border border-lab-info flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-lab-info" aria-hidden="true" />
                  </div>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>

            <motion.a
              href="/tokens"
              className="inline-flex items-center gap-2 text-sm font-medium text-lab-info hover:text-lab-accent transition-colors group"
            >
              Explore Token Reasoning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </motion.a>
          </motion.article>

          {/* Latent Card */}
          <motion.article
            className="bg-lab-panel/50 backdrop-blur-sm border border-lab-accent/30 rounded-2xl p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-lab-accentBg/50 border border-lab-accent/30 flex items-center justify-center">
                <Brain className="w-6 h-6 text-lab-accent" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-lab-text">Latent Reasoning</h3>
                <p className="text-sm text-lab-textMuted">Recurrent Hidden State</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8" role="list">
              {[
                'Computation in continuous hidden state space',
                'Fixed memory footprint regardless of depth',
                'Natural adaptive compute (early exit)',
                'Effectively infinite context window',
                'Compute efficiency at scale',
                'Requires probes for interpretability',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-3 text-sm text-lab-textMuted"
                >
                  <div className="w-5 h-5 rounded-full border border-lab-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-lab-accent" aria-hidden="true" />
                  </div>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>

            <motion.a
              href="/latents"
              className="inline-flex items-center gap-2 text-sm font-medium text-lab-accent hover:text-lab-info transition-colors group"
            >
              Explore Latent Reasoning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </motion.a>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
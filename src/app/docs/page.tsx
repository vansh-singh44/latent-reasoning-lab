'use client';

import React from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { EvidencePanel } from '@/components/research/EvidenceBadge';
import { motion } from 'framer-motion';
import { BookOpen, Code, FileText, Terminal, Link as LinkIcon, ArrowRight, ExternalLink, Code as CodeIcon } from 'lucide-react';

const DOC_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Quick start guide to running your first experiment.',
    icon: BookOpen,
    color: 'text-lab-accent',
    bgColor: 'bg-lab-accentBg/30',
    borderColor: 'border-lab-accent/30',
    items: [
      'Open the Experiments page',
      'Adjust the recurrent depth slider',
      'Choose token or latent mode',
      'Watch the model reason in real time',
    ],
  },
  {
    id: 'token-reasoning',
    title: 'Token Reasoning (CoT)',
    description: 'Traditional chain-of-thought reasoning with visible intermediate tokens.',
    icon: Code,
    color: 'text-lab-info',
    bgColor: 'bg-lab-infoBg/30',
    borderColor: 'border-lab-info/30',
    items: [
      'Visible intermediate computation',
      'Step-by-step token generation',
      'High interpretability',
      'Linear memory growth',
    ],
  },
  {
    id: 'latent-reasoning',
    title: 'Latent Recurrent Reasoning',
    description: 'Computation through repeated hidden state updates without visible tokens.',
    icon: Terminal,
    color: 'text-lab-accent',
    bgColor: 'bg-lab-accentBg/30',
    borderColor: 'border-lab-accent/30',
    items: [
      'Hidden state computation',
      'Fixed memory footprint',
      'Adaptive compute (early exit)',
      'Infinite effective context',
    ],
  },
  {
    id: 'bdh-cq',
    title: 'BDH / BDH-CQ Memory',
    description: 'How recurrent memory enables in-context learning through demonstrations.',
    icon: LinkIcon,
    color: 'text-lab-warning',
    bgColor: 'bg-lab-warningBg/30',
    borderColor: 'border-lab-warning/30',
    items: [
      'Demonstration memory updates',
      'Recurrent memory persistence',
      'In-context learning via recurrence',
      'BDH-CQ inspired mechanism',
    ],
  },
];

const API_REFERENCE = [
  { name: 'useExperimentStore', description: 'React hook for experiment state management', category: 'State' },
  { name: 'runExperiment', description: 'Execute a single reasoning experiment', category: 'Core' },
  { name: 'runRecurrentDepthSweep', description: 'Sweep recurrent depth and collect metrics', category: 'Core' },
  { name: 'ToyLatentReasoner', description: 'Core recurrent neural network class', category: 'Model' },
  { name: 'GridDisplay', description: 'Interactive grid visualization component', category: 'Viz' },
  { name: 'StateHeatmap', description: 'Heatmap visualization of hidden state', category: 'Viz' },
  { name: 'StateTrajectory', description: 'Trajectory visualization over steps', category: 'Viz' },
];

export default function DocsPage() {
  return (
    <PageLayout 
      title="Documentation" 
      description="Learn how to use Latent Reasoning Lab, understand the architecture, and integrate the components."
    >
      <motion.div className="space-y-16">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-accentBg/50 border border-lab-accent/30 text-lab-accent text-sm font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-lab-accent animate-pulse" aria-hidden="true" />
            Documentation
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-lab-text leading-tight mb-6">
            Documentation
          </h1>
          <p className="text-lg md:text-xl text-lab-textMuted max-w-2xl mx-auto">
            Complete guide to using Latent Reasoning Lab, understanding the experiments, and extending the platform.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold text-lab-text text-center mb-12">Core Concepts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOC_SECTIONS.map((section, i) => (
              <motion.article
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="group p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:shadow-lab-lg"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderColor: section.borderColor,
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: section.bgColor, border: `1px solid ${section.borderColor}` }}>
                  <section.icon className="w-6 h-6" style={{ color: section.color }} aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-semibold text-lab-text mb-2">{section.title}</h3>
                <p className="text-lab-textMuted mb-4 text-sm">{section.description}</p>
                <ul className="space-y-2 mb-6" role="list">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-lab-textMuted">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: section.color }} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-lab-border/30">
                  <a href={`/#${section.id}`} className="inline-flex items-center gap-1 text-sm font-medium transition-colors" style={{ color: section.color }}>
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="font-display text-3xl font-bold text-lab-text text-center mb-12">API Reference</h2>
          <motion.div
            className="overflow-hidden rounded-2xl border border-lab-border bg-lab-panel/30 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-lab-border bg-lab-panel/50">
                  <th className="px-6 py-4 text-left font-display text-sm font-semibold text-lab-textMuted uppercase tracking-wider">Function / Component</th>
                  <th className="px-6 py-4 text-left font-display text-sm font-semibold text-lab-textMuted uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left font-display text-sm font-semibold text-lab-textMuted uppercase tracking-wider">Category</th>
                </tr>
              </thead>
              <tbody>
                {API_REFERENCE.map((item, i) => (
                  <motion.tr
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className="border-b border-lab-border/50 hover:bg-lab-panel/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <code className="font-mono text-sm text-lab-accent bg-lab-panel/50 px-2 py-1 rounded">{item.name}</code>
                    </td>
                    <td className="px-6 py-4 text-lab-text text-sm">{item.description}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded bg-lab-panelHover text-lab-textMuted border border-lab-border">
                        {item.category}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold text-lab-text mb-4">Contribute</h2>
          <p className="text-lab-textMuted max-w-2xl mx-auto mb-8">
            Latent Reasoning Lab is open source. Contributions welcome — from bug fixes to new experiments.
          </p>
          <a 
            href="https://github.com/vansh-singh44/latent-reasoning-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Code className="w-5 h-5" aria-hidden="true" />
            View on GitHub
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </motion.section>
      </motion.div>
    </PageLayout>
  );
}
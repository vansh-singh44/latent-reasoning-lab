'use client';

import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { EvidencePanel } from '@/components/research/EvidenceBadge';
import { motion } from 'framer-motion';
import { Brain, Zap, GitBranch, Award, Users, Heart, Globe, Code, ArrowRight } from 'lucide-react';

const TEAM = [
  { name: 'Research Team', role: 'AI Reasoning Research', initials: 'RT' },
  { name: 'Engineering', role: 'Frontend & Visualization', initials: 'ENG' },
  { name: 'Design', role: 'UX & Visual Design', initials: 'DSN' },
];

const VALUES = [
  { icon: Brain, title: 'Research-First', desc: 'Every feature grounded in published research' },
  { icon: Code, title: 'Open Source', desc: 'MIT licensed, community-driven development' },
  { icon: Zap, title: 'Interactive Learning', desc: 'Hands-on experimentation over passive reading' },
  { icon: Award, title: 'Rigor', desc: 'Evidence badges on every result — no hidden assumptions' },
  { icon: Users, title: 'Accessibility', desc: 'Designed for students, researchers, and engineers' },
  { icon: Heart, title: 'Transparency', desc: 'LIVE TOY / PUBLISHED / TOY badges on everything' },
];

export default function AboutPage() {
  return (
    <PageLayout 
      title="About Latent Reasoning Lab" 
      description="An interactive laboratory for understanding how AI models reason — through visible tokens or hidden latent states."
    >
      <div className="space-y-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-accentBg/50 border border-lab-accent/30 text-lab-accent text-sm font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-lab-accent animate-pulse" aria-hidden="true" />
            About This Project
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-lab-text leading-tight mb-6">
            Latent Reasoning Lab
          </h1>
          <p className="text-lg md:text-xl text-lab-textMuted max-w-2xl mx-auto mb-10 leading-relaxed">
            An interactive laboratory for exploring how AI models reason — through visible token reasoning 
            or hidden latent recurrent reasoning. Built for the DataForge 2026 × Pathway Track.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-lab-accentBg/50 border border-lab-accent/30 text-lab-accent text-sm font-mono">
              <Award className="w-3 h-3" aria-hidden="true" />
              DataForge 2026
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-lab-infoBg/50 border border-lab-info/30 text-lab-info text-sm font-mono">
              <Globe className="w-3 h-3" aria-hidden="true" />
              Pathway Track
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-lab-warningBg/50 border border-lab-warning/30 text-lab-warning text-sm font-mono">
              <Code className="w-3 h-3" aria-hidden="true" />
              MIT License
            </span>
          </div>
        </motion.section>

        {/* The Problem */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold text-lab-text text-center mb-12">Why This Exists</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl border bg-lab-panel/30 backdrop-blur-sm"
              style={{ borderColor: 'rgba(0, 212, 170, 0.3)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-lab-accentBg/30 border border-lab-accent/30 flex items-center justify-center mb-4">
                <GitBranch className="w-6 h-6 text-lab-info" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold text-lab-text mb-3">Token Reasoning Shows Its Work</h3>
              <p className="text-lab-textMuted leading-relaxed">
                Traditional chain-of-thought reasoning generates visible intermediate tokens. 
                Each reasoning step is a human-readable word. This makes reasoning interpretable, 
                but it's limited by the context window and scales linearly with sequence length.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl border bg-lab-panel/30 backdrop-blur-sm"
              style={{ borderColor: 'rgba(0, 212, 170, 0.3)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-lab-accentBg/30 border border-lab-accent/30 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-lab-accent" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold text-lab-text mb-3">Latent Reasoning Thinks Silently</h3>
              <p className="text-lab-textMuted leading-relaxed">
                Recurrent latent reasoning repeatedly updates a hidden state vector without 
                generating visible tokens. It can "think more" without saying more — changing 
                the accuracy/latency/cost/observability Pareto frontier.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Values */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold text-lab-text text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((value, i) => (
              <motion.article
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="group p-6 rounded-2xl border transition-all duration-300 hover:shadow-lab-lg"
                style={{ 
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  borderColor: 'rgba(42, 53, 72, 0.5)',
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-lab-accentBg/30 border border-lab-accent/30 flex items-center justify-center mb-4">
                  <value.icon className="w-5 h-5 text-lab-accent" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-semibold text-lab-text mb-2">{value.title}</h3>
                <p className="text-lab-textMuted text-sm">{value.desc}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Evidence Discipline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold text-lab-text text-center mb-12">Evidence Discipline</h2>
          <p className="text-lab-textMuted text-center max-w-2xl mx-auto mb-12">
            Every result in Latent Reasoning Lab carries an evidence badge. 
            We distinguish between live toy computation, published results, and illustrative diagrams.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <EvidencePanel type="LIVE_TOY_COMPUTATION" title="LIVE TOY COMPUTATION" className="h-full">
              <p className="text-lab-textMuted mb-4">Computed in real-time in your browser from a toy model.</p>
              <ul className="space-y-2 text-sm text-lab-textMuted">
                <li>• Deterministic seeded RNG</li>
                <li>• 64D linear recurrent + ReLU</li>
                <li>• Real-time in browser</li>
              </ul>
            </EvidencePanel>
            <EvidencePanel type="PUBLISHED_RESULT" title="PUBLISHED RESULT" citation="Coconut, Recurrent Depth, TRM, BDH-CQ" className="h-full">
              <p className="text-lab-textMuted mb-4">Directly reported in cited research papers.</p>
              <ul className="space-y-2 text-sm text-lab-textMuted">
                <li>• Coconut (Hao et al., ICLR 2025)</li>
                <li>• Recurrent Depth (Geiping et al., NeurIPS 2025)</li>
                <li>• TRM (Jolicoeur-Martineau, 2025)</li>
              </ul>
            </EvidencePanel>
            <EvidencePanel type="TOY_PEDAGOGICAL" title="TOY / PEDAGOGICAL" className="h-full">
              <p className="text-lab-textMuted mb-4">Simplified simulation for teaching; not a research model.</p>
              <ul className="space-y-2 text-sm text-lab-textMuted">
                <li>• 64D linear recurrent toy</li>
                <li>• Illustrative mechanisms</li>
                <li>• Not a trained model</li>
              </ul>
            </EvidencePanel>
          </div>
        </motion.section>

        {/* Team */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold text-lab-text text-center mb-12">The Team</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {TEAM.map((member, i) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="text-center p-6 rounded-2xl border bg-lab-panel/30 backdrop-blur-sm group"
                style={{ borderColor: 'rgba(42, 53, 72, 0.5)' }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lab-accent to-lab-info flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <span className="font-display text-2xl font-bold text-lab-bg">{member.initials}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-lab-text mb-1">{member.name}</h3>
                <p className="text-sm text-lab-textMuted">{member.role}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold text-lab-text mb-4">Ready to Explore?</h2>
          <p className="text-lab-textMuted max-w-xl mx-auto mb-8">
            Start your first experiment and see how AI reasoning works beyond the final answer.
          </p>
          <a href="/experiments" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-lg">
            <Zap className="w-6 h-6" aria-hidden="true" />
            Start Experiment
            <ArrowRight className="w-6 h-6 ml-2" aria-hidden="true" />
          </a>
        </motion.section>
      </div>
    </PageLayout>
  );
}
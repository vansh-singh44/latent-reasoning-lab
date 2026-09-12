'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, ArrowRight, Brain, GitBranch, CheckCircle } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" aria-labelledby="cta-heading">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 212, 170, 0.08) 0%, transparent 70%)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lab-accent/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] -translate-x-1/4 translate-y-1/4 rounded-full bg-lab-info/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lab-accentBg/50 border border-lab-accent/30 text-lab-accent text-sm font-mono mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-lab-accent animate-pulse" aria-hidden="true" />
            Ready to Explore AI Reasoning?
          </motion.span>

          {/* Headline */}
          <motion.h2
            id="cta-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-lab-text leading-tight mb-6"
          >
            Run Your First Experiment
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-lab-textMuted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Adjust the thinking budget, choose your reasoning mode, and watch how the model 
            solves grid transformation tasks. See the difference between token and latent reasoning.
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm"
          >
            <div className="flex items-center gap-2 text-lab-textMuted">
              <CheckCircle className="w-4 h-4 text-lab-accent" aria-hidden="true" />
              <span className="font-medium text-lab-text">No setup required</span>
            </div>
            <div className="flex items-center gap-2 text-lab-textMuted">
              <CheckCircle className="w-4 h-4 text-lab-accent" aria-hidden="true" />
              <span className="font-medium text-lab-text">Runs in browser</span>
            </div>
            <div className="flex items-center gap-2 text-lab-textMuted">
              <CheckCircle className="w-4 h-4 text-lab-accent" aria-hidden="true" />
              <span className="font-medium text-lab-text">Real-time results</span>
            </div>
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/experiments"
              className="btn-primary group px-10 py-4 text-lg"
            >
              <Zap className="w-6 h-6 mr-2" aria-hidden="true" />
              Start Experiment
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              href="/research"
              className="btn-secondary px-10 py-4 text-lg"
            >
              <Brain className="w-6 h-6 mr-2" aria-hidden="true" />
              Explore Research
              <ArrowRight className="w-6 h-6 ml-2" aria-hidden="true" />
            </Link>
          </motion.div>

          {/* What you'll get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-16 grid md:grid-cols-3 gap-8 text-left"
          >
            <div className="flex items-start gap-3 p-4 rounded-xl bg-lab-panel/30 border border-lab-border/30">
              <div className="w-10 h-10 rounded-lg bg-lab-accentBg/30 border border-lab-accent/30 flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-5 h-5 text-lab-info" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-lab-text mb-1">Token Reasoning</h4>
                <p className="text-sm text-lab-textMuted">Chain-of-thought with visible steps</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-lab-panel/30 border border-lab-border/30">
              <div className="w-10 h-10 rounded-lg bg-lab-accentBg/30 border border-lab-accent/30 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-lab-accent" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-lab-text mb-1">Latent Reasoning</h4>
                <p className="text-sm text-lab-textMuted">Recurrent hidden state updates</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-lab-panel/30 border border-lab-border/30">
              <div className="w-10 h-10 rounded-lg bg-lab-warningBg/30 border border-lab-warning/30 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-lab-warning" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-lab-text mb-1">BDH-CQ Memory</h4>
                <p className="text-sm text-lab-textMuted">Recurrent memory + in-context learning</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
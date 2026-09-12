'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, ArrowRight, Brain, GitBranch, ExternalLink } from 'lucide-react';

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  connections: number[];
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<NeuralNode[]>([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const dpr = window.devicePixelRatio || 1;
    const newWidth = rect.width;
    const newHeight = rect.height;
    canvas.width = newWidth * dpr;
    canvas.height = newHeight * dpr;
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
    ctx.scale(dpr, dpr);
    setWidth(newWidth);
    setHeight(newHeight);

    // Initialize nodes
    const newNodes: NeuralNode[] = [];
    const nodeCount = Math.min(35, Math.floor((newWidth * newHeight) / 15000));
    const colors = ['#00d4aa', '#60a5fa', '#a78bfa', '#ffb84d'];

    for (let i = 0; i < nodeCount; i++) {
      newNodes.push({
        x: Math.random() * newWidth,
        y: Math.random() * newHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections: [],
      });
    }

    // Build connections
    for (let i = 0; i < nodeCount; i++) {
      const connections: number[] = [];
      for (let j = 0; j < nodeCount; j++) {
        if (i !== j && Math.random() < 0.08) {
          connections.push(j);
        }
      }
      newNodes[i].connections = connections;
    }

    setNodes(newNodes);

    let animationId: number;
    const animate = () => {
      if (!ctx || !canvasRef.current) return;
      
      ctx.clearRect(0, 0, newWidth, newHeight);

      // Draw connections
      for (let i = 0; i < newNodes.length; i++) {
        const node = newNodes[i];
        for (const connIdx of node.connections) {
          const other = newNodes[connIdx];
          if (!other) continue;
          
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 180) {
            const opacity = (1 - dist / 180) * 0.15 * node.opacity * other.opacity;
            const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
            gradient.addColorStop(0, node.color);
            gradient.addColorStop(1, other.color);
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Update and draw nodes
      for (const node of newNodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 20 || node.x > newWidth - 20) node.vx *= -1;
        if (node.y < 20 || node.y > newHeight - 20) node.vy *= -1;

        // Keep in bounds
        node.x = Math.max(20, Math.min(newWidth - 20, node.x));
        node.y = Math.max(20, Math.min(newHeight - 20, node.y));

        // Pulse opacity
        node.opacity = 0.3 + Math.sin(Date.now() * 0.001 + node.x * 0.01) * 0.2;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Glow effect
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 3);
        gradient.addColorStop(0, node.color + '40');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [width, height]);

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lab-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-lab-info/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lab-accent/5 blur-3xl" />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Neural network visualization */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-32 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-4xl"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lab-accentBg/50 border border-lab-accent/30 text-lab-accent text-sm font-mono mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-lab-accent animate-pulse" aria-hidden="true" />
            <span>Interactive AI Reasoning Research Platform</span>
            <span className="text-lab-textMuted">DataForge 2026 × Pathway</span>
          </motion.span>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-lab-text leading-tight mb-6 text-balance"
          >
            See How AI{' '}
            <span className="relative">
              <span className="relative z-10">Thinks</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-lab-accent/30 to-lab-info/30 rounded-full" aria-hidden="true" />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-lab-textMuted max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            An interactive laboratory for exploring how AI models reason — through visible tokens or hidden latent states. 
            Run experiments, compare approaches, and discover the trade-offs.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/experiments"
              className="btn-primary group px-8 py-3 text-base"
            >
              <Zap className="w-5 h-5 mr-2" aria-hidden="true" />
              Start Experiment
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              href="/research"
              className="btn-secondary px-8 py-3 text-base"
            >
              Explore Research
              <ExternalLink className="w-5 h-5 ml-2" aria-hidden="true" />
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-lab-textMuted"
          >
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-lab-accent" aria-hidden="true" />
              <span>Token Reasoning (CoT)</span>
            </div>
            <div className="w-px h-6 bg-lab-border" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-lab-info" aria-hidden="true" />
              <span>Latent Recurrent Reasoning</span>
            </div>
            <div className="w-px h-6 bg-lab-border" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-lab-warning" aria-hidden="true" />
              <span>BDH-CQ Memory</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-lab-textMuted"
          aria-hidden="true"
        >
          <span className="text-xs font-mono uppercase tracking-wider">Scroll to explore</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
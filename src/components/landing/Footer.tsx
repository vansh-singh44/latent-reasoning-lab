'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Github, Twitter, Mail, ExternalLink } from 'lucide-react';

const FOOTER_LINKS = {
  product: [
    { label: 'Experiments', href: '/experiments' },
    { label: 'Token Reasoning', href: '/tokens' },
    { label: 'Latent Reasoning', href: '/latents' },
    { label: 'BDH / BDH-CQ', href: '/bdh' },
    { label: 'Failure Lab', href: '/failure-lab' },
    { label: 'Challenge', href: '/challenge' },
  ],
  resources: [
    { label: 'Research', href: '/research' },
    { label: 'Evidence', href: '/evidence' },
    { label: 'Documentation', href: '/docs' },
    { label: 'About', href: '/about' },
  ],
  community: [
    { label: 'GitHub', href: 'https://github.com/vansh-singh44/latent-reasoning-lab', external: true },
    { label: 'Report Issue', href: 'https://github.com/vansh-singh44/latent-reasoning-lab/issues', external: true },
    { label: 'Contact', href: 'mailto:hello@latentreasoninglab.dev', external: true },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-lab-panel/50 backdrop-blur-sm border-t border-lab-border" aria-labelledby="footer-heading">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 w-[600px] h-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lab-accent/5 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Brand */}
          <div className="lg:col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6" aria-label="Latent Reasoning Lab home">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lab-accent to-lab-info flex items-center justify-center">
                <Zap className="w-6 h-6 text-lab-bg" aria-hidden="true" />
              </div>
              <span className="font-display text-xl font-semibold text-lab-text">Latent Reasoning Lab</span>
            </Link>
            <p className="text-lab-textMuted text-sm md:text-base max-w-xs leading-relaxed mb-6">
              An interactive laboratory for understanding how AI models reason — through visible tokens or hidden latent states.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/vansh-singh44/latent-reasoning-lab" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-lab-textMuted hover:text-lab-text hover:bg-lab-panelHover transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-lab-textMuted hover:text-lab-text hover:bg-lab-panelHover transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </a>
              <a 
                href="mailto:hello@latentreasoninglab.dev"
                className="p-2 rounded-lg text-lab-textMuted hover:text-lab-text hover:bg-lab-panelHover transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <nav aria-label="Product">
            <h4 className="font-display font-semibold text-lab-text mb-4">Product</h4>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-lab-textMuted hover:text-lab-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <h4 className="font-display font-semibold text-lab-text mb-4">Resources</h4>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-lab-textMuted hover:text-lab-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Community */}
          <nav aria-label="Community">
            <h4 className="font-display font-semibold text-lab-text mb-4">Community</h4>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.community.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-2 text-sm text-lab-textMuted hover:text-lab-text transition-colors"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3" aria-hidden="true" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-lab-border/50 mb-8" role="separator" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-lab-textMuted">
            © {new Date().getFullYear()} Latent Reasoning Lab. Built for DataForge 2026 × Pathway Track.
          </p>
          <div className="flex items-center gap-6 text-sm text-lab-textMuted">
            <span className="font-mono">MIT License</span>
            <span className="hidden sm:inline">|</span>
            <span className="font-mono">Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
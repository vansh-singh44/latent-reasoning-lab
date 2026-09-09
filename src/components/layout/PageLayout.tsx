'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Braces, 
  GitBranch, 
  FlaskConical, 
  BookOpen, 
  AlertTriangle, 
  HelpCircle,
  Brain,
  Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home, short: 'Home' },
  { href: '/tokens', label: 'Think in Tokens', icon: Braces, short: 'Tokens' },
  { href: '/latents', label: 'Think in Latents', icon: GitBranch, short: 'Latents' },
  { href: '/bdh', label: 'BDH / BDH-CQ', icon: Brain, short: 'BDH' },
  { href: '/experiments', label: 'Experiments', icon: FlaskConical, short: 'Expts' },
  { href: '/evidence', label: 'Evidence', icon: BookOpen, short: 'Evidence' },
  { href: '/failure-lab', label: 'Failure Lab', icon: AlertTriangle, short: 'Failures' },
  { href: '/challenge', label: 'Challenge', icon: HelpCircle, short: 'Quiz' },
];

export function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav 
      className="fixed left-0 top-0 z-40 h-full w-16 bg-lab-panel/95 backdrop-blur-md border-r border-lab-border flex flex-col"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex flex-col flex-1 py-4 gap-1 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-3 rounded-lg transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-accent',
                isActive
                  ? 'bg-lab-accentBg text-lab-accent'
                  : 'text-lab-textMuted hover:text-lab-text hover:bg-lab-panelHover'
              )}
              aria-current={isActive ? 'page' : undefined}
              title={item.label}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-[10px] font-mono uppercase tracking-wider whitespace-nowrap">
                {item.short}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Status indicator */}
      <div className="p-2 border-t border-lab-border">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-lab-accentBg border border-lab-accent/30">
          <Zap className="w-4 h-4 text-lab-accent" aria-hidden="true" />
          <span className="text-[10px] font-mono text-lab-accent">LIVE</span>
        </div>
      </div>
    </nav>
  );
}

export function TopBar({ children }: { children?: React.ReactNode }) {
  return (
    <header className="fixed top-0 left-16 right-0 z-30 h-14 bg-lab-panel/90 backdrop-blur-md border-b border-lab-border flex items-center px-6 gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lab-accent to-lab-info flex items-center justify-center">
          <Zap className="w-5 h-5 text-lab-bg" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-display text-lg font-semibold text-lab-text">Latent Reasoning Lab</h1>
          <p className="text-[11px] text-lab-textMuted font-mono">DataForge 2026 × Pathway</p>
        </div>
      </div>
      
      <div className="flex-1" />
      
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </header>
  );
}

export function PageLayout({ children, title, description }: { 
  children: React.ReactNode; 
  title?: string; 
  description?: string;
}) {
  return (
    <div className="min-h-screen flex">
      <Navigation />
      <div className="flex-1 ml-16 flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 pt-20 overflow-auto">
          <div className="max-w-7xl mx-auto animate-in">
            {(title || description) && (
              <header className="mb-6 pb-4 border-b border-lab-border">
                {title && <h2 className="font-display text-2xl font-semibold text-lab-text mb-1">{title}</h2>}
                {description && <p className="text-lab-textMuted text-sm max-w-2xl">{description}</p>}
              </header>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
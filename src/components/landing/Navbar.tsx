'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, Sun, Moon, Zap, Keyboard } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/experiments', label: 'Experiments' },
  { href: '/research', label: 'Research' },
  { href: '/docs', label: 'Documentation' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setIsDark(stored === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Handle shortcuts
      switch (e.key.toLowerCase()) {
        case 'd':
          if (e.altKey || e.metaKey || e.ctrlKey) {
            e.preventDefault();
            toggleTheme();
          }
          break;
        case 'r':
          if (e.altKey || e.metaKey || e.ctrlKey) {
            e.preventDefault();
            // Trigger re-run experiment if on experiments page
            const event = new CustomEvent('rerun-experiment');
            window.dispatchEvent(event);
          }
          break;
        case 'k':
          if (e.altKey || e.metaKey || e.ctrlKey) {
            e.preventDefault();
            setShowShortcuts(!showShortcuts);
          }
          break;
        case 'escape':
          setIsMobileMenuOpen(false);
          setShowShortcuts(false);
          break;
        case '/':
          if (e.altKey || e.metaKey || e.ctrlKey) {
            e.preventDefault();
            setShowShortcuts(!showShortcuts);
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          if (e.altKey || e.metaKey || e.ctrlKey) {
            e.preventDefault();
            const index = parseInt(e.key) - 1;
            const links = ['/', '/experiments', '/research', '/docs', '/about'];
            if (links[index]) {
              window.location.href = links[index];
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDark, showShortcuts]);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-lab-panel/95 backdrop-blur-md border-b border-lab-border shadow-lab' : 'bg-transparent'
    )}>
      <nav className="mx-auto max-w-7xl px-6" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Latent Reasoning Lab home">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lab-accent to-lab-info flex items-center justify-center">
              <Zap className="w-5 h-5 text-lab-bg" aria-hidden="true" />
            </div>
            <span className="font-display text-lg font-semibold text-lab-text">Latent Reasoning Lab</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {NAV_LINKS.map((link, index) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200 relative',
                    isActive
                      ? 'text-lab-accent'
                      : 'text-lab-textMuted hover:text-lab-text'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`${link.label} ${index + 1 === 1 ? '(Alt+1)' : index + 1 === 2 ? '(Alt+2)' : index + 1 === 3 ? '(Alt+3)' : index + 1 === 4 ? '(Alt+4)' : '(Alt+5)'}`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-[-8px] left-1/2 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-lab-accent" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Keyboard Shortcuts */}
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="p-2 rounded-lg text-lab-textMuted hover:text-lab-text hover:bg-lab-panelHover transition-colors"
              aria-label="Show keyboard shortcuts (Alt+K)"
            >
              <Keyboard className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-lab-textMuted hover:text-lab-text hover:bg-lab-panelHover transition-colors"
              aria-label={isDark ? 'Switch to light mode (Alt+D)' : 'Switch to dark mode (Alt+D)'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Get Started CTA */}
            <Link
              href="/experiments"
              className="hidden md:btn-primary text-sm"
            >
              Get Started
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-lab-textMuted hover:text-lab-text hover:bg-lab-panelHover transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-lab-border animate-in">
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-lab-accentBg text-lab-accent'
                        : 'text-lab-textMuted hover:text-lab-text hover:bg-lab-panelHover'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-lab-border flex flex-col gap-2">
                <button
                  onClick={toggleTheme}
                  className="btn-secondary text-sm justify-center"
                >
                  {isDark ? '☀️ Light' : '🌙 Dark'}
                </button>
                <Link href="/experiments" className="btn-primary text-sm text-center">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Modal */}
        {showShortcuts && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
            <div className="bg-lab-panel border border-lab-border rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto animate-in">
              <div className="flex items-center justify-between mb-6">
                <h2 id="shortcuts-title" className="font-display text-xl font-semibold text-lab-text">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="p-1 rounded-lg text-lab-textMuted hover:text-lab-text hover:bg-lab-panelHover transition-colors"
                  aria-label="Close shortcuts"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <dl className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <dt className="text-lab-textMuted text-sm">Theme</dt>
                  <dd className="font-mono text-sm text-lab-accent">Alt + D</dd>
                  
                  <dt className="text-lab-textMuted text-sm">Re-run Experiment</dt>
                  <dd className="font-mono text-sm text-lab-accent">Alt + R</dd>
                  
                  <dt className="text-lab-textMuted text-sm">Shortcuts Help</dt>
                  <dd className="font-mono text-sm text-lab-accent">Alt + K / ?</dd>
                  
                  <dt className="text-lab-textMuted text-sm">Navigate Home</dt>
                  <dd className="font-mono text-sm text-lab-accent">Alt + 1</dd>
                  
                  <dt className="text-lab-textMuted text-sm">Navigate Experiments</dt>
                  <dd className="font-mono text-sm text-lab-accent">Alt + 2</dd>
                  
                  <dt className="text-lab-textMuted text-sm">Navigate Research</dt>
                  <dd className="font-mono text-sm text-lab-accent">Alt + 3</dd>
                  
                  <dt className="text-lab-textMuted text-sm">Navigate Docs</dt>
                  <dd className="font-mono text-sm text-lab-accent">Alt + 4</dd>
                  
                  <dt className="text-lab-textMuted text-sm">Navigate About</dt>
                  <dd className="font-mono text-sm text-lab-accent">Alt + 5</dd>
                </div>
              </dl>
              
              <button
                onClick={() => setShowShortcuts(false)}
                className="mt-6 btn-primary w-full"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
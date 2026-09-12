'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, Sun, Moon, Zap } from 'lucide-react';

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
  const [isDark, setIsDark] = useState(true);

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
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

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
            {NAV_LINKS.map((link) => {
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
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-lab-textMuted hover:text-lab-text hover:bg-lab-panelHover transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
              <div className="pt-4 border-t border-lab-border flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="flex-1 btn-secondary text-sm justify-center"
                >
                  {isDark ? '☀️ Light' : '🌙 Dark'}
                </button>
                <Link href="/experiments" className="flex-1 btn-primary text-sm text-center">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
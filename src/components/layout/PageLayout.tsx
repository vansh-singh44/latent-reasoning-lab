'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export function PageLayout({ children, title, description }: { 
  children: React.ReactNode; 
  title?: string; 
  description?: string;
}) {
  return (
    <div className="min-h-screen bg-lab-bg flex flex-col">
      <Navbar />
      <div className="flex-1">
        <main className="pt-0">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:py-12 animate-in">
            {(title || description) && (
              <header className="mb-8 lg:mb-12">
                {title && <h1 className="font-display text-3xl md:text-4xl font-bold text-lab-text mb-2">{title}</h1>}
                {description && <p className="text-lab-textMuted text-lg max-w-3xl">{description}</p>}
              </header>
            )}
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export function Navigation() {
  return null; // Deprecated - use Navbar instead
}

export function TopBar({ children }: { children?: React.ReactNode }) {
  return null; // Deprecated - use Navbar instead
}
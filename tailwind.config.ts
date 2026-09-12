import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lab: {
          // Light/Cream theme
          bg: '#faf9f6',           // Cream white
          bgAlt: '#f5f3ef',        // Slightly darker cream
          panel: '#ffffff',        // Pure white panels
          panelHover: '#faf9f6',   // Cream on hover
          border: '#e5e2db',       // Light border
          borderBright: '#d8d4cb', // Slightly darker border
          text: '#1a1a1a',         // Near black text
          textMuted: '#6b6b6b',    // Muted gray text
          accent: '#00a878',       // Teal green (accessible on light)
          accentDim: '#008f66',    // Darker teal
          accentBg: '#e8f5ee',     // Light teal background
          warning: '#d4a017',      // Gold/amber
          warningBg: '#fef3e2',    // Light warning background
          danger: '#d64545',       // Red
          dangerBg: '#fef2f2',     // Light danger background
          info: '#2563eb',         // Blue
          infoBg: '#eff6ff',       // Light info background
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'state-pulse': 'statePulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        statePulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      boxShadow: {
        'lab': '0 4px 24px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.04)',
        'lab-lg': '0 8px 48px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.04)',
        'inner-glow': 'inset 0 0 20px rgba(0, 168, 120, 0.1)',
      },
    },
  },
  plugins: [typography],
};

export default config;
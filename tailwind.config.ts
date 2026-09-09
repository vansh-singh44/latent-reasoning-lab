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
          bg: '#0a0f1a',
          panel: '#111827',
          panelHover: '#1a2234',
          border: '#2a3548',
          borderBright: '#3d4a6b',
          text: '#e8edf5',
          textMuted: '#8b9ab8',
          accent: '#00d4aa',
          accentDim: '#00a888',
          accentBg: '#052e26',
          warning: '#ffb84d',
          warningBg: '#3d2a0a',
          danger: '#ff6b6b',
          dangerBg: '#3d1a1a',
          info: '#60a5fa',
          infoBg: '#1a2a4a',
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
        'lab': '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.05)',
        'lab-lg': '0 8px 48px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.05)',
        'inner-glow': 'inset 0 0 20px rgba(0, 212, 170, 0.1)',
      },
    },
  },
  plugins: [typography],
};

export default config;
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/sections/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#05060a',
          900: '#0a0c14',
          800: '#0f1220',
          700: '#161a2e',
        },
        electric: '#3b82f6',
        violet: '#7c3aed',
        cyan: '#06b6d4',
        muted: '#8b93a7',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        mega: 'clamp(2.75rem, 11vw, 12rem)',
        display: 'clamp(2.25rem, 7vw, 6rem)',
      },
      backgroundImage: {
        aurora:
          'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(59,130,246,0.22), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 20%, rgba(124,58,237,0.18), transparent 55%), radial-gradient(ellipse 70% 60% at 50% 100%, rgba(6,182,212,0.14), transparent 60%)',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        card: 'var(--card)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        info: 'var(--info)',
        brand: {
          ink: 'var(--brand-ink)',
          navy: 'var(--brand-navy)',
          gold: 'var(--brand-gold)',
          teal: 'var(--brand-teal)',
        },
        'brand-panel': {
          DEFAULT: 'var(--brand-navy)',
          foreground: 'var(--brand-panel-foreground)',
          strong: 'var(--brand-panel-strong)',
          quiet: 'var(--brand-panel-quiet)',
          soft: 'var(--brand-panel-soft)',
          muted: 'var(--brand-panel-muted)',
          dim: 'var(--brand-panel-dim)',
          faint: 'var(--brand-panel-faint)',
          border: 'var(--brand-panel-border)',
          'border-strong': 'var(--brand-panel-border-strong)',
          'border-active': 'var(--brand-panel-border-active)',
          hover: 'var(--brand-panel-hover)',
          active: 'var(--brand-panel-active)',
          surface: 'var(--brand-panel-surface)',
          subtle: 'var(--brand-panel-subtle)',
          glass: 'var(--glass-surface)',
          'glass-border': 'var(--brand-panel-glass-border)',
          'gold-border': 'var(--brand-panel-gold-border)',
        },
        'status-info-surface': 'var(--status-info-surface)',
        'status-info-border': 'var(--status-info-border)',
        'status-success-surface': 'var(--status-success-surface)',
        'status-success-border': 'var(--status-success-border)',
        'status-warning-surface': 'var(--status-warning-surface)',
        'status-warning-border': 'var(--status-warning-border)',
        'status-destructive-surface': 'var(--status-destructive-surface)',
        'status-destructive-border': 'var(--status-destructive-border)',
        overlay: 'var(--overlay)',
        topbar: 'var(--topbar)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        micro: '0.16em',
        eyebrow: '0.18em',
        brand: '0.19em',
        'eyebrow-wide': '0.22em',
      },
      spacing: {
        '4.5': '1.125rem',
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        DEFAULT: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 8px)',
        '2xl': 'calc(var(--radius) + 16px)',
      },
      width: {
        dialog: 'calc(100vw - 2rem)',
        drawer: 'min(20rem, calc(100vw - 2rem))',
      },
      minWidth: {
        select: '10rem',
        table: '42rem',
      },
      maxWidth: {
        shell: '96rem',
      },
      gridTemplateColumns: {
        auth: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        elevated: 'var(--shadow-elevated)',
        inset: 'var(--shadow-inset)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-float': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 360ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'soft-float': 'soft-float 9s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // MCR Design System Palette Tokens
        'mcr-black': '#050507',
        'mcr-surface': '#0A0A0E',
        'mcr-card': '#111116',
        'mcr-overlay': 'rgba(5, 5, 7, 0.82)',
        'mcr-subtle': 'rgba(255, 255, 255, 0.08)',
        'mcr-focus': 'rgba(6, 182, 212, 0.4)',
        'mcr-cyan': '#06B6D4',
        'mcr-pink': '#FF2A85',
        'mcr-orange': '#FF7A00',
        'mcr-green': '#10B981',
        'mcr-amber': '#F59E0B',
        'mcr-red': '#EF4444',
        'mcr-primary': '#FFFFFF',
        'mcr-secondary': '#E4E4E7',
        'mcr-muted': '#A1A1AA',
        'mcr-dim': '#52525B',

        background: '#050507',
        foreground: '#f1f5f9',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Geist Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'mcr-cyan': '0 0 35px -5px rgba(6, 182, 212, 0.25)',
        'mcr-neon': '0 0 40px -8px rgba(255, 42, 133, 0.3)',
        'card-elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.9)',
      },
      backdropBlur: {
        'mcr': '16px',
        'heavy': '24px',
      },
      backgroundImage: {
        'mcr-neon': 'linear-gradient(135deg, #FF5E62 0%, #FF9966 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #FF2A85 0%, #FF7A00 100%)',
      },
    },
  },
  plugins: [],
};

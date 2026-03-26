import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        surface: '#141416',
        'surface-border': '#1F1F23',
        primary: '#00FF6A',
        danger: '#FF3B3B',
        warning: '#FFB800',
        'text-primary': '#FAFAFA',
        'text-secondary': '#8B8B8B',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'count-up': 'count-up 0.6s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'confetti': 'confetti 0.8s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 106, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 106, 0.6)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'confetti': {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(0) rotate(360deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config

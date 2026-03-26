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
        'primary': '#9c3f00',
        'primary-container': '#ff7a2f',
        'primary-dim': '#893600',
        'on-primary': '#fff0ea',
        'on-primary-container': '#401500',
        'secondary': '#6d5a00',
        'secondary-container': '#fdd400',
        'on-secondary': '#fff2ce',
        'on-secondary-container': '#594a00',
        'tertiary': '#7a5400',
        'tertiary-container': '#fbb423',
        'on-tertiary-container': '#523700',
        'error': '#b02500',
        'error-container': '#f95630',
        'on-error': '#ffefec',
        'surface': '#f9f6f5',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f0ef',
        'surface-container': '#eae7e7',
        'surface-container-high': '#e4e2e1',
        'surface-container-highest': '#dfdcdc',
        'surface-dim': '#d6d4d3',
        'on-surface': '#2f2f2e',
        'on-surface-variant': '#5c5b5b',
        'outline': '#787676',
        'outline-variant': '#afadac',
        'inverse-surface': '#0e0e0e',
        'inverse-primary': '#fe6b00',
        background: '#f9f6f5',
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Be Vietnam Pro', 'sans-serif'],
        label: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-ring': 'pulse-ring 2s infinite ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(156, 63, 0, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(156, 63, 0, 0.3)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)', opacity: '0.3' },
          '100%': { transform: 'scale(0.95)', opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
export default config

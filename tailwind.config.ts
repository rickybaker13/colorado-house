import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          DEFAULT: '#c4956a',
          light: '#d4a574',
          pale: '#e8d5c0',
          warm: '#b8845c',
        },
        charcoal: {
          DEFAULT: '#1a1a2e',
          light: '#2d2d3f',
        },
        forest: {
          DEFAULT: '#2d5016',
          soft: '#4a7c59',
          mist: '#7da88a',
        },
        snow: '#fafaf8',
        cream: '#f5f0eb',
        'warm-gray': {
          DEFAULT: '#9a9590',
          light: '#c4bfba',
          dark: '#6b6560',
        },
        mountain: {
          blue: '#5b7f95',
          deep: '#3a5a6e',
          sky: '#8bb0c4',
        },
        dusk: '#6b5b73',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.15em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'subtle-pulse': 'subtlePulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #1a1a2e 0%, #2d2d3f 50%, #3a5a6e 100%)',
        'gradient-stone': 'linear-gradient(to bottom, #f5f0eb, #fafaf8)',
      },
    },
  },
  plugins: [],
}

export default config

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
          dark: '#4a4540',
        },
        mountain: {
          blue: '#5b7f95',
          deep: '#3a5a6e',
          sky: '#8bb0c4',
        },
        dusk: '#6b5b73',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /* Hero - massive impact */
        'display-hero': ['clamp(3.5rem, 9vw, 8rem)', { lineHeight: '1.0', letterSpacing: '-0.03em', fontWeight: '300' }],
        /* Page titles */
        'display-xl': ['clamp(3rem, 7vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '300' }],
        /* Section headings */
        'display-lg': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '300' }],
        /* Sub-section headings */
        'display-md': ['clamp(1.75rem, 3.5vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '300' }],
        /* Body text - generous for readability */
        'body-xl': ['1.375rem', { lineHeight: '1.75', fontWeight: '300' }],
        'body-lg': ['1.25rem', { lineHeight: '1.7', fontWeight: '300' }],
        'body-md': ['1.0625rem', { lineHeight: '1.7' }],
        /* Labels */
        'label': ['1rem', { lineHeight: '1.5', letterSpacing: '0.06em' }],
        'label-sm': ['0.9375rem', { lineHeight: '1.5', letterSpacing: '0.08em' }],
        /* Captions */
        'caption': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.18em' }],
        'caption-sm': ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.2em' }],
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

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          deep: '#0F1C15',
          dark: '#1F2A1D',
          mid: '#2D3A2A',
        },
        glass: {
          light: 'rgba(255,255,255,0.06)',
          medium: 'rgba(255,255,255,0.12)',
          strong: 'rgba(255,255,255,0.15)',
        },
        dimension: {
          sleep: '#A8D8FF',
          diet: '#FFD4A8',
          exercise: '#A8FFB4',
          stress: '#FFB8D4',
          risk: '#FFE8A8',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
      borderRadius: {
        glass: '8px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
}

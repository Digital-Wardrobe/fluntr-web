/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#09090b',
        black2: '#111113',
        black3: '#1c1c1f',
        gold: '#C9A84C',
        'gold-light': '#E2C97E',
        'gold-pale': '#F5EDD8',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        jost: ['Jost', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        sparkle: 'sparkle 8s ease-in-out infinite',
        fadeUp: 'fadeUp 0.8s ease forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        sparkle: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.06)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

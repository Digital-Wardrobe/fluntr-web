/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F6F7F9',
        surface: '#F4F5F7',
        ink: '#15171B',
        'ink-2': '#3A3D45',
        muted: '#767A85',
        'muted-soft': '#9AA0A6',
        accent: '#15171B',
        blue: '#0047FF',
        pill: '#3A3A3C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Source Serif 4"', 'serif'],
      },
      colors: {
        ink: 'rgb(18 22 27 / <alpha-value>)',
        paper: 'rgb(246 241 234 / <alpha-value>)',
        sand: 'rgb(232 221 208 / <alpha-value>)',
        clay: 'rgb(201 123 99 / <alpha-value>)',
        sun: 'rgb(242 166 90 / <alpha-value>)',
        moss: 'rgb(47 93 80 / <alpha-value>)',
        sea: 'rgb(31 122 140 / <alpha-value>)',
      },
      boxShadow: {
        soft: '0 18px 50px -30px rgba(18, 22, 27, 0.35)',
        card: '0 20px 60px -40px rgba(18, 22, 27, 0.4)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease-out both',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

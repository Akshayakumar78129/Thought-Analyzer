/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        growVertical: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        growVertical: 'growVertical 0.5s ease-out forwards'
      }
    },
  },
  plugins: [],
} 
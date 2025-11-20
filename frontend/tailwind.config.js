/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00FF88',
          dark: '#00CC6E',
          light: '#33FFA3'
        },
        secondary: {
          DEFAULT: '#FFA500',
          dark: '#FF8C00',
          light: '#FFB833'
        },
        danger: {
          DEFAULT: '#FF4444',
          dark: '#CC0000',
          light: '#FF6666'
        },
        neutral: {
          DEFAULT: '#2A2A2A',
          dark: '#1A1A1A',
          light: '#3A3A3A',
          lighter: '#4A4A4A'
        },
        success: '#00FF88',
        warning: '#FFA500',
        error: '#FF4444'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
      }
    },
  },
  plugins: [],
}

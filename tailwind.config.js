/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        background: '#f7f7f7',
        dark: {
          primary: '#FF8585',
          secondary: '#66E6DE',
          background: '#1a1a1a',
          card: '#2d2d2d',
          text: '#e5e5e5',
          muted: '#9ca3af',
        },
      },
    },
  },
  plugins: [],
}
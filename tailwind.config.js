/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        teal: {
          accent: '#00d4aa',
        },
        dark: {
          bg: '#09090f',
        },
      },
    },
  },
  plugins: [],
}

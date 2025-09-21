/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#0a192f',
        'light-navy': '#112240',
        'slate': '#8892b0',
        'light-slate': '#a8b2d1',
        'white': '#e6f1ff',
        'accent': '#64ffda',
      }
    },
  },
  plugins: [],
}
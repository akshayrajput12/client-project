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
          teal: '#128F8B',
          bg: '#FFFFFF',
        },
        secondary: {
          teal: '#24D4C6',
          bg: '#E0E0E0',
        },
        text: {
          primary: '#000000',
        },
        error: '#EA6B66',
      },
    },
  },
  plugins: [],
}
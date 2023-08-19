/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lavender-blush': '#EEE5E9',
        'photo-blue': '#92DCE5',
        'gunmetal': '#2B303A',
        'gray': '#7C7C7C',
      },
    },
  },
  plugins: [],
}
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
        'primary': '#6940C7',
        'gray': '#5e5e5e',
      },
    },
  },
  plugins: [],
}
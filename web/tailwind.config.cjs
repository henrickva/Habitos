/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        'glass': 'rgba(255, 255, 255, 0.2)'
      },
      gridTemplateRows: {
        7: 'repeat(7, minmax(0,1fr))'
      }
    },
  },
  plugins: [],
}

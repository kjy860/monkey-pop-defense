/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grassBg: '#2D6A4F',
        grassTrack: '#DDB892',
        desertBg: '#E9C46A',
        desertWater: '#48CAE4',
        desertTrack: '#C69C6D',
        volcanoBg: '#2B2D42',
        volcanoMagma: '#D90429',
        volcanoTrack: '#4A4E69',
        panel: '#1B4332',
        btnGreen: '#2A9D8F',
        btnRed: '#E76F51',
        gold: '#FFB703',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        customFont: ["pixelmix", "sans-serif"],
        sans: ['pixelmix', 'sans'], // Reemplaza 'MiFuente' con el nombre real de tu fuente
        'sans-bold': ['pixelmix_bold', 'sans'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}


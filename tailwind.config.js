/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    
    extend: {
      colors: {
        customColor: {
          rosador: '#F8858C',
          azulitos: '#3A5A68',
          grisr: '#BCBCCC',
          grisc: '#E2E4E6',
          azulc: '#52B2B9',
        },
      },
    },
  },
  plugins: [],
}

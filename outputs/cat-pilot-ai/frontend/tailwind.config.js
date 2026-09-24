/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cat: '#f5c518',
        ink: '#0a0b0c',
        panel: '#141619',
        safe: '#37d67a',
        danger: '#ff4d4f',
      },
    },
  },
  plugins: [],
};

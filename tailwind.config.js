module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
        cursive: ['Dancing Script', 'cursive'],
      },
      colors: {
        gold: '#C9A86B',
        black: '#181818',
      },
    },
  },
  plugins: [],
};

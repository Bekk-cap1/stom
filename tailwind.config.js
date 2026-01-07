export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Onest', 'sans-serif'],
        display: ['Unbounded', 'Onest', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 60px -35px rgba(15, 32, 44, 0.45)',
        lift: '0 18px 45px -30px rgba(15, 32, 44, 0.4)',
      },
    },
  },
  plugins: [],
}

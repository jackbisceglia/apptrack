/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sen: "sen, sans-serif",
      },
      fontSize: {
        loginHeader: "clamp(1.88rem, calc(-2.5rem + 21.88vw), 6.25rem)",
        header: "clamp(1.88rem, calc(-2.5rem + 21.88vw), 4.5rem)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")], 
  content: ['./src/**/*.tsx'],
  safelist: [
    'opacity-0',
    'opacity-100'
  ]
};
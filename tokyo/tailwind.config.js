/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sen: "sen, sans-serif",
      },
      fontSize: {
        header: "clamp(1.88rem, calc(-2.5rem + 21.88vw), 6.25rem)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

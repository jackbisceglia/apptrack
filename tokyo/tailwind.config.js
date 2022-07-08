/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sen: "sen, sans-serif",
      },
      fontSize: {
        header: "var(--step-0)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

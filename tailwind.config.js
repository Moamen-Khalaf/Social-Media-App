/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--primary))",
        secondary: "rgb(var(--secondary))",
        accent: "rgb(var(--accent))",
        customRed: "rgb(var(--customRed))",
        customGray: {
          light: "rgb(var(--light))",
          DEFAULT: "rgb(var(--DEFAULT))",
          dark: "rgb(var(--dark))",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

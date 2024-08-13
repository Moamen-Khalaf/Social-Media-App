/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#f1f1f1",
        secondary: "#ffffff",
        accent: "#00acff",
        customRed: "#ff0101",
        customGray: {
          light: "#D1D5DB",
          DEFAULT: "#6B7280",
          dark: "#4B5563",
        },
      },
    },
    plugins: [],
  },
};

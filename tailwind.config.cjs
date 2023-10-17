/** @type {import('tailwindcss').Config}*/
const defaultTheme = require("tailwindcss/defaultTheme");
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["text-sm", "text-xs", "text-base", "text-lg", "text-xl",
            "w-32", "w-28", "w-48", "h-48", "h-32", "h-28"],
  theme: {
    container: {
      padding: "2rem",
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },

  plugins: [],
};

module.exports = config;

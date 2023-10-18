/** @type {import('tailwindcss').Config}*/
const defaultTheme = require("tailwindcss/defaultTheme");
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["text-sm", "text-xs", "text-base", "text-lg", "text-xl",
            "w-32", "w-28", "w-48", "h-48", "h-32", "h-28",
           "to-[#ff0000]", "to-[#00ff00]", "to-[#0000ff]",  "to-[#00ffff]", "to-[#ff00ff]", "to-[#ffff00]", "to-[#000000]"
          ],
  theme: {
    container: {
      padding: "2rem",
      center: true,
    },
    extend: {
      colors: {
        'magenta': '#ff00ff'
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },

  plugins: [],
};

module.exports = config;

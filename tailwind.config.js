import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: [
    "dark",
    "text-sm",
    "text-xs",
    "text-base",
    "text-lg",
    "text-xl",
    "text-inherit",
    "w-32",
    "w-28",
    "w-48",
    "w-64",
    "w-72",
    "w-96",
    "w-full",
    "h-48",
    "h-32",
    "h-28",
    "h-64",
    "h-72",
    "h-96",
    "h-full",
    "m-0",
    "p-0",
    "to-[#ff0000]",
    "to-[#00ff00]",
    "to-[#0000ff]",
    "to-[#00ffff]",
    "to-[#ff00ff]",
    "to-[#ffff00]",
    "to-[#000000]",
    "w-fit",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        magenta: "#ff00ff",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ["Inter var", '"Inter"', ...fontFamily.sans],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
};

export default config;

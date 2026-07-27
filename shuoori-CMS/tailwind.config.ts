import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101827",
        muted: "#4A5462",
        brand: "#2EB8AA",
        surface: "#FCFBF8",
        terracotta: {
          DEFAULT: "#C86B4D",
          hover: "#B65E41",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "sans-serif"],
        serif: ["Lora", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
}

export default config

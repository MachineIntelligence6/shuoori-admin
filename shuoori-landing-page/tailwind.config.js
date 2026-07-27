/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: "var(--text-xs)",
        sm: "var(--text-sm)",
        base: "var(--text-base)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
        "5xl": "var(--text-5xl)",
        "6xl": "var(--text-6xl)",
      },
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        primary: "var(--color-primary)",
        "primary-contrast": "var(--color-primary-contrast)",
        accent: "var(--color-accent)",
        header: "var(--color-header-bg)",
        border: "var(--color-border)",
        muted: "var(--color-muted)",
        text: {
          base: "var(--color-text)",
          muted: "var(--color-text-muted)",
        },
      },
      boxShadow: {
        primary: "var(--shadow-primary)",
        soft: "var(--shadow-soft)",
      },
    },
  },
  plugins: [],
}

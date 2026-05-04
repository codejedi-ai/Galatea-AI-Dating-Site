import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
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
        // ===== GALATEA SEMANTIC TOKENS =====
        "g-page":    "rgb(var(--g-page-rgb) / <alpha-value>)",
        "g-surface": "rgb(var(--g-surface-rgb) / <alpha-value>)",
        "g-nav":     "rgb(var(--g-nav-rgb) / <alpha-value>)",

        "g-surface-alt":      "var(--g-surface-alt)",
        "g-border":           "var(--g-border)",
        "g-text":             "var(--g-text)",
        "g-muted":            "var(--g-muted)",
        "g-subtle":           "var(--g-subtle)",
        "g-accent":           "var(--g-accent)",
        "g-accent-hover":     "var(--g-accent-hover)",
        "g-accent-text":      "var(--g-accent-text)",
        "g-footer":           "var(--g-footer)",
        "g-input":            "var(--g-input-bg)",
        "g-input-border":     "var(--g-input-border)",
        "g-loading":          "var(--g-loading-bg)",
        "g-loading-accent":   "var(--g-loading-accent)",
        "g-loading-accent-2": "var(--g-loading-accent-2)",

        // ===== LIGHT THEME PALETTE (commit 391538a) =====
        ivory: {
          100: "#FFFFF0",
          200: "#FEFCEB",
        },
        earth: {
          100: "#E5D9C9",
          200: "#D3C1A8",
          300: "#C1A987",
          400: "#AF9166",
          500: "#9D7945",
          600: "#7A5F36",
          700: "#574527",
          800: "#342B18",
        },
        rose: {
          50:  "#FFF1F2",
          100: "#FFE4E6",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
        },

        // ===== DARK THEME PALETTE =====
        teal: {
          50:  "#e6fcff",
          100: "#c2f9ff",
          200: "#8ff2ff",
          300: "#4ee6ff",
          400: "#1cd8ff",
          500: "#00c4f0",
          600: "#009bc2",
          700: "#007a9e",
          800: "#006380",
          900: "#00526a",
          950: "#003544",
        },

        // ===== SHADCN/UI COMPATIBILITY =====
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 10px var(--g-loading-accent)" },
          "50%":      { boxShadow: "0 0 20px var(--g-loading-accent), 0 0 30px var(--g-loading-accent-2)" },
        },
        shimmer: {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        pulse:   "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow:    "glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        // Semantic colors using the new palette
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        badge: {
          DEFAULT: "hsl(var(--badge))",
          foreground: "hsl(var(--badge-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Palette colors with full shade scale
        "dark-pastel-green": {
          DEFAULT: "#3eb141",
          100: "#0c230d",
          200: "#19471a",
          300: "#256a28",
          400: "#328e35",
          500: "#3eb141",
          600: "#5fc762",
          700: "#87d58a",
          800: "#afe3b1",
          900: "#d7f1d8",
        },
        "lavender-web": {
          DEFAULT: "#d0cfec",
          100: "#1b193f",
          200: "#35337f",
          300: "#5451ba",
          400: "#9290d3",
          500: "#d0cfec",
          600: "#dad9f0",
          700: "#e3e3f4",
          800: "#ececf7",
          900: "#f6f6fb",
        },
        "dark-green": {
          DEFAULT: "#01200f",
          100: "#000603",
          200: "#000c06",
          300: "#011208",
          400: "#01180b",
          500: "#01200f",
          600: "#047b39",
          700: "#07d865",
          800: "#45f996",
          900: "#a2fccb",
        },
        fawn: {
          DEFAULT: "#fcb97d",
          100: "#4a2302",
          200: "#934704",
          300: "#dd6a06",
          400: "#fa9034",
          500: "#fcb97d",
          600: "#fcc798",
          700: "#fdd5b1",
          800: "#fee3cb",
          900: "#fef1e5",
        },
        burgundy: {
          DEFAULT: "#70161e",
          100: "#160406",
          200: "#2c090c",
          300: "#420d12",
          400: "#591217",
          500: "#70161e",
          600: "#ae222e",
          700: "#da424f",
          800: "#e68189",
          900: "#f3c0c4",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "infinite-scroll": {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(calc(-50% - var(--gap) / 2))",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "infinite-scroll": "infinite-scroll linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

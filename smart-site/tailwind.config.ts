import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0B1020",
          700: "#1F2937",
          500: "#475569",
          300: "#94A3B8"
        },
        brand: {
          50: "#EEF4FF",
          100: "#DCE7FF",
          300: "#9DB7FF",
          500: "#3D6EFF",
          600: "#2B57E0",
          700: "#1E3FAE"
        },
        mint: {
          400: "#6EE7B7",
          500: "#34D399"
        },
        surface: {
          0: "#FFFFFF",
          50: "#F7F9FC",
          100: "#EEF2F7"
        }
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Hiragino Kaku Gothic ProN",
          "Hiragino Sans",
          "Noto Sans JP",
          "Yu Gothic",
          "Meiryo",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15, 23, 42, 0.06)",
        glow: "0 0 0 1px rgba(61,110,255,0.15), 0 12px 40px rgba(61,110,255,0.18)"
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 30% 20%, rgba(61,110,255,0.10), transparent 40%), radial-gradient(circle at 80% 60%, rgba(110,231,183,0.10), transparent 45%)"
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        }
      },
      animation: {
        floaty: "floaty 4s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;

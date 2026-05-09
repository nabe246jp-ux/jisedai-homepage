import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0f",
        gold: "#d4a574",
        amber: "#f5b942",
        sakura: "#f5c6d6",
        moss: "#7a9b6e",
        deepblue: "#0e1a3a",
      },
      fontFamily: {
        serif: ["'Hiragino Mincho ProN'", "'Yu Mincho'", "serif"],
        sans: ["'Hiragino Kaku Gothic ProN'", "'Yu Gothic'", "system-ui", "sans-serif"],
        display: ["'Cinzel'", "'Hiragino Mincho ProN'", "serif"],
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

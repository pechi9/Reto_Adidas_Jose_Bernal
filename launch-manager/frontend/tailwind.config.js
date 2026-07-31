/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#170030",
          900: "#240046",
          800: "#300A5C",
          700: "#3C1870",
          600: "#4D2C86",
          500: "#5F3F9D",
        },
        mist: {
          400: "#A99BC7",
          200: "#DDD6EE",
          50: "#F6F3FB",
        },
        signal: {
          amber: "#8E1DC1",       // acento principal / "en revisión"
          amberSoft: "#341446",   // fondo chip (derivado, oscurecido)
          green: "#33B200",
          greenSoft: "#132E0A",
          greenDeep: "#008CB2",   // "publicado"
          greenDeepSoft: "#0A2C36",
          red: "#A71900",
          redSoft: "#33100A",
          slate: "#7500A8",       // "borrador"
          slateSoft: "#2A1240",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 12px 32px -16px rgba(0,0,0,0.6)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
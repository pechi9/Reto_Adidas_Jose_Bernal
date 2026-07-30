/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0F18",
          900: "#0F1420",
          800: "#171E2E",
          700: "#1D2537",
          600: "#2A3348",
          500: "#3A4560",
        },
        mist: {
          400: "#8A93AB",
          200: "#C7CDDC",
          50: "#EDEFF4",
        },
        signal: {
          amber: "#E8A23D",
          amberSoft: "#3A2E1C",
          green: "#34D399",
          greenSoft: "#173229",
          greenDeep: "#0EA5A0",
          red: "#F0616B",
          redSoft: "#3A1E22",
          slate: "#7C8AA5",
          slateSoft: "#232B3D",
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

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14171F",
        paper: "#FBF9F6",
        slate: {
          650: "#4B5565",
        },
        amber: {
          scan: "#E8A33D",
        },
        teal: {
          match: "#2F9E8F",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        scan: "scan 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

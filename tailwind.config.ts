import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        coal: "#0B0B0B",
        ash: "#8E8E93",
        obsidian: "#7D5CFF",
        glow: "#A987FF",
        whisper: "#9CF4FF",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        temple: "0.35em",
      },
    },
  },
  plugins: [],
};

export default config;

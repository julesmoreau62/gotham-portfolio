import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        mute: "var(--mute)",
        line: "var(--line)",
        acid: "var(--acid)",
        magenta: "#ff2e88",
        ember: "#ff5c1a",
        cyan: "#2ee6ff",
        violet: "#9d6bff",
        amber: "#ffb000",
        crimson: "#ff2a3c",
        gold: "#e8c15a",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "Archivo", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        label: "0.22em",
        tight2: "-0.03em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-rev": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        "spin-rev": {
          to: { transform: "rotate(-360deg)" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "marquee-rev": "marquee-rev 28s linear infinite",
        blink: "blink 1s steps(2, start) infinite",
        scan: "scan 7s linear infinite",
        "spin-slow": "spin 24s linear infinite",
        "spin-rev": "spin-rev 36s linear infinite",
        pulse2: "pulse2 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

export default config

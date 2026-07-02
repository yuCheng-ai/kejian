import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        paper: "#f8fafc",
        "signal-cyan": "#06b6d4",
        "signal-green": "#22c55e",
        "signal-orange": "#f97316",
        "signal-yellow": "#facc15",
        "signal-red": "#ef4444",
      },
      boxShadow: {
        stage: "0 20px 70px rgba(15, 23, 42, 0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;

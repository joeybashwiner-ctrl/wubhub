import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        surface: "#141414",
        raised: "#1F1F1F",
        line: "#2A2A2A",
        ink: "#F5F5F5",
        muted: "#A3A3A3",
        acid: "#C8FF00",
        hot: "#FF3B30",
        ok: "#00E676",
      },
      fontFamily: {
        display: ['Helvetica Neue', 'Helvetica', 'Arial Black', 'sans-serif'],
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Roboto Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
      },
      borderRadius: {
        sharp: '0px',
        nub: '2px',
        button: '8px',
        card: '8px',
      },
      keyframes: {
        'wub-pulse': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        'wub-bid-in': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'wub-sheet-up': {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
      },
      animation: {
        'wub-pulse': 'wub-pulse 0.8s infinite',
        'wub-bid-in': 'wub-bid-in 0.4s ease',
        'wub-sheet-up': 'wub-sheet-up 0.3s ease',
      },
    },
  },
  plugins: [],
} satisfies Config;

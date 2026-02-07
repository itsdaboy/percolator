import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Consolas", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", "14px"],
      },
      colors: {
        base: "#06080f",
        panel: "#0b0e18",
        card: "#0f1320",
        elevated: "#161b2e",
        amber: "#ff8c00",
        "terminal-green": "#00ff41",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "slide-up": "slideUp 0.25s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 5s ease-in-out infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
        ticker: "ticker 25s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
        scan: "scan 3s linear infinite",
        "terminal-blink": "terminal-blink 1.06s step-end infinite",
        "data-flash-green": "data-flash-green 0.6s ease-out",
        "data-flash-red": "data-flash-red 0.6s ease-out",
        heartbeat: "heartbeat 2s ease-in-out infinite",
        "h-scan": "h-scan 12s linear infinite",
        "tick-up": "tick-up 0.3s ease-out",
        "tick-down": "tick-down 0.3s ease-out",
        "depth-fill": "depth-fill 0.4s ease-out forwards",
        "label-slide": "label-slide 0.3s ease-out",
        "ring-pulse": "ring-pulse 4s ease-in-out infinite",
        "flow-line": "flow-line 3s linear infinite",
        ripple: "ripple 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "33%": { transform: "translateY(-4px)" },
          "66%": { transform: "translateY(2px)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

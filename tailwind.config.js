import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // 1. SAFELIST: Pozwala na kolory odznak z bazy (standardowe kolory Tailwinda)
  safelist: [
    { 
      pattern: /shadow-(red|green|yellow|blue|purple|amber)-(200|300)/ 
    },
    { 
      pattern: /bg-(red|green|yellow|blue|purple|amber)-100/ 
    },
    { 
      pattern: /text-(red|green|yellow|blue|purple|amber)-(500|600|700)/ 
    },
    { 
      pattern: /border-(red|green|yellow|blue|purple|amber)-(200|300|400)/ 
    },
    "shadow-md", "shadow-sm"
  ],
  // 2. THEME: Twoje unikalne kolory (Primary, Success, Error)
  theme: {
    extend: {
      colors: {
        background: "#fff7ed", // Kremowy
        card: "#ffffff",
        primary: {
          DEFAULT: "#8b5cf6", // Fiolet
          dark: "#7c3aed",
          light: "#ddd6fe",
        },
        success: {
          DEFAULT: "#58cc02", // Zieleń
          dark: "#46a302",
        },
        error: {
          DEFAULT: "#ef4444", // Czerwień
          dark: "#b91c1c",
        },
        gray: {
          border: "#e5e7eb",
          shadow: "#d1d5db",
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
};

export default config;
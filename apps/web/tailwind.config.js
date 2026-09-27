/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/shared/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rp: {
          DEFAULT: "#2F6FED",
          head: "#1E4FD7",
          body: "#E8F1FF",
          line: "#7AA7FF",
        },
        mech: {
          DEFAULT: "#E6A100",
          head: "#D49200",
          body: "#FFF6D9",
          line: "#F2C14E",
        },
        case: {
          DEFAULT: "#E23B4A",
          head: "#C81E33",
          body: "#FFE8EA",
          line: "#F08A93",
        },
        clue: {
          DEFAULT: "#1FA971",
          head: "#0E8A58",
          body: "#E5F8EF",
          line: "#7DD3A8",
        },
        felt: {
          DEFAULT: "#0B3B36",
          deep: "#072824",
        },
        wood: {
          DEFAULT: "#6B3E2E",
          dark: "#4A281D",
          light: "#8B5A2B",
        },
        play: {
          DEFAULT: "#2EAD4B",
          border: "#166534",
          hover: "#259840",
        },
        gold: "#D4A017",
        navy: "#0B1F2A",
      },
      fontFamily: {
        thai: ["'IBM Plex Sans Thai'", "sans-serif"],
        nuclide: ["'Source Serif 4'", "serif"],
        game: ["'Prompt'", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
      },
      aspectRatio: {
        card: "63 / 88",
      },
      boxShadow: {
        card: "0 10px 24px rgba(0,0,0,0.28)",
        "card-hover": "0 16px 32px rgba(0,0,0,0.36)",
        "play-btn": "0 6px 0 #166534, 0 10px 20px rgba(0,0,0,0.35)",
        "play-btn-pressed": "0 2px 0 #166534, 0 4px 10px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};

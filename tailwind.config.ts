import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211f",
        cloud: "#f6f7f4",
        line: "#dfe5dd",
        sage: "#5f7f73",
        pine: "#24483f",
        mint: "#dcece5",
        amber: "#d1913a",
        rose: "#bd4b55"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 33, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

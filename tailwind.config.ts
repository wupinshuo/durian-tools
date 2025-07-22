import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
    "./json.html",
    "./jwt.html",
    "./todo.html",
  ],
  darkMode: "class",
  theme: {
    extend: {
      maxWidth: {
        "7xl": "80rem",
        "6xl": "72rem",
        "5xl": "64rem",
        "4xl": "56rem",
        "3xl": "48rem",
        "2xl": "42rem",
        xl: "36rem",
        lg: "32rem",
        md: "28rem",
        sm: "24rem",
      },
      backgroundColor: {
        background: "var(--background)",
        "background-alt": "var(--background-alt)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        secondary: "var(--secondary)",
        "secondary-hover": "var(--secondary-hover)",
        danger: "var(--danger)",
        "danger-hover": "var(--danger-hover)",
        light: "var(--light)",
        dark: "var(--dark)",
      },
      textColor: {
        text: "var(--text)",
        "text-light": "var(--text-light)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        danger: "var(--danger)",
      },
      borderColor: {
        border: "var(--border)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        danger: "var(--danger)",
      },
      ringColor: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        danger: "var(--danger)",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        goole: "#DB4437"
      },
      screens: {
        iphone: { max: "450px" }, // iPhoneのPro Maxのサイズ以下
      },
      height: {
        screen: "100dvh",
      },
      minHeight: {
        screen: "100dvh",
      },
      maxHeight: {
        screen: "100dvh",
      },
    },
  },
  plugins: [],
};
export default config;

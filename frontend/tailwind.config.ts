import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sbi: {
          blue: "#1f63b5",
          cyan: "#00a9e0",
          ink: "#172033"
        }
      }
    }
  },
  plugins: []
};

export default config;


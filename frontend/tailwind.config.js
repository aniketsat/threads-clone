import {nextui} from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/react/dist/**/*.{js,ts,jsx,tsx}",
    ".src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extends: {
    }
  },
  darkMode: "class",
  plugins: [nextui()]
}


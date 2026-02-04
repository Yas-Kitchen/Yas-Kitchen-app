/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["System"],
      },
      colors: {
        primary: "#FF7629",
        base_color: "#6C757D",
        faded_black: "#212529",
        button_bg: "#F3F4F6",
        yellow: "#FFC107",
        red: "#EF4444",
        secondary: "#212529", // Mapping to faded_black based on context
        tertiary: "#6C757D", // Mapping to base_color based on context
        red_dark: "#EF4444", // Mapping to red
      },
    },
  },
  plugins: [],
};

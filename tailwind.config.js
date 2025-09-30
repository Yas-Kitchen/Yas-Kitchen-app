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
      colors: {
        primary: '#FF7629',
        base_color : '#6C757D',
        faded_black : '#212529',
        button_bg : '#F3F4F6',
        yellow : '#FFC107'
      }
    },
  },
  plugins: [],
}

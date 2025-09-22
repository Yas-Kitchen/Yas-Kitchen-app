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
        base : '#6C757D',
        faded_black : '#212529'
      }
    },
  },
  plugins: [],
}

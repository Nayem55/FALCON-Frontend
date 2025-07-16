/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"], // include jsx, tsx too
  theme: {
    extend: {
      fontFamily: {
        onest: ['Onest'], // <-- add Onest here
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#ffffff",
          secondary: "#abcacb",
          accent: "#7dc569",
          neutral: "#191D24",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#f62e36",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};

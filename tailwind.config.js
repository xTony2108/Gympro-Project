/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      montserrat: ["Montserrat", "sans-serif"],
    },
    extend: {
      maxWidth: {
        section: "1200px",
      },
      colors: {
        //sfondo scuro
        primary: "#14161F",
        //arancione-100 normale, 200:hover
        secondary: {
          100: "#FF721B",
          200: "#F87A2C",
          300: "#F59C64",
        },
        //yellow-100 normale, 200:hover
        yellow: {
          100: "#E5BB39",
          200: "#EDCD6B",
        },
        //verde
        green: "#167b20",
        //grigio
        gray: "#393b44",
        //bianco-100 normale, 200:hover
        white: {
          100: "#dfdfdf",
          200: "#afafaf",
          300: "#F1F2F8",
          400: "#FFFFFF",
        },
        //sfondo 2 sezione chiara
        bgwhite: "#F1F2F8",
        //colore rosso
        red: {
          100: "#D60000",
          200: "#FF4040",
          300: "#ED6464",
        },
        divider: "#5B5050",
      },
    },
  },
  plugins: [],
};

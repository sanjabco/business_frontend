const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
    content: ["./index.html", "./src/**/*.{jsx,js,ts}"],
    plugins: [require("tw-elements/plugin.cjs")],
    theme: {
        extend: {
            fontFamily: {
                BYekan: ['"B Yekan"'],
            },
            colors: {
                primaryWhite: "#edeff1",
                lightWhite: "#f9fafb",
                primaryGray: "#ededf3",
                Gray: "#6f6f9d",
                lightGray: "#e5e7e8",
                Red: "#ff5644",
                lightRed: "#efe0e0",
                Pink: "#f9edec",
                Orange: "#fd6757",
                lightOrange: "#FFD700",
                grassGreen: "#5ab55e",
                Green: "#1abc9c",
                lightGreen: "#2cc1a4",
                Purple: "#7a7aa5",
                lightBlue: "#A8D5BA",
                Blue: "#2E8B57",
            },
        },
    },
    safelist: [
        "primaryWhite",
        "lightWhite",
        "primaryGray",
        "Gray",
        "lightGray",
        "Red",
        "lightRed",
        "Pink",
        "Orange",
        "lightOrange",
        "grassGreen",
        "Green",
        "lightGreen",
        "Purple",
        "lightBlue",
        "Blue",
    ],
});

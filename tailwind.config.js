const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F4DFBF",
        darkBrown: "#5F3920",
        lightBrown: "#A16B45",
        orangeBrown: "#E1804B",
        brown: "#AD5427",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".tj-eb-64": {
          "font-family": "TJJoyofsingingEB, sans-serif",
          "font-size": "64px",
        },
        ".tj-eb-48": {
          "font-family": "TJJoyofsingingEB, sans-serif",
          "font-size": "48px",
        },
        ".tj-eb-40": {
          "font-family": "TJJoyofsingingEB, sans-serif",
          "font-size": "40px",
        },
        ".tj-eb-36": {
          "font-family": "TJJoyofsingingEB, sans-serif",
          "font-size": "36px",
        },
        ".tj-eb-32": {
          "font-family": "TJJoyofsingingEB, sans-serif",
          "font-size": "36px",
        },
        ".tj-b-48": {
          "font-family": "TJJoyofsingingB, sans-serif",
          "font-size": "48px",
        },
        ".tj-b-40": {
          "font-family": "TJJoyofsingingB, sans-serif",
          "font-size": "40px",
        },
        ".tj-b-36": {
          "font-family": "TJJoyofsingingB, sans-serif",
          "font-size": "36px",
        },
        ".tj-b-32": {
          "font-family": "TJJoyofsingingB, sans-serif",
          "font-size": "32px",
        },
        ".tj-b-24": {
          "font-family": "TJJoyofsingingB, sans-serif",
          "font-size": "24px",
        },
        ".tj-m-32": {
          "font-family": "TJJoyofsingingM, sans-serif",
          "font-size": "32px",
        },
        ".tj-m-24": {
          "font-family": "TJJoyofsingingM, sans-serif",
          "font-size": "24px",
        },
        ".tj-m-20": {
          "font-family": "TJJoyofsingingM, sans-serif",
          "font-size": "20px",
        },
        ".tj-m-16": {
          "font-family": "TJJoyofsingingM, sans-serif",
          "font-size": "16px",
        },
        ".tj-l-32": {
          "font-family": "TJJoyofsingingL, sans-serif",
          "font-size": "32px",
        },
        ".tj-l-24": {
          "font-family": "TJJoyofsingingL, sans-serif",
          "font-size": "24px",
        },
        ".tj-l-20": {
          "font-family": "TJJoyofsingingL, sans-serif",
          "font-size": "20px",
        },
        ".tj-l-16": {
          "font-family": "TJJoyofsingingL, sans-serif",
          "font-size": "16px",
        },
      });
    }),
  ],
};

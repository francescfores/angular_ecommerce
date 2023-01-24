const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");
const { createThemes } = require('tw-colors');
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  purge: {
    enabled: true,
    content: [
      "./**/*.html",
      "./*.html",
      "./**/*.js",
      "./*.js",
      "./**/*.ts",
      "./*.ts",
      './src/**/*.{html,js}', './node_modules/tw-elements/dist/js/**/*.js'
    ],
    options: {
      safelist: [],
    },
  },
  theme: {
    colors: {
      ...colors,
      /*
      'primary': '#2577c1',
      'secondary-bg': '#fff',
      'theme': '#fff',
      'header-color': '#c23fe2',
      'route-link-active': '#fff',
      'link-color': '#555050',
      'border-color': '#555050',

      // Dark theme colors
      'dark-primary': '#ff500b',
      'dark-secondary-bg': '#424242',
      'dark-theme': '#424242',
      'dark-header-color': '#424242',
      'dark-route-link-active': '#ff500b',
      'dark-link-color': '#fff',
      'dark-border-color': '#1cd61c',
      */
    },
    extend: {
      minHeight: {
        "screen-75": "75vh",
      },
      fontSize: {
        55: "55rem",
      },
      opacity: {
        80: ".8",
      },
      zIndex: {
        2: 2,
        3: 3,
      },
      inset: {
        "-100": "-100%",
        "-225-px": "-225px",
        "-160-px": "-160px",
        "-150-px": "-150px",
        "-94-px": "-94px",
        "-50-px": "-50px",
        "-29-px": "-29px",
        "-20-px": "-20px",
        "25-px": "25px",
        "40-px": "40px",
        "95-px": "95px",
        "145-px": "145px",
        "195-px": "195px",
        "210-px": "210px",
        "260-px": "260px",
      },
      height: {
        "95-px": "95px",
        "70-px": "70px",
        "350-px": "350px",
        "500-px": "500px",
        "600-px": "600px",
      },
      maxHeight: {
        "860-px": "860px",
      },
      maxWidth: {
        "100-px": "100px",
        "120-px": "120px",
        "150-px": "150px",
        "180-px": "180px",
        "200-px": "200px",
        "210-px": "210px",
        "580-px": "580px",
      },
      minWidth: {
        "140-px": "140px",
        48: "12rem",
      },
      backgroundSize: {
        full: "100%",
      },
    },
    fontFamily: {
      sans: [
        'Montserrat',
        'sans-serif',
        , ...defaultTheme.fontFamily.sans
      ]
    },

  },
  variants: [
    "responsive",
    "group-hover",
    "focus-within",
    "first",
    "last",
    "odd",
    "even",
    "hover",
    "focus",
    "active",
    "visited",
    "disabled",
  ],
  plugins: [
    require("@tailwindcss/forms"),
    require('tailwind-scrollbar'),
    plugin(function ({ addComponents, theme }) {
      const screens = theme("screens", {});
     /* addComponents([
        {
          ".container": { width: "100%" },
        },
        {
          [`@media (min-width: ${screens.sm})`]: {
            ".container": {
              "max-width": "640px",
            },
          },
        },
        {
          [`@media (min-width: ${screens.md})`]: {
            ".container": {
              "max-width": "768px",
            },
          },
        },
        {
          [`@media (min-width: ${screens.lg})`]: {
            ".container": {
              "max-width": "1024px",
            },
          },
        },
        {
          [`@media (min-width: ${screens.xl})`]: {
            ".container": {
              "max-width": "1280px",
            },
          },
        },
        {
          [`@media (min-width: ${screens["2xl"]})`]: {
            ".container": {
              "max-width": "1280px",
            },
          },
        },
      ]);*/
    }),
    createThemes({
      light: {
        'primary': '#F5F6FA',
        'text-primary': '#151D33',
        'secondary': '#FFFFFF',
        'ternary': '#f6f7f8',
        'secondary-bg': '#151D33',
        'theme': '#fff',
        'header-color': '#c23fe2',
        'route-link-active': '#fff',
        'link-color': '#555050',
        'border-color': '#555050',
      },
      dark: {
        'primary': '#151D33',
        'text-primary': '#F5F6FA',
        'secondary': '#19233d',
        'ternary': '#233054',
        'secondary-bg': '#F5F6FA',
        'theme': '#424242',
        'header-color': '#424242',
        'route-link-active': '#ff500b',
        'link-color': '#fff',
        'border-color': '#1cd61c',
      },
      fontFamily: {
        sans: [
          'Montserrat',
          'sans-serif',
          , ...defaultTheme.fontFamily.sans
        ]
      },
    }),
    require('tw-elements/dist/plugin'),
    require('@tailwindcss/aspect-ratio'),
  ],
  safelist: [{
    pattern: /.*/
  }]
};

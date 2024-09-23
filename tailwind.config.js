/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");
const { createThemes } = require('tw-colors');
// const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
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
    // extend: {
    //   minHeight: {
    //     "screen-75": "75vh",
    //   },
    //   fontSize: {
    //     55: "55rem",
    //   },
    //   opacity: {
    //     80: ".8",
    //   },
    //   zIndex: {
    //     2: 2,
    //     3: 3,
    //   },
    //   inset: {
    //     "-100": "-100%",
    //     "-225-px": "-225px",
    //     "-160-px": "-160px",
    //     "-150-px": "-150px",
    //     "-94-px": "-94px",
    //     "-50-px": "-50px",
    //     "-29-px": "-29px",
    //     "-20-px": "-20px",
    //     "25-px": "25px",
    //     "40-px": "40px",
    //     "95-px": "95px",
    //     "145-px": "145px",
    //     "195-px": "195px",
    //     "210-px": "210px",
    //     "260-px": "260px",
    //   },
    //   height: {
    //     "95-px": "95px",
    //     "70-px": "70px",
    //     "350-px": "350px",
    //     "500-px": "500px",
    //     "600-px": "600px",
    //   },
    //   maxHeight: {
    //     "860-px": "860px",
    //   },
    //   maxWidth: {
    //     "100-px": "100px",
    //     "120-px": "120px",
    //     "150-px": "150px",
    //     "180-px": "180px",
    //     "200-px": "200px",
    //     "210-px": "210px",
    //     "580-px": "580px",
    //   },
    //   minWidth: {
    //     "140-px": "140px",
    //     48: "12rem",
    //   },
    //   backgroundSize: {
    //     full: "100%",
    //   },
    // },
    // fontFamily: {
    //   sans: [
    //     'Montserrat',
    //     'sans-serif',
    //     , ...defaultTheme.fontFamily.sans
    //   ]
    // },
  },
  plugins: [
    //   // require("@tailwindcss/forms"),
    //   // require('tailwind-scrollbar'),
    //   // plugin(function ({ addComponents, theme }) {
    //   //   const screens = theme("screens", {});
    //   //   /* addComponents([
    //   //      {
    //   //        ".container": { width: "100%" },
    //   //      },
    //   //      {
    //   //        [`@media (min-width: ${screens.sm})`]: {
    //   //          ".container": {
    //   //            "max-width": "640px",
    //   //          },
    //   //        },
    //   //      },
    //   //      {
    //   //        [`@media (min-width: ${screens.md})`]: {
    //   //          ".container": {
    //   //            "max-width": "768px",
    //   //          },
    //   //        },
    //   //      },
    //   //      {
    //   //        [`@media (min-width: ${screens.lg})`]: {
    //   //          ".container": {
    //   //            "max-width": "1024px",
    //   //          },
    //   //        },
    //   //      },
    //   //      {
    //   //        [`@media (min-width: ${screens.xl})`]: {
    //   //          ".container": {
    //   //            "max-width": "1280px",
    //   //          },
    //   //        },
    //   //      },
    //   //      {
    //   //        [`@media (min-width: ${screens["2xl"]})`]: {
    //   //          ".container": {
    //   //            "max-width": "1280px",
    //   //          },
    //   //        },
    //   //      },
    //   //    ]);*/
    //   // }),
    createThemes({
      light: {
        'primary': '#901E3C',
        'primary-2': '#f9f7d8',
        'primary-3': '#c79f1b',
        'secondary': '#989898', //'#70d0f8',
        'secondary': '#989898', //'#70d0f8',
        'secondary-2': '#C4C4C4', //'#70d0f8',
        'secondary-3': '#d9d9d9', //'#70d0f8',
        'ternary': '#29335C', //'#29335C',
        'success': '#70c183', //'#70C1B3',
        'info': '#2E72B2', //'#29335C',
        'warning': '#FFC43D', //'#FFC43D',
        'help': 'rgba(85,49,145,0.63)', //'#29335C',
        'danger': '#EF476F', //'#29335C',
        'bgPrim': '#fffef5',
        'bgSeco': '#fffee9',
        'bgTern': '#ddddc3',
        // 'secondary': '#CBF7ED',
        // 'ternary': '#1D3557',
        // 'quaternary': '#1D3557',
        'textPrimary': '#0c0c0c', //0e1a2a
        'textSecondary': '#111111',//89919d
        'textTertiary': '#222222',//c0c0c0
        // 'nav-color': '#242b3b',
        // 'theme': '#fff',
        // 'header-color': '#404040',
        // 'route-link-active': '#E85651',
        'link-color': '#40B45BED',
        // 'border-color': '#E85651',

        //for 3d button
        'btn_primary_border_style': '#ac2447',
        'btn_primary_bg_front_color': '#901E3C',
        'btn_primary_bg_shadow_color': '#D9D9D949',
        'btn_primary_bg_back_color': '#69162d',
        'btn_primary_font_color': '#f9f7d8',

        'btn_secondary_border_style': '#b4b4b4',
        'btn_secondary_bg_front_color': '#C4C4C4',
        'btn_secondary_bg_shadow_color': '#D9D9D949',
        'btn_secondary_bg_back_color': '#8a8a8a',
        'btn_secondary_font_color': '#505050',

        'btn_ternary_border_style': '#9ab789',
        'btn_ternary_bg_front_color': '#c0e0ae',
        'btn_ternary_bg_shadow_color': '#D9D9D949',
        'btn_ternary_bg_back_color': '#819a73',
        'btn_ternary_font_color': '#5a6b52',

        'btn_anchor_border_style': 'transparent',
        'btn_anchor_bg_front_color': 'transparent',
        'btn_anchor_bg_shadow_color': 'transparent',
        'btn_anchor_bg_back_color': 'transparent',
        'btn_anchor_font_color': '#95D44A',

        'btn_danger_border_style': '#531849',
        'btn_danger_bg_front_color': '#8B3357',
        'btn_danger_bg_shadow_color': '#D9D9D949',
        'btn_danger_bg_back_color': '#531849',
        'btn_danger_font_color': '#fff',

        'btn_disabled_border_style': '#838383',
        'btn_disabled_bg_front_color': '#C1C1C1',
        'btn_disabled_bg_shadow_color': '#D9D9D949',
        'btn_disabled_bg_back_color': '#838383',
        'btn_disabled_font_color': '#555753',

      },
      dark: {
        'primary': '#3cb4ff',
        'primary-2': '#3ca4ff',
        'primary-3': '#35a14e',
        'secondary': '#ffb43c', //'#70d0f8',
        'secondary-2': '#C4C4C4', //'#70d0f8',
        'secondary-3': '#d9d9d9', //'#70d0f8',
        'ternary': '#92c200', ///29335C99 //17BEBBE4 29335C99
        'success': '#70C18399', //'#70C1B3',
        'info': '#2E72B299', //'#29335C',
        'warning': '#FFC43D99', //'#FFC43D',
        'help': '#55319199', //'#29335C',
        'danger': '#EF476F99', //'#29335C',
        'bgPrim': '#0c0c0c', ////0F1C2E //rgb(36, 28, 81) rgb(36, 28, 81) rgb(28, 20, 69)
        'bgSeco': '#111111',//0A131F
        'bgTern': '#222222',//1e314b #474954
        // 'secondary': '#CBF7ED',
        // 'ternary': '#1D3557',
        // 'quaternary': '#1D3557',
        'textPrimary': '#ffffff',//CBF7ED
        'textSecondary': '#f5f5f5',//658cbb
        'textTertiary': '#e9e9e9',//364c69
        // 'primary-bg': '#404040',
        // 'bt-primary': 'rgb(34,80,77)',
        // 'nav-color': 'rgb(34,80,77)',
        // 'theme': '#424242',
        // 'header-color': '#E85651',
        // 'route-link-active': '#E85651',
        'link-color': '#41FF6CCA',
        // 'border-color': '#E85651',

        'btn_primary_border_style': '#ffdbac',
        'btn_primary_bg_front_color': '#f08257',
        'btn_primary_bg_shadow_color': '#D9D9D949',
        'btn_primary_bg_back_color': '#c67503d1',
        'btn_primary_font_color': '#fffdf4',

        'btn_secondary_border_style': '#b4b4b4',
        'btn_secondary_bg_front_color': '#C4C4C4',
        'btn_secondary_bg_shadow_color': '#D9D9D949',
        'btn_secondary_bg_back_color': '#8a8a8a',
        'btn_secondary_font_color': '#505050',

        'btn_ternary_border_style': '#9ab789',
        'btn_ternary_bg_front_color': '#c0e0ae',
        'btn_ternary_bg_shadow_color': '#D9D9D949',
        'btn_ternary_bg_back_color': '#819a73',
        'btn_ternary_font_color': '#5a6b52',

        'btn_anchor_border_style': '#fff',
        'btn_anchor_bg_front_color': 'transparent',
        'btn_anchor_bg_shadow_color': 'transparent',
        'btn_anchor_bg_back_color': 'transparent',
        'btn_anchor_font_color': '#fff',

        'btn_danger_border_style': '#531849',
        'btn_danger_bg_front_color': '#8B3357',
        'btn_danger_bg_shadow_color': '#D9D9D949',
        'btn_danger_bg_back_color': '#531849',
        'btn_danger_font_color': '#fff',

        'btn_disabled_border_style': '#838383',
        'btn_disabled_bg_front_color': '#C1C1C1',
        'btn_disabled_bg_shadow_color': '#D9D9D949',
        'btn_disabled_bg_back_color': '#838383',
        'btn_disabled_font_color': '#555753',
      },
      fontFamily: {
        // sans: [
        //   'Montserrat',
        //   'sans-serif',
        //   // , ...defaultTheme.fontFamily.sans
        // ]
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans-serif'],
      },
    }),
    //   // require('tw-elements/dist/plugin'),
    require('@midudev/tailwind-animations'),
  ],
  safelist: [
     //{
     //  pattern: /accent-+/,
     //  pattern:/bg-[a-zA-Z0-9#]+/,
//},
    //   {
    //     pattern: /bg-(red|green|blue)-(100|200|300|600)/,
    //     //pattern: /bg-+/
    //     variants: ['dark','sm','md','lg','xl', 'hover', 'focus', 'lg:hover'],
    //   },
     ],
  // safelist: [
  //   'text-2xl',
  //   'text-3xl',
  //   'text-4xl',
  //   'text-5xl',
  //   'text-6xl',
  //   'text-7xl',
  //   'text-8xl',
  //   'text-9xl',
  //   {
  //     pattern: /bg-(red|green|blue)-(100|200|300|600)/,
  //     //pattern: /bg-+/
  //     variants: ['dark','sm','md','lg','xl', 'hover', 'focus', 'lg:hover'],
  //   },
  //   {
  //     pattern: /text-(xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/,
  //     //pattern: /bg-+/
  //     variants: ['sm','md','lg','xl'],
  //   },
  // ],
};


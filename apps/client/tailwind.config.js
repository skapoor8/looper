/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ['./src/**/*.{html,ts}'],
  content: ['apps/client/src/**/*.{html,ts}'],
  theme: {
    extend: {},
    customColorPalette: {
      colors: {
        matRed: '#f44336', // add more colors to the plugin
        matPink: '#e91e63',
        matPurple: '#9c27b0',
        matDeepPurple: '#673ab7',
        matIndigo: '#3f51b5',
        matBlue: '#2196f3',
        matLightBlue: '#03a9f4',
        matCyan: '#00bcd4',
        matTeal: '#009688',
        matGreen: '#43a047',
        matLightGreen: '#8bc34a',
        matLime: '#cddc39',
        matYellow: '#ffeb3b',
        matAmber: '#ffc107',
        matOrange: '#ff9800',
        matDeepOrange: '#ff5722',
        matBrown: '#6d4c41',
        matGrey: '#9e9e9e',
        matBlueGray: '#607d8b',
      },
      steps: 50,
    },
  },
  plugins: [
    require('@markusantonwolf/tailwind-css-plugin-custom-color-palette'),
  ],
};

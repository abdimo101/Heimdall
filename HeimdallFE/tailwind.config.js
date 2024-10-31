/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  daisyui: {
    themes: [
      {
        heimdall: { // TODO: Map remaining colors
          'primary': '#FF00FF',
          'primary-focus': '#FF00FF',
          'primary-content': '#FF00FF',
          'secondary': '#FF00FF',
          'secondary-focus': '#FF00FF',
          'secondary-content': '#FF00FF',
          'accent': '#FF00FF',
          'accent-focus': '#FF00FF',
          'accent-content': '#FF00FF',
          'base-100': 'rgb(255, 255, 255)', // Base white color
          'base-200': 'rgb(229, 231, 235)', // Base light grey color, page background
          'base-300': 'rgb(156, 163, 175)', // Base grey color
          'base-content': '#000000', // Default text and elements color
          'info': '#FF00FF',
          'success': 'rgb(0,160,0)', // Success messages and icons
          'warning': '#FF00FF',
          'error': 'rgb(192,0,0)', // Error messages and icons
        }
      },
    ],
  },
  theme: {
    extend: {
      margin: {
        '1/10': '10%',
        '1/5': '20%',
        '1/4': '25%',
        '1/3': '33.333%',
        '1/2': '50%',
        '2/3': '66.666%',
        '3/4': '75%',
        '9/10': '90%',
      },
      fontSize: {
        '2xs': '.625rem',
        '3xs': '.5rem',
      },
    },
  },
  plugins: [require('daisyui')],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require('daisyui'), require('@tailwindcss/line-clamp')],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#acc2b1',
          accent: '#b6ff9e',
          secondary: '#acc2b1',

          neutral: '#212936',
          'base-100': '#F6F6F6',
          info: '#61D7F5',
          success: '#2CB55E',
          whitey: '#ffffff',

          grayer: '#2E2E2E',

          warning: '#D0B216',

          error: '#9D3232',
        },
      },
    ],
  },

  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      blue: '#1fb6ff',
      purple: '#7e5bef',
      pink: '#ff49db',
      orange: '#ff7849',
      green: '#13ce66',
      yellow: '#ffc82c',
      'gray-dark': '#273444',
      black: '#000000',
      'gray-medium': '#717171',
      'gray-medium-light': '#F6F6F6',

      'gray-light': '#f2f2f2',
      white: '#ffffff',
      'primary-dark': '#3A5937',
      secondary: '#acc2b1',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
};

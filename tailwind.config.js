/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary colors - Coral/salmon shades
        primary: {
          50: '#FFF1F0',
          100: '#FFE4E1',
          200: '#FFC9C3',
          300: '#FFA599',
          400: '#FF8D7E',
          500: '#E76F5E', // Main button color
          600: '#D85F4E',
          700: '#C04B3A',
          800: '#A13426',
          900: '#832012',
        },
        // Secondary colors - Cream/off-white shades
        secondary: {
          50: '#FEFBF6',
          100: '#FDF7ED',
          200: '#FAE8D2',
          300: '#FDF6F0', // Main background color
          400: '#F5E6D8',
          500: '#EDD6C4',
          600: '#E5C7B0',
          700: '#DDB89C',
          800: '#D5A988',
          900: '#CD9A74',
        },
        // Text colors
        text: {
          primary: '#333333', // Main text
          secondary: '#666666', // Subtitle text
          accent: '#E94F37', // Link/accent text (like "Already have account?")
        },
      },
      fontFamily: {
        'nunito-extra-bold': ['Nunito_900Black'],
        'nunito-regular': ['Nunito_700Bold'],
        'nunito-bold': ['Nunito_800ExtraBold'],
        titan: ['TitanOne_400Regular'],
      },
    },
  },
  plugins: [],
};

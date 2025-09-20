/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          50: '#e8f0fe',
          100: '#c6dafc',
          200: '#a2c2fa',
          300: '#7ea9f8',
          400: '#5b91f6',
          500: '#3778f4',
          600: '#2d5fcc',
          700: '#234699',
          800: '#1a2e66',
          900: '#101933',
        },
        secondary: {
          50: '#f5f5f5',
          100: '#e1e1e1',
          200: '#cfcfcf',
          300: '#bcbcbc',
          400: '#aaaaaa',
          500: '#979797',
          600: '#7a7a7a',
          700: '#5d5d5d',
          800: '#404040',
          900: '#1a1a1a',
        },
      }
    },
  },
  plugins: [],
}

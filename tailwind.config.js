/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  prefix: 'mt-',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00b2a6',
          50: '#eefffe',
          100: '#c6fffc',
          200: '#8efff9',
          300: '#4dfff5',
          400: '#0affe9',
          500: '#00b2a6',
          600: '#009e94',
          700: '#007d76',
          800: '#00635f',
          900: '#00524e',
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

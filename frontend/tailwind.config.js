/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s forwards',
        'pop-in': 'popIn 0.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.95)', opacity: 0.6 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        blob: "float 20s ease-in-out infinite both alternate",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'none' },
          '50%': { transform: 'translate(50%, 20%) rotateY(10deg) scale(1.2)' },
        },
      },
    },
  },
  // plugins: [
  //   require('tailwind-scrollbar-hide')  // npm install tailwind-scrollbar-hide
  // ],
};

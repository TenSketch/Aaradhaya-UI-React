/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-clr': 'hsl(0, 0%, 9%)',
        'secondary-clr': 'hsl(128, 70%, 21%)',
        'accent-clr': 'hsl(36, 66%, 58%)',
      },
    },
  },
  plugins: [],
};

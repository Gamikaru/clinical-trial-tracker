/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
    theme: {
      extend: {},
    },
    daisyui: {
      themes: [
        {
          corporate: {
            primary: '#3b82f6',
            secondary: '#64748b',
            accent: '#37cdbe',
            neutral: '#1f2937',
            'base-100': '#ffffff',
          },
        },
      ],
    },
    plugins: [require('daisyui')],
  };

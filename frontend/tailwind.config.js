/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './src/index.html'],
    theme: {
        extend: {},
    },
    daisyui: {
        themes: ["corporate"], // Professional theme
    },
    plugins: [require('daisyui')],
};
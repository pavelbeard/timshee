/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    screens: {
        'xs': '600px',
        'mdx': '800px',
        ...defaultTheme.screens,
    },
    theme: {
        extend: {},
    },
    plugins: [],
}


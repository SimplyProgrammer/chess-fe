/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  important: true,
  content: [
    "./public/*.html", "./dist/*.html",
    "./src/**/*.{html,vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}

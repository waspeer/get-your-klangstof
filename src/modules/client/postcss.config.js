module.exports = {
  modules: true,
  plugins: [
    require('tailwindcss'),
    require('postcss-preset-env')({
      autoprefixer: true,
      features: {
        'color-mod-function': true,
        'focus-within-pseudo-class': false,
        'nesting-rules': true,
      },
    }),
  ],
};

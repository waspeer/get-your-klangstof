module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  purge: ['./src/**/*.js'],
  theme: {
    extend: {
      borderRadius: {
        super: '1.25rem',
      },
      boxShadow: {
        funky: "theme('colors.secondary') 1px 1px, black 3px 3px",
        outline: "0px 0px 4px theme('colors.primary')",
      },
      colors: {
        dark: '#333333',
        neutral: '#FFF2D3',
        primary: '#FF88D9',
        secondary: '#00FEFF',
      },
      fontFamily: {
        heading: ['Arial Black', 'Arial Bold', 'Gadget', 'sans-serif'],
      },
    },
  },
};

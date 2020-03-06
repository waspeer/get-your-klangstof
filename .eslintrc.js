module.exports = {
  extends: ['./node_modules/poetic/config/eslint/eslint-config.js'],
  // Add custom rules here
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'comma-dangle': ['warn', 'always-multiline'],
    'no-console': 'off',
    'no-useless-constructor': 'off',
    semi: ['warn', 'always'],
    'object-curly-spacing': ['warn', 'always'],
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};

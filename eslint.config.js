module.exports = {
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  files: ['src/**/*.js'],
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    globals: {
      require: 'readonly',
      module: 'readonly',
      process: 'readonly',
      __dirname: 'readonly',
    },
  },
  plugins: {},
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    indent: ['error', 2],
    'no-unused-vars': ['warn'],
    'no-console': 'off',
  },
}

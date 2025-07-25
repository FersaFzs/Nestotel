module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Solo warnings para no bloquear commits
    '@next/next/no-img-element': 'warn',
    '@next/next/no-page-custom-font': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  globals: {
    cy: 'readonly',
    Cypress: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    jest: 'readonly',
  },
};

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.test.json'],
  },
  ignorePatterns: ['.eslintrc.*'],
  plugins: ['@typescript-eslint', 'jest', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './',
      },
    },
  },
  rules: {
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Function: false,
          Object: false,
        },
        extendDefaults: true,
      },
    ],
  },
};

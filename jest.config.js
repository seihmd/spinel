module.exports = {
  moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['test/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': '@swc/jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
};

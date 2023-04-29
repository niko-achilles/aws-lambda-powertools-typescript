module.exports = {
  displayName: {
    name: 'AWS Lambda Powertools utility: METRICS',
    color: 'green',
  },
  'runner': 'groups',
  'preset': 'ts-jest',
  'transform': {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleFileExtensions: [ 'js', 'ts' ],
  'collectCoverageFrom': [
    '**/src/**/*.ts',
    '!**/node_modules/**',
  ],
  'testMatch': ['**/?(*.)+(spec|test).ts'],
  'roots': [
    '<rootDir>/src',
    '<rootDir>/tests',
  ],
  'testPathIgnorePatterns': [
    '/node_modules/',
  ],
  'testEnvironment': 'node',
  'coveragePathIgnorePatterns': [
    '/node_modules/',
  ],
  'coverageThreshold': {
    'global': {
      'statements': 95,
      'branches': 95,
      'functions': 95,
      'lines': 95,
    },
  },
  'coverageReporters': [
    'json-summary',
    'text',
    'lcov' ],
  'setupFiles': [
    '<rootDir>/tests/helpers/populateEnvironmentVariables.ts'
  ]
};
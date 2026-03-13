/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.(test|spec)\\.ts$',
  transform: {
    '^.+\\.m?[tj]s$': 'ts-jest',
  },

  collectCoverageFrom: ['src/**/*.(j|t)s', '!src/**/*.(test|spec).(j|t)s'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
};

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/types'],
  setupFilesAfterEnv: ['<rootDir>/tests/util/customMatchers.ts'],
}

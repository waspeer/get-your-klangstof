const path = require('path');

module.exports = {
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/test/jest/fileMock.ts',
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [path.resolve(__dirname, './test/jest/setup.ts')],
};

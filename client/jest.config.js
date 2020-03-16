const path = require('path');

module.exports = {
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/test/jest/fileMock.ts',
    '^#root/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [path.resolve(__dirname, './test/jest/setup.ts')],
};

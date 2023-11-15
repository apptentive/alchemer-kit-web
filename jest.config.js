const config = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/interfaces/**',
    '!src/types/**',
    '!src/constants/**',
    '!src/utils/sdkDoctor.ts',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text'],
  fakeTimers: {
    doNotFake: ['nextTick', 'setImmediate'],
  },
  setupFilesAfterEnv: ['./__tests__/utils/setup-browser-env.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    html: '<!doctype html><html><body></body></html>',
    url: 'http://apptentive.com',
    referrer: 'http://apptentive.com',
    includeNodeLocations: true,
  },
  testMatch: ['**/__tests__/unit/**/*.[jt]s'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!ky/.*)'],
};

module.exports = config;

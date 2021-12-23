export default {
  preset: 'ts-jest/presets/js-with-ts',
  rootDir: './test',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/setup.ts'],
  verbose: true,
  moduleNameMapper: {
    '^@engine/(.*)$': [
      // Offline tests
      '../src/engine/$1.ts',
      '../src/engine/$1.js',
      // Online (live) tests
      '../../src/engine/$1.ts',
      '../../src/engine/$1.js',
    ]
  },
}

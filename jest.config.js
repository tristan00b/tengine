export default {
  preset: 'ts-jest/presets/js-with-ts',
  rootDir: './test',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@engine/(.*)$': [
      // Offline tests
      '../src/engine/$1.ts',
      '../../src/engine/$1.ts',
      // Online (live) tests
      '../src/engine/$1.js',
      '../../src/engine/$1.js',
    ]
  },
}

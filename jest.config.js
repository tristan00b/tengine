export default {
  preset: 'ts-jest/presets/js-with-ts',
  rootDir: "./test",
  globals: {
    "ts-jest": {
      diagnostics: {
        ignoreCodes: [
        ]
      }
    }
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@engine/(.*)$": [
      "../src/engine/$1.ts",
      "../src/engine/$1.js",
    ]
  },
}

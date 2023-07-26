import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  setupFiles: ['./src/test-utils/setup-tests.ts'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy'
  },
  modulePathIgnorePatterns: ['cypress']
}

export default config

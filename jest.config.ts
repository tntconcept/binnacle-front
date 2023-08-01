import type { Config } from 'jest'

process.env.TZ = 'UTC'

const config: Config = {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  setupFiles: ['<rootDir>/src/test-utils/setup-tests.ts'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/src/test-utils/mocks/svg.ts'
  },
  modulePathIgnorePatterns: ['cypress']
}

export default config

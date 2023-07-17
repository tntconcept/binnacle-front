import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  resetMocks: true,
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  setupFiles: ['<rootDir>/test-utils/setup-tests.ts'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 86,
      branches: 65,
      functions: 70,
      lines: 86
    }
  },
  testEnvironment: 'jsdom',
  coverageReporters: ['html', 'lcov', 'json', 'text'],
  rootDir: 'src',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/test-utils/mocks/svg.ts'
  }
}

export default config

import 'shared/archimedes/archimedes'
import 'shared/i18n/i18n'
import { configure } from 'test-utils/app-test-utils'
import './test-utils/di/integration-di'

// Disable huge error output of testing library
configure({
  defaultHidden: true
})

const matchMediaMock = jest.fn().mockImplementation((query) => ({
  matches: true,
  media: query,
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
}))

// matchMedia is not supported in JSDOM
// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock
})

import 'shared/archimedes/archimedes'
import 'shared/i18n/i18n'
import './test-utils/di/integration-di'

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

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock
})

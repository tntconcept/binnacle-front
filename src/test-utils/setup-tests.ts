import './di/unit-di'
import '../shared/archimedes/archimedes'
import '../shared/i18n/i18n'
import matchers from '@testing-library/jest-dom/matchers'
import { expect, vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

Object.defineProperty(window, 'scrollTo', vi.fn())

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

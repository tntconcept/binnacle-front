// this adds jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect'

beforeEach(() => {
  localStorage.clear()
})

jest.mock('core/i18n/i18n', () => ({ t: (key: string) => key, language: 'en' }))
jest.mock('react-i18next', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-i18next')

  return {
    ...originalModule,
    // mock only useTranslation hook
    useTranslation: () => {
      return {
        t: (key: string, options: any) => {
          // if there aren't options then return only the key
          if (options === undefined) {
            return key
          }

          // if options exists then return the key + the options parsed to string
          return key + ' ' + JSON.stringify(options)
        },
        i18n: {
          language: 'en'
        }
      }
    }
  }
})

// Mock Worker of browser-image-compression
// https://github.com/Donaldcwl/browser-image-compression/issues/9
class Worker {
  constructor(stringUrl: string) {
    // @ts-ignore
    this.url = stringUrl
    // @ts-ignore
    this.onmessage = () => {}
  }

  postMessage(msg: string) {
    // @ts-ignore
    this.onmessage(msg)
  }
}

// @ts-ignore
window.Worker = Worker
// @ts-ignore
global.URL.createObjectURL = jest.fn()

window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false,
      addEventListener: function() {},
      removeEventListener: function() {},
      addListener: function() {},
      removeListener: function() {}
    }
  }

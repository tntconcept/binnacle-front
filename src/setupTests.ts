// this adds jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect'

jest.mock('app/i18n', () => ({
  t: (k: string) => k
}))

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

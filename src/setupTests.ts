// this adds jest-dom's custom assertions
import "@testing-library/jest-dom/extend-expect"
import fetchMock from "fetch-mock/es5/client"

jest.mock("i18n", () => ({
  t: (k: string) => k
}));

afterEach(fetchMock.reset)

// Mock Worker of browser-image-compression
// https://github.com/Donaldcwl/browser-image-compression/issues/9
class Worker {
  constructor(stringUrl: string) {
    // @ts-ignore
    this.url = stringUrl;
    // @ts-ignore
    this.onmessage = () => {};
  }

  postMessage(msg: string) {
    // @ts-ignore
    this.onmessage(msg);
  }
}

// @ts-ignore
window.Worker = Worker;
// @ts-ignore
global.URL.createObjectURL = jest.fn();


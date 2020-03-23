// this adds jest-dom's custom assertions
import "@testing-library/jest-dom/extend-expect"
import fetchMock from "fetch-mock/es5/client"

jest.mock("i18n", () => ({
  t: (k: string) => k
}));

afterEach(fetchMock.reset)

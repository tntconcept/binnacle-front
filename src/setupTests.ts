// this adds jest-dom's custom assertions
import "@testing-library/jest-dom/extend-expect";

jest.mock("i18n", () => ({
  t: (k: string) => k
}));

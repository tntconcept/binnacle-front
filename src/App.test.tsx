import React from "react";
import App from "./App";
import { createMockMediaMatcher, renderWithRouter } from "utils/testing";

describe("App works", () => {
  let originalMatchMedia: {
    (query: string): MediaQueryList;
    (query: string): MediaQueryList;
  };
  beforeAll(() => {
    originalMatchMedia = window.matchMedia;
  });

  beforeEach(() => {
    // @ts-ignore
    window.matchMedia = createMockMediaMatcher(false);
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("renders without crashing", () => {
    const result = renderWithRouter(<App />);
  });
});

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createMockMediaMatcher } from "utils/testing";

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
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

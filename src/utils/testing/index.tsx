import React from "react";
import MockAdapter from "axios-mock-adapter";
import { axiosClient } from "services/axiosClient";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";
import { Router } from "react-router-dom";

// This sets the mock adapter on the instance of axios
export const axiosMock = new MockAdapter(axiosClient);

export const createMockMediaMatcher = (matches: boolean) => {
  return () => ({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {}
  });
};

export const renderWithRouter = (
  ui: React.ReactElement<any>,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] })
  } = {}
) => {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history
  };
};

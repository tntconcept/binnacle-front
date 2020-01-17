import React from "react"
import {createMemoryHistory} from "history"
import {render} from "@testing-library/react"
import {Router} from "react-router-dom"

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
    history = createMemoryHistory({ initialEntries: [route] }),
    Wrapper = undefined
  }: {
    Wrapper?: React.ComponentType;
    history?: any;
    route?: string;
  } = {}
) => {
  if (Wrapper !== undefined) {
    return {
      ...render(
        <Router history={history}>
          <Wrapper>{ui}</Wrapper>
        </Router>
      ),
      history
    };
  } else {
    return {
      ...render(<Router history={history}>{ui}</Router>),
      history
    };
  }
};

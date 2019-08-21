import MockAdapter from "axios-mock-adapter";
import { axiosClient } from "services/axiosClient";

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

import { createMockMediaMatcher } from "utils/testing";

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

it.todo("should redirect to binnacle page if the user is authenticated");
it.todo("should render the desktop login page");
it.todo("should render the mobile login page");
it.todo("should display the current version");

// TODO Investigate to reuse the login form between the desktop and mobile page

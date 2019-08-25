import { createMockMediaMatcher, renderWithRouter } from "utils/testing";
import LoginPage from "pages/login/LoginPage";
import * as React from "react";
import { AuthContext } from "core/contexts/AuthContext";
import { render } from "@testing-library/react";

describe("Login Page", () => {
  const Wrapper: React.FC = ({ children }) => {
    return (
      // @ts-ignore
      <AuthContext.Provider value={{ isAuthenticated: true }}>
        {children}
      </AuthContext.Provider>
    );
  };

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

  it("should redirect to binnacle page if the user is authenticated", () => {
    const result = renderWithRouter(
      <Wrapper>
        <LoginPage />
      </Wrapper>
    );
    expect(result.asFragment()).toMatchInlineSnapshot(`<DocumentFragment />`);
  });

  it("should render the desktop login page", () => {
    const result = render(<LoginPage />);
    expect(result.getByText("Bienvenido")).toBeInTheDocument();
  });

  it("should render the mobile login page", () => {
    // @ts-ignore
    window.matchMedia = createMockMediaMatcher(true);

    const result = render(<LoginPage />);
    expect(result.queryByText("Bienvenido")).not.toBeInTheDocument();
  });

  it("should display the current version", () => {
    const result = render(<LoginPage />);
    expect(
      result.getByText("v" + process.env.REACT_APP_VERSION)
    ).toBeInTheDocument();
  });

  // TODO Investigate to reuse the login form between the desktop and mobile page
});

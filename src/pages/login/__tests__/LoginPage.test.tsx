import {
  axiosMock,
  createMockMediaMatcher,
  renderWithRouter
} from "utils/testing";
import LoginPage from "pages/login/LoginPage";
import * as React from "react";
import { AuthProvider } from "core/contexts/AuthContext";
import { fireEvent, render, waitForDomChange } from "@testing-library/react";
import { NotificationsProvider } from "core/contexts/NotificationsContext";
import {
  ACTIVITIES_ENDPOINT,
  AUTH_ENDPOINT,
  HOLIDAYS_ENDPOINT,
  TIME_TRACKER_ENDPOINT,
  USER_ENDPOINT
} from "services/endpoints";
import {
  buildActivitiesResponse,
  buildHolidaysResponse,
  buildOAuthResponse,
  buildTimeStatsResponse,
  buildUserResponse
} from "utils/testing/mocks";
import Routes from "Routes";
import mockDate from "mockdate";

const Wrapper: React.FC = ({ children }) => {
  return (
    <NotificationsProvider>
      <AuthProvider>{children}</AuthProvider>
    </NotificationsProvider>
  );
};

describe("Login Page", () => {
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
    axiosMock.reset();
  });

  it("should display the current version", () => {
    const result = render(<LoginPage />);
    expect(
      result.getByText("v" + process.env.REACT_APP_VERSION)
    ).toBeInTheDocument();
  });

  describe("should render different pages based on the media query", () => {
    it("should render the desktop login page if the media query does not match", () => {
      const result = render(<LoginPage />);
      expect(result.getByText("login_page.welcome_title")).toBeInTheDocument();
    });

    it("should render the mobile login page if the media query match", () => {
      // @ts-ignore
      window.matchMedia = createMockMediaMatcher(true);

      const result = render(<LoginPage />);
      expect(
        result.queryByText("login_page.welcome_title")
      ).not.toBeInTheDocument();
    });
  });

  describe("Login form should work correctly", () => {
    it("should focus the username input after the component is mounted", function() {
      const result = render(<LoginPage />);
      expect(result.getByTestId("username_input")).toHaveFocus();
    });

    it("should see the form errors if the user does not fill anything and try to submit", async () => {
      const result = render(<LoginPage />);
      fireEvent.click(result.getByTestId("login_button"));
      const errors = await result.findAllByText("form_errors.field_required");
      expect(errors.length).toBe(2);
    });

    it("should login correctly", async () => {
      mockDate.set("2019-09-09 14:00:00");

      axiosMock.onPost(AUTH_ENDPOINT).reply(200, buildOAuthResponse());
      axiosMock.onGet(USER_ENDPOINT).reply(200, buildUserResponse());
      axiosMock
        .onGet(ACTIVITIES_ENDPOINT, {
          params: {
            startDate: "2019-08-26",
            endDate: "2019-10-06"
          }
        })
        .reply(200, buildActivitiesResponse());
      axiosMock
        .onGet(HOLIDAYS_ENDPOINT, {
          params: {
            startDate: "2019-08-26",
            endDate: "2019-10-06"
          }
        })
        .reply(200, buildHolidaysResponse());
      axiosMock
        .onGet(TIME_TRACKER_ENDPOINT, {
          params: {
            startDate: "2019-09-01",
            endDate: "2019-09-09"
          }
        })
        .reply(200, buildTimeStatsResponse());

      const result = renderWithRouter(<Routes />, { Wrapper });

      // waits for the component to be fetched
      await waitForDomChange();

      fireEvent.change(result.getByTestId("username_input"), {
        target: { value: "jdoe" }
      });
      fireEvent.change(result.getByTestId("password_input"), {
        target: { value: "secret-password" }
      });

      fireEvent.click(result.getByTestId("login_button"));

      await waitForDomChange();

      expect(
        result.queryByText("api_errors.not_found")
      ).not.toBeInTheDocument();

      expect(result.getByTestId("selected_date")).toHaveTextContent(
        "September 2019"
      );

      result.debug();
      localStorage.clear();
      mockDate.reset();
    });

    it("should show a notification with the explanation of why the request failed", async () => {
      axiosMock.onPost(AUTH_ENDPOINT).reply(500, buildOAuthResponse());

      const result = render(<LoginPage />, { wrapper: Wrapper });
      fireEvent.change(result.getByTestId("username_input"), {
        target: { value: "jdoe" }
      });
      fireEvent.change(result.getByTestId("password_input"), {
        target: { value: "secret-password" }
      });

      fireEvent.click(result.getByTestId("login_button"));

      const notification = await result.findByText("api_errors.server_error");

      expect(notification).toBeInTheDocument();
      expect(result.getByTestId("username_input")).toHaveValue("jdoe");
    });

    it("should clear the form and set the focus on the username input if the request is unauthorized", async () => {
      axiosMock.onPost(AUTH_ENDPOINT).reply(401, {});

      const result = render(<LoginPage />, { wrapper: Wrapper });
      fireEvent.change(result.getByTestId("username_input"), {
        target: { value: "jdoe" }
      });
      fireEvent.change(result.getByTestId("password_input"), {
        target: { value: "secret-password" }
      });

      fireEvent.click(result.getByTestId("login_button"));

      const notification = await result.findByText("api_errors.unauthorized");

      expect(notification).toBeInTheDocument();
      expect(result.getByTestId("username_input")).toHaveValue("");
      expect(result.getByTestId("password_input")).toHaveValue("");
      expect(result.getByTestId("username_input")).toHaveFocus();
    });
  });
});

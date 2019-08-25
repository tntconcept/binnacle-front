import React from "react";
import { fireEvent, render, waitForDomChange } from "@testing-library/react";
import DesktopLoginPageLayout from "desktop/layouts/DesktopLoginPageLayout";
import { AuthProvider } from "core/contexts/AuthContext";
import { axiosMock } from "utils/testing";
import { AUTH_ENDPOINT, USER_ENDPOINT } from "services/endpoints";
import { buildOAuthResponse, buildUserResponse } from "utils/testing/mocks";
import { NotificationsProvider } from "core/contexts/NotificationsContext";

jest.mock("i18n", () => ({
  t: (k: string) => k
}));

const Wrapper: React.FC = ({ children }) => {
  return (
    <NotificationsProvider>
      <AuthProvider>{children}</AuthProvider>
    </NotificationsProvider>
  );
};

describe("Login Desktop", () => {
  it("should focus the username input after the component is mounted", function() {
    const result = render(<DesktopLoginPageLayout />);
    expect(result.getByTestId("username_input")).toHaveFocus();
  });

  it("should see the form errors if the user does not fill anything and try to submit", async () => {
    const result = render(<DesktopLoginPageLayout />);
    fireEvent.click(result.getByTestId("login_button"));
    const errors = await result.findAllByText("form_errors.field_required");
    expect(errors.length).toBe(2);
  });

  it("should login correctly", async () => {
    axiosMock.onPost(AUTH_ENDPOINT).reply(200, buildOAuthResponse());
    axiosMock.onGet(USER_ENDPOINT).reply(200, buildUserResponse());

    const result = render(<DesktopLoginPageLayout />, { wrapper: Wrapper });
    fireEvent.change(result.getByTestId("username_input"), {
      target: { value: "jdoe" }
    });
    fireEvent.change(result.getByTestId("password_input"), {
      target: { value: "secret-password" }
    });

    fireEvent.click(result.getByTestId("login_button"));

    await waitForDomChange();

    expect(result.queryByText("api_errors.not_found")).not.toBeInTheDocument();
  });

  it("should show a notification with the explanation of why the request failed", async () => {
    axiosMock.onPost(AUTH_ENDPOINT).reply(500, buildOAuthResponse());

    const result = render(<DesktopLoginPageLayout />, { wrapper: Wrapper });
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

    const result = render(<DesktopLoginPageLayout />, { wrapper: Wrapper });
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

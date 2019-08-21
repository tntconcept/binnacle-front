import React from "react";
import { fireEvent, render } from "@testing-library/react";
import LoginDesktop from "desktop/pages/LoginDesktop";

jest.mock("i18n", () => ({
  t: (k: string) => k
}));

it("should focus the username input after the component is mounted", function() {
  const result = render(<LoginDesktop />);
  expect(result.getByTestId("username_input")).toHaveFocus();
});

it("should see the form errors if the user does not fill anything and try to submit", async () => {
  const result = render(<LoginDesktop />);
  fireEvent.click(result.getByTestId("login_button"));
  const errors = await result.findAllByText("form_errors.field_required");
  expect(errors.length).toBe(2);
});

test("should login correctly", async () => {
  const result = render(<LoginDesktop />);
  fireEvent.change(result.getByTestId("username_input"), {
    target: { value: "jdoe" }
  });
  fireEvent.change(result.getByTestId("password_input"), {
    target: { value: "secret-password" }
  });

  fireEvent.click(result.getByTestId("login_button"));
});

it.todo(
  "should show a notification with the explanation of why the request failed"
);
it.todo(
  "should clear the form and set the focus on the username input if the request fails"
);

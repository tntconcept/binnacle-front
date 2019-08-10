import React from "react";
import { render } from "@testing-library/react";
import LoginPage from "../LoginPage";

it("should render correctly", function() {
  const result = render(<LoginPage />);

  expect(result.asFragment().firstElementChild).toHaveTextContent("Login page");
});

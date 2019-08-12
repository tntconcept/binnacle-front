import React from "react";
import { render } from "@testing-library/react";
import LoginPage from "pages/login/LoginPage";

it("should render form correctly", function() {
  const result = render(<LoginPage />);
  result.debug();
});

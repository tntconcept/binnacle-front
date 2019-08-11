import getErrorMessage from "../ApiErrorMessage";
import { AxiosError } from "axios";

jest.mock("../../i18n", () => ({
  t: (k: string) => k
}));

const mockAxiosError = (status?: number, code?: String) => ({
  code: code,
  response: status ? { status: status } : undefined
});

test.each`
  status | expected
  ${401} | ${"api_errors.unauthorized"}
  ${403} | ${"api_errors.forbidden"}
  ${404} | ${"api_errors.not_found"}
  ${408} | ${"api_errors.timeout"}
  ${500} | ${"api_errors.server_error"}
  ${503} | ${"api_errors.server_down"}
  ${600} | ${"api_errors.unknown"}
`("when status is $status returns $expected ", ({ status, expected }) => {
  expect(getErrorMessage(mockAxiosError(status) as AxiosError)).toBe(expected);
});

test("when axios timeouts the request returns timeout message", function() {
  expect(
    getErrorMessage(mockAxiosError(undefined, "ECONNABORTED") as AxiosError)
  ).toBe("api_errors.timeout");
});

test("overrides the 401 error message with a custom one", function() {
  const customErrorMessage = {
    401: "401 error message replaced"
  };
  expect(
    getErrorMessage(mockAxiosError(401) as AxiosError, customErrorMessage)
  ).toBe(customErrorMessage["401"]);
});

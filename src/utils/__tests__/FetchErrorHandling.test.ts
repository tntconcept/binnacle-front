import getErrorMessage from "utils/FetchErrorHandling"
import {WretcherError} from "wretch"

jest.mock("../../i18n", () => ({
  t: (k: string) => k
}));

const mockPromiseError = (status?: number, name: string | undefined = undefined) => ({
  name: name,
  response: status ? { status: status } : undefined
});

describe("FetchErrorHandling", () => {
  test.each`
    status | title                        | description
    ${401} | ${"api_errors.unauthorized"} | ${"api_errors.unauthorized_description"}
    ${403} | ${"api_errors.forbidden"}    | ${"api_errors.forbidden_description"}
    ${404} | ${"api_errors.not_found"}    | ${"api_errors.general_description"}
    ${408} | ${"api_errors.timeout"}      | ${"api_errors.general_description"}
    ${500} | ${"api_errors.server_error"} | ${"api_errors.general_description"}
    ${503} | ${"api_errors.server_down"}  | ${"api_errors.general_description"}
    ${600} | ${"api_errors.unknown"}      | ${"api_errors.general_description"}
  `(
  "when status is $status returns a message with title $title and description $description",
  ({ status, title, description }) => {
    expect(getErrorMessage(mockPromiseError(status) as WretcherError)).toEqual({
      title: title,
      description: description
    });
  }
);

  test("when request timeouts returns timeout message", function() {
    expect(
      getErrorMessage(mockPromiseError(undefined, "AbortError") as WretcherError)
    ).toEqual({
      title: "api_errors.timeout",
      description: "api_errors.general_description"
    });
  });

  test("overrides the 401 error message with a custom one", function() {
    const customErrorMessage = {
      401: {
        title: "401 error title replaced",
        description: "401 error replaced "
      }
    };
    expect(
      getErrorMessage(mockPromiseError(401) as WretcherError, customErrorMessage)
    ).toBe(customErrorMessage["401"]);
  });
});

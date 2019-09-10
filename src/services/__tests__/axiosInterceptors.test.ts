import { axiosMock } from "utils/testing";
import { AUTH_ENDPOINT, USER_ENDPOINT } from "services/endpoints";
import { buildOAuthResponse, buildUserResponse } from "utils/testing/mocks";
import { getLoggedUser } from "services/authService";

jest.mock("core/contexts/AuthContext/tokenUtils", () => ({
  getToken: (tokenType: "access_token" | "refresh_token") =>
    tokenType === "refresh_token"
      ? "mock of refresh token"
      : "mock of access token",
  saveToken: jest.fn()
}));

describe("Axios interceptors", () => {
  afterEach(() => {
    axiosMock.reset();
    localStorage.clear();
  });

  it("intercepts the 401 response and refresh the token successfully", async () => {
    const userResponse = buildUserResponse();

    axiosMock.onGet(USER_ENDPOINT).replyOnce(401);

    // refresh the token and then retries the user request
    axiosMock.onPost(AUTH_ENDPOINT).reply(200, buildOAuthResponse());

    axiosMock.onGet(USER_ENDPOINT).replyOnce(200, userResponse);

    const result = await getLoggedUser();

    expect(result.data).toEqual(userResponse);
  });

  it("intercepts the 401 response, but the refresh token request fails", async () => {
    axiosMock.onGet(USER_ENDPOINT).replyOnce(401);
    axiosMock.onPost(AUTH_ENDPOINT).replyOnce(408);

    await expect(getLoggedUser()).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Request failed with status code 408"`
    );
  });

  it("should NOT trigger another request if the first refresh token call fails with an 401 status code", async () => {
    axiosMock.onGet(USER_ENDPOINT).replyOnce(401);
    axiosMock.onPost(AUTH_ENDPOINT).replyOnce(401);

    await expect(getLoggedUser()).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Request failed with status code 401"`
    );
  });

  xit("should NOT trigger the refresh token request because the access_token is not saved in the localstorage", async () => {
    axiosMock.onGet(USER_ENDPOINT).replyOnce(401);

    await expect(getLoggedUser()).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Request failed with status code 401"`
    );
  });
});

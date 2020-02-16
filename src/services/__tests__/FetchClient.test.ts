import {getLoggedUser} from "services/FetchClient"
// @ts-ignore
import fetchMock from "fetch-mock/es5/client"
import {AUTH_ENDPOINT, USER_ENDPOINT} from "services/endpoints"
import {buildOAuthResponse} from "utils/testing/mocks"
import Cookies from "js-cookie"

jest.spyOn(Cookies, "getJSON");
jest.spyOn(Cookies, "set");

jest.mock("js-cookie", () => ({
  getJSON: () => ({
    access_token: "Access Token",
    refresh_token: "Refresh Token"
  }),
  set: jest.fn(),
  clear: jest.fn()
}));

describe("OAuth Service", () => {
  beforeEach(fetchMock.restore);

  it("should intercept the 401 response and refresh the token successfully", async () => {
    fetchMock
      .getOnce("end:" + USER_ENDPOINT, 401)
      // refresh the token and then retries the user request
      .postOnce("path:" + AUTH_ENDPOINT, {
        status: 200,
        body: buildOAuthResponse()
      })
      .get(
        "end:" + USER_ENDPOINT,
        {
          status: 200,
          body: { id: 100 }
        },
        { overwriteRoutes: false }
      );

    const result = await getLoggedUser();

    expect(result).toEqual({ id: 100 });
    expect(fetchMock.calls().length).toBe(3);
    expect(Cookies.getJSON).toHaveBeenCalled();
    expect(Cookies.set).toHaveBeenCalledWith("BINNACLE", {
      access_token: "demo access token",
      refresh_token: "demo refresh token"
    });
  });

  it("should throw error of refresh token request when the original request fails", async () => {
    fetchMock
      .getOnce("end:" + USER_ENDPOINT, 401)
      .postOnce("path:" + AUTH_ENDPOINT, 500);

    const result = await getLoggedUser();

    expect(result).toMatchObject({ status: 500 });
    expect(fetchMock.calls().length).toBe(2);
  });

  it("should not fetch refresh token when the request fails with a status code different than 401", async () => {
    fetchMock.getOnce("path:" + USER_ENDPOINT, 400);

    await expect(getLoggedUser()).rejects.toMatchInlineSnapshot(
      `[Error: Request failed with status code 400]`
    );

    expect(fetchMock.calls().length).toBe(1);
  });

  it('should timeout the request', async () => {
    jest.setTimeout(12_000)

    fetchMock.getOnce("path:" + USER_ENDPOINT, { hello: 'world' }, {
      delay: 11_000
    });

    await expect(getLoggedUser()).rejects.toThrowError(DOMException)

  })
});

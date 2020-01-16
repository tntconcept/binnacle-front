import {getLoggedUser} from "services/fetchClient"
import fetchMock from "fetch-mock"
import {AUTH_ENDPOINT, USER_ENDPOINT} from "services/endpoints"
import {buildOAuthResponse} from "utils/testing/mocks"

jest.mock("js-cookie", () => ({
  getJSON: () => ({access_token: "Access Token", refresh_token: "Refresh Token"})
}));

describe("OAuth Service", () => {

  beforeEach(fetchMock.restore)

  it("should intercept the 401 response and refresh the token successfully", async () => {
    fetchMock.getOnce("end:" + USER_ENDPOINT, 401);

    // refresh the token and then retries the user request
    fetchMock.postOnce("end:" + AUTH_ENDPOINT, {
      status: 200,
      body: buildOAuthResponse()
    });

    fetchMock.getOnce(
      "end:" + USER_ENDPOINT,
      {
        status: 200,
        body: { id: 100 }
      },
      { overwriteRoutes: true }
    );

    const result = await getLoggedUser();

    expect(result).toEqual({ id: 100 });
  });

  it("should fail original request when refresh token request fails", async () => {
    fetchMock.getOnce("end:" + USER_ENDPOINT, 401);

    // refresh the token and then retries the user request
    fetchMock.postOnce("path:" + AUTH_ENDPOINT, 500);

    const result = await getLoggedUser();

    console.log(result)

    // @ts-ignore
    expect(result.status).toEqual(401);
  });

  it('should fail request without trying to fetch a refresh_token', async () => {
    fetchMock.getOnce("end:" + USER_ENDPOINT, 404);

    // fetchMock.mock("path:" + AUTH_ENDPOINT, 500);

    const result = await getLoggedUser();

    // @ts-ignore
    expect(result.status).toEqual(404);
    expect(fetchMock.lastCall()).toEqual("")
  })
});

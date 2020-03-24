import fetchMock from "fetch-mock/es5/client"
import endpoints from "api/endpoints"
import {getLoggedUser} from "api/UserAPI"
import {buildOAuthResource} from "utils/generateTestMocks"
import {TokenService} from "services/TokenService"

describe("HttpClient", () => {
  it("should timeout the request", async () => {
    jest.setTimeout(12_000);

    fetchMock.getOnce(
      "path:/" + endpoints.user,
      { id: 1 },
      {
        delay: 11_000
      }
    );

    await expect(getLoggedUser()).rejects.toMatchInlineSnapshot(
      "[TimeoutError: Request timed out]"
    );
  });

  describe("oauth interceptors", () => {
    afterEach(fetchMock.reset);

    it("should intercept the 401 response and refresh the token successfully", async () => {
      TokenService.storeTokens = jest.fn();
      const oauthResource = buildOAuthResource();
      fetchMock
        .getOnce("end:" + endpoints.user, 401)
        // refresh the token and then retries the user request
        .postOnce("path:/" + endpoints.auth, {
          status: 200,
          body: oauthResource
        })
        .get(
          "end:" + endpoints.user,
          {
            status: 200,
            body: { id: 100 }
          },
          { overwriteRoutes: false }
        );

      const result = await getLoggedUser();

      expect(result).toEqual({ id: 100 });
      expect(fetchMock.calls().length).toBe(3);
      expect(TokenService.storeTokens).toHaveBeenCalledWith(
        oauthResource.access_token,
        oauthResource.refresh_token
      );
    });

    it("should throw error of refresh token request when the original request fails", async () => {
      fetchMock
        .getOnce("end:" + endpoints.user, 401)
        .postOnce("path:/" + endpoints.auth, 500);

      await expect(getLoggedUser()).rejects.toMatchInlineSnapshot("[HTTPError: Unauthorized]");
      expect(fetchMock.calls().length).toBe(2);
    });

    it("should not fetch refresh token when the request fails with a status code different than 401", async () => {
      fetchMock.getOnce("path:/" + endpoints.user, 400);

      await expect(getLoggedUser()).rejects.toMatchInlineSnapshot(
        `[HTTPError: Bad Request]`
      );

      expect(fetchMock.calls().length).toBe(1);
    });
  });
});

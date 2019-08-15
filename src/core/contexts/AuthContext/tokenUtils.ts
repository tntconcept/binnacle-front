const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

type TokenType = "access_token" | "refresh_token";

export const saveToken = (token: string, tokenType: TokenType) => {
  const key =
    tokenType === "access_token" ? ACCESS_TOKEN_KEY : REFRESH_TOKEN_KEY;
  window.localStorage.setItem(key, token);
};

export const removeToken = (tokenType: TokenType) => {
  const key =
    tokenType === "access_token" ? ACCESS_TOKEN_KEY : REFRESH_TOKEN_KEY;
  window.localStorage.removeItem(key);
};

export const getToken = (tokenType: TokenType) => {
  const key =
    tokenType === "access_token" ? ACCESS_TOKEN_KEY : REFRESH_TOKEN_KEY;
  return window.localStorage.getItem(key);
};

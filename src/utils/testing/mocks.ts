import { IResponseToken, IUser } from "services/authService";

export const buildOAuthResponse = (): IResponseToken => ({
  access_token: "demo access token",
  token_type: "bearer",
  refresh_token: "demo refresh token",
  expires_in: 360,
  scope: "tnt",
  jti: "jti code"
});

export const buildUserResponse = (): IUser => ({
  id: 1,
  dayDuration: 480,
  departmentId: 1,
  email: "username@email.com",
  genre: "male",
  hiringDate: new Date().toDateString(),
  name: "john",
  photoUrl: undefined,
  role: {
    id: 1,
    name: "User"
  },
  username: "jdoe"
});

import { IUser } from "../models/user";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export function signInResponse(
  token: string
): ApiResponse<{ access_token: string }> {
  return {
    data: {
      access_token: token,
    },
  };
}

export function signUpResponse(user: IUser): ApiResponse<{ email: string }> {
  return {
    data: {
      email: user.email,
    },
  };
}

export function logoutResponse(isLogout: boolean): ApiResponse<{}> {
  return {
    message: "User has successfully logged out",
    data: {},
  };
}

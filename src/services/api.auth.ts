import { axiosInstance } from "@/lib/axios";
import { AuthUser, LoginCredentials } from "@/types/auth";
import { ApiResponse } from "@/types/common";

export const loginRequest = (credentials: LoginCredentials) => {
  return axiosInstance.post<ApiResponse<AuthUser>>("auth/login/", credentials);
};

export const logoutRequest = () => {
  return axiosInstance.post<ApiResponse<null>>("auth/logout/");
};

export const authUserRequest = () => {
  return axiosInstance.get<ApiResponse<AuthUser>>("auth/me/");
};

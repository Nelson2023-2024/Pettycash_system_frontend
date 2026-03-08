import { axiosInstance } from "@/lib/axios";
import { ApiResponse, AuthUser, LoginCredentials } from "@/types/auth";

export const loginRequest = (credentials: LoginCredentials) => {
  return axiosInstance.post<ApiResponse<AuthUser>>("auth/login", credentials);
};

export const logoutRequest = () => {
  return axiosInstance.post<ApiResponse<null>>("auth/logout");
};

export const authUserRequest = () => {
  return axiosInstance.get<ApiResponse<AuthUser>>("auth/me");
};

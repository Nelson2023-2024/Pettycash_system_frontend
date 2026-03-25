import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateProfilePayload,
} from "@/types/user";

// ADMIN
export const getAllUsers = () =>
  axiosInstance.get<ApiResponse<User[]>>("/users/");

export const getUserById = (user_id: string) =>
  axiosInstance.get<ApiResponse<User>>(`/users/${user_id}/`);

export const createUser = (payload: CreateUserPayload) =>
  axiosInstance.post<ApiResponse<User>>("/users/create/", payload);

export const updateUser = (user_id: string, payload: UpdateUserPayload) =>
  axiosInstance.patch<ApiResponse<User>>(`/users/${user_id}/update/`, payload);

// AUTHENTICATED USER
export const updateProfile = (payload: UpdateProfilePayload) =>
  axiosInstance.post<ApiResponse<User>>("/users/profile/update/", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });


export const searchUsers = (query: string) =>
  axiosInstance.get<ApiResponse<User[]>>(`/users/search/?search=${query}`);
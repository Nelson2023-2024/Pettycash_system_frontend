import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { Role } from "@/types/role";

export const getAllRoles = () =>
  axiosInstance.get<ApiResponse<Role[]>>("/users/roles/all/");
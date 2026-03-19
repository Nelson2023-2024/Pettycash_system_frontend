import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "@/types/department";

export const getAllDepartments = () =>
  axiosInstance.get<ApiResponse<Department[]>>("/department/");

export const getDepartmentById = (department_id: string) =>
  axiosInstance.get<ApiResponse<Department>>(`/department/${department_id}/`);

export const createDepartment = (payload: CreateDepartmentPayload) =>
  axiosInstance.post<ApiResponse<Department>>("/department/create/", payload);

export const updateDepartment = (department_id: string, payload: UpdateDepartmentPayload) =>
  axiosInstance.patch<ApiResponse<Department>>(`/department/${department_id}/update/`, payload);

export const deactivateDepartment = (department_id: string) =>
  axiosInstance.post<ApiResponse<Department>>(`/department/${department_id}/deactivate/`);
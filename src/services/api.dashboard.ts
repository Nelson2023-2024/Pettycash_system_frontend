import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { DashboardData } from "@/types/dashboard";

export const getDashboard = () => {
  return axiosInstance.get<ApiResponse<DashboardData>>("/audit/dashboard/");
};
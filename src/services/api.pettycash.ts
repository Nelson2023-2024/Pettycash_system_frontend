import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import {
  CreatePettyCashPayload,
  PettyCash,
  PettyCashAccountActivity,
  UpdatePettyCashPayload,
} from "@/types/pettycash";

// FO
export const getPettyCashAccounts = () =>
  axiosInstance.get<ApiResponse<PettyCash[]>>("/finance/petty_cash/");

export const getPettyCashById = (id: string) =>
  axiosInstance.get<ApiResponse<PettyCash>>(`/finance/petty_cash/${id}/`);

// ADMIN, CFO
export const createPettyCash = (payload: CreatePettyCashPayload) =>
  axiosInstance.post<ApiResponse<PettyCash>>(
    "/finance/petty_cash/create/",
    payload,
    {},
  );

export const updatePettyCash = (id: string, payload: UpdatePettyCashPayload) =>
  axiosInstance.patch<ApiResponse<PettyCash>>(
    `/finance/petty_cash/${id}/update/`,
    payload,
  );

export const deactivatePettyCash = (id: string) =>
  axiosInstance.delete<ApiResponse<PettyCash>>(
    `/finance/petty_cash/${id}/deactivate/`,
  );

export const getPettyCashActivity = () =>
  axiosInstance.get<ApiResponse<PettyCashAccountActivity>>(
    "/finance/petty_cash/activity/",
  );

export const exportPettyCashActivity = (period: "weekly" | "monthly") =>
  axiosInstance.get(`/finance/petty_cash/activity/export/?period=${period}`, {
    responseType: "blob",
  });

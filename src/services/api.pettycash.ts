


import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { CreatePettyCashPayload, PettyCash, UpdatePettyCashPayload } from "@/types/pettycash";

// FO
export const getPettyCashAccounts = () =>
  axiosInstance.get<ApiResponse<PettyCash[]>>("/petty_cash/");


export const getPettyCashById = (id: string) =>
  axiosInstance.get<ApiResponse<PettyCash>>(`/petty_cash/${id}/`);


// ADMIN, CFO
export const createPettyCash = (payload: CreatePettyCashPayload) =>
  axiosInstance.post<ApiResponse<PettyCash>>("/petty_cash/create/", payload,{
  });

export const updatePettyCash = (id: string, payload: UpdatePettyCashPayload) =>
  axiosInstance.patch<ApiResponse<PettyCash>>(`/petty_cash/${id}/update/`, payload);

export const deactivatePettyCash = (id: string) =>
  axiosInstance.delete<ApiResponse<PettyCash>>(`/petty_cash/${id}/deactivate/`);


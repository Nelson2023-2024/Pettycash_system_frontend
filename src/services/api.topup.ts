import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { TopUp, CreateTopUpPayload, UpdateTopUpPayload, DecideTopUpPayload } from "@/types/topup";

// FO — create topup for a specific petty cash account
export const createTopUp = (pettycash_account_id: string, payload: CreateTopUpPayload) =>
  axiosInstance.post<ApiResponse<TopUp>>(`/finance/topup/${pettycash_account_id}/create/`, payload);

// ADM, FO — all topups
export const getAllTopUps = () =>
  axiosInstance.get<ApiResponse<TopUp[]>>("/finance/topup/");

// FO — own topup requests
export const getMyTopUps = () =>
  axiosInstance.get<ApiResponse<TopUp[]>>("/finance/topup/mine/");

// CFO, FO — approve or reject
export const decideTopUp = (topup_id: string, payload: DecideTopUpPayload) =>
  axiosInstance.post<ApiResponse<TopUp>>(`/finance/topup/${topup_id}/decide/`, payload);

// FO — disburse approved topup
export const disburseTopUp = (topup_id: string) =>
  axiosInstance.post<ApiResponse<TopUp>>(`/finance/topup/${topup_id}/disburse/`);

// FO — update pending topup
export const updateTopUp = (topup_id: string, payload: UpdateTopUpPayload) =>
  axiosInstance.patch<ApiResponse<TopUp>>(`/finance/topup/${topup_id}/update/`, payload);

// FO — soft delete
export const deactivateTopUp = (topup_id: string) =>
  axiosInstance.post<ApiResponse<TopUp>>(`/finance/topup/${topup_id}/deactivate/`);
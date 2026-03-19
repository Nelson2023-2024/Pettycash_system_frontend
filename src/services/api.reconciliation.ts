import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import {
  Reconciliation,
  SubmitReconciliationPayload,
  ReviewReconciliationPayload,
} from "@/types/reconciliation";

// EMPLOYEE — own reconciliations
export const getMyReconciliations = () =>
  axiosInstance.get<ApiResponse<Reconciliation[]>>(
    "/finance/reconciliation/mine/",
  );

// FO — all reconciliations
export const getAllReconciliations = () =>
  axiosInstance.get<ApiResponse<Reconciliation[]>>("/finance/reconciliation/");

// EMPLOYEE, FO — single reconciliation
export const getReconciliationById = (reconciliation_id: string) =>
  axiosInstance.get<ApiResponse<Reconciliation>>(
    `/finance/reconciliation/${reconciliation_id}/`,
  );

// EMPLOYEE — submit receipt after disbursement
// uses multipart/form-data because receipt is a File
export const submitReconciliation = (
  reconciliation_id: string,
  payload: SubmitReconciliationPayload,
) => {
  return axiosInstance.post<ApiResponse<Reconciliation>>(
    `/finance/reconciliation/${reconciliation_id}/submit/`,
    payload,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
};

// FO — approve or reject a submitted reconciliation
export const reviewReconciliation = (
  reconciliation_id: string,
  payload: ReviewReconciliationPayload,
) =>
  axiosInstance.patch<ApiResponse<Reconciliation>>(
    `/finance/reconciliation/${reconciliation_id}/review/`,
    payload,
  );

import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { Loan, CreateLoanPayload, DecideLoanPayload } from "@/types/loan";

// EMPLOYEE
export const createLoan = (payload: CreateLoanPayload) =>
  axiosInstance.post<ApiResponse<Loan>>("/finance/loan/create/", payload);

export const getMyLoans = () =>
  axiosInstance.get<ApiResponse<Loan[]>>("/finance/loan/mine/");

// ADMIN, FO, CFO
export const getAllLoans = () =>
  axiosInstance.get<ApiResponse<Loan[]>>("/finance/loan/");

export const getLoanById = (loan_id: string) =>
  axiosInstance.get<ApiResponse<Loan>>(`/finance/loan/${loan_id}/`);

// FO
export const decideLoan = (loan_id: string, payload: DecideLoanPayload) =>
  axiosInstance.post<ApiResponse<Loan>>(
    `/finance/loan/${loan_id}/decide/`,
    payload,
  );

// CFO
export const disburseLoan = (loan_id: string) =>
  axiosInstance.post<ApiResponse<Loan>>(`/finance/loan/${loan_id}/disburse/`);

export const markLoanRepaid = (loan_id: string) =>
  axiosInstance.post<ApiResponse<Loan>>(`/finance/loan/${loan_id}/repaid/`);

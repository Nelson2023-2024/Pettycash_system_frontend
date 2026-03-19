import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { Expense, CreateExpensePayload, UpdateExpensePayload, DecideExpensePayload } from "@/types/expense";

// EMPLOYEE
export const getAuthUserExpenses = () =>
  axiosInstance.get<ApiResponse<Expense[]>>("/finance/expense/mine/");

export const createExpense = (payload: CreateExpensePayload) =>
  axiosInstance.post<ApiResponse<Expense>>("/finance/expense/create/", payload,{
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateExpense = (id: string, payload: UpdateExpensePayload) =>
  axiosInstance.patch<ApiResponse<Expense>>(`/finance/expense/${id}/update/`, payload);

export const deactivateExpense = (id: string) =>
  axiosInstance.delete<ApiResponse<Expense>>(`/finance/expense/${id}/deactivate/`);

// api.expense.ts
export const getExpenseById = (id: string) =>
  axiosInstance.get<ApiResponse<Expense>>(`/finance/expense/${id}/`);

// ADMIN
export const getAllExpenses = () =>
  axiosInstance.get<ApiResponse<Expense[]>>("/finance/expense/");

// FO, CFO
export const decideExpense = (id: string, payload: DecideExpensePayload) =>
  axiosInstance.patch<ApiResponse<Expense>>(`/finance/expense/${id}/decide/`, payload);

export const disburseExpense = (id: string) =>
  axiosInstance.post<ApiResponse<Expense>>(`/finance/expense/${id}/disburse/`);
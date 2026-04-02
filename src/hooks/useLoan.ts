import {
  createLoan,
  getAllLoans,
  getLoanById,
  getMyLoans,
  decideLoan,
  disburseLoan,
  markLoanRepaid,
} from "@/services/api.loan";
import { CreateLoanPayload, DecideLoanPayload } from "@/types/loan";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

/**
 * Fetches all loans across the organization.
 * Accessible by ADM, FO, CFO roles.
 */
export function useGetAllLoans() {
  return useQuery({
    queryKey: ["allLoans"],
    queryFn: async () => {
      const { data } = await getAllLoans();
      return data.data;
    },
  });
}

/**
 * Fetches all loans belonging to the authenticated employee.
 */
export function useGetMyLoans() {
  return useQuery({
    queryKey: ["myLoans"],
    queryFn: async () => {
      const { data } = await getMyLoans();
      return data.data;
    },
  });
}

/**
 * Fetches a single loan by ID.
 * Query is disabled until a valid id is provided.
 */
export function useGetLoanById(id: string) {
  return useQuery({
    queryKey: ["loan", id],
    queryFn: async () => {
      const { data } = await getLoanById(id);
      return data.data;
    },
    enabled: !!id,
  });
}

/**
 * Employee creates a new loan request.
 * Requires amount and reason.
 * Invalidates myLoans on success.
 */
export function useCreateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLoanPayload) => createLoan(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myLoans"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * FO approves or rejects a pending loan.
 * decision must be 'approved' or 'rejected'.
 * decision_reason is optional on approval but should be provided on rejection.
 * Invalidates allLoans on success.
 */
export function useDecideLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      loan_id,
      payload,
    }: {
      loan_id: string;
      payload: DecideLoanPayload;
    }) => decideLoan(loan_id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allLoans"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * CFO disburses an approved loan.
 * Deducts from petty cash balance — invalidates pettyCashAccounts too.
 * Invalidates allLoans on success.
 */
export function useDisburseLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loan_id: string) => disburseLoan(loan_id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allLoans"] });
      queryClient.invalidateQueries({ queryKey: ["pettyCashAccounts"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * CFO marks a disbursed loan as repaid after M-Pesa confirmation.
 * Credits the amount back to petty cash — invalidates pettyCashAccounts too.
 * Invalidates allLoans on success.
 */
export function useMarkLoanRepaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loan_id: string) => markLoanRepaid(loan_id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allLoans"] });
      queryClient.invalidateQueries({ queryKey: ["pettyCashAccounts"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
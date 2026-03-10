import {
  createExpense,
  deactivateExpense,
  decideExpense,
  disburseExpense,
  getAllExpenses,
  getAuthUserExpenses,
  getExpenseById,
  updateExpense,
} from "@/services/api.expense";
import {
  CreateExpensePayload,
  DecideExpensePayload,
  UpdateExpensePayload,
} from "@/types/expense";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ── ADMIN/ FO/ CFO ────────────────────────────────────────────────
export function useGetAllExpenses() {
  return useQuery({
    queryKey: ["allExpenses"],
    queryFn: async () => {
      const { data } = await getAllExpenses();
      return data.data;
    },
  });
}

// ── EMPLOYEE ─────────────────────────────────────────────
export function useGetAuthUserExpenses() {
  return useQuery({
    queryKey: ["authUserExpenses"],
    queryFn: async () => {
      const { data } = await getAuthUserExpenses();
      return data.data;
    },
  });
}

export function useGetExpenseById(id: string) {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: async () => {
      const { data } = await getExpenseById(id);
      return data.data;
    },
    enabled: !!id, // only runs when id exists
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => createExpense(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUserExpenses"] });

      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateExpensePayload;
    }) => updateExpense(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUserExpenses"] });
      toast.success("Expense updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeactivateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUserExpenses"] });
      toast.success("Expense cancelled");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// ── FO / CFO ─────────────────────────────────────────────
export function useDecideExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: DecideExpensePayload;
    }) => decideExpense(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDisburseExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => disburseExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
      toast.success("Expense disbursed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

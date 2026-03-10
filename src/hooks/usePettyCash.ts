import {
  getPettyCashAccounts,
  createPettyCash,
  getPettyCashById,
  updatePettyCash,
  deactivatePettyCash,
} from "@/services/api.pettycash";
import { UpdatePettyCashPayload } from "@/types/pettycash";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Get all petty cash accounts
export function useGetPettyCashAccounts() {
  return useQuery({
    queryKey: ["pettyCashAccounts"],
    queryFn: async () => {
      const { data } = await getPettyCashAccounts();
      return data.data;
    },
  });
}

// Get single petty cash account by id
export function useGetPettyCashAccount(id: string) {
  return useQuery({
    queryKey: ["pettyCashAccount", id],
    queryFn: async () => {
      const { data } = await getPettyCashById(id);
      return data.data;
    },
    enabled: !!id,
  });
}

//CREATE PETTYCASH ACCOUNT
export function useCreatePettyCash() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPettyCash,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pettyCashAccounts"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// UPDATE petty cash
export function useUpdatePettyCash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePettyCashPayload;
    }) => updatePettyCash(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pettyCashAccounts"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Deactivate petty cash
export function useDeactivatePettyCash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivatePettyCash,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pettyCashAccounts"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

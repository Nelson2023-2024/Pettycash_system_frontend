import {
  createTopUp,
  getAllTopUps,
  getMyTopUps,
  decideTopUp,
  disburseTopUp,
  updateTopUp,
  deactivateTopUp,
} from "@/services/api.topup";
import { DecideTopUpPayload, UpdateTopUpPayload, CreateTopUpPayload } from "@/types/topup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

/**
 * Fetches all top-up requests across the organization.
 * Accessible by ADM and FO roles.
 */
export function useGetAllTopUps() {
  return useQuery({
    queryKey: ["allTopUps"],
    queryFn: async () => {
      const { data } = await getAllTopUps();
      return data.data;
    },
  });
}

/**
 * Fetches only the top-up requests created by the authenticated user.
 * Accessible by FO role.
 */
export function useGetMyTopUps() {
  return useQuery({
    queryKey: ["myTopUps"],
    queryFn: async () => {
      const { data } = await getMyTopUps();
      return data.data;
    },
  });
}

/**
 * Creates a new top-up request for a specific petty cash account.
 * Requires the petty cash account ID and the top-up payload (amount + reason).
 * Invalidates both allTopUps and myTopUps on success.
 */
export function useCreateTopUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      pettycash_account_id,
      payload,
    }: {
      pettycash_account_id: string;
      payload: CreateTopUpPayload;
    }) => createTopUp(pettycash_account_id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTopUps"] });
      queryClient.invalidateQueries({ queryKey: ["myTopUps"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Updates a pending top-up request.
 * Only top-ups in 'pending' status can be edited — enforced on the backend.
 * Accepts optional amount and request_reason fields.
 * Invalidates both allTopUps and myTopUps on success.
 */
export function useUpdateTopUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      topup_id,
      payload,
    }: {
      topup_id: string;
      payload: UpdateTopUpPayload;
    }) => updateTopUp(topup_id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTopUps"] });
      queryClient.invalidateQueries({ queryKey: ["myTopUps"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Approves or rejects a top-up request.
 * Decision must be either 'approved' or 'rejected'.
 * decision_reason is optional for approval but required for rejection.
 * Accessible by CFO and FO roles.
 * Invalidates allTopUps on success.
 */
export function useDecideTopUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      topup_id,
      payload,
    }: {
      topup_id: string;
      payload: DecideTopUpPayload;
    }) => decideTopUp(topup_id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTopUps"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Disburses an approved top-up request.
 * Increments the petty cash account's current_balance by the top-up amount.
 * Invalidates allTopUps AND pettyCashAccounts because the account balance changes.
 * Accessible by FO role.
 */
export function useDisburseTopUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (topup_id: string) => disburseTopUp(topup_id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTopUps"] });
      queryClient.invalidateQueries({ queryKey: ["pettyCashAccounts"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Soft deletes a top-up request by setting is_active to False on the backend.
 * The record is preserved in the database for audit purposes.
 * Invalidates both allTopUps and myTopUps on success.
 */
export function useDeactivateTopUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (topup_id: string) => deactivateTopUp(topup_id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTopUps"] });
      queryClient.invalidateQueries({ queryKey: ["myTopUps"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
import {
  getAllReconciliations,
  getMyReconciliations,
  getReconciliationById,
  reviewReconciliation,
  submitReconciliation,
} from "@/services/api.reconciliation";
import {
  ReviewReconciliationPayload,
  SubmitReconciliationPayload,
} from "@/types/reconciliation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

/**
 * Fetches all reconciliations across all employees.
 * Intended for Finance Officer use — full system-wide visibility.
 */
export function useGetAllReconciliations() {
  return useQuery({
    queryKey: ["allReconciliations"],
    queryFn: async () => {
      const { data } = await getAllReconciliations();
      return data.data;
    },
  });
}

/**
 * Fetches all reconciliations belonging to the authenticated employee.
 * Returns full history regardless of status.
 */
export function useGetMyReconciliations() {
  return useQuery({
    queryKey: ["myReconciliations"],
    queryFn: async () => {
      const { data } = await getMyReconciliations();
      return data.data;
    },
  });
}

/**
 * Fetches a single reconciliation by ID.
 * Used for detail views on both employee and FO side.
 * Query is disabled until a valid id is provided.
 */
export function useGetReconciliationById(id: string) {
  return useQuery({
    queryKey: ["reconciliation", id],
    queryFn: async () => {
      const { data } = await getReconciliationById(id);
      return data.data;
    },
    enabled: !!id,
  });
}

/**
 * Employee submits a receipt after cash has been disbursed.
 * Sends multipart/form-data — receipt is a File.
 * Requires reconciled_amount + surplus_returned to add up to disbursed amount.
 * Transitions reconciliation status from pending → under_review.
 * Invalidates myReconciliations and allReconciliations on success.
 */
export function useSubmitReconciliation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reconciliation_id,
      payload,
    }: {
      reconciliation_id: string;
      payload: SubmitReconciliationPayload;
    }) => submitReconciliation(reconciliation_id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myReconciliations"] });
      queryClient.invalidateQueries({ queryKey: ["allReconciliations"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Finance Officer approves or rejects a submitted reconciliation.
 * decision must be 'completed' or 'rejected'.
 * On completion — parent expense request is also marked completed.
 * On rejection — reconciliation goes back to pending for employee resubmission.
 * comments are optional on approval but should always be provided on rejection.
 * Invalidates allReconciliations, myReconciliations, and allExpenses on success
 * since completing a reconciliation also closes the parent expense request.
 */
export function useReviewReconciliation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reconciliation_id,
      payload,
    }: {
      reconciliation_id: string;
      payload: ReviewReconciliationPayload;
    }) => reviewReconciliation(reconciliation_id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allReconciliations"] });
      queryClient.invalidateQueries({ queryKey: ["myReconciliations"] });
      // completing a reconciliation also closes the parent expense request
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["authUserExpenses"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
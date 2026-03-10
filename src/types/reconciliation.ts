export interface Reconciliation {
  id: string;
  expense_request_id: string;
  expense_request_title: string;
  disbursed_amount: string;
  reconciled_amount: string | null;
  surplus_returned: string | null;
  comments: string | null;
  status: string;
  submitted_by: string;
  approved_by: string | null;
  approved_at: string | null;
  receipt: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubmitReconciliationPayload {
  reconciled_amount: number;
  surplus_returned: number;
  comments?: string;
  receipt: File;
}

export interface ReviewReconciliationPayload {
  decision: "completed" | "rejected";
  comments?: string;
}
export interface Expense {
  id: string;
  title: string;
  amount: string;
  expense_type: "disbursement" | "reimbursement";
  description: string;
  status: string;
  status_code: string | null;
  created_at: string;
  updated_at: string;
  mpesa_phone: string;
  receipt?: string | null;
  employee: {
    id: string;
    name: string;
    email: string;
  };
  reason?: string | null;
  // ── Disbursement financial details ──
  transaction_cost: string | null;
  total_deduction: string | null;
  disbursed_at: string | null;
  disbursed_by_email: string | null;
}

export interface CreateExpensePayload {
  title: string;
  expense_type: "disbursement" | "reimbursement";
  description: string;
  amount: number;
  mpesa_phone: string;
  receipt?: File;
}

export interface UpdateExpensePayload {
  title?: string;
  expense_type?: "disbursement" | "reimbursement";
  description?: string;
  amount?: number;
  mpesa_phone?: string;
}

export interface DecideExpensePayload {
  decision: "approved" | "rejected";
  reason?: string;
}
export interface Expense {
  id: string;
  title: string;
  amount: string;
  expense_type: "disbursement" | "reimbursement";
  description: string;
  status: string;
  created_at: string;
  mpesa_phone: string;
  receipt?: string;
  employee_email: string;
  reason?: string;
}

export interface CreateExpensePayload {
  title: string;
  expense_type: "disbursement" | "reimbursement";
  description: string;
  amount: number;
  mpesa_phone: string;
  receipt?: File; // only for reimbursement
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

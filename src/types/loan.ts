export interface Loan {
  id: string;
  amount: string;
  reason: string;
  due_date: string | null;
  repaid_at: string | null;
  decision_reason: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  status: string;
  status_code: string;
  employee: {
    id: string;
    name: string;
    email: string;
  };
  decision_by: {
    id: string;
    name: string;
    email: string;
  } | null;
  transaction_cost: string | null;
  total_deduction: string | null;
  previous_balance: string | null;
  new_balance: string | null;
  disbursed_at: string | null;
}

export interface CreateLoanPayload {
  amount: number;
  reason: string;
}

export interface DecideLoanPayload {
  decision: "approved" | "rejected";
  decision_reason?: string;
}
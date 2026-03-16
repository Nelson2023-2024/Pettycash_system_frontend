export interface TopUp {
  id: string;
  amount: string;
  request_reason: string;
  decision_reason: string;
  is_auto_triggered: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  status: string | null;
  status_code: string | null;
  event_type: string | null;
  pettycash_account: {
    id: string;
    name: string;
    current_balance: string;
  } | null;
  requested_by: {
    id: string;
    name: string;
    email: string;
  } | null;
  decision_by: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface CreateTopUpPayload {
  amount: number;
  request_reason: string;
}

export interface UpdateTopUpPayload {
  amount?: number;
  request_reason?: string;
}

export interface DecideTopUpPayload {
  decision: "approved" | "rejected";
  decision_reason?: string;
}
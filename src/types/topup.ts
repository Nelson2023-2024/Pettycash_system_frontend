export interface TopUp {
  id: string;
  account_name: string;
  amount: string;
  request_reason: string;
  decision_reason: string;
  status: string;
  event_type: string;
  requested_by: string;
  decision_by: string | null;
  is_auto_triggered: boolean;
  is_active: boolean;
  created_at: string;
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
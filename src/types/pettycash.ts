export interface PettyCash {
  id: string;
  name: string;
  description: string;
  mpesa_phone_number: string;
  account_type: string;
  current_balance: string;
  minimum_threshold: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PettyCashActivity {
  date: string;
  item: string;
  triggered_by: {
    id: string;
    name: string;
    email: string;
  } | null;
  amount: string | null;
  transaction_cost: string | null;
  total_spent: string | null;
  balance: string | null;
  event_code: string | null;
  event_name: string | null;
}
export interface PettyCashAccountActivity {
  account: PettyCash;
  activity: PettyCashActivity[];
}

export interface CreatePettyCashPayload {
  name: string;
  description: string;
  mpesa_phone_number: string;
  minimum_threshold: string;
}

export interface UpdatePettyCashPayload {
  name?: string;
  description?: string;
  mpesa_phone_number?: string;
  minimum_threshold?: string;
}
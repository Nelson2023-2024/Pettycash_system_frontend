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
  id: string;
  event_code: string;
  event_name: string;
  message: string;
  triggered_by: {
    id: string;
    name: string;
    email: string;
  } | null;
  created_at: string;
  amount: string | null;
  expense_amount: string | null;
  transaction_cost: string | null;
  previous_balance: string | null;
  new_balance: string | null;
  amount_deducted: string | null;
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
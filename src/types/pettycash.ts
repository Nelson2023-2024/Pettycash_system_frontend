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
  account_type?: string;
}
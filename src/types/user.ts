export interface User {
  email: string;
  first_name: string;
  last_name: string;
  other_name: string | null;
  phone_number: string;
  national_id: string | null;
  avatar_url: string | null;
  last_login: string | null;
  department: string | null;
  is_active: boolean;
  role: string;
  status: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  other_name?: string;
  phone_number?: string;
  national_id?: string;
  role?: string;
  department?: string;
  status?: string;
}

export interface UpdateUserPayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  other_name?: string;
  phone_number?: string;
  national_id?: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  status?: string;
  is_active?: boolean;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  other_name?: string;
  phone_number?: string;
  national_id?: string;
  avatar_url?: string;
}

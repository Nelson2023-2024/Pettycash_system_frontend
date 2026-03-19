export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  other_name?: string;
  fullname: string;
  phone_number?: string;
  national_id?: string;
  status: string;
  role: string;
  permissions: string[];
  avatar_url?: string | null;
  access_token: string;
  token_type: "Bearer";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

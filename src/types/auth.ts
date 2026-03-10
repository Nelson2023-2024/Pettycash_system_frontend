export interface AuthUser {
  id: string;
  email: string;
  fullname: string;
  status: string;
  role: string;
  permissions: string[];
  access_token: string;
  token_type: "Bearer";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

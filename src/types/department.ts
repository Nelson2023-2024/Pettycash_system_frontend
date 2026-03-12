export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
  line_manager: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface CreateDepartmentPayload {
  name: string;
  description: string;
  code: string;
}

export interface UpdateDepartmentPayload {
  name: string;
  code?: string;
  description?: string;
  line_manager_id?: string;
}
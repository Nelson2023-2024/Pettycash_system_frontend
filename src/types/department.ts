export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
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
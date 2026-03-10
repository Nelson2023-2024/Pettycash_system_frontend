import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deactivateDepartment,
} from "@/services/api.department";
import {
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "@/types/department";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

/**
 * Fetches all active departments.
 * Accessible by ADM role.
 */
export function useGetAllDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data } = await getAllDepartments();
      return data.data;
    },
  });
}

/**
 * Fetches a single department by ID.
 * Query is disabled until a valid id is provided.
 */
export function useGetDepartmentById(id: string) {
  return useQuery({
    queryKey: ["department", id],
    queryFn: async () => {
      const { data } = await getDepartmentById(id);
      return data.data;
    },
    enabled: !!id,
  });
}

/**
 * Creates a new department.
 * Requires name, description, and code.
 * Accessible by ADM role.
 * Invalidates departments on success.
 */
export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => createDepartment(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Updates an existing department.
 * name is required — code, description, line_manager_id are optional.
 * Accessible by ADM role.
 * Invalidates departments on success.
 */
export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      department_id,
      payload,
    }: {
      department_id: string;
      payload: UpdateDepartmentPayload;
    }) => updateDepartment(department_id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Soft deletes a department by setting is_active to False on the backend.
 * The record is preserved in the database for audit purposes.
 * Accessible by ADM role.
 * Invalidates departments on success.
 */
export function useDeactivateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (department_id: string) => deactivateDepartment(department_id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

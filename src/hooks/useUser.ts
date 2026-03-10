import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateProfile,
} from "@/services/api.user";
import { CreateUserPayload, UpdateUserPayload, UpdateProfilePayload } from "@/types/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

/**
 * Fetches all active users.
 * Accessible by ADM role only.
 */
export function useGetAllUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await getAllUsers();
      return data.data;
    },
  });
}

/**
 * Fetches a single user by ID.
 * Accessible by ADM role only.
 * Query is disabled until a valid id is provided.
 */
export function useGetUserById(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await getUserById(id);
      return data.data;
    },
    enabled: !!id,
  });
}

/**
 * Admin creates a new user.
 * Required: email, password, first_name, last_name.
 * Optional: role, department, phone_number, national_id, status.
 * Invalidates users list on success.
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Admin updates any user field including role, department, status, and is_active.
 * Guard on backend — admin cannot deactivate their own account.
 * Invalidates both users list and the individual user cache on success.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      user_id,
      payload,
    }: {
      user_id: string;
      payload: UpdateUserPayload;
    }) => updateUser(user_id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.user_id] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Authenticated user updates their own profile.
 * Allowed fields: first_name, last_name, other_name, phone_number, national_id, avatar_url.
 * Role, status, department are NOT editable here — admin only via useUpdateUser.
 * Invalidates authUser so sidebar and header reflect the changes immediately.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
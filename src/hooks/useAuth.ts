import {
  authUserRequest,
  loginRequest,
  logoutRequest,
} from "@/services/api.auth";
import { LoginCredentials } from "@/types/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useAuthMe() {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await authUserRequest();
      return response.data.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await loginRequest(credentials);
      return data;
    },
    onSuccess: (data) => {
      sessionStorage.setItem("access_token", data.data.access_token);
      // store permissions in a cookie so middleware can read it
      document.cookie = `permissions=${JSON.stringify(data.data.permissions)}; path=/`;
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message);
      router.replace("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// ─────────────────────────────────────────────────────────
// HOOK 3 — Logout
// ─────────────────────────────────────────────────────────
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await logoutRequest();
      return response.data;
    },

    onSuccess: (data) => {
      sessionStorage.removeItem("access_token");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

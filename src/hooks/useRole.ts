import { getAllRoles } from "@/services/api.role";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches all active roles.
 * Accessible by ADM role only.
 * Used primarily for select inputs on user create/edit forms.
 */
export function useGetAllRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data } = await getAllRoles();
      return data.data;
    },
  });
}
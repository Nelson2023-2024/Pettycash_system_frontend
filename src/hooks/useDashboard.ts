import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/services/api.dashboard";

export function useGetDashboard() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const { data } = await getDashboard();
      return data.data;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}

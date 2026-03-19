import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsRequest } from "@/services/api.dashboard";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const { data } = await getDashboardStatsRequest();
      return data.data;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}

import { QueryClient } from "@tanstack/react-query";

export const invalidateDashboard = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });

export const invalidateNotifications = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: ["notifications"] });

export const invalidateAllExpenses = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: ["allExpenses"] });

export const invalidateAuthUserExpenses = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: ["authUserExpenses"] });

export const invalidatePettyCash = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: ["pettyCashAccounts"] });

export const invalidateAllTopUps = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: ["allTopUps"] });

export const invalidateMyTopUps = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: ["myTopUps"] });

export const invalidateAllReconciliations = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: ["allReconciliations"] });

export const invalidateMyReconciliations = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: ["myReconciliations"] });

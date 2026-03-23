import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/api.notifications";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

/**
 * Fetches all notifications for the authenticated user
 * including unread count in the same response.
 */
export function useGetMyNotifications(page=1,pageSize=20) {
  return useQuery({
    queryKey: ["notifications", page, pageSize],
    queryFn: async () => {
      const { data } = await getMyNotifications(page,pageSize);
      return data.data;
    },
  });
}

/**
 * Marks a single notification as read.
 * Invalidates notifications cache so unread count updates immediately.
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notification_id: string) =>
      markNotificationAsRead(notification_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Marks all unread notifications as read.
 * Invalidates notifications cache so badge clears immediately.
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
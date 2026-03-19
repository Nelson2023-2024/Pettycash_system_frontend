import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { Notification, NotificationsResponse } from "@/types/notification";

export const getMyNotifications = () =>
  axiosInstance.get<ApiResponse<NotificationsResponse>>(
    "/audit/notifications/",
  );

export const markNotificationAsRead = (notification_id: string) =>
  axiosInstance.patch<ApiResponse<Notification>>(
    `/audit/notifications/${notification_id}/read/`,
  );

export const markAllNotificationsAsRead = () =>
  axiosInstance.patch<ApiResponse<{ updated_count: number }>>(
    "/audit/notifications/read/all/",
  );
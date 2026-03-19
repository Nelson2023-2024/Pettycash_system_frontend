export interface Notification {
  id: string;
  channel: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  message: string;
  entity_type: string;
  entity_id: string;
  sender: string;
  event_code: string;
  event_name: string;
  event_category: string;
  log_status: string;
}

export interface NotificationsResponse {
  unread_count: number;
  notifications: Notification[];
}
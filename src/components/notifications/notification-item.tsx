"use client";
import { cn } from "@/lib/utils";
import { useMarkNotificationAsRead } from "@/hooks/useNotifications";
import { Notification } from "@/types/notification";

export const eventColorMap: Record<string, string> = {
  expense_approved: "var(--status-approved-fg)",
  expense_rejected: "var(--status-rejected-fg)",
  expense_disbursed: "var(--status-disbursed-fg)",
  expense_submitted: "var(--status-pending-fg)",
  expense_completed: "var(--status-complete-fg)",
  expense_updated: "var(--status-processing-fg)",
  expense_reconciliation_submitted: "var(--status-under-review-fg)",
  topup_requested: "var(--status-pending-fg)",
  topup_approved: "var(--status-approved-fg)",
  topup_disbursed: "var(--status-disbursed-fg)",
  topup_rejected: "var(--status-rejected-fg)",
};

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const color =
    eventColorMap[notification.event_code] ?? "var(--muted-foreground)";

  return (
    <div
      onClick={() => {
        if (!notification.is_read) markAsRead(notification.id);
      }}
      className={cn(
        "flex gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/30",
        !notification.is_read && "bg-muted/40",
      )}
    >
      <div className="mt-1.5 shrink-0">
        <div
          className="size-2 rounded-full"
          style={{
            backgroundColor: notification.is_read
              ? "var(--muted-foreground)"
              : color,
            opacity: notification.is_read ? 0.3 : 1,
          }}
        />
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium" style={{ color }}>
            {notification.event_name}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">
            {new Date(notification.created_at).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p
          className={cn(
            "text-sm",
            notification.is_read && "text-muted-foreground",
          )}
        >
          {notification.message}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {notification.sender}
          </span>
          <span className="text-muted-foreground text-xs">·</span>
          <span className="text-xs text-muted-foreground">
            {notification.event_category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

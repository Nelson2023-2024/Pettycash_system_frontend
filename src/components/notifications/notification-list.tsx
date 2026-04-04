"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { Notification, NotificationsResponse } from "@/types/notification";
import NotificationItem from "./notification-item";

type Filter = "all" | "unread";

interface NotificationListProps {
  data: NotificationsResponse | undefined;
  isPending: boolean;
  filter: Filter;
  page: number;
  onPageChange: (page: number) => void;
}

const NotificationList = ({
  data,
  isPending,
  filter,
  page,
  onPageChange,
}: NotificationListProps) => {
  const notifications = data?.results ?? [];
  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <>
      {/* ── List ── */}
      <div className="rounded-md border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <Bell className="size-8 opacity-30" />
            <p className="text-sm">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
          </div>
        ) : (
          filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {filter === "all" && data && data.total_pages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            Page {data.current_page} of {data.total_pages} — {data.count} total
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={!data.has_previous}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={!data.has_next}
              onClick={() => onPageChange(page + 1)}
            >
              Next
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationList;

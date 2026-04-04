"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import {
  useGetMyNotifications,
  useMarkAllNotificationsAsRead,
} from "@/hooks/useNotifications";
import NotificationList from "./notification-list";

type Filter = "all" | "unread";

const NotificationsPage = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);

  const { data, isPending } = useGetMyNotifications(page, 20);
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsRead();

  const unreadCount = data?.unread_count ?? 0;

  return (
    <div className="w-full max-w-2xl mx-auto py-6 flex flex-col gap-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Bell className="size-5" />
          <h1 className="text-xl font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
            disabled={isMarkingAll}
            onClick={() => markAllAsRead()}
          >
            <CheckCheck className="size-3.5" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-1 border-b border-border">
        {(["all", "unread"] as Filter[]).map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilter(tab);
              setPage(1);
            }}
            className={cn(
              "rounded-none border-b-2 -mb-px capitalize",
              filter === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground",
            )}
          >
            {tab}
            {tab === "unread" && unreadCount > 0 && (
              <span className="ml-1 text-xs">({unreadCount})</span>
            )}
          </Button>
        ))}
      </div>

      {/* ── List + Pagination ── */}
      <NotificationList
        data={data}
        isPending={isPending}
        filter={filter}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default NotificationsPage;

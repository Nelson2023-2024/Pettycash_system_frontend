"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { eventColorMap } from "../helpers";
import { DashboardData } from "@/types/dashboard";

export const RecentActivitySection = ({
  data,
}: {
  data: DashboardData["recent_activity"];
}) => (
  <Card className="lg:col-span-2">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      <CardDescription className="text-xs">Your latest actions</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-0">
      {data.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No recent activity
        </p>
      )}
      {data.map((activity, i) => {
        const color =
          eventColorMap[activity["event_type__code"]] ??
          "var(--status-processing-fg)";
        return (
          <div
            key={i}
            className="flex items-start gap-3 py-2.5 border-b border-border last:border-0"
          >
            <div
              className="mt-1 size-1.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug">
                {activity["event_message"]}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(activity["created_at"]).toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span className="text-xs shrink-0 font-medium" style={{ color }}>
              {activity["event_type__name"]}
            </span>
          </div>
        );
      })}
    </CardContent>
  </Card>
);

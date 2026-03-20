"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusRow } from "../dashboard-ui";
import { fmt } from "../helpers";
import { DashboardData } from "@/types/dashboard";

export const TopupSummarySection = ({
  data,
}: {
  data: DashboardData["topup_summary"];
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">Top-Up Summary</CardTitle>
      <CardDescription className="text-xs">
        {fmt(data.total_disbursed_this_month)} this month
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col divide-y divide-border">
      <StatusRow label="Pending" value={data.pending} status="pending" />
      <StatusRow label="Approved" value={data.approved} status="approved" />
      <StatusRow label="Completed" value={data.completed} status="complete" />
      <div className="flex items-center justify-between pt-3 mt-1">
        <span className="text-xs text-muted-foreground">Total requests</span>
        <span className="text-sm font-medium">{data.total}</span>
      </div>
    </CardContent>
  </Card>
);

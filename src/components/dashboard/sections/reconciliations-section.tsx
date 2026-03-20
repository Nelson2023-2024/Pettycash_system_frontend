"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusRow } from "../dashboard-ui";
import { DashboardData } from "@/types/dashboard";

export const MyReconciliationsSection = ({
  data,
}: {
  data: DashboardData["my_reconciliations"];
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">My Reconciliations</CardTitle>
      <CardDescription className="text-xs">{data.total} total</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col divide-y divide-border">
      <StatusRow label="Pending" value={data.pending} status="pending" />
      <StatusRow
        label="Under Review"
        value={data.under_review}
        status="under review"
      />
      <StatusRow label="Completed" value={data.completed} status="complete" />
      <StatusRow label="Rejected" value={data.rejected} status="rejected" />
    </CardContent>
  </Card>
);

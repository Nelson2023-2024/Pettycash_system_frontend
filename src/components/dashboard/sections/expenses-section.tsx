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

export const AllExpensesSection = ({
  data,
}: {
  data: DashboardData["all_expenses"];
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">All Expenses</CardTitle>
      <CardDescription className="text-xs">
        {data.total} total — org wide
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col divide-y divide-border">
      <StatusRow label="Pending" value={data.pending} status="pending" />
      <StatusRow label="Approved" value={data.approved} status="approved" />
      <StatusRow label="Disbursed" value={data.disbursed} status="disbursed" />
      <StatusRow label="Completed" value={data.completed} status="complete" />
      <StatusRow label="Rejected" value={data.rejected} status="rejected" />
    </CardContent>
  </Card>
);

export const MyExpensesSection = ({
  data,
}: {
  data: DashboardData["my_expenses"];
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">My Expenses</CardTitle>
      <CardDescription className="text-xs">
        {data.total} total — {fmt(data.total_amount_this_month)} this month
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col divide-y divide-border">
      <StatusRow label="Pending" value={data.pending} status="pending" />
      <StatusRow label="Approved" value={data.approved} status="approved" />
      <StatusRow label="Disbursed" value={data.disbursed} status="disbursed" />
      <StatusRow label="Completed" value={data.completed} status="complete" />
      <StatusRow label="Rejected" value={data.rejected} status="rejected" />
    </CardContent>
  </Card>
);

export const ExpenseTypesSection = ({
  data,
}: {
  data: DashboardData["all_expenses"];
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">Expense Types</CardTitle>
      <CardDescription className="text-xs">
        Disbursement vs Reimbursement
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Disbursement</span>
        <span className="text-sm font-medium tabular-nums">
          {data.type_breakdown.disbursement}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full bg-primary"
          style={{
            width: `${(data.type_breakdown.disbursement / data.total) * 100}%`,
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Reimbursement</span>
        <span className="text-sm font-medium tabular-nums">
          {data.type_breakdown.reimbursement}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full"
          style={{
            width: `${(data.type_breakdown.reimbursement / data.total) * 100}%`,
            backgroundColor: "var(--status-disbursed-fg)",
          }}
        />
      </div>
    </CardContent>
  </Card>
);

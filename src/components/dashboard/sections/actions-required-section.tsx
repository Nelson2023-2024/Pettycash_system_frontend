"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActionAlert } from "../dashboard-ui";
import { usePermissions } from "@/hooks/usePermissions";
import { DashboardData } from "@/types/dashboard";

export const ActionsRequiredSection = ({
  data,
}: {
  data: DashboardData["actions_required"];
}) => {
  const { can } = usePermissions();
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Actions Required</CardTitle>
        <CardDescription className="text-xs">
          Items needing your attention
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {can("can_decide_expense") && (
          <ActionAlert
            label="Expenses pending review"
            count={data.expenses_pending_review}
            color="var(--status-pending-fg)"
          />
        )}
        {can("can_review_reconciliation") && (
          <ActionAlert
            label="Reconciliations to review"
            count={data.reconciliations_pending_review}
            color="var(--status-under-review-fg)"
          />
        )}
        {can("can_decide_topup") && (
          <ActionAlert
            label="Top-ups pending approval"
            count={data.topups_pending_approval}
            color="var(--status-processing-fg)"
          />
        )}
        {can("can_disburse_topup") && (
          <ActionAlert
            label="Top-ups pending disburse"
            count={data.topups_approved_pending_disburse}
            color="var(--status-approved-fg)"
          />
        )}
      </CardContent>
    </Card>
  );
};

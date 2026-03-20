"use client";
import {
  AlertCircle,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useGetDashboard } from "@/hooks/useDashboard";
import { usePermissions } from "@/hooks/usePermissions";
import { Spinner } from "@/components/ui/spinner";
import {
  StatCard,
  DisbursementAreaChart,
  ExpenseVolumeBarChart,
} from "./dashboard-ui";
import { ActionsRequiredSection } from "./sections/actions-required-section";
import {
  AllExpensesSection,
  MyExpensesSection,
  ExpenseTypesSection,
} from "./sections/expenses-section";
import { MyReconciliationsSection } from "./sections/reconciliations-section";
import { TopupSummarySection } from "./sections/topup-section";
import { RecentActivitySection } from "./sections/activity-section";
import { fmt } from "./helpers";
import { cn } from "@/lib/utils"; // ← add this import

const Dashboard = () => {
  const { data, isPending, isError } = useGetDashboard();
  const { can } = usePermissions();

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-10" />
      </div>
    );
  if (isError || !data)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-destructive">Failed to load dashboard.</p>
      </div>
    );

  const isLow = data.petty_cash?.is_low ?? false;

  const trend = data.charts.monthly_expense_trend.map((d) => ({
    ...d,
    total_amount: Number(d.total_amount),
  }));

  const showPettyCash = can("can_view_petty_cash_account");
  const showAllExpenses = can("can_view_all_expenses");
  const showAllTopups = can("can_view_all_topups");
  const showActionsRequired =
    can("can_decide_expense") ||
    can("can_decide_topup") ||
    can("can_review_reconciliation");
  const showCharts = can("can_view_all_petty_cash");
  const showOwnExpenses = can("can_view_own_expenses");
  const showOwnReconciliations = can("can_view_own_reconciliations");

  const isEmployee = !showAllExpenses && !showActionsRequired && !showCharts;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back — here&apos;s what&apos;s happening today
        </p>
      </div>

      {showPettyCash && isLow && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <AlertCircle className="size-4 text-destructive shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">
              Petty Cash Balance Low
            </p>
            <p className="text-xs text-muted-foreground">
              Current balance {fmt(data.petty_cash!.current_balance)} is below
              minimum threshold of {fmt(data.petty_cash!.minimum_threshold)}
            </p>
          </div>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {showPettyCash && (
          <StatCard
            title="Petty Cash Balance"
            value={data.petty_cash ? fmt(data.petty_cash.current_balance) : "—"}
            description={
              data.petty_cash
                ? `Min. ${fmt(data.petty_cash.minimum_threshold)}`
                : undefined
            }
            icon={Wallet}
            trend={isLow ? "down" : "up"}
            className={isLow ? "border-destructive/30" : ""}
          />
        )}
        {showAllExpenses && (
          <StatCard
            title="Disbursed This Month"
            value={fmt(data.all_expenses.total_disbursed_this_month)}
            description="All expenses"
            icon={ArrowUpRight}
          />
        )}
        {showAllExpenses && (
          <StatCard
            title="Approval Rate"
            value={`${data.all_expenses.approval_rate_this_month}%`}
            description="This month"
            icon={CheckCircle2}
            trend="up"
          />
        )}
        {showActionsRequired && (
          <StatCard
            title="Pending Actions"
            value={
              data.actions_required.expenses_pending_review +
              data.actions_required.reconciliations_pending_review +
              data.actions_required.topups_pending_approval
            }
            description="Need your attention"
            icon={Clock}
            trend={
              data.actions_required.expenses_pending_review > 0
                ? "down"
                : "neutral"
            }
          />
        )}
      </div>

      {/* ── Row 1 ── */}
      {(showActionsRequired || showAllExpenses || showOwnExpenses) && (
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-3 gap-4",
            isEmployee ? "lg:grid-cols-2" : "lg:grid-cols-3",
          )}
        >
          {showActionsRequired && (
            <ActionsRequiredSection data={data.actions_required} />
          )}
          {showAllExpenses && <AllExpensesSection data={data.all_expenses} />}
          {showOwnExpenses && <MyExpensesSection data={data.my_expenses} />}
          {isEmployee && showOwnReconciliations && (
            <MyReconciliationsSection data={data.my_reconciliations} />
          )}
        </div>
      )}

      {/* ── Row 2: Charts ── */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <DisbursementAreaChart
            data={trend}
            totalAllTime={data.all_expenses.total_disbursed_all_time}
          />
          <ExpenseVolumeBarChart data={trend} />
        </div>
      )}

      {/* ── Row 3: Activity + right column ── */}
      <div
        className={cn(
          "grid grid-cols-1  gap-4",
          !isEmployee && "lg:grid-cols-3",
        )}
      >
        <div className={cn(!isEmployee && "lg:col-span-2")}>
          <RecentActivitySection data={data.recent_activity} />
        </div>
        {!isEmployee && ( 
          <div className="flex flex-col gap-4">
            {showOwnReconciliations && (
              <MyReconciliationsSection data={data.my_reconciliations} />
            )}
            {showAllExpenses && (
              <ExpenseTypesSection data={data.all_expenses} />
            )}
            {showAllTopups && <TopupSummarySection data={data.topup_summary} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

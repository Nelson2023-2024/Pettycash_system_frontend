"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Spinner } from "@/components/ui/spinner";
import { useDisburseLoan } from "@/hooks/useLoan";
import { Loan } from "@/types/loan";

interface LoanDisburseFormProps {
  loan: Loan;
  onSuccess?: () => void;
}

export function LoanDisburseForm({ loan, onSuccess }: LoanDisburseFormProps) {
  const { mutate: disburseLoan, isPending } = useDisburseLoan();

  function handleDisburse() {
    disburseLoan(loan.id, {
      onSuccess: () => onSuccess?.(),
    });
  }

  const fmt = (val: string | null) =>
    val
      ? new Intl.NumberFormat("en-KE", {
          style: "currency",
          currency: "KES",
        }).format(parseFloat(val))
      : "—";

  const fmtDate = (val: string | null) =>
    val
      ? new Intl.DateTimeFormat("en-KE", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(val))
      : "—";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disburse Loan</CardTitle>
        <CardDescription>
          Confirm you want to disburse this approved loan
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">

        {/* ── Employee + status ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{loan.employee.name}</CardTitle>
              <StatusBadge status={loan.status} />
            </div>
            <CardDescription>
              <p className="text-xs">{loan.employee.email}</p>
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">

            {/* Amount */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount requested</span>
              <span className="font-semibold">{fmt(loan.amount)}</span>
            </div>

            {/* Transaction cost */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">M-Pesa transaction cost</span>
              <span className="font-semibold">{fmt(loan.transaction_cost)}</span>
            </div>

            {/* Total deduction */}
            <div className="flex items-center justify-between text-sm border-t pt-3">
              <span className="text-muted-foreground">Total deduction</span>
              <span className="font-semibold">{fmt(loan.total_deduction)}</span>
            </div>

            {/* Previous balance */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Petty cash before</span>
              <span className="font-semibold">{fmt(loan.previous_balance)}</span>
            </div>

            {/* New balance */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Petty cash after</span>
              <span className="font-semibold">{fmt(loan.new_balance)}</span>
            </div>

            {/* Approved by */}
            <div className="flex items-center justify-between text-sm border-t pt-3">
              <span className="text-muted-foreground">Approved by</span>
              <span className="font-semibold">{loan.decision_by?.name ?? "—"}</span>
            </div>

            {/* Disbursed at */}
            {loan.disbursed_at && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Disbursed at</span>
                <span className="font-semibold">{fmtDate(loan.disbursed_at)}</span>
              </div>
            )}

            {/* Due date */}
            {loan.due_date && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Due date</span>
                <span className="font-semibold">{fmtDate(loan.due_date)}</span>
              </div>
            )}

            {/* Reason */}
            <div className="flex flex-col gap-1 border-t pt-3">
              <span className="text-xs text-muted-foreground">Reason</span>
              <p className="text-sm">{loan.reason}</p>
            </div>

            {/* Decision reason (if rejected and re-reviewing) */}
            {loan.decision_reason && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Decision note</span>
                <p className="text-sm">{loan.decision_reason}</p>
              </div>
            )}

          </CardContent>
        </Card>

        {/* ── Warning ── */}
        <p className="text-sm text-muted-foreground text-center">
          This will disburse{" "}
          <span className="font-semibold text-foreground">{fmt(loan.amount)}</span>{" "}
          to{" "}
          <span className="font-semibold text-foreground">{loan.employee.name}</span>{" "}
          via M-Pesa. This action cannot be undone.
        </p>

        {/* ── Confirm ── */}
        <Button className="w-full" onClick={handleDisburse} disabled={isPending}>
          {isPending ? <><Spinner /> Disbursing...</> : "Confirm Disbursement"}
        </Button>

      </CardContent>
    </Card>
  );
}
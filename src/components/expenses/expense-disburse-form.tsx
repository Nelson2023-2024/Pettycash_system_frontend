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
import { useDisburseExpense } from "@/hooks/useExpense";
import { Expense } from "@/types/expense";

interface ExpenseDisburseFormProps {
  expense: Expense;
  onSuccess?: () => void;
}

export function ExpenseDisburseForm({
  expense,
  onSuccess,
}: ExpenseDisburseFormProps) {
  const { mutate: disburseExpense, isPending } = useDisburseExpense();

  function handleDisburse() {
    disburseExpense(expense.id, {
      onSuccess: () => onSuccess?.(),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disburse Expense</CardTitle>
        <CardDescription>
          Confirm you want to disburse this approved expense
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* ── Expense summary ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{expense.title}</CardTitle>
              <StatusBadge status={expense.status} />
            </div>
            <CardDescription className="capitalize">
              {expense.expense_type} · M-Pesa: {expense.mpesa_phone}
              <p className="text-xs">
                Submitted by:{" "}
                <span className="font-bold">{expense.employee_email}</span>
              </p>
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount to disburse</span>
              <span className="font-semibold">
                {new Intl.NumberFormat("en-KE", {
                  style: "currency",
                  currency: "KES",
                }).format(parseFloat(expense.amount))}
              </span>
            </div>
            <p className="text-sm text-muted-foreground border-t pt-4">
              {expense.description}
            </p>
          </CardContent>
        </Card>

        {/* ── Warning note ── */}
        <p className="text-sm text-muted-foreground text-center">
          This will send{" "}
          <span className="font-semibold text-foreground">
            {new Intl.NumberFormat("en-KE", {
              style: "currency",
              currency: "KES",
            }).format(parseFloat(expense.amount))}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-foreground">
            {expense.mpesa_phone}
          </span>{" "}
          via M-Pesa. This action cannot be undone.
        </p>

        {/* ── Confirm button ── */}
        <Button
          className="w-full"
          onClick={handleDisburse}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner /> Disbursing...
            </>
          ) : (
            "Confirm Disbursement"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

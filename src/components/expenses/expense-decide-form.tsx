"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Spinner } from "@/components/ui/spinner";
import { useDecideExpense } from "@/hooks/useExpense";
import { Expense } from "@/types/expense";
import { decideExpenseSchema } from "@/lib/schemas/expense";
import z from "zod";
import Link from "next/link";

interface ExpenseDecideFormProps {
  expense: Expense;
  onSuccess?: () => void;
}

export function ExpenseDecideForm({
  expense,
  onSuccess,
}: ExpenseDecideFormProps) {
  const { mutate: decideExpense, isPending } = useDecideExpense();

  const [decision, setDecision] = useState("approved");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isRejecting = decision === "rejected";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = decideExpenseSchema.safeParse({ decision, reason });

    if (!result.success) {
      const fieldErrors = z.treeifyError(result.error);
      setErrors({
        decision: fieldErrors.properties?.decision?.errors?.[0] ?? "",
        reason: fieldErrors.properties?.reason?.errors?.[0] ?? "",
      });
      return;
    }

    decideExpense(
      { id: expense.id, payload: result.data },
      { onSuccess: () => onSuccess?.() },
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader className="mb-1">
          <CardTitle>Review Expense</CardTitle>
          <CardDescription>
            Approve or reject this expense request
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
              <CardDescription className="capitalize flex flex-col gap-3">
                {expense.expense_type} · M-Pesa: {expense.mpesa_phone}
                <p className="text-xs">
                  Submitted by: <span className="font-bold">{expense.employee.email}</span>
                </p>
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
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

              {/* Receipt — reimbursement only */}
              {expense.expense_type === "reimbursement" && expense.receipt && (
                <div className="border-t pt-4 flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground tracking-widest">
                    RECEIPT
                  </p>
                  <Link href={expense.receipt} target="_blank">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={expense.receipt}
                      alt="Receipt"
                      className="max-h-96 w-full rounded-md border object-contain bg-card"
                    />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Decision ── */}
          <Field>
            <FieldLabel>Decision</FieldLabel>
            <RadioGroup
              value={decision}
              onValueChange={(val) => {
                setDecision(val);
                setReason("");
                setErrors({});
              }}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="approved" id="approved" />
                <FieldLabel
                  htmlFor="approved"
                  className="cursor-pointer font-normal"
                >
                  Approve
                </FieldLabel>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="rejected" id="rejected" />
                <FieldLabel
                  htmlFor="rejected"
                  className="cursor-pointer font-normal"
                >
                  Reject
                </FieldLabel>
              </div>
            </RadioGroup>
            {errors.decision && (
              <p className="text-sm text-destructive">{errors.decision}</p>
            )}
          </Field>

          {/* ── Reason ── */}
          <Field>
            <FieldLabel htmlFor="reason">
              Reason {isRejecting ? "(required)" : "(optional)"}
            </FieldLabel>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrors((prev) => ({ ...prev, reason: "" }));
              }}
              placeholder={
                isRejecting
                  ? "Explain why this expense is being rejected..."
                  : "Add an optional note..."
              }
              rows={3}
              className="resize-none"
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason}</p>
            )}
          </Field>

          {/* ── Submit ── */}
          <Button
            type="submit"
            variant={isRejecting ? "destructive" : "default"}
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner />
                {isRejecting ? "Rejecting..." : "Approving..."}
              </>
            ) : isRejecting ? (
              "Reject Expense"
            ) : (
              "Approve Expense"
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}

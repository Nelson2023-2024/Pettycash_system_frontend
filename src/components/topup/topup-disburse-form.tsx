"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useDisburseTopUp } from "@/hooks/useTopup";
import { TopUp } from "@/types/topup";

interface TopupDisburseFormProps {
  topup: TopUp;
  onSuccess?: () => void;
}

export default function TopupDisburseForm({
  topup,
  onSuccess,
}: TopupDisburseFormProps) {
  const { mutate: disburseTopup, isPending } = useDisburseTopUp();

  // disable button if already completed
  const isCompleted = topup.status_code === "completed";

  function handleDisburse() {
    disburseTopup(topup.id, {
      onSuccess: () => onSuccess?.(),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disburse Top-Up</CardTitle>
        <CardDescription>
          Confirm you want to disburse this approved top-up request
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* ── Topup Summary ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {topup.pettycash_account?.name ?? "—"}
              </CardTitle>
              <StatusBadge status={topup.status ?? "approved"} />
            </div>
            <CardDescription>
              Requested by:{" "}
              <span className="font-bold">
                {topup.requested_by?.name ?? "—"}
              </span>
              <span className="text-xs block">{topup.requested_by?.email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount to disburse</span>
              <span className="font-semibold tabular-nums">
                {new Intl.NumberFormat("en-KE", {
                  style: "currency",
                  currency: "KES",
                  minimumFractionDigits: 0,
                }).format(Number(topup.amount))}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Balance</span>
              <span className="font-semibold tabular-nums">
                {new Intl.NumberFormat("en-KE", {
                  style: "currency",
                  currency: "KES",
                  minimumFractionDigits: 0,
                }).format(
                  Number(topup.pettycash_account?.current_balance ?? 0),
                )}
              </span>
            </div>

            {/* ── Balance after top-up ── */}
            <div className="flex items-center justify-between text-sm border-t pt-3">
              <span className="text-muted-foreground">
                Balance After Top-Up
              </span>
              <span
                className="font-semibold tabular-nums"
                style={{ color: "var(--status-active-fg)" }}
              >
                {new Intl.NumberFormat("en-KE", {
                  style: "currency",
                  currency: "KES",
                  minimumFractionDigits: 0,
                }).format(
                  Number(topup.pettycash_account?.current_balance ?? 0) +
                    Number(topup.amount),
                )}
              </span>
            </div>

            <p className="text-sm text-muted-foreground border-t pt-4">
              {topup.request_reason}
            </p>
          </CardContent>
        </Card>

        {/* ── Warning note — hidden when already completed ── */}
        {!isCompleted && (
          <p className="text-sm text-muted-foreground text-center">
            This will credit{" "}
            <span className="font-semibold text-foreground">
              {new Intl.NumberFormat("en-KE", {
                style: "currency",
                currency: "KES",
                minimumFractionDigits: 0,
              }).format(Number(topup.amount))}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-foreground">
              {topup.pettycash_account?.name}
            </span>
            . This action cannot be undone.
          </p>
        )}

        {/* ── Already completed message ── */}
        {isCompleted && (
          <p className="text-sm text-muted-foreground text-center">
            This top-up has already been disbursed.
          </p>
        )}

        {/* ── Confirm button ── */}
        <Button
          className="w-full"
          onClick={handleDisburse}
          disabled={isPending || isCompleted}
        >
          {isPending ? (
            <>
              <Spinner /> Disbursing...
            </>
          ) : isCompleted ? (
            "Already Disbursed"
          ) : (
            "Confirm Disbursement"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { decideTopUpSchema, DecideTopUpInput } from "@/lib/schemas/topup";
import { Textarea } from "../ui/textarea";
import { useDecideTopUp } from "@/hooks/useTopup";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { TopUp } from "@/types/topup";
import { StatusBadge } from "../ui/status-badge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { DecisionRadio } from "../ui/decision-radio";

interface TopupDecideFormProps {
  topup: TopUp;
  onSuccess?: () => void;
}

export default function TopupDecideForm({
  topup,
  onSuccess,
}: TopupDecideFormProps) {
  const { mutate: decideTopUp, isPending } = useDecideTopUp();

  const methods = useForm<DecideTopUpInput>({
    resolver: zodResolver(decideTopUpSchema),
    defaultValues: {
      decision: "approved",
      decision_reason: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const decision = watch("decision");
  const isRejecting = decision === "rejected";

  function onSubmit(data: DecideTopUpInput) {
    decideTopUp(
      { topup_id: topup.id, payload: data },
      { onSuccess: () => onSuccess?.() },
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* ── Topup Summary ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {topup.pettycash_account?.name ?? "—"}
              </CardTitle>
              <CardAction>
                <StatusBadge status={topup.status ?? "pending"} />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat("en-KE", {
                    style: "currency",
                    currency: "KES",
                    minimumFractionDigits: 0,
                  }).format(Number(topup.amount))}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Requested By</span>
                <div className="flex flex-col items-end">
                  <span className="font-medium">
                    {topup.requested_by?.name ?? "—"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {topup.requested_by?.email ?? ""}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground border-t pt-3">
                {topup.request_reason}
              </p>
            </CardContent>
          </Card>
          {/* ── Decision ── */}
          <DecisionRadio<DecideTopUpInput> />

          {/* ── Reason ── */}
          <Field>
            <FieldLabel>
              Reason {isRejecting ? "(required)" : "(optional)"}
            </FieldLabel>
            <Textarea
              rows={3}
              placeholder={
                isRejecting
                  ? "Explain why this top-up is being rejected..."
                  : "Add an optional note..."
              }
              className="resize-none"
              {...register("decision_reason")}
            />
            <FieldError>{errors.decision_reason?.message}</FieldError>
          </Field>

          {/* ── Submit ── */}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            variant={isRejecting ? "destructive" : "default"}
          >
            {isPending ? (
              <>
                <Spinner className="size-4" />
                {isRejecting ? "Rejecting..." : "Approving..."}
              </>
            ) : isRejecting ? (
              "Reject Top-Up"
            ) : (
              "Approve Top-Up"
            )}
          </Button>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

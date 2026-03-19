"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "../ui/textarea";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ReviewReconciliationInput,
  reviewReconciliationSchema,
} from "@/lib/schemas/reconciliation";
import { Spinner } from "../ui/spinner";
import { useReviewReconciliation } from "@/hooks/useReconciliation";
import { Reconciliation } from "@/types/reconciliation";
import { DecisionRadio } from "./decision-review-radio";

interface ReconciliationReviewFormProps {
  reconciliation: Reconciliation;
  onSuccess?: () => void;
}

export function ReconciliationReviewForm({
  reconciliation,
  onSuccess,
}: ReconciliationReviewFormProps) {
  const { mutate: reviewReconciliation, isPending } = useReviewReconciliation();

  const methods = useForm<ReviewReconciliationInput>({
    defaultValues: {
      decision: "completed",
      comments: "",
    },
    resolver: zodResolver(
      reviewReconciliationSchema,
    ) as Resolver<ReviewReconciliationInput>,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const decision = watch("decision");

  function onSubmit(data: ReviewReconciliationInput) {
    reviewReconciliation(
      { reconciliation_id: reconciliation.id, payload: data },
      { onSuccess: () => onSuccess?.() },
    );
  }

  const fmt = (val: string) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(Number(val));

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Reconciliation summary — read only context */}
          <div className="rounded-md bg-muted/60 px-3 py-3 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expense</span>
              <span className="font-medium">
                {reconciliation.expense_request_title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Disbursed</span>
              <span className="font-medium tabular-nums">
                {fmt(reconciliation.disbursed_amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reconciled</span>
              <span className="font-medium tabular-nums">
                {reconciliation.reconciled_amount
                  ? fmt(reconciliation.reconciled_amount)
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Surplus Returned</span>
              <span className="font-medium tabular-nums">
                {reconciliation.surplus_returned
                  ? fmt(reconciliation.surplus_returned)
                  : "—"}
              </span>
            </div>
            {reconciliation.receipt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receipt</span>
                <a
                  href={reconciliation.receipt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  View receipt
                </a>
              </div>
            )}

            {reconciliation.comments && (
              <>
                <div className="border-t border-border my-1" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground">Employee Notes</span>
                  <span className="font-medium leading-relaxed">
                    {reconciliation.comments}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Decision radio — reads from FormProvider */}
          <DecisionRadio />

          {/* Comments — required on rejection */}
          <Field>
            <FieldLabel>
              Comments{" "}
              {decision === "rejected" && (
                <span className="text-destructive">*</span>
              )}
              {decision === "completed" && (
                <span className="text-muted-foreground">(optional)</span>
              )}
            </FieldLabel>
            <Textarea
              placeholder={
                decision === "rejected"
                  ? "Explain what the employee needs to fix..."
                  : "Any notes for the employee..."
              }
              rows={3}
              {...register("comments")}
            />
            <FieldError>{errors.comments?.message}</FieldError>
          </Field>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Submitting...
              </>
            ) : decision === "completed" ? (
              "Approve Reconciliation"
            ) : (
              "Reject & Send Back"
            )}
          </Button>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

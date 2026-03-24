"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import FormInput from "../ui/FormInput";
import { Controller, Resolver, useForm } from "react-hook-form";
import {
  SubmitReconciliationInput,
  submitReconciliationSchema,
} from "@/lib/schemas/reconciliation";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitReconciliation } from "@/hooks/useReconciliation";
import { Spinner } from "../ui/spinner";
import { Reconciliation } from "@/types/reconciliation";
import { FileUpload } from "../ui/file-upload";

interface ReconciliationSubmitFormProps {
  reconciliation: Reconciliation;
  onSuccess?: () => void;
}

const ReconciliationSubmitForm = ({
  reconciliation,
  onSuccess,
}: ReconciliationSubmitFormProps) => {
  const { mutate: submitReconciliation, isPending } = useSubmitReconciliation();

  const statusCode = reconciliation.status?.toLowerCase();
  const isEditable = statusCode === "pending" || statusCode === "rejected";

  // comments on the reconciliation object are FO comments (feedback)
  // we don't prefill the employee's comment field with FO feedback
  // employee comments are separate from FO comments
  const foComments = reconciliation.comments;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SubmitReconciliationInput>({
    defaultValues: {
      comments: "", // always empty — employee writes their own fresh comment
      surplus_returned: reconciliation.surplus_returned
        ? Number(reconciliation.surplus_returned)
        : 0,
      reconciled_amount: reconciliation.reconciled_amount
        ? Number(reconciliation.reconciled_amount)
        : 0,
    },
    resolver: zodResolver(
      submitReconciliationSchema,
    ) as Resolver<SubmitReconciliationInput>,
  });

  function onSubmit(data: SubmitReconciliationInput) {
    submitReconciliation(
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* ── FO Feedback — shown on rejection ── */}
        {statusCode === "rejected" && foComments && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 flex flex-col gap-1">
            <p className="text-xs font-medium text-destructive">
              Rejected — You need to resubmit
            </p>
            <p className="text-xs text-muted-foreground">{foComments}</p>
          </div>
        )}

        {/* ── FO Feedback — shown on completion ── */}
        {statusCode === "completed" && foComments && (
          <div className="rounded-md border border-border bg-muted/60 px-3 py-2.5 flex flex-col gap-1">
            <p className="text-xs font-medium text-foreground">
              Finance Officer Notes
            </p>
            <p className="text-xs text-muted-foreground">{foComments}</p>
          </div>
        )}

        {/* ── Under review notice ── */}
        {statusCode === "under review" && (
          <div className="rounded-md bg-muted/60 px-3 py-2.5">
            <p className="text-xs text-muted-foreground">
              This reconciliation is currently under review by the finance
              officer.
            </p>
          </div>
        )}

        {/* ── Disbursed amount ── */}
        <div className="rounded-md bg-muted/60 px-3 py-2.5 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Disbursed Amount</p>
          <p className="text-sm font-semibold tabular-nums">
            {fmt(reconciliation.disbursed_amount)}
          </p>
        </div>

        {/* ── Receipt ── */}
        <Field>
          <FieldLabel>Receipt</FieldLabel>
          {reconciliation.receipt && !isEditable ? (
            <a
              href={reconciliation.receipt}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline"
            >
              View submitted receipt
            </a>
          ) : (
            <Controller
              name="receipt"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FileUpload
                  onChange={onChange}
                  value={value as File | undefined}
                  label="Click to upload receipt"
                />
              )}
            />
          )}
          <FieldError>{errors.receipt?.message as string}</FieldError>
        </Field>

        {/* ── Amounts ── */}
        <FieldGroup className="grid grid-cols-2">
          <FormInput
            label="Reconciled Amount"
            type="number"
            placeholder="Amount actually spent"
            disabled={!isEditable}
            {...register("reconciled_amount")}
            error={errors.reconciled_amount?.message}
          />
          <FormInput
            label="Surplus Returned"
            type="number"
            placeholder="Leftover cash returned"
            disabled={!isEditable}
            {...register("surplus_returned")}
            error={errors.surplus_returned?.message}
          />
        </FieldGroup>

        {/* ── Employee comments — their own notes, NOT FO feedback ── */}
        <Field>
          <FieldLabel>
            Your Comments{" "}
            <span className="text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Textarea
            placeholder="Any notes about this reconciliation"
            rows={3}
            disabled={!isEditable}
            {...register("comments")}
          />
          <FieldError>{errors.comments?.message}</FieldError>
        </Field>

        {/* ── Submit ── */}
        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !isEditable}
          >
            {isPending ? (
              <>
                <Spinner /> Submitting...
              </>
            ) : statusCode === "rejected" ? (
              "Resubmit Reconciliation"
            ) : (
              "Submit Reconciliation"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default ReconciliationSubmitForm;

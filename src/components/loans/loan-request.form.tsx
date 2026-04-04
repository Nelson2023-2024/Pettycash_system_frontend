"use client";

import {
  CreateLoanInput,
  createLoanSchema,
  UpdateLoanInput,
  updateLoanSchema,
} from "@/lib/schemas/loan";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import FormInput from "../ui/FormInput";
import { Textarea } from "../ui/textarea";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLoan, useUpdateLoan } from "@/hooks/useLoan";
import { Spinner } from "../ui/spinner";
import { Loan } from "@/types/loan";

interface LoanRequestFormProps {
  loan?: Loan;
  onSuccess?: () => void;
}

const LoanRequestForm = ({ loan, onSuccess }: LoanRequestFormProps) => {
  const isEdit = !!loan;

  const { mutate: createLoan, isPending: isCreating } = useCreateLoan();
  const { mutate: updateLoan, isPending: isUpdating } = useUpdateLoan();
  const isPending = isCreating || isUpdating;

  const statusCode = loan?.status_code?.toLowerCase();
  const isRejected = statusCode === "rejected";
  const isPendingStatus = statusCode === "pending";
  const isEditable = !isEdit || isPendingStatus;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateLoanInput | UpdateLoanInput>({
    resolver: zodResolver(
      isEdit ? updateLoanSchema : createLoanSchema,
    ) as Resolver<CreateLoanInput | UpdateLoanInput>,
    defaultValues: isEdit
      ? {
          amount: parseFloat(loan.amount),
          reason: loan.reason,
          phone_number: loan.phone_number ?? "",
        }
      : { amount: undefined, reason: "", phone_number: "" },
  });

  function onSubmit(data: CreateLoanInput | UpdateLoanInput) {
    if (isEdit) {
      updateLoan(
        { loan_id: loan.id, payload: data as UpdateLoanInput },
        { onSuccess: () => onSuccess?.() },
      );
    } else {
      createLoan(data as CreateLoanInput, {
        onSuccess: () => onSuccess?.(),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* ── Rejection notice ── */}
        {isRejected && loan?.decision_reason && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 flex flex-col gap-1 text-center">
            <p className="text-xs font-medium text-destructive">
              Rejected — Please review the reason below
            </p>
            <p className="text-xs text-muted-foreground">
              {loan?.decision_reason}
            </p>
          </div>
        )}

        <FieldGroup className="grid grid-cols-2">
          {/* ── Amount ── */}
          <FormInput
            label="Amount"
            type="number"
            placeholder="Enter Amount"
            disabled={!isEditable}
            {...register("amount")}
            error={errors.amount?.message}
          />

          <FormInput
            label="Phone Number"
            type="number"
            placeholder="07XXXXXXXX"
            maxLength={10}
            disabled={!isEditable}
            {...register("phone_number")}
            error={errors.phone_number?.message}
          />
        </FieldGroup>
        {/* ── Reason ── */}
        <Field>
          <FieldLabel>Reason</FieldLabel>
          <Textarea
            id="reason"
            rows={3}
            placeholder="Why are you requesting this loan?"
            disabled={!isEditable}
            {...register("reason")}
          />
          <FieldError>{errors.reason?.message}</FieldError>
        </Field>

        {/* ── Submit ── */}
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !isEditable}
        >
          {isPending ? (
            <>
              <Spinner />
              {isEdit ? "Saving changes..." : "Submitting..."}
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Request Loan"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default LoanRequestForm;

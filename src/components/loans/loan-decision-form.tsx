"use client";
import { DecideLoanInput, decideLoanSchema } from "@/lib/schemas/loan";
import { Button } from "../ui/button";
import { DecisionRadio } from "../ui/decision-radio";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDecideLoan } from "@/hooks/useLoan";
import { Spinner } from "../ui/spinner";
import { Loan } from "@/types/loan";

const LoanDecisionForm = ({
  loan,
  onSuccess,
}: {
  loan: Loan;
  onSuccess?: () => void;
}) => {
  const { mutate: decideLoan, isPending } = useDecideLoan();
  const methods = useForm<DecideLoanInput>({
    resolver: zodResolver(decideLoanSchema) as Resolver<DecideLoanInput>,
    defaultValues: { decision: "approved" },
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = methods;

  function onSubmit(data: DecideLoanInput) {
    decideLoan({ loan_id: loan.id, payload: data }, { onSuccess });
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

          {/* ── Loan summary — so the FO knows what they're deciding on ── */}
          <div className="rounded-md bg-muted/60 px-3 py-2.5 flex flex-col gap-2">
            <p className="text-xs font-medium text-foreground">Loan Summary</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Requested by</p>
              <p className="text-xs font-medium">{loan.employee.name}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-sm font-semibold tabular-nums">
                {fmt(loan.amount)}
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-xs text-muted-foreground">Reason</p>
              <p className="text-xs">{loan.reason}</p>
            </div>
          </div>

          <DecisionRadio<DecideLoanInput> />

          <Field>
            <FieldLabel>
              Reason{" "}
              <span className="text-muted-foreground text-xs">
                (required when rejecting)
              </span>
            </FieldLabel>
            <Textarea
              rows={3}
              placeholder="Enter a reason"
              {...register("decision_reason")}
            />
            {errors.decision_reason && (
              <FieldError>{errors.decision_reason.message}</FieldError>
            )}
          </Field>

          <Field>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner /> Submitting...
                </>
              ) : (
                "Submit Decision"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </FormProvider>
  );
};

export default LoanDecisionForm;
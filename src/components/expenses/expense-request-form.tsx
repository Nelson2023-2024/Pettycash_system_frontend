"use client";

import { Controller, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCreateExpense } from "@/hooks/useExpense";
import { CreateExpenseInput, createExpenseSchema } from "@/lib/schemas/expense";
import { Spinner } from "../ui/spinner";
import { FileUpload } from "../ui/file-upload";
import FormInput from "../ui/FormInput";

const EXPENSE_TYPES = [
  {
    value: "disbursement",
    title: "Disbursement",
    description:
      "Request petty cash in advance. Receipts will be submitted later for reconciliation.",
  },
  {
    value: "reimbursement",
    title: "Reimbursement",
    description:
      "Get reimbursed for money already spent. Receipt must be submitted upfront.",
  },
];

interface ExpenseRequestFormProps {
  onSuccess?: () => void;
}

export function ExpenseRequestForm({ onSuccess }: ExpenseRequestFormProps) {
  const { mutate: createExpense, isPending } = useCreateExpense();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseSchema) as Resolver<CreateExpenseInput>,
    defaultValues: {
      expense_type: "disbursement",
      title: "",
      amount: 0,
      mpesa_phone: "",
      description: "",
    },
  });

  // ── watch expense_type to show/hide receipt field ──
  const expenseType = watch("expense_type");

  function onSubmit(data: CreateExpenseInput) {
    createExpense(data, { onSuccess: () => onSuccess?.() });
  }

  return (
    <div className="flex-1 flex justify-center items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* ── Expense Type ── */}
            <Field>
              <FieldLabel>Expense Type</FieldLabel>
              <Controller
                name="expense_type"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-2 gap-4"
                  >
                    {EXPENSE_TYPES.map((type) => (
                      <FieldLabel key={type.value} htmlFor={type.value}>
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>{type.title}</FieldTitle>
                            <FieldDescription>
                              {type.description}
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem value={type.value} id={type.value} />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                )}
              />
              <FieldError>{errors.expense_type?.message}</FieldError>
            </Field>

            {/* ── Title ── */}
            <FormInput
              label="Title"
              placeholder="e.g. Office Supplies"
              {...register("title")}
              error={errors.title?.message}
            />

            {/* ── Amount + Phone ── */}
            <FieldGroup className="grid grid-cols-2">
              <FormInput
                label="Amount"
                type="number"
                placeholder="Enter amount"
                {...register("amount", { valueAsNumber: true })}
                error={errors.amount?.message}
              />
              <FormInput
                label="Phone"
                placeholder="0712345678"
                {...register("mpesa_phone")}
                error={errors.mpesa_phone?.message}
              />
            </FieldGroup>

            {/* ── Receipt — reimbursement only ── */}
            {expenseType === "reimbursement" && (
              <Field>
                <FieldLabel>Receipt</FieldLabel>
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
                <FieldError>{errors.receipt?.message}</FieldError>
              </Field>
            )}

            {/* ── Description ── */}
            <Field>
              <FieldLabel htmlFor="description">Description / Notes</FieldLabel>
              <Textarea
                id="description"
                placeholder="Add a brief note about this expense"
                rows={3}
                {...register("description")}
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner /> Submitting...
                </>
              ) : (
                "Create Expense"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

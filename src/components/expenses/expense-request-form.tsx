"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useCreateExpense } from "@/hooks/useExpense";
import { createExpenseSchema } from "@/lib/schemas/expense";
import z from "zod";
import { Spinner } from "../ui/spinner";

/* Expense type options */
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

export function ExpenseRequestForm() {
  const { mutate: createExpense, isPending } = useCreateExpense();

  const [formData, setFormData] = useState({
    expense_type: "disbursement",
    title: "",
    amount: "",
    mpesa_phone: "",
    description: "",
    receipt: undefined as File | undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, receipt: file }));
    setErrors((prev) => ({ ...prev, receipt: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // pprevent the default form submit

    const result = createExpenseSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = z.treeifyError(result.error);
      setErrors({
        title: fieldErrors.properties?.title?.errors?.[0] ?? "",
        expense_type: fieldErrors.properties?.expense_type?.errors?.[0] ?? "",
        amount: fieldErrors.properties?.amount?.errors?.[0] ?? "",
        mpesa_phone: fieldErrors.properties?.mpesa_phone?.errors?.[0] ?? "",
        description: fieldErrors.properties?.description?.errors?.[0] ?? "",
        receipt: fieldErrors.properties?.receipt?.errors?.[0] ?? "",
      });
      return;
    }

    createExpense(result.data);
    console.log(result.data)
  }
  return (
    <div className="flex-1 flex justify-center items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Expense</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Expense Type */}
            <Field>
              <FieldLabel>Expense Type</FieldLabel>
              <RadioGroup
                value={formData.expense_type}
                onValueChange={(val) => {
                  setFormData((prev) => ({ ...prev, expense_type: val }));
                  setErrors((prev) => ({ ...prev, expense_type: "" }));
                }}
                className="grid grid-cols-2 gap-4"
              >
                {EXPENSE_TYPES.map((type) => (
                  <FieldLabel key={type.value} htmlFor={type.value}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>{type.title}</FieldTitle>
                        <FieldDescription>{type.description}</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value={type.value} id={type.value} />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              {errors.expense_type && (
                <p className="text-sm text-destructive">
                  {errors.expense_type}
                </p>
              )}
            </Field>

            {/* Title */}
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                name="title"
                placeholder="m@example.com"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </Field>

            <FieldGroup className="grid grid-cols-2">
              {/* Amount */}
              <Field>
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleChange}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount}</p>
                )}
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  name="mpesa_phone"
                  type="text"
                  placeholder="Enter Phone number "
                  value={formData.mpesa_phone}
                  onChange={handleChange}
                />
                {errors.mpesa_phone && (
                  <p className="text-sm text-destructive">
                    {errors.mpesa_phone}
                  </p>
                )}
              </Field>
            </FieldGroup>

            {/* Receipt — reimbursement only */}
            {formData.expense_type === "reimbursement" && (
              <Field>
                <FieldLabel htmlFor="receipt">Receipt</FieldLabel>
                <Input
                  id="receipt"
                  name="receipt"
                  type="file"
                  onChange={handleFileChange}
                />
                {errors.receipt && (
                  <p className="text-sm text-destructive">{errors.receipt}</p>
                )}
              </Field>
            )}

            {/* Description */}
            <Field>
              <FieldLabel htmlFor="description">Description / Notes</FieldLabel>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add a brief note about this expense"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </Field>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner /> Submitting....
                </>
              ) : (
                "Create expense"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

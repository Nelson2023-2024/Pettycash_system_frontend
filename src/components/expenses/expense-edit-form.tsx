"use client";

import { Button } from "@/components/ui/button";
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
import { useUpdateExpense } from "@/hooks/useExpense";
import { updateExpenseSchema } from "@/lib/schemas/expense";
import z from "zod";
import { Spinner } from "../ui/spinner";
import { Expense } from "@/types/expense";
import { X } from "lucide-react";
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

interface ExpenseEditFormProps {
  expense: Expense; // the selected expense to pre-fill the form
  onSuccess?: () => void;
}

export function ExpenseEditForm({ expense, onSuccess }: ExpenseEditFormProps) {
  const { mutate: updateExpense, isPending } = useUpdateExpense();
  const isApproved = expense.status.toLowerCase() === "approved";

  // Pre-fill form with existing expense data
  const [formData, setFormData] = useState({
    expense_type: expense.expense_type,
    title: expense.title,
    amount: expense.amount, // already a string from the Expense type
    mpesa_phone: expense.mpesa_phone, // API doesn't return this so starts empty
    description: expense.description,
    receipt: undefined as File | undefined,
    removeReceipt: false, // tracks if user wants to clear old receipt
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
    setFormData((prev) => ({
      ...prev,
      receipt: file,
      removeReceipt: false, // if they pick a new file, don't remove
    }));
    setErrors((prev) => ({ ...prev, receipt: "" }));
  }

  function handleRemoveReceipt() {
    setFormData((prev) => ({
      ...prev,
      receipt: undefined,
      removeReceipt: true, // flag that old receipt should be cleared
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Only validate fields that were actually changed
    // updateExpenseSchema makes everything optional
    const payload = {
      title: formData.title || undefined,
      expense_type: formData.expense_type as "disbursement" | "reimbursement",
      description: formData.description || undefined,
      amount: formData.amount ? Number(formData.amount) : undefined,
      mpesa_phone: formData.mpesa_phone || undefined,
    };

    const result = updateExpenseSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors = z.treeifyError(result.error);
      setErrors({
        title: fieldErrors.properties?.title?.errors?.[0] ?? "",
        expense_type: fieldErrors.properties?.expense_type?.errors?.[0] ?? "",
        amount: fieldErrors.properties?.amount?.errors?.[0] ?? "",
        mpesa_phone: fieldErrors.properties?.mpesa_phone?.errors?.[0] ?? "",
        description: fieldErrors.properties?.description?.errors?.[0] ?? "",
      });
      return;
    }

    updateExpense(
      { id: expense.id, payload: result.data },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  }

  return (
    <form
      className="flex flex-col gap-6 overflow-hidden"
      onSubmit={handleSubmit}
    >
      {/* Expense Type */}
      <Field>
        <FieldLabel>Expense Type</FieldLabel>
        <RadioGroup
          value={formData.expense_type}
          onValueChange={(val) => {
            setFormData((prev) => ({
              ...prev,
              expense_type: val as "disbursement" | "reimbursement",
            }));
            setErrors((prev) => ({ ...prev, expense_type: "" }));
          }}
          className="grid grid-cols-2 gap-4"
        >
          {EXPENSE_TYPES.map((type) => (
            <FieldLabel key={type.value} htmlFor={`edit-${type.value}`}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{type.title}</FieldTitle>
                  <FieldDescription>{type.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={type.value} id={`edit-${type.value}`} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        {errors.expense_type && (
          <p className="text-sm text-destructive">{errors.expense_type}</p>
        )}
      </Field>

      {/* Title */}
      <FormInput
        name="title"
        label="Title"
        type="text"
        placeholder="Enter expense title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
      />

      <FieldGroup className="grid grid-cols-2">
        {/* Amount */}

        <FormInput
          name="amount"
          label="Amount"
          type="number"
          placeholder="Enter eamount"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
        />

        {/* Phone */}
        <FormInput
          name="mpesa_phone"
          label="Phone"
          type="text"
          placeholder="Enter Mpesa number"
          value={formData.mpesa_phone}
          onChange={handleChange}
          error={errors.mpesa_phone}
        />
      </FieldGroup>

      {/* Receipt — reimbursement only */}
      {formData.expense_type === "reimbursement" && (
        <Field>
          <FieldLabel>Receipt</FieldLabel>

          {!formData.removeReceipt ? (
            // Current receipt exists — show remove + replace options
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <span className="text-muted-foreground">
                  {formData.receipt
                    ? formData.receipt.name // show new file name if replaced
                    : "Receipt already uploaded"}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveReceipt}
                  className="flex items-center gap-1 text-destructive hover:text-destructive shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
              {/* Replace file input below the label */}
              <Input type="file" onChange={handleFileChange} />
            </div>
          ) : (
            // Receipt removed — just show the file input
            <Input type="file" onChange={handleFileChange} />
          )}

          {errors.receipt && (
            <p className="text-sm text-destructive">{errors.receipt}</p>
          )}
        </Field>
      )}

      {/* Description */}
      <Field>
        <FieldLabel htmlFor="edit-description">Description / Notes</FieldLabel>
        <Textarea
          id="edit-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add a brief note about this expense"
          rows={3}
          className="resize-none w-full"
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </Field>

      {expense.status.toLowerCase() === "rejected" && expense.reason && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 flex flex-col gap-1">
          <p className="text-xs font-medium text-destructive uppercase tracking-widest">
            Rejection Reason
          </p>
          <p className="text-sm text-muted-foreground">{expense.reason}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending || isApproved}>
        {isPending ? (
          <>
            <Spinner /> Saving changes...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}

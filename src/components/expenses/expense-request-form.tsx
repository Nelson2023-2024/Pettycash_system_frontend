"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
  const [expenseType, setExpenseType] = useState("disbursement");
  return (
    <div className="flex-1 flex justify-center items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Expense</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-6">
            {/* Expense Type */}
            <Field>
              <FieldLabel>Expense Type</FieldLabel>
              <RadioGroup
                value={expenseType}
                onValueChange={(val: string) => setExpenseType(val)}
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
            </Field>

            {/* Title */}
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input id="title" placeholder="m@example.com" required />
            </Field>

            <FieldGroup className="grid grid-cols-2">
              {/* Amount */}
              <Field>
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  required
                />
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Enter Phone number "
                  required
                />
              </Field>
            </FieldGroup>

            {/* Receipt */}
            {expenseType === "reimbursement" && (
              <Field>
                <FieldLabel htmlFor="receipt">Receipt</FieldLabel>
                <Input id="receipt" type="file" />
              </Field>
            )}

            {/* Description / Notes */}
            <Field>
              <FieldLabel htmlFor="description">Description / Notes</FieldLabel>
              <Textarea
                id="description"
                placeholder="Add a brief note about this expense"
                rows={3}
              />
            </Field>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Create Expense
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

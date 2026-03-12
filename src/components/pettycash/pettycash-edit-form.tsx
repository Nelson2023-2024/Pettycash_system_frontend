// components/pettycash/pettycash-edit-form.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import FormInput from "../ui/FormInput";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { PettyCash, UpdatePettyCashPayload } from "@/types/pettycash";
import { updatePettyCashSchema } from "@/lib/schemas/pettycash";
import z from "zod";
import { useUpdatePettyCash } from "@/hooks/usePettyCash";
import { Spinner } from "../ui/spinner";

interface PettyCashEditFormProps {
  account: PettyCash;
  onSuccess?: () => void;
}

export function PettyCashEditForm({ account, onSuccess }: PettyCashEditFormProps) {
  const { mutate: updatePettyCash, isPending } = useUpdatePettyCash();

  const [formData, setFormData] = useState<UpdatePettyCashPayload>({
    name: account.name,
    description: account.description,
    mpesa_phone_number: account.mpesa_phone_number,
    minimum_threshold: account.minimum_threshold,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UpdatePettyCashPayload, string>>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = updatePettyCashSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = z.treeifyError(result.error);
      setErrors({
        name: fieldErrors.properties?.name?.errors?.[0] ?? "",
        description: fieldErrors.properties?.description?.errors?.[0] ?? "",
        minimum_threshold: fieldErrors.properties?.minimum_threshold?.errors?.[0] ?? "",
        mpesa_phone_number: fieldErrors.properties?.mpesa_phone_number?.errors?.[0] ?? "",
      });
      return;
    }

    updatePettyCash(
      { id: account.id, payload: result.data },
      { onSuccess: () => onSuccess?.() }
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <FieldGroup>
        <FormInput
          label="Account Name"
          name="name"
          type="text"
          placeholder="operations account"
          value={formData.name ?? ""}
          onChange={handleChange}
          error={errors.name}
        />

        <FieldGroup className="grid grid-cols-2">
          <FormInput
            label="Mpesa Phone Number"
            name="mpesa_phone_number"
            type="text"
            placeholder="0115720771"
            value={formData.mpesa_phone_number ?? ""}
            onChange={handleChange}
            error={errors.mpesa_phone_number}
          />
          <FormInput
            label="Minimum Threshold"
            name="minimum_threshold"
            type="number"
            placeholder="2000"
            value={formData.minimum_threshold ?? ""}
            onChange={handleChange}
            error={errors.minimum_threshold}
          />
        </FieldGroup>

        {/* account_type is read-only — mpesa by default, not editable */}
        <Field>
          <FieldLabel>Account Type</FieldLabel>
          <p className="text-sm text-muted-foreground capitalize px-3 py-2 rounded-md bg-muted/60">
            {account.account_type}
          </p>
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            placeholder="Runs small day to day operation"
            value={formData.description ?? ""}
            onChange={handleChange}
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </Field>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <><Spinner /> Saving changes...</> : "Save Changes"}
        </Button>
      </FieldGroup>
    </form>
  );
}
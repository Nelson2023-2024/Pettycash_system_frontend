"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import FormInput from "../ui/FormInput";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { CreatePettyCashPayload } from "@/types/pettycash";
import { createPettyCashSchema } from "@/lib/schemas/pettycash";
import z from "zod";
import { useCreatePettyCash } from "@/hooks/usePettyCash";
import { Spinner } from "../ui/spinner";
// remove this line

interface PettyCashCreateFormProps {
  onSuccess?: () => void;
}

const PettyCashCreateForm = ({ onSuccess }: PettyCashCreateFormProps) => {
  const { mutate: createPettyCash, isPending } = useCreatePettyCash();

  const [formData, setFormData] = useState<CreatePettyCashPayload>({
    name: "",
    description: "",
    mpesa_phone_number: "",
    minimum_threshold: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreatePettyCashPayload, string>>
  >({});
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = createPettyCashSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = z.treeifyError(result.error);
      setErrors({
        name: fieldErrors.properties?.name?.errors?.[0] ?? "",
        description: fieldErrors.properties?.description?.errors?.[0] ?? "",
        minimum_threshold:
          fieldErrors.properties?.minimum_threshold?.errors?.[0] ?? "",
        mpesa_phone_number:
          fieldErrors.properties?.mpesa_phone_number?.errors?.[0] ?? "",
      });
      return;
    }

    createPettyCash(formData, {
      onSuccess: () => onSuccess?.(),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <FormInput
          label="Account Name"
          name="name"
          type="text"
          placeholder="operations account"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <FieldGroup className="grid grid-cols-2">
          <FormInput
            label="Mpesa Phone Number"
            name="mpesa_phone_number"
            type="text"
            placeholder="0115720771"
            value={formData.mpesa_phone_number}
            onChange={handleChange}
            error={errors.mpesa_phone_number}
          />
          <FormInput
            label="Minimum Threshold"
            name="minimum_threshold"
            placeholder="2000"
            type="number"
            value={formData.minimum_threshold}
            onChange={handleChange}
            error={errors.minimum_threshold}
          />
        </FieldGroup>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            placeholder="Runs small day to day operation"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </Field>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default PettyCashCreateForm;

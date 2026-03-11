"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import FormInput from "../ui/FormInput";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { CreatePettyCashPayload } from "@/types/pettycash";
import { createPettyCashSchema } from "@/lib/schemas/pettycash";
import z, { treeifyError } from "zod";

const PettyCashCreateForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
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
    }
  }

  return (
    <div
      className={cn("flex flex-col gap-6 max-w-125 mx-auto", className)}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Pettycash Account</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  type="number"
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
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description}
                  </p>
                )}
              </Field>

              <Field>
                <Button type="submit">Create Account</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PettyCashCreateForm;

import { useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { DecideTopUpInput } from "@/lib/schemas/topup";

const DECISION_TYPES = [
  {
    value: "approved",
    title: "Approve",
    description: "Approve this request and allow it to proceed.",
  },
  {
    value: "rejected",
    title: "Reject",
    description: "Reject this request. A reason is required.",
  },
];

export function DecisionRadio() {
  // useFormContext reads the form state from the nearest FormProvider
  // no need to pass control or errors as props
  const {
    control,
    formState: { errors },
  } = useFormContext<DecideTopUpInput>();

  return (
    <Field>
      <FieldLabel>Decision</FieldLabel>
      <Controller
        name="decision"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="grid grid-cols-2 gap-4"
          >
            {DECISION_TYPES.map((type) => (
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
        )}
      />
      {errors.decision && (
        // errors.decision.message could be string or undefined
        // casting to any to avoid TypeScript complaint since form schema varies
        <FieldError>{errors.decision?.message}</FieldError>
      )}
    </Field>
  );
}

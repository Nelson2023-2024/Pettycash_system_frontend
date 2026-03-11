import React from "react";
import { Field, FieldLabel } from "./field";
import { Input } from "./input";

interface FormInputProps extends React.InputHTMLAttributes<HTMLElement> {
  label: string;
  name: string;
  error?: string;
}

const FormInput = ({ label, name, error, ...props }: FormInputProps) => {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input id={name} name={name} {...props} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </Field>
  );
};

export default FormInput;

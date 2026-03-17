"use client";
import React from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import FormInput from "../ui/FormInput";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "@/hooks/useUser";
import { Spinner } from "../ui/spinner";

import { DepartmentSelect } from "../departments/department-select";
import { CreateUserInput, createUserSchema } from "@/lib/schemas/user";
import { RoleSelect } from "./role-select";

interface UserFormProps {
  onSuccess?: () => void;
}

const UserForm = ({ onSuccess }: UserFormProps) => {
  const { mutate: createUser, isPending } = useCreateUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema) as Resolver<CreateUserInput>,
    defaultValues: {
      first_name: "",
      last_name: "",
      other_name: "",
      email: "",
      password: "",
      phone_number: "",
      national_id: "",
      role: "EMP",
      department: "",
    },
  });

  function onSubmit(data: CreateUserInput) {
    createUser(data, { onSuccess: () => onSuccess?.() });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* ── Name ── */}
        <FieldGroup className="grid grid-cols-3">
          <FormInput
            label="First Name"
            placeholder="John"
            {...register("first_name")}
            error={errors.first_name?.message}
          />
          <FormInput
            label="Last Name"
            placeholder="Doe"
            {...register("last_name")}
            error={errors.last_name?.message}
          />
          <FormInput
            label="Other Name"
            placeholder="Optional"
            {...register("other_name")}
            error={errors.other_name?.message}
          />
        </FieldGroup>

        {/* ── Contact ── */}
        <FieldGroup className="grid grid-cols-2">
          <FormInput
            label="Email"
            type="email"
            placeholder="john@company.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <FormInput
            label="Phone Number"
            type="text"
            placeholder="0712345678"
            {...register("phone_number")}
            error={errors.phone_number?.message}
          />
        </FieldGroup>

        {/* ── Identity & Password ── */}
        <FieldGroup className="grid grid-cols-2">
          <FormInput
            label="National ID"
            placeholder="12345678"
            {...register("national_id")}
            error={errors.national_id?.message}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />
        </FieldGroup>

        {/* ── Role & Department ── */}
        <FieldGroup className="grid grid-cols-2">
          <Field>
            <FieldLabel>Role</FieldLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RoleSelect value={field.value} onChange={field.onChange} />
              )}
            />
            <FieldError>{errors.role?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Department</FieldLabel>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <DepartmentSelect
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <FieldError>{errors.department?.message}</FieldError>
          </Field>
        </FieldGroup>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Creating User...
            </>
          ) : (
            "Create User"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default UserForm;

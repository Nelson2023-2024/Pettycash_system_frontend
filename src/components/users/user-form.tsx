"use client";
import React from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "../ui/field";
import FormInput from "../ui/FormInput";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser, useUpdateUser } from "@/hooks/useUser";
import { Spinner } from "../ui/spinner";

import { DepartmentSelect } from "../departments/department-select";
import {
  CreateUserInput,
  createUserSchema,
  UpdateUserInput,
  updateUserSchema,
} from "@/lib/schemas/user";
import { RoleSelect } from "./role-select";
import { User } from "@/types/user";
import { Checkbox } from "../ui/checkbox";

interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
}

const UserForm = ({ onSuccess, user }: UserFormProps) => {
  const isEdit = !!user;

  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserInput | UpdateUserInput>({
    resolver: zodResolver(
      isEdit ? updateUserSchema : createUserSchema,
    ) as Resolver<CreateUserInput | UpdateUserInput>,
    defaultValues: isEdit
      ? {
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          other_name: user.other_name ?? "",
          email: user.email ?? "",
          phone_number: user.phone_number ?? "",
          national_id: user.national_id ?? "",
          role: user.role_code ?? "",
          department: user.department?.id ?? "",
        }
      : {
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

  function onSubmit(data: CreateUserInput | UpdateUserInput) {
    if (isEdit) {
      updateUser(
        { user_id: user.id, payload: data as UpdateUserInput },
        { onSuccess: () => onSuccess?.() },
      );
    } else {
      createUser(data as CreateUserInput, { onSuccess: () => onSuccess?.() });
    }
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
            type="number"
            placeholder="12345678"
            {...register("national_id")}
            error={errors.national_id?.message}
          />
          {/* only show when the user is not passed in */}
          {!isEdit && (
            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={
                (errors as Record<string, { message?: string }>).password
                  ?.message
              }
            />
          )}
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

        {isEdit && (
          <Field>
            <FieldLabel>Account Status</FieldLabel>
            <Field
              orientation="horizontal"
              className="rounded-md border border-border px-3 py-2.5"
            >
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="is_active"
                    checked={field.value ?? true}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <FieldContent>
                <FieldTitle>Active</FieldTitle>
                <FieldDescription>
                  Inactive users cannot log in or access any part of the system.
                </FieldDescription>
              </FieldContent>
            </Field>
          </Field>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> {isEdit ? "Saving changes..." : "Creating User..."}
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create User"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default UserForm;

"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import FormInput from "../ui/FormInput";
import { Textarea } from "../ui/textarea";
import {
  CreateDepartmentInput,
  createDepartmentSchema,
  UpdateDepartmentInput,
  updateDepartmentSchema,
} from "@/lib/schemas/department";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "@/hooks/useDepartment";
import { Spinner } from "../ui/spinner";
import { Department } from "@/types/department";
import { UserSearchCombobox } from "../ui/UserSearchCombobox";

interface DepartmentFormProps extends React.ComponentProps<"div"> {
  department?: Department; // if passed → update mode
  onSuccess?: () => void;
}

const DepartmentForm = ({
  className,
  department,
  onSuccess,
  ...props
}: DepartmentFormProps) => {
  const isEdit = !!department;

  const { mutate: createDepartment, isPending: isCreating } =
    useCreateDepartment();
  const { mutate: updateDepartment, isPending: isUpdating } =
    useUpdateDepartment();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateDepartmentInput | UpdateDepartmentInput>({
    resolver: zodResolver(
      isEdit ? updateDepartmentSchema : createDepartmentSchema,
    ),
    defaultValues: isEdit
      ? {
          name: department.name,
          code: department.code,
          description: department.description,
          line_manager_id: department?.line_manager?.id ?? "",
        }
      : {
          name: "",
          code: "",
          description: "",
        },
  });

  function onSubmit(data: CreateDepartmentInput | UpdateDepartmentInput) {
    if (isEdit) {
      updateDepartment(
        {
          department_id: department.id,
          payload: data as UpdateDepartmentInput,
        },
        { onSuccess: () => onSuccess?.() },
      );
    } else {
      createDepartment(data as CreateDepartmentInput, {
        onSuccess: () => onSuccess?.(),
      });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {isEdit ? "Edit Department" : "Create Department"}
          </CardTitle>
          <CardDescription>Organizational Departments</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldGroup className="grid grid-cols-2">
                <FormInput
                  label="Department Name"
                  placeholder="Finance"
                  {...register("name")}
                  error={errors.name?.message}
                />
                <FormInput
                  label="Code"
                  placeholder="HR or IT"
                  {...register("code")}
                  error={errors.code?.message}
                />
              </FieldGroup>

              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  placeholder="Handles companies finances"
                  rows={3}
                  {...register("description")}
                />
                <FieldError>{errors.description?.message}</FieldError>
              </Field>

              {/* Line manager — update only */}
              {isEdit && (
                <Field>
                  <FieldLabel>Line Manager</FieldLabel>

                  <Controller
                    name="line_manager_id"
                    control={control}
                    render={({ field }) => (
                      <UserSearchCombobox
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <FieldError>{errors.line_manager_id?.message}</FieldError>
                </Field>
              )}

              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner />
                      {isEdit ? "Saving changes..." : "Creating Department..."}
                    </>
                  ) : isEdit ? (
                    "Save Changes"
                  ) : (
                    "Create Department"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentForm;

"use client";
import React, {
  DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES,
} from "react";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTopUpInput,
  createTopUpSchema,
  UpdateTopUpInput,
} from "@/lib/schemas/topup";
import FormInput from "../ui/FormInput";
import { Textarea } from "../ui/textarea";
import { useCreateTopUp, useUpdateTopUp } from "@/hooks/useTopup";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { TopUp } from "@/types/topup";

interface TopupFormProps {
  // passed from PettyCashCardPage when topping up a specific account optional — if not passed, falls back to the first active account
  pettycashAccountId?: string;
  // passed from TopupDataTable when editing an existing top-up presence of this prop switches form to edit mode
  topup?: TopUp;
  // called after successful create or update — closes the dialog
  onSuccess?: () => void;
}
const TopupForm = ({
  pettycashAccountId,
  topup,
  onSuccess,
}: TopupFormProps) => {
  // true when editing an existing top-up, false when creating a new one
  const isEdit = !!topup;
  const { mutate: createTopUp, isPending: isCreating } = useCreateTopUp();
  const { mutate: updateTopUp, isPending: isUpdating } = useUpdateTopUp();

  const isPending = isCreating || isUpdating;

  // in edit mode, account id comes from the topup object itself
  const accountId = isEdit ? topup.pettycash_account?.id : pettycashAccountId;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTopUpInput | UpdateTopUpInput>({
    resolver: zodResolver(createTopUpSchema) as Resolver<
      CreateTopUpInput | UpdateTopUpInput
    >,
    // pre-fills form when editing — same pattern as DepartmentForm
    defaultValues: isEdit
      ? {
          amount: Number(topup.amount),
          request_reason: topup.request_reason,
        }
      : //on creat no default values
        {},
  });

  function onSubmit(data: CreateTopUpInput | UpdateTopUpInput) {
    if (isEdit) {
      updateTopUp(
        {
          topup_id: topup.id,
          payload: data as UpdateTopUpInput,
        },
        //close the edit modal
        { onSuccess: () => onSuccess?.() },
      );
    } else {
      if (!accountId) return;
      createTopUp({
        pettycash_account_id: accountId!,
        payload: data as CreateTopUpInput,
      });
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormInput
          label="Amount (KES)"
          type="number"
          placeholder="Enter Amount"
          {...register("amount")}
        />
        <FieldError>{errors.amount?.message}</FieldError>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea
            rows={3}
            placeholder="Enter a description"
            {...register("request_reason")}
          />
          <FieldError>{errors.request_reason?.message}</FieldError>
        </Field>
        <Field>
          <Button type="submit" disabled={isPending || (!isEdit && !accountId)}>
            {isPending ? (
              <>
                <Spinner className="size-4" />
                {isEdit ? "Saving changes..." : "Submitting Top-Up..."}
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Submit Top-up"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default TopupForm;

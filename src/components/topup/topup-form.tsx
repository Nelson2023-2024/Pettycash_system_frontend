"use client";
import React from "react";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTopUpInput, createTopUpSchema } from "@/lib/schemas/topup";
import FormInput from "../ui/FormInput";
import { Textarea } from "../ui/textarea";
import { useCreateTopUp } from "@/hooks/useTopup";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const TopupForm = ({ pettycashAccountId }: { pettycashAccountId: string }) => {
  const { mutate: createTopUp, isPending } = useCreateTopUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTopUpInput>({
    resolver: zodResolver(createTopUpSchema) as Resolver<CreateTopUpInput>,
  });

  function onSubmit(data: CreateTopUpInput) {
    createTopUp({ pettycash_account_id: pettycashAccountId, payload: data });
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
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner className="size-4" />
                Submitting Topup....
              </>
            ) : (
              "Submit TopUp"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default TopupForm;

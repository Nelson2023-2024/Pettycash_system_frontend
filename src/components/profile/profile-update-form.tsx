"use client";
import { useRef, useState } from "react";
import FormInput from "../ui/FormInput";
import { FieldGroup } from "../ui/field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthMe } from "@/hooks/useAuth";
import { Controller, Resolver, useForm } from "react-hook-form";
import { UpdateProfileInput, updateProfileSchema } from "@/lib/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfile } from "@/hooks/useUser";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { AuthUser } from "@/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ── Inner form — always receives a fully loaded user ──────────────────────────
const ProfileUpdateForm = ({ user }: { user: AuthUser }) => {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema) as Resolver<UpdateProfileInput>,
    defaultValues: {
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      other_name: user.other_name ?? "",
      phone_number: user.phone_number ?? "",
      national_id: user.national_id ?? "",
    },
  });

  function onSubmit(data: UpdateProfileInput) {
    updateProfile(data);
  }

  const initials =
    `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <form
      className="max-w-125 mx-auto flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-2">
        <Avatar
          className="size-32 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <AvatarImage src={preview ?? user.avatar_url ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <p className="text-muted-foreground text-sm">Click to update photo</p>
        <Controller
          name="avatar_url"
          control={control}
          render={({ field: { onChange } }) => (
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setPreview(URL.createObjectURL(file));
                onChange(file);
              }}
            />
          )}
        />
      </div>

      <FieldGroup>
        <FieldGroup className="grid grid-cols-2">
          <FormInput
            label="First Name"
            placeholder="James"
            {...register("first_name")}
            error={errors.first_name?.message}
          />
          <FormInput
            label="Last Name"
            placeholder="Peter"
            {...register("last_name")}
            error={errors.last_name?.message}
          />
        </FieldGroup>
        <FormInput
          label="Other Name"
          placeholder="Optional"
          {...register("other_name")}
          error={errors.other_name?.message}
        />
        <FieldGroup className="grid grid-cols-2">
          <FormInput
            label="Phone Number"
            type="text"
            placeholder="0712345678"
            {...register("phone_number")}
            error={errors.phone_number?.message}
          />
          <FormInput
            label="National ID"
            placeholder="12345678"
            {...register("national_id")}
            error={errors.national_id?.message}
          />
        </FieldGroup>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Saving changes...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};

// ── Wrapper — handles loading state before rendering the form ─────────────────
const ProfileUpdateFormWrapper = () => {
  const { data: user, isPending } = useAuthMe();
  if (isPending || !user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    );
  return <div className="max-w-125 mx-auto py-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">My Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileUpdateForm user={user} />
        </CardContent>
      </Card>
    </div>
};

export default ProfileUpdateFormWrapper;

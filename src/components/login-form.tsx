"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import z from "zod";
import { loginSchema } from "@/lib/schemas/auth";
import { useLogin } from "@/hooks/useAuth";
import { Spinner } from "./ui/spinner";
import FormInput from "./ui/FormInput";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate: login, isPending, isError, error, data } = useLogin(); // login hook to login

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear the error for this field as user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const errors = z.treeifyError(result.error); //returns a structured error tree that matches your schema.

      setErrors({
        email: errors.properties?.email?.errors?.[0] ?? "",
        password: errors.properties?.password?.errors?.[0] ?? "",
      });
      console.log(errors);

      return false;
    }
    return true;
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    const isValid = validate();

    if (!isValid) return;

    console.log("Login data:", formData);
    login(formData);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your account
                </p>
              </div>

              {/* API-level error banner */}
              {isError && (
                <p className="text-sm text-destructive text-center">
                  {error.message ?? "Something went wrong"}
                </p>
              )}
              
              {/* EMAIL FIELD */}
              <FormInput
                label="Email"
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href={"/"}
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner />
                      Logging in ....
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>
              
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/variant_2_warm_parchment.png"
              alt="Image"
              fill
              className="aobject-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}

import { Button } from "@bus-booking/ui/components/button";
import { Label } from "@bus-booking/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@bus-booking/ui/components/input-group";
import { Eye, EyeClosed, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function SignInForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email.trim().toLowerCase(),
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/",
              search: { page: 1, pageSize: 10 },
            });
            toast.success("Signed in successfully");
          },
          onError: (error) => {
            toast.error(
              error.error.message ||
                error.error.statusText ||
                "Failed to sign in",
            );
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
      }),
    },
  });

  return (
    <div className="mx-auto mt-16 w-full max-w-md p-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="size-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in with your administrator account to access bookings.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email address</Label>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Mail className="size-4 text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="admin@example.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </InputGroup>
                  {field.state.meta.errors.map((error) => (
                    <p
                      key={error?.message}
                      className="text-xs text-destructive"
                    >
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Password</Label>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      type={passwordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        onClick={() => {
                          setPasswordVisible((prev) => !prev);
                        }}
                      >
                        {passwordVisible ? (
                          <Eye className="size-4" />
                        ) : (
                          <EyeClosed className="size-4" />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {field.state.meta.errors.map((error) => (
                    <p
                      key={error?.message}
                      className="text-xs text-destructive"
                    >
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
          >
            {({ canSubmit, isSubmitting }) => (
              <Button
                type="submit"
                className="w-full mt-2 h-12"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In to Admin"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  );
}

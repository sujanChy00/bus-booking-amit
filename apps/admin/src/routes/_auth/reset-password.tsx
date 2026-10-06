import { Button } from "@bus-booking/ui/components/button";
import { Input } from "@bus-booking/ui/components/input";
import { Label } from "@bus-booking/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

const searchSchema = z.object({
  email: z.string().optional().catch(""),
});

export const Route = createFileRoute("/_auth/reset-password")({
  validateSearch: (search) => searchSchema.parse(search),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: search.email || "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      try {
        await authClient.emailOtp.resetPassword({
          email: value.email,
          otp: value.otp,
          password: value.password,
        });
        toast.success(
          "Password updated successfully! Please sign in with your new password.",
        );
        navigate({ to: "/", search: { page: 1, pageSize: 10 } });
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to reset password. Invalid or expired OTP code.";
        toast.error(errorMsg);
      }
    },
    validators: {
      onSubmit: z
        .object({
          email: z.string().email("Invalid email address"),
          otp: z.string().min(4, "Please enter the OTP code"),
          password: z.string().min(8, "Password must be at least 8 characters"),
          confirmPassword: z.string().min(8, "Confirm password is required"),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
    },
  });

  return (
    <div className="mx-auto mt-10 w-full max-w-md p-6">
      <h1 className="mb-2 text-center text-3xl font-bold">Set New Password</h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Enter the OTP code sent to your email and your new password below.
      </p>

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
                <Label htmlFor={field.name}>Admin Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-destructive">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="otp">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>OTP Code</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  className="font-mono text-center tracking-widest text-lg"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-destructive">
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
                <Label htmlFor={field.name}>New Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-destructive">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="confirmPassword">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Confirm New Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-destructive">
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
              className="w-full"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </Button>
          )}
        </form.Subscribe>

        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => navigate({ to: "/login" })}>
            Back to Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}

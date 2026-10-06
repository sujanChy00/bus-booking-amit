import { api } from "@bus-booking/backend/convex/_generated/api";
import { Button } from "@bus-booking/ui/components/button";
import { Input } from "@bus-booking/ui/components/input";
import { Label } from "@bus-booking/ui/components/label";
import { useMutation } from "convex/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

export default function ForgotPasswordForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) {
  const navigate = useNavigate();
  const sendPasswordResetOTP = useMutation(api.adminAuth.sendPasswordResetOTP);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await sendPasswordResetOTP({ email: value.email });
        toast.success("Password reset OTP sent to your email!");
        navigate({
          to: "/reset-password",
          search: { email: value.email },
        });
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to send reset code. Please check your email.";
        toast.error(errorMsg);
      }
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email("Invalid email address"),
      }),
    },
  });

  return (
    <div className="mx-auto mt-10 w-full max-w-md p-6">
      <h1 className="mb-2 text-center text-3xl font-bold">Reset Password</h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Enter your admin email address to receive a 6-digit reset code.
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
                  placeholder="suzu9869@gmail.com"
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
              {isSubmitting ? "Sending OTP..." : "Send Reset OTP"}
            </Button>
          )}
        </form.Subscribe>

        <div className="mt-4 text-center">
          <Button variant="link" onClick={onSwitchToSignIn}>
            Remember your password? Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}

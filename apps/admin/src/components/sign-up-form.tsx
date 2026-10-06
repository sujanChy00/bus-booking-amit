import { api } from "@bus-booking/backend/convex/_generated/api";
import { Button } from "@bus-booking/ui/components/button";
import { Input } from "@bus-booking/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@bus-booking/ui/components/input-group";
import { Label } from "@bus-booking/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useAction } from "convex/react";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

export default function SignUpForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const sendRegistrationOTP = useAction(api.adminAuth.sendRegistrationOTP);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        // Step 1: Check authorization, create the account and send the
        // verification OTP. No session cookie is set, so the admin is sent
        // to the verify-email page to complete registration.
        await sendRegistrationOTP({
          email: value.email,
          password: value.password,
          name: value.name,
        });

        toast.success("Verification code sent to your email!");
        // Navigate to verify email page
        navigate({
          to: "/verify-email",
          search: { email: value.email },
        });
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Registration failed. Check if your email is authorized.";
        toast.error(errorMsg);
      }
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  return (
    <div className="mx-auto mt-10 w-full max-w-md p-6">
      <h1 className="mb-2 text-center text-3xl font-bold">
        Admin Registration
      </h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Register an admin account with an authorized email address.
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
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Full Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="Admin User"
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
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Authorized Email</Label>
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

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <InputGroup>
                  <InputGroupAddon align={"inline-end"}>
                    <InputGroupButton
                      onClick={() => {
                        setPasswordVisible((prev) => !prev);
                      }}
                    >
                      {passwordVisible ? <Eye /> : <EyeClosed />}
                    </InputGroupButton>
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    type={passwordVisible ? "text" : "password"}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </InputGroup>
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
              {isSubmitting ? "Processing..." : "Register & Get OTP"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={() => {
            navigate({ to: "/login" });
          }}
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
}

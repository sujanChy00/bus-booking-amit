import { Button } from "@bus-booking/ui/components/button";
import { Card } from "@bus-booking/ui/components/card";
import { Container } from "@bus-booking/ui/components/container";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@bus-booking/ui/components/input-group";
import { Label } from "@bus-booking/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_protected/change-password")({
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (value.newPassword !== value.confirmPassword) {
        toast.error("New passwords do not match.");
        return;
      }

      try {
        const { error } = await authClient.changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
          revokeOtherSessions: true,
        });

        if (error) {
          toast.error(error.message || "Failed to update password.");
          return;
        }

        toast.success("Password changed successfully.");
        navigate({
          to: "/",
          search: { page: 1, pageSize: 10 },
        });
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Error changing password";
        toast.error(msg);
      }
    },
    validators: {
      onSubmit: z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
          .string()
          .min(8, "New password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Confirm password is required"),
      }),
    },
  });

  return (
    <Container className="max-w-lg py-10 space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() =>
            navigate({ to: "/", search: { page: 1, pageSize: 10 } })
          }
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Change Password</h1>
          <p className="text-xs text-muted-foreground">
            Update your administrator account password.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <form.Field name="currentPassword">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Current Password</Label>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      type={showCurrent ? "text" : "password"}
                      value={field.state.value}
                      placeholder="••••••••"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        onClick={() => setShowCurrent((p) => !p)}
                      >
                        {showCurrent ? (
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

          <div>
            <form.Field name="newPassword">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>New Password</Label>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      type={showNew ? "text" : "password"}
                      value={field.state.value}
                      placeholder="At least 8 characters"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        onClick={() => setShowNew((p) => !p)}
                      >
                        {showNew ? (
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

          <div>
            <form.Field name="confirmPassword">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Confirm New Password</Label>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      type={showConfirm ? "text" : "password"}
                      value={field.state.value}
                      placeholder="Re-enter new password"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        onClick={() => setShowConfirm((p) => !p)}
                      >
                        {showConfirm ? (
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
                {isSubmitting ? "Updating Password..." : "Change Password"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </Card>
    </Container>
  );
}

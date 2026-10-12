import { api } from "@bus-booking/backend/convex/_generated/api";
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
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction } from "convex/react";
import { ArrowLeft, Eye, EyeClosed, Mail, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_protected/reset-admin-password")({
  component: ResetAdminPasswordPage,
});

function ResetAdminPasswordPage() {
  const navigate = useNavigate();
  const listAdminUsersAction = useAction(api.adminAuth.listAdminUsers);
  const resetPasswordAction = useAction(
    api.adminAuth.resetAdminPasswordByEmail,
  );

  const [admins, setAdmins] = useState<
    Array<{ id: string; email: string; name: string }>
  >([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmins() {
      try {
        const users = await listAdminUsersAction();
        setAdmins(users);
        if (users.length > 0 && !selectedEmail) {
          setSelectedEmail(users[0].email);
        }
      } catch (err) {
        console.error("Failed to load admin list:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAdmins();
  }, [listAdminUsersAction, selectedEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail.trim()) {
      toast.error("Please enter or select an admin email.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPasswordAction({
        email: selectedEmail.trim().toLowerCase(),
        newPassword,
      });
      toast.success(res.message || "Password updated successfully.");
      setNewPassword("");
      navigate({ to: "/", search: { page: 1, pageSize: 10 } });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to reset password.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold tracking-tight">
            Reset Admin Password
          </h1>
          <p className="text-xs text-muted-foreground">
            Set a new password for another administrator account.
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
          <ShieldAlert className="size-4 shrink-0 mt-0.5" />
          <p>
            This administrative override resets the password directly. Use this
            when a fellow admin forgets their password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Select or Enter Admin Email</Label>
            {admins.length > 0 ? (
              <select
                id="adminEmail"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
              >
                {admins.map((a) => (
                  <option key={a.id} value={a.email}>
                    {a.name ? `${a.name} (${a.email})` : a.email}
                  </option>
                ))}
              </select>
            ) : (
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Mail className="size-4 text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  id="adminEmail"
                  type="email"
                  placeholder="admin@example.com"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  required
                />
              </InputGroup>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <InputGroup>
              <InputGroupInput
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeClosed className="size-4" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Resetting Password..." : "Set New Password"}
          </Button>
        </form>
      </Card>
    </Container>
  );
}

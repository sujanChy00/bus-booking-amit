import { createFileRoute, useNavigate } from "@tanstack/react-router";

import ForgotPasswordForm from "@/components/forgot-password-form";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <ForgotPasswordForm
      onSwitchToSignIn={() => navigate({ to: "/login" })}
    />
  );
}

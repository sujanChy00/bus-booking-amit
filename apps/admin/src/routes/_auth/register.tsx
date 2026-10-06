import { createFileRoute, useNavigate } from "@tanstack/react-router";

import SignUpForm from "@/components/sign-up-form";

export const Route = createFileRoute("/_auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <SignUpForm onSwitchToSignIn={() => navigate({ to: "/login" })} />
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";

import SignInForm from "@/components/sign-in-form";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <SignInForm
      onSwitchToForgotPassword={() =>
        navigate({ to: "/forgot-password" })
      }
      onSwitchToSignUp={() => navigate({ to: "/register" })}
    />
  );
}

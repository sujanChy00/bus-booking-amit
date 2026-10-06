import { createFileRoute } from "@tanstack/react-router";

import SignUpForm from "@/components/sign-up-form";

export const Route = createFileRoute("/_auth/register")({
  component: SignUpForm,
});

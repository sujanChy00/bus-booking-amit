import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthLayoutRoute,
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({
        to: "/",
        search: { page: 1, pageSize: 10 },
      });
    }
  },
});

function AuthLayoutRoute() {
  return <Outlet />;
}

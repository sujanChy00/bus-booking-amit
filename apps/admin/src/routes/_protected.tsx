import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  component: ProtectedLayout,
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function ProtectedLayout() {
  return <Outlet />;
}

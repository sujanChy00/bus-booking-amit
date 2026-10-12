import { authClient } from "@/lib/auth-client";
import { Button } from "@bus-booking/ui/components/button";
import { Container } from "@bus-booking/ui/components/container";
import { useRouter } from "@tanstack/react-router";
import { LogOut, ShieldAlert } from "lucide-react";

export function UnauthorizedErrorView({ error }: { error?: Error }) {
  const router = useRouter();
  const isUnauthorized =
    error?.message?.includes("Unauthorized") ||
    error?.message?.includes("Admin");

  return (
    <Container className="max-w-md py-20 text-center space-y-4">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <ShieldAlert className="size-8" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">
        {isUnauthorized ? "Unauthorized Access" : "Access Error"}
      </h2>
      <p className="text-sm text-muted-foreground">
        {isUnauthorized
          ? "Your account does not have administrator privileges to view or manage bookings. Please sign in with an authorized admin account."
          : error?.message ||
            "An unexpected error occurred while loading admin data."}
      </p>
      <div className="pt-2 flex justify-center gap-3">
        <Button
          variant="outline"
          onClick={() => {
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.navigate({
                    to: "/login",
                  });
                },
              },
            });
          }}
          className="gap-2"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </Container>
  );
}

import { api } from "@bus-booking/backend/convex/_generated/api";
import { Button } from "@bus-booking/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bus-booking/ui/components/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { KeyRound, LogOut, ShieldAlert } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getAvatarName } from "@bus-booking/ui/lib/utils";

export default function UserMenu() {
  const user = useQuery(api.auth.getCurrentUser);
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="rounded-full font-semibold"
            size="icon-lg"
          />
        }
      >
        {getAvatarName(user?.name)}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuGroup className={"space-y-1"}>
          <DropdownMenuLabel className="px-2 py-1.5">
            <div className="font-semibold text-sm">
              {user?.name || "Administrator"}
            </div>
            <div className="text-xs text-muted-foreground font-normal truncate">
              {user?.email}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => navigate({ to: "/change-password" })}
          >
            <KeyRound className="size-4 text-muted-foreground" />
            <span>Change My Password</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => navigate({ to: "/reset-admin-password" })}
          >
            <ShieldAlert className="size-4 text-muted-foreground" />
            <span>Reset Admin Password</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer gap-2"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    location.href = "/login";
                  },
                },
              });
            }}
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

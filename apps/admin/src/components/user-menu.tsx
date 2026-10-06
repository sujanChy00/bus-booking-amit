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
import { useQuery } from "convex/react";

import { authClient } from "@/lib/auth-client";
import { getAvatarName } from "@bus-booking/ui/lib/utils";

export default function UserMenu() {
  const user = useQuery(api.auth.getCurrentUser);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className={"rounded-full"}
            size={"icon-lg"}
          />
        }
      >
        {getAvatarName(user?.name)}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card min-w-36">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{user?.email}</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    location.reload();
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

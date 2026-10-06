import { Link } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";

import UserMenu from "./user-menu";

export default function Header() {
  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <Link
          to="/"
          search={{ page: 1, pageSize: 10 }}
          className="text-lg font-bold tracking-tight"
        >
          Bus Booking Admin
        </Link>

        <div className="flex items-center gap-2">
          <Authenticated>
            <UserMenu />
          </Authenticated>
          <Unauthenticated>
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Link>
          </Unauthenticated>
        </div>
      </div>
      <hr />
    </div>
  );
}

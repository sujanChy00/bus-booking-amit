import { api } from "@bus-booking/backend/convex/_generated/api";
import { Button } from "@bus-booking/ui/components/button";
import { Container } from "@bus-booking/ui/components/container";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { KeyRound, Loader2 } from "lucide-react";
import z from "zod";

import { BookingDataTable } from "@/components/booking-data-table";
import { BookingsFilter } from "@/components/bookings-filter";
import { UnauthorizedErrorView } from "@/components/unauthorized-error-view";

const searchSchema = z.object({
  page: z.coerce.number().optional().default(1).catch(1),
  pageSize: z.coerce.number().optional().default(10).catch(10),
  name: z.string().optional().catch(""),
  phone: z.string().optional().catch(""),
  destination: z.string().optional().catch(""),
  travelDate: z.string().optional().catch(""),
  sortDate: z.enum(["asc", "desc"]).optional().catch(undefined),
});

export const Route = createFileRoute("/_protected/")({
  validateSearch: (search) => searchSchema.parse(search),
  errorComponent: ({ error }) => (
    <UnauthorizedErrorView error={error as Error} />
  ),
  component: DashboardPage,
});

function DashboardPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  let bookings = useQuery(api.bookings.list, {
    name: search.name || undefined,
    phone: search.phone || undefined,
    destination: search.destination || undefined,
    travelDate: search.travelDate || undefined,
  });

  // Client-side sort by travel date if requested
  let sortedBookings = bookings;
  if (bookings && search.sortDate) {
    sortedBookings = [...bookings].sort((a, b) => {
      const dateA = a.travelDate || "";
      const dateB = b.travelDate || "";
      if (!dateA) return 1;
      if (!dateB) return -1;
      return search.sortDate === "asc"
        ? dateA.localeCompare(dateB)
        : dateB.localeCompare(dateA);
    });
  }

  const handlePageChange = (newPage: number) => {
    navigate({
      to: "/",
      search: {
        ...search,
        page: newPage,
      },
      replace: true,
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: "/",
      search: {
        ...search,
        page: 1,
        pageSize: newPageSize,
      },
      replace: true,
    });
  };

  return (
    <Container className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bookings Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage passenger reservations with live data updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/change-password" })}
            className="gap-1.5"
          >
            <KeyRound className="size-3.5" />
            <span>Change Password</span>
          </Button>
        </div>
      </div>

      <BookingsFilter />

      {bookings === undefined ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-2xl border bg-card/50 text-sm text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span>Loading bookings...</span>
        </div>
      ) : (
        <BookingDataTable
          data={sortedBookings ?? []}
          page={search.page}
          pageSize={search.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </Container>
  );
}

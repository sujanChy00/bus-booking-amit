import { api } from "@bus-booking/backend/convex/_generated/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import z from "zod";

import { BookingDataTable } from "@/components/booking-data-table";
import { BookingsFilter } from "@/components/bookings-filter";
import { Container } from "@bus-booking/ui/components/container";

const searchSchema = z.object({
  page: z.coerce.number().optional().default(1).catch(1),
  pageSize: z.coerce.number().optional().default(10).catch(10),
  name: z.string().optional().catch(""),
  phone: z.string().optional().catch(""),
  travelDate: z.string().optional().catch(""),
});

export const Route = createFileRoute("/_protected/")({
  validateSearch: (search) => searchSchema.parse(search),
  component: DashboardPage,
});

function DashboardPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const bookings = useQuery(api.bookings.list, {
    name: search.name || undefined,
    phone: search.phone || undefined,
    travelDate: search.travelDate || undefined,
  });

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Bookings Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage all passenger booking requests.
        </p>
      </div>

      <BookingsFilter />
      {bookings === undefined ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Loading bookings...
        </div>
      ) : (
        <BookingDataTable
          data={bookings ?? []}
          page={search.page}
          pageSize={search.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </Container>
  );
}

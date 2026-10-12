import type { BookingResponse } from "@bus-booking/backend/convex/bookings";
import { Badge } from "@bus-booking/ui/components/badge";
import { Button } from "@bus-booking/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bus-booking/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@bus-booking/ui/components/table";
import { cn, formatBookingDateTime } from "@bus-booking/ui/lib/utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Inbox,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import { BookingTableActions } from "./booking-table-actions";

const PAGE_SIZE_OPTIONS = [
  { label: "10 per page", value: 10 },
  { label: "20 per page", value: 20 },
  { label: "50 per page", value: 50 },
];

interface BookingDataTableProps {
  data: BookingResponse[];
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function BookingDataTable({
  data,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: BookingDataTableProps) {
  const totalCount = data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  <User className="size-3.5" />
                  Passenger
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  <Phone className="size-3.5" />
                  Phone
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  <Mail className="size-3.5" />
                  Email
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  <MapPin className="size-3.5" />
                  Route
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  <Calendar className="size-3.5" />
                  Travel Date
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  <Users className="size-3.5" />
                  Seats
                </div>
              </TableHead>
              <TableHead className="text-center">
                <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Status
                </span>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-1.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  <Clock className="size-3.5" />
                  Booked On
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((booking) => (
                <TableRow
                  key={booking._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium">
                    <span className="text-foreground font-semibold">
                      {booking.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-muted-foreground">
                      {booking.phone}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {booking.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-semibold text-foreground">
                        {booking.from || "N/A"}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-semibold text-primary">
                        {booking.to || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="font-mono text-xs font-normal"
                    >
                      {booking.travelDate || "Flexible"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {booking.passengers}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        "uppercase font-mono",
                        booking.status === "confirmed"
                          ? "text-success"
                          : booking.status === "cancelled"
                            ? "text-destructive"
                            : "text-warning",
                      )}
                    >
                      {booking.status || "pending"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {formatBookingDateTime(booking.createdAt)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    <BookingTableActions data={booking} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Inbox className="size-8 stroke-[1.5]" />
                    <p className="text-sm font-medium">No bookings found</p>
                    <p className="text-xs">
                      Try adjusting your search filters or clear existing
                      filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <div className="text-xs text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {totalCount === 0 ? 0 : startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-foreground">
                    {Math.min(startIndex + pageSize, totalCount)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {totalCount}
                  </span>{" "}
                  bookings
                </div>
              </TableCell>
              <TableCell colSpan={4}>
                <div className="flex items-center gap-4 justify-end">
                  <div className="flex items-center gap-2">
                    <Select
                      items={PAGE_SIZE_OPTIONS}
                      value={pageSize}
                      onValueChange={(v) => onPageSizeChange(Number(v))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAGE_SIZE_OPTIONS.map((item) => (
                          <SelectItem
                            value={item.value}
                            key={item.value}
                            className="text-xs"
                          >
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      disabled={currentPage <= 1}
                      onClick={() => onPageChange(currentPage - 1)}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-xs font-medium px-2 whitespace-nowrap">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => onPageChange(currentPage + 1)}
                      aria-label="Next page"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

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
import { formatBookingDateTime } from "@bus-booking/ui/lib/utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";

export interface Booking {
  _id: string;
  name: string;
  phone: string;
  email: string;
  travelDate?: string;
  passengers: number;
  from: string;
  to: string;
  status: string;
  createdAt: number;
}

const SELECT_ITEMS = [
  {
    label: "10",
    value: 10,
  },
  {
    label: "20",
    value: 20,
  },
  {
    label: "50",
    value: 50,
  },
];

interface BookingDataTableProps {
  data: Booking[];
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
    <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>
              <div className="flex items-center gap-1.5 font-semibold">
                <User className="size-4 text-muted-foreground" />
                Passenger
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1.5 font-semibold">
                <Phone className="size-4 text-muted-foreground" />
                Contact
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1.5 font-semibold">
                <Mail className="size-4 text-muted-foreground" />
                Email
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1.5 font-semibold">
                <MapPin className="size-4 text-muted-foreground" />
                Route (From → To)
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1.5 font-semibold">
                <Calendar className="size-4 text-muted-foreground" />
                Travel Date (BS)
              </div>
            </TableHead>
            <TableHead className="text-center">
              <div className="flex items-center justify-center gap-1.5 font-semibold">
                <Users className="size-4 text-muted-foreground" />
                Seats
              </div>
            </TableHead>
            {/*<TableHead>Status</TableHead>*/}
            <TableHead className="text-right">Booked At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((booking) => (
              <TableRow key={booking._id} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  <div>{booking.name}</div>
                </TableCell>
                <TableCell>
                  <span>{booking.phone}</span>
                </TableCell>
                <TableCell>
                  <span>{booking.email}</span>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <span className="font-medium">{booking.from || "N/A"}</span>
                    <span className="mx-1.5">→</span>
                    <span className="font-medium">{booking.to || "N/A"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={"secondary"}>
                    {booking.travelDate || "Not specified"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {booking.passengers}
                </TableCell>
                {/*<TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        booking.status === "confirmed"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : booking.status === "cancelled"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {booking.status || "pending"}
                    </span>
                  </TableCell>*/}
                <TableCell className="text-right">
                  {formatBookingDateTime(booking.createdAt)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-32 text-center text-muted-foreground"
              >
                No booking records found matching your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
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
            <TableCell colSpan={3}>
              <div className="flex items-center gap-4 justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Rows per page:
                  </span>
                  <Select
                    items={SELECT_ITEMS}
                    value={pageSize}
                    onValueChange={(v) => onPageSizeChange(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder />
                    </SelectTrigger>
                    <SelectContent>
                      {SELECT_ITEMS.map((item) => (
                        <SelectItem value={item.value} key={item.value}>
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
                  <span className="text-xs font-medium px-2">
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
  );
}

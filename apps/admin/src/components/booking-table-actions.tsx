import { api } from "@bus-booking/backend/convex/_generated/api";
import type {
  BookingResponse,
  BookingStatus,
} from "@bus-booking/backend/convex/bookings";
import { Button } from "@bus-booking/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bus-booking/ui/components/dropdown-menu";
import { useMutation } from "convex/react";
import { MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const BookingTableActions = ({ data }: { data: BookingResponse }) => {
  const [status, setStatus] = useState<BookingStatus>(data.status ?? "pending");
  const [isPending, setIsPending] = useState(false);

  const updateStatus = useMutation(api.bookings.updateStatus);
  const removeBooking = useMutation(api.bookings.remove);

  const onStatusChange = async (newStatus: BookingStatus) => {
    if (newStatus === status || isPending) return;

    const previousStatus = status;
    setStatus(newStatus);
    setIsPending(true);

    try {
      await updateStatus({
        id: data._id,
        status: newStatus,
      });
      toast.success(`Booking marked as ${newStatus}.`);
    } catch (error) {
      setStatus(previousStatus);
      toast.error(
        error instanceof Error ? error.message : "Failed to update status.",
      );
    } finally {
      setIsPending(false);
    }
  };

  const onDelete = async () => {
    if (isPending) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this booking?",
    );

    if (!isConfirmed) return;

    setIsPending(true);

    try {
      await removeBooking({ id: data._id });
      toast.success("Booking deleted.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete booking.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size={"icon-lg"}
            variant={"ghost"}
            className={"rounded-full"}
          />
        }
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup className={"space-y-1"}>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={status} onValueChange={onStatusChange}>
            <DropdownMenuRadioItem value={"confirmed"} disabled={isPending}>
              Confirmed
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={"cancelled"} disabled={isPending}>
              Cancelled
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={"pending"} disabled={isPending}>
              Pending
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
          >
            <Trash /> Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

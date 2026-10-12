import { Button } from "@bus-booking/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@bus-booking/ui/components/input-group";
import {
  convertToBsDateStructure,
  formattedDate,
} from "@bus-booking/ui/lib/utils";
import { ClientOnly, useNavigate, useSearch } from "@tanstack/react-router";
import { NepaliDatePicker, type BSDate } from "bikram-sambat-react";
import "bikram-sambat-react/styles.css";
import {
  ArrowUpDown,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

export const BookingsFilter = () => {
  const search = useSearch({
    from: "/_protected/",
  }) as {
    name?: string;
    phone?: string;
    destination?: string;
    travelDate?: string;
    sortDate?: "asc" | "desc";
    page?: number;
    pageSize?: number;
  };

  const navigate = useNavigate({ from: "/" });
  const [userName, setUserName] = useState(search.name ?? "");
  const [phoneNumber, setPhoneNumber] = useState(search.phone ?? "");
  const [dest, setDest] = useState(search.destination ?? "");
  const [date, setDate] = useState<BSDate | undefined>(
    convertToBsDateStructure(search.travelDate),
  );

  const onFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    navigate({
      to: "/",
      search: (prev) => ({
        ...prev,
        page: 1,
        name: userName.trim() || undefined,
        phone: phoneNumber.trim() || undefined,
        destination: dest.trim() || undefined,
        travelDate: formattedDate(date) || undefined,
      }),
    });
  };

  const onReset = () => {
    setUserName("");
    setPhoneNumber("");
    setDest("");
    setDate(undefined);
    navigate({
      to: "/",
      search: (prev) => ({
        page: 1,
        pageSize: prev.pageSize || 10,
      }),
    });
  };

  const toggleSortDate = () => {
    const nextSort =
      search.sortDate === "asc"
        ? "desc"
        : search.sortDate === "desc"
          ? undefined
          : "asc";
    navigate({
      to: "/",
      search: (prev) => ({
        ...prev,
        page: 1,
        sortDate: nextSort,
      }),
    });
  };

  const hasActiveFilters =
    Boolean(search.name) ||
    Boolean(search.phone) ||
    Boolean(search.destination) ||
    Boolean(search.travelDate) ||
    Boolean(search.sortDate);

  return (
    <form
      onSubmit={onFilter}
      className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-xs"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Name filter */}
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <User className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Filter by name..."
          />
          {userName && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                onClick={() => {
                  setUserName("");
                  navigate({
                    to: "/",
                    search: (prev) => ({ ...prev, name: undefined, page: 1 }),
                  });
                }}
              >
                <X className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        {/* Phone filter */}
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <Phone className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Filter by phone..."
            maxLength={10}
          />
          {phoneNumber && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                onClick={() => {
                  setPhoneNumber("");
                  navigate({
                    to: "/",
                    search: (prev) => ({ ...prev, phone: undefined, page: 1 }),
                  });
                }}
              >
                <X className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        {/* Destination filter */}
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <MapPin className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            placeholder="Filter by destination..."
          />
          {dest && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                onClick={() => {
                  setDest("");
                  navigate({
                    to: "/",
                    search: (prev) => ({
                      ...prev,
                      destination: undefined,
                      page: 1,
                    }),
                  });
                }}
              >
                <X className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        {/* Travel Date filter */}
        <ClientOnly
          fallback={
            <div className="h-10 w-full rounded-xl border bg-muted/20" />
          }
        >
          <NepaliDatePicker
            components={{
              ClearIcon: () => (
                <button
                  type="button"
                  onClick={() => {
                    setDate(undefined);
                    navigate({
                      to: "/",
                      search: (prev) => ({
                        ...prev,
                        travelDate: undefined,
                        page: 1,
                      }),
                    });
                  }}
                >
                  <X className="size-4 text-muted-foreground hover:text-foreground" />
                </button>
              ),
            }}
            value={date}
            onChange={setDate}
            id="travel_date"
            clearable
            iconPosition="start"
            className="w-full"
            classNames={{
              root: "w-full h-10!",
              field:
                "h-10! min-h-0! w-full border border-input! bg-background! shadow-xs! rounded-xl! focus-within:border-primary! py-2!",
              input: "h-10 w-full placeholder:text-muted-foreground!",
              trigger: "rounded-2xl! h-10!",
              icon: "text-muted-foreground! rounded-full",
              clear: "rounded-full!",
            }}
          />
        </ClientOnly>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={search.sortDate ? "secondary" : "outline"}
            size="sm"
            onClick={toggleSortDate}
            className="gap-1.5"
          >
            <ArrowUpDown className="size-3.5" />
            <span>
              Travel Date:{" "}
              {search.sortDate
                ? search.sortDate === "asc"
                  ? "Oldest First"
                  : "Newest First"
                : "Default"}
            </span>
          </Button>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>

        <Button type="submit" size="sm" className="px-5 gap-1.5">
          <Search className="size-3.5" />
          <span>Apply Filters</span>
        </Button>
      </div>
    </form>
  );
};

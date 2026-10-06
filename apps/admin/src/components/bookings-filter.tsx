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
import { useNavigate, useSearch } from "@tanstack/react-router";
import { NepaliDatePicker, type BSDate } from "bikram-sambat-react";
import "bikram-sambat-react/styles.css";
import { Phone, Search, User, X } from "lucide-react";
import { Activity, useState } from "react";

export const BookingsFilter = () => {
  const { name, phone, travelDate } = useSearch({
    from: "/_protected/",
  });
  const navigate = useNavigate({ from: "/" });
  const [userName, setUserName] = useState(name ?? "");
  const [phoneNumber, setPhoneNumber] = useState(phone ?? "");
  const [date, setDate] = useState<BSDate | undefined>(
    convertToBsDateStructure(travelDate),
  );

  const onFilter = () => {
    navigate({
      to: "/",
      search: (prev) => ({
        ...prev,
        name: userName,
        phone: phoneNumber,
        travelDate: formattedDate(date),
      }),
    });
  };

  return (
    <form
      onSubmit={onFilter}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <InputGroup>
        <InputGroupAddon align={"inline-start"}>
          <User />
        </InputGroupAddon>
        <Activity mode={!!name ? "visible" : "hidden"}>
          <InputGroupAddon
            onClick={() => {
              navigate({
                to: "/",
                search: (prev) => ({
                  ...prev,
                  name: undefined,
                }),
              });
            }}
            align={"inline-end"}
          >
            <InputGroupButton>
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        </Activity>
        <InputGroupInput
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          placeholder="Filter by name..."
        />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon align={"inline-start"}>
          <Phone />
        </InputGroupAddon>
        <Activity mode={!!phone ? "visible" : "hidden"}>
          <InputGroupAddon
            align={"inline-end"}
            onClick={() => {
              navigate({
                to: "/",
                search: (prev) => ({
                  ...prev,
                  phone: undefined,
                }),
              });
            }}
          >
            <InputGroupButton>
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        </Activity>
        <InputGroupInput
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
          placeholder="Filter by name..."
        />
      </InputGroup>
      <NepaliDatePicker
        components={{
          ClearIcon: () => (
            <button
              type="button"
              onClick={() => {
                navigate({
                  to: "/",
                  search: (prev) => ({
                    ...prev,
                    travelDate: undefined,
                  }),
                });
              }}
            >
              <X />
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
            "h-10! min-h-0! w-full border border-input! bg-background! shadow-xs! rounded-xl! focus-within:border-primary! focus-within:shadow-none! focus-within:shadow-none! focus-within:ring-1! focus-within:border-ring! transition-[color,box-shadow] focus-within:ring-ring/50! py-2! dark:bg-input/70!",
          input: "h-10 w-full placeholder:text-muted-foreground!",
          trigger: "rounded-2xl! h-10!",
          icon: "text-muted-foreground! rounded-full",
          clear: "rounded-full!",
        }}
      />
      <Button onClick={onFilter} size={"xl"} className={"px-7"}>
        <Search />
        <span>Apply</span>
      </Button>
    </form>
  );
};

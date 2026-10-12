import { api } from "@bus-booking/backend/convex/_generated/api";
import { Button } from "@bus-booking/ui/components/button";
import { Card } from "@bus-booking/ui/components/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@bus-booking/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@bus-booking/ui/components/input-group";
import { adToBs, formattedDate } from "@bus-booking/ui/lib/utils";
import { ClientOnly } from "@tanstack/react-router";
import type { BSDate } from "bikram-sambat-react";
import { NepaliDatePicker } from "bikram-sambat-react";
import "bikram-sambat-react/styles.css";
import { useMutation } from "convex/react";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BookingForm() {
  const today = new Date();
  const todayBs = adToBs(today);

  const [passengers, setPassengers] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<BSDate>();

  const createBooking = useMutation(api.bookings.create);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = (formData.get("name") as string)?.trim() || "";
    const phone = (formData.get("phone") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim() || "";
    const from = (formData.get("from") as string)?.trim() || "";
    const to = (formData.get("to") as string)?.trim() || "";

    try {
      await createBooking({
        name,
        phone,
        email,
        from,
        to,
        passengers,
        travelDate: formattedDate(date),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to create booking:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save booking. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }
  if (submitted) {
    return (
      <Card className="flex flex-col items-center justify-center rounded-2xl bg-primary/30 px-6 py-12 border-none shadow-none">
        <CheckCircle2 className="mb-4 size-12 text-primary" />
        <h3 className="font-serif text-3xl font-bold">Request received</h3>
        <p className="mt-2 max-w-md text-muted-foreground">
          Thanks for booking with wayfare. We&apos;ll send your trip details to
          your email shortly.
        </p>
        <Button
          type="button"
          variant={"link"}
          onClick={() => setSubmitted(false)}
          className="mt-6 font-semibold"
        >
          Book another trip
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel>Full name</FieldLabel>
            <InputGroup className="h-12">
              <InputGroupAddon>
                <User />
              </InputGroupAddon>
              <InputGroupInput
                name="name"
                placeholder="Your full name"
                required
              />
            </InputGroup>
          </Field>
          <div className="grid grid-cols-2 items-center gap-6">
            <Field>
              <FieldLabel htmlFor="phone">Phone number</FieldLabel>
              <InputGroup className="h-12">
                <InputGroupAddon>
                  <Phone />
                </InputGroupAddon>
                <InputGroupInput
                  id="phone"
                  name="phone"
                  inputMode="numeric"
                  placeholder="98XXXXXXXX"
                  minLength={10}
                  maxLength={10}
                  required
                />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup className="h-12">
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="alex@example.com"
                  required
                />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="travel_date">Travel date</FieldLabel>
              <ClientOnly
                fallback={<div className="h-13 w-full rounded-xl border" />}
              >
                <NepaliDatePicker
                  value={date}
                  onChange={setDate}
                  id="travel_date"
                  required
                  minDate={todayBs}
                  clearable
                  iconPosition="start"
                  className="w-full"
                  classNames={{
                    root: "w-full h-13!",
                    field:
                      "h-13! min-h-0! w-full border border-input! bg-background! shadow-xs! rounded-xl! focus-within:border-primary! focus-within:shadow-none! focus-within:shadow-none! focus-within:ring-1! focus-within:border-ring! transition-[color,box-shadow] focus-within:ring-ring/50! py-2! dark:bg-input/70!",
                    input: "h-13 w-full placeholder:text-muted-foreground!",
                    trigger: "rounded-2xl! h-10!",
                    icon: "text-muted-foreground!",
                  }}
                />
              </ClientOnly>
            </Field>

            <Field>
              <FieldLabel>Passengers</FieldLabel>
              <InputGroup className="h-12">
                <div className="flex h-full flex-1 items-center px-3">
                  <span>{passengers}</span>
                </div>
                <InputGroupAddon align={"inline-end"}>
                  <InputGroupButton
                    variant={"outline"}
                    type="button"
                    className={"rounded-full"}
                    size={"icon-sm"}
                    aria-label="Remove passenger"
                    disabled={passengers === 1}
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  >
                    <Minus aria-hidden="true" />
                  </InputGroupButton>
                  <InputGroupButton
                    type="button"
                    aria-label="Add passenger"
                    variant={"secondary"}
                    className={"rounded-full"}
                    size={"icon-sm"}
                    onClick={() => {
                      console.log("plus clicked");
                      setPassengers(Math.min(9, passengers + 1));
                    }}
                  >
                    <Plus aria-hidden="true" />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="from">From</FieldLabel>
              <InputGroup className="h-12">
                <InputGroupAddon>
                  <MapPin />
                </InputGroupAddon>
                <InputGroupInput
                  id="from"
                  name="from"
                  type="text"
                  placeholder="e.g. Kathmandu Bus Park"
                />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="to">To</FieldLabel>
              <InputGroup className="h-12">
                <InputGroupAddon>
                  <MapPin />
                </InputGroupAddon>
                <InputGroupInput
                  id="to"
                  name="to"
                  type="text"
                  placeholder="e.g. Pokhara Tourist Bus Park"
                />
              </InputGroup>
            </Field>
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}

          <Button
            size={"xxl"}
            type="submit"
            disabled={isSubmitting}
            className={"w-max px-8 ml-auto"}
          >
            {isSubmitting ? "Submitting..." : "Find my trip"}{" "}
            <ArrowRight aria-hidden="true" />
          </Button>
        </FieldGroup>
      </form>
    </Card>
  );
}

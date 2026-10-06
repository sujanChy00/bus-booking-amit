import { Badge } from "@bus-booking/ui/components/badge";
import { Container } from "@bus-booking/ui/components/container";
import { ArrowRight, Ticket } from "lucide-react";
const popularRoutes = [
  { from: "Kathmandu", to: "Pokhara", duration: "7h 30m", price: "रु 850" },
  { from: "Kathmandu", to: "Chitwan", duration: "5h 30m", price: "रु 750" },
  { from: "Pokhara", to: "Lumbini", duration: "8h 00m", price: "रु 1,200" },
];

export const PopularRoutes = () => {
  return (
    <Container id="routes" className="px-6 pb-24 lg:px-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Get inspired
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight">
            Popular routes
          </h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {popularRoutes.map((route) => (
          <a
            href="#book"
            key={`${route.from}-${route.to}`}
            className="group rounded-2xl border border-border p-5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Badge
              className="mb-6 flex items-center justify-between ml-auto text-primary h-7 px-3 font-semibold"
              variant={"secondary"}
            >
              <Ticket aria-hidden="true" />
              <span>from {route.price}</span>
            </Badge>
            <p className="font-serif text-xl font-bold">
              {route.from}{" "}
              <ArrowRight
                className="mx-1 inline size-4 text-muted-foreground"
                aria-hidden="true"
              />{" "}
              {route.to}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {route.duration} · Daily departures
            </p>
          </a>
        ))}
      </div>
    </Container>
  );
};

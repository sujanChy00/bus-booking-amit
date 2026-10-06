import { Container } from "@bus-booking/ui/components/container";
import { Bus, User } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="why-us" className="border-t border-t-border">
      <Container className="flex flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <a
          href="#top"
          className="flex items-center gap-1"
          aria-label="Himal Yatra home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl text-primary">
            <Bus aria-hidden="true" />
          </span>
          <span className="font-serif text-2xl font-bold tracking-tight text-primary">
            Himal Yatra
          </span>
        </a>
        <span className="flex items-center gap-2">
          <User aria-hidden="true" className="size-4" /> Reliable service, every
          mile.
        </span>
        <span>© {new Date().getFullYear()} Himal Yatra</span>
      </Container>
    </footer>
  );
};

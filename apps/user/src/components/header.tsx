import { Container } from "@bus-booking/ui/components/container";
import { Bus } from "lucide-react";

export const Header = () => {
  return (
    <Container className="flex items-center justify-between px-6 py-6 lg:px-10">
      <a
        href="#top"
        className="flex items-center gap-3"
        aria-label="Himal Yatra home"
      >
        <span className="flex size-10 items-center justify-center rounded-xl text-primary">
          <Bus aria-hidden="true" />
        </span>
        <span className="font-serif text-2xl font-bold tracking-tight text-primary">
          Himal Yatra
        </span>
      </a>
    </Container>
  );
};

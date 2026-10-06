import { BookingForm } from "@/components/booking-form";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroContent } from "@/components/hero-content";
import { PopularRoutes } from "@/components/popular-routes";
import { Container } from "@bus-booking/ui/components/container";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {

  return (
    <main className="min-h-screen overflow-hidden" id="top">
      <Header />
      <Container className="grid gap-y-12 lg:gap-x-10 px-6 pb-20 pt-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-16">
        <HeroContent />
        <BookingForm />
      </Container>

      <PopularRoutes />
      <Footer />
    </main>
  );
}

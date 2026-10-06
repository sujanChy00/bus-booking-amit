import { Clock3, ShieldCheck } from "lucide-react";

export const HeroContent = () => {
  return (
    <div>
      <h1 className="max-w-xl font-serif text-5xl font-bold leading-[1.03] tracking-[-0.04em] text-primary/30 sm:text-6xl lg:text-7xl">
        Explore Nepal.
        <br />
        <span className="text-primary">Travel with ease.</span>
      </h1>
      <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">
        Book safe, comfortable bus journeys across Nepal. From the hills of
        Pokhara to the energy of Kathmandu, your next journey starts here.
      </p>
      <div className="mt-9 flex flex-wrap gap-6 text-sm font-medium text-muted-foreground">
        <span className="flex items-center gap-2">
          <ShieldCheck className="text-primary" aria-hidden="true" /> Safe &amp;
          reliable
        </span>
        <span className="flex items-center gap-2">
          <Clock3 className="text-primary" aria-hidden="true" /> On-time
          departures
        </span>
      </div>
    </div>
  );
};

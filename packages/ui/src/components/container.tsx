import { cn } from "@bus-booking/ui/lib/utils";

export const Container = ({
  className,
  ...rest
}: React.ComponentProps<"div">) => {
  return (
    <div className={cn("mx-auto w-full max-w-7xl", className)} {...rest} />
  );
};

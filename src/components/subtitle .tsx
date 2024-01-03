import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const Subtitle = ({ className, children }: ComponentProps<"h1">) => {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
    >
      {children}
    </h1>
  );
};

export default Subtitle;

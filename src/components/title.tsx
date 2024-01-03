import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const Title = ({ className, children }: ComponentProps<"h1">) => {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className,
      )}
    >
      {children}
    </h1>
  );
};

export default Title;

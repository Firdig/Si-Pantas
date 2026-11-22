import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-surface shadow-[0_1px_2px_rgba(24,36,29,0.04)]",
        className,
      )}
      {...props}
    />
  );
}

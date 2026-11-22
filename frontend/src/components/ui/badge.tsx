import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { StatusTone } from "@/lib/status";

const tones: Record<StatusTone, string> = {
  success: "bg-brand-soft text-brand-dark",
  info: "bg-info-soft text-info-dark",
  warning: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
};

type BadgeProps = {
  tone?: StatusTone;
  children: ReactNode;
  className?: string;
};

/**
 * Badge status. Label teks wajib ada — warna hanya penguat, bukan
 * satu-satunya pembeda (aturan Foundations).
 */
export function Badge({ tone = "success", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-meta font-semibold leading-[18px]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

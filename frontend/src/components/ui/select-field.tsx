import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type SelectFieldProps = ComponentProps<"select"> & {
  id: string;
  label: string;
  containerClassName?: string;
};

/**
 * Select bawaan browser dengan label di atasnya.
 * Sengaja pakai `<select>` asli agar pemilih bawaan perangkat (besar dan
 * mudah dipakai) tetap muncul, bukan dropdown buatan sendiri.
 */
export function SelectField({
  id,
  label,
  className,
  containerClassName,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <div className={containerClassName}>
      <label
        htmlFor={id}
        className="block text-caption font-medium text-ink-muted"
      >
        {label}
      </label>

      <div className="relative mt-1">
        <select
          id={id}
          className={cn(
            "min-h-[48px] w-full appearance-none rounded-[10px] border border-line-strong bg-surface pl-3 pr-9 text-body text-ink",
            className,
          )}
          {...props}
        >
          {children}
        </select>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

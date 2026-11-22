import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "soft";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

/** Ukuran `lg` memenuhi target sentuh 52–56px dari halaman Foundations. */
const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-4 text-caption",
  lg: "min-h-[56px] px-7 text-body",
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-dark",
  outline: "border-2 border-brand bg-surface text-brand hover:bg-brand-tint",
  soft: "bg-brand-soft text-brand-dark hover:bg-[#dcece0]",
};

type StyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  className?: string;
};

export function buttonStyles({
  variant = "primary",
  size = "lg",
  full = false,
  className,
}: StyleOptions = {}): string {
  return cn(base, sizes[size], variants[variant], full && "w-full", className);
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleOptions;

export function ButtonLink({
  variant,
  size,
  full,
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, full, className })} {...props} />;
}

type ButtonProps = ComponentProps<"button"> & StyleOptions;

export function Button({
  variant,
  size,
  full,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, full, className })}
      {...props}
    />
  );
}

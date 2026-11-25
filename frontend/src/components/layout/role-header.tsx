import Link from "next/link";
import type { ReactNode } from "react";

type RoleHeaderProps = {
  /** Keterangan area, mis. "Area Operator" atau "Tugas TPS". */
  label: string;
  /** Aksi di kanan header; bila kosong dipakai tautan kembali ke situs warga. */
  action?: ReactNode;
};

/** Header ringkas untuk area selain halaman warga (operator, TPS). */
export function RoleHeader({ label, action }: RoleHeaderProps) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex h-[60px] w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:h-[64px] sm:px-8 lg:px-14">
        <Link href="/" className="flex flex-col justify-center">
          <span className="text-[20px] font-bold leading-none tracking-tight text-brand-dark sm:text-[22px]">
            SI-PANTAS
          </span>
          <span className="mt-1 text-[11px] leading-none text-ink-muted sm:text-[12px]">
            {label}
          </span>
        </Link>

        {action ?? (
          <Link
            href="/"
            className="text-caption font-medium text-ink-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Kembali ke situs warga
          </Link>
        )}
      </div>
    </header>
  );
}

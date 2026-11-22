"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/lib/mock/beranda";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto grid h-[64px] w-full max-w-[1440px] grid-cols-[1fr_auto] items-center gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-14">
        <Link href="/" className="flex flex-col justify-center justify-self-start">
          <span className="text-[26px] font-bold leading-none tracking-tight text-brand-dark">
            SI-PANTAS
          </span>
          <span className="mt-1 text-[13px] leading-none text-ink-muted">
            RW XI Kelurahan Temas
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "inline-flex h-10 items-center rounded-[10px] px-4 text-body transition-colors",
                      active
                        ? "bg-brand-soft font-semibold text-brand-dark"
                        : "text-ink-muted hover:bg-brand-tint hover:text-ink",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden justify-self-end lg:block">
          <Link
            href="/bantuan"
            className="inline-flex h-[42px] items-center rounded-[10px] bg-brand-soft px-4 text-body font-semibold text-brand-dark transition-colors hover:bg-[#dcece0]"
          >
            Butuh Bantuan?
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-utama"
          aria-label="Buka menu navigasi"
          className="inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-[10px] border border-line text-ink lg:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="menu-utama"
          aria-label="Navigasi utama (seluler)"
          className="border-t border-line bg-surface px-5 pb-5 pt-2 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "flex min-h-11 items-center rounded-[10px] px-4 text-body",
                      active
                        ? "bg-brand-soft font-semibold text-brand-dark"
                        : "text-ink-muted",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/bantuan"
                onClick={() => setOpen(false)}
                className="mt-1 flex min-h-11 items-center justify-center rounded-[10px] bg-brand-soft px-4 text-body font-semibold text-brand-dark"
              >
                Butuh Bantuan?
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

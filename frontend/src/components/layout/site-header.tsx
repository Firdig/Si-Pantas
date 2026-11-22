"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { navItems } from "@/lib/mock/beranda";

/** Ikon sederhana per menu, memakai garis 24×24. */
const menuIcons: Record<string, ReactNode> = {
  "/": (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v10h5v-6h4v6h5V10" />
    </>
  ),
  "/peta": (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  "/status": (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.6-3.6" />
    </>
  ),
  "/edukasi": (
    <>
      <path d="M20 4H6.5A2.5 2.5 0 0 0 4 6.5v13" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M20 4v16" />
    </>
  ),
};

function MenuIcon({ href }: { href: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {menuIcons[href] ?? null}
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Saat menu terbuka: kunci scroll halaman, fokuskan tombol tutup,
  // tangani Escape, dan jaga fokus tetap di dalam panel.
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );

      if (focusables.length === 0) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousFocus?.focus();
    };
  }, [open]);

  // Tutup menu bila layar melebar ke ukuran desktop (mis. HP diputar).
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };

    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto grid h-[60px] w-full max-w-[1440px] grid-cols-[1fr_auto] items-center gap-4 px-4 sm:h-[64px] sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-14">
        <Link href="/" className="flex flex-col justify-center justify-self-start">
          <span className="text-[22px] font-bold leading-none tracking-tight text-brand-dark sm:text-[24px]">
            SI-PANTAS
          </span>
          <span className="mt-1 text-[11px] leading-none text-ink-muted sm:text-[12px]">
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
                      "inline-flex h-10 items-center rounded-[10px] px-4 text-nav transition-colors",
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
            className="inline-flex h-[42px] items-center rounded-[10px] bg-brand-soft px-4 text-nav font-semibold text-brand-dark transition-colors hover:bg-[#dcece0]"
          >
            Butuh Bantuan?
          </Link>
        </div>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="Buka menu navigasi"
          className="inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-[10px] border border-line-strong text-ink transition-colors hover:bg-brand-tint lg:hidden"
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
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="sheet-backdrop absolute inset-0 bg-ink/45"
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi seluler"
            className="sheet-panel absolute inset-y-0 right-0 flex w-[86%] max-w-[340px] flex-col bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <span className="flex flex-col">
                <span className="text-[20px] font-bold leading-none tracking-tight text-brand-dark">
                  SI-PANTAS
                </span>
                <span className="mt-1 text-[11px] leading-none text-ink-muted">
                  RW XI Kelurahan Temas
                </span>
              </span>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-line-strong text-ink transition-colors hover:bg-brand-tint"
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
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav
              aria-label="Navigasi utama seluler"
              className="flex-1 overflow-y-auto px-3 py-3"
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
                        className={cn(
                          "relative flex min-h-[56px] items-center gap-3 rounded-xl px-4 text-nav transition-colors",
                          active
                            ? "bg-brand-soft font-semibold text-brand-dark"
                            : "text-ink hover:bg-brand-tint",
                        )}
                      >
                        {active ? (
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-2.5 left-0 w-1 rounded-full bg-brand"
                          />
                        ) : null}

                        <MenuIcon href={item.href} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-line px-4 py-4">
              <Link
                href="/bantuan"
                onClick={() => setOpen(false)}
                className="flex min-h-[52px] items-center justify-center rounded-[10px] bg-brand-soft px-4 text-nav font-semibold text-brand-dark transition-colors hover:bg-[#dcece0]"
              >
                Butuh Bantuan?
              </Link>

              <p className="mt-3 text-center text-meta text-ink-subtle">
                SI-PANTAS · RW XI Kelurahan Temas
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

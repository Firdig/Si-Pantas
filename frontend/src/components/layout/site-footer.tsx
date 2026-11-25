import Link from "next/link";
import { footer } from "@/lib/mock/warga/beranda";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand-deep text-white">
      {/* Seluler: dua tingkat — identitas, lalu tautan dengan area sentuh lega. */}
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-3 pt-4 sm:hidden">
        <p className="text-[15px] font-semibold tracking-wide">SI-PANTAS</p>
        <p className="mt-1 max-w-[320px] text-meta leading-relaxed text-white/70">
          {footer.tagline}
        </p>

        <nav
          aria-label="Tautan footer"
          className="mt-2 border-t border-white/15 pt-1"
        >
          <ul className="-ml-2 flex flex-wrap items-center gap-x-2">
            {footer.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center px-2 text-caption font-medium text-white/85 underline-offset-4 hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Desktop: satu bar tipis, sesuai desain. */}
      <div className="mx-auto hidden w-full max-w-[1440px] items-center justify-between gap-6 px-8 text-meta sm:flex sm:h-[46px] lg:px-14">
        <p className="text-white/85">{footer.note}</p>

        <nav aria-label="Tautan footer desktop">
          <ul className="flex items-center gap-6">
            {footer.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/85 underline-offset-4 hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

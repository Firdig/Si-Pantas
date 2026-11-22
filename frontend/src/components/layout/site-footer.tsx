import Link from "next/link";
import { footer } from "@/lib/mock/beranda";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand-deep text-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-5 py-4 text-meta sm:h-[46px] sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-8 sm:py-0 lg:px-14">
        <p className="text-white/85">{footer.note}</p>
        <nav aria-label="Tautan footer">
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
